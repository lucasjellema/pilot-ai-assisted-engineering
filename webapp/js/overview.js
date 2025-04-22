// This file handles the overview page functionality

document.addEventListener('DOMContentLoaded', async () => {
    // Load the participant data
    const participants = await loadParticipantData();
    
    // Store participants in a global variable for tooltips
    window.allParticipants = participants;
    
    if (participants.length === 0) return;
    
    // Populate summary statistics
    populateSummaryStats(participants);
    
    // Populate key metrics for filtering
    populateKeyMetrics(participants);
    
    // Populate the participants table
    populateParticipantsTable(participants);
});

// Function to populate summary statistics
function populateSummaryStats(participants) {
    const statsContainer = document.getElementById('stats-container');
    
    // Create stats cards
    const stats = [
        { label: 'Total Participants', value: participants.length },
        { label: 'Unique Companies', value: getUniqueValues(participants, 'Company').length }
    ];
    
    // Add Track Participation card with short labels
    const trackCounts = {
        'Codeium': 0,
        'Windsurf': 0,
        'Roo Code': 0
    };
    
    participants.forEach(participant => {
        const trackText = participant['Track Participation'] || '';
        if (trackText.includes('Codeium')) trackCounts['Codeium']++;
        if (trackText.includes('Windsurf')) trackCounts['Windsurf']++;
        if (trackText.includes('Roo Code')) trackCounts['Roo Code']++;
    });
    
    const trackCard = {
        label: 'Track Participation',
        isTrackCard: true,
        tracks: [
            { name: 'Codeium', count: trackCounts['Codeium'] },
            { name: 'Windsurf', count: trackCounts['Windsurf'] },
            { name: 'Roo Code', count: trackCounts['Roo Code'] }
        ]
    };
    stats.push(trackCard);
    
    // Add Usage Intent card
    const usageIntents = getUniqueValues(participants, 'Usage Intent', true);
    const usageIntentCounts = {};
    
    usageIntents.forEach(intent => {
        usageIntentCounts[intent] = participants.filter(p => {
            const intents = parseListField(p['Usage Intent']);
            return intents.includes(intent);
        }).length;
    });
    
    const usageIntentCard = {
        label: 'Usage Intent',
        isIntentCard: true,
        intents: Object.keys(usageIntentCounts).map(intent => {
            return { name: intent, count: usageIntentCounts[intent] };
        })
    };
    stats.push(usageIntentCard);
    
    stats.forEach(stat => {
        const statCard = document.createElement('div');
        statCard.className = 'stat-card';
        
        if (stat.isTrackCard) {
            // Create Track Participation card with track counts
            const trackContent = document.createElement('div');
            trackContent.innerHTML = `<h4>${stat.label}</h4>`;
            
            const trackList = document.createElement('div');
            trackList.className = 'track-list';
            
            stat.tracks.forEach(track => {
                const trackItem = document.createElement('div');
                trackItem.className = 'track-item';
                trackItem.innerHTML = `
                    <span class="track-name">${track.name}</span>
                    <span class="track-count">${track.count}</span>
                `;
                trackItem.addEventListener('click', () => {
                    window.location.href = `filter.html?field=${encodeURIComponent('Track Participation')}&value=${encodeURIComponent(track.name)}&isList=true`;
                });
                trackList.appendChild(trackItem);
            });
            
            trackContent.appendChild(trackList);
            statCard.appendChild(trackContent);
        } else if (stat.isIntentCard) {
            // Create Usage Intent card with intent counts
            const intentContent = document.createElement('div');
            intentContent.innerHTML = `<h4>${stat.label}</h4>`;
            
            const intentList = document.createElement('div');
            intentList.className = 'intent-list';
            
            stat.intents.forEach(intent => {
                const intentItem = document.createElement('div');
                intentItem.className = 'intent-item';
                intentItem.innerHTML = `
                    <span class="intent-name">${intent.name}</span>
                    <span class="intent-count">${intent.count}</span>
                `;
                intentItem.addEventListener('click', () => {
                    window.location.href = `filter.html?field=${encodeURIComponent('Usage Intent')}&value=${encodeURIComponent(intent.name)}&isList=true`;
                });
                intentList.appendChild(intentItem);
            });
            
            intentContent.appendChild(intentList);
            statCard.appendChild(intentContent);
        } else {
            // Standard stat card
            statCard.innerHTML = `
                <h4>${stat.label}</h4>
                <p class="stat-value">${stat.value}</p>
            `;
        }
        
        statsContainer.appendChild(statCard);
    });
}

// Function to populate key metrics for filtering
function populateKeyMetrics(participants) {
    // Populate roles
    const roles = getUniqueValues(participants, 'Role');
    const rolesList = document.getElementById('roles-list');
    populateList(rolesList, roles, 'Role', false, 'role');
    
    // Populate daily activities and create chart
    const activities = getUniqueValues(participants, 'Daily Engineering Activities', true);
    const activitiesList = document.getElementById('activities-list');
    populateList(activitiesList, activities, 'Daily Engineering Activities', true);
    
    // Create companies pie chart
    createCompaniesPieChart(participants);
    
    // Create bar charts for various fields
    createFieldBarChart(participants, 'Daily Engineering Activities', 'activities-chart', true);
    createFieldBarChart(participants, 'Activities to Explore', 'explore-activities-chart', true);
    createFieldBarChart(participants, 'Track Participation', 'track-participation-chart', true);
    createFieldBarChart(participants, 'Usage Intent', 'usage-intent-chart', true);
    createFieldBarChart(participants, 'Code Base', 'code-base-chart', true);
    
    // Create time commitment chart
    createTimeCommitmentChart(participants);
    
    // No longer need feedback tabs or tab switching since they've been moved to separate pages
    
    // Extract and populate technology stacks
    const techStacks = new Set();
    participants.forEach(p => {
        const techStack = p['Technology Stack for Development'];
        if (techStack) {
            // Extract technologies with better parsing
            const techs = extractTechnologies(techStack);
            techs.forEach(tech => techStacks.add(tech));
        }
    });
    
    const techStackList = document.getElementById('tech-stack-list');
    populateList(techStackList, Array.from(techStacks).sort(), 'Technology Stack for Development', true, 'tech-stack');
    
    // Extract and populate IDEs
    const ideMap = {}; // Map to track normalized IDE names to display names
    const ideParticipants = {}; // Map to track participants for each IDE
    
    participants.forEach(p => {
        const ideText = p['IDE'];
        if (ideText) {
            // Extract IDE names
            const ideNames = ideText.split(/[,\n]/)
                .map(ide => ide.trim())
                .filter(ide => ide.length > 0);
            
            ideNames.forEach(ide => {
                // Normalize IDE name for case-insensitive comparison
                const normalizedName = ide.toLowerCase();
                
                // Store the original display name if this is the first occurrence
                if (!ideMap[normalizedName]) {
                    ideMap[normalizedName] = ide;
                    ideParticipants[normalizedName] = [];
                }
                
                // Track participant for this IDE
                ideParticipants[normalizedName].push(p);
            });
        }
    });
    
    // Convert to array of unique IDE names (using normalized keys but display values)
    const uniqueIdes = Object.keys(ideMap).map(key => ideMap[key]).sort();
    
    const ideList = document.getElementById('ide-list');
    populateList(ideList, uniqueIdes, 'IDE', true, 'tech-stack', ideParticipants);
    
    // Extract and populate AI assistants
    const aiAssistants = new Set();
    participants.forEach(p => {
        const assistants = extractAIAssistants(p['Experience with AI Coding Assistants']);
        assistants.forEach(assistant => aiAssistants.add(assistant));
    });
    
    const aiAssistantsList = document.getElementById('ai-assistants-list');
    populateList(aiAssistantsList, Array.from(aiAssistants).sort(), 'Experience with AI Coding Assistants', true, 'tech-stack');
}

// Helper function to populate a list with clickable items
function populateList(listElement, items, fieldName, isListField = false, tagType = '', participantMapping = null) {
    // Special styling for tags (activities, tech stacks, roles, etc.)
    if (fieldName === 'Daily Engineering Activities' || 
        fieldName === 'Technology Stack for Development' || 
        tagType === 'tech-stack' || 
        tagType === 'role') {
        
        let containerClass = 'activities-container';
        let linkClass = 'activity-link';
        
        if (tagType === 'tech-stack') {
            containerClass = 'tech-stack-container';
            linkClass = 'tag-link tech-stack-link';
        } else if (tagType === 'role') {
            containerClass = 'roles-container';
            linkClass = 'tag-link role-link';
        }
        
        const tagsContainer = document.createElement('div');
        tagsContainer.className = containerClass;
        listElement.parentNode.appendChild(tagsContainer);
        
        items.forEach(item => {
            let participantsWithItem;
            
            // Use provided participant mapping if available (for case-insensitive matching)
            if (participantMapping && fieldName === 'IDE') {
                const normalizedName = item.toLowerCase();
                participantsWithItem = participantMapping[normalizedName] || [];
            } else {
                // Get participants with this item using standard method
                participantsWithItem = getParticipantsWithValue(window.allParticipants, fieldName, item, isListField);
            }
            
            // Create tooltip text with participant names
            const participantNames = participantsWithItem.map(p => p['Your Name'] || 'Anonymous').join(', ');
            const tooltipText = `Participants: ${participantNames}`;
            
            const tagLink = document.createElement('a');
            tagLink.className = linkClass;
            tagLink.textContent = item;
            tagLink.href = `filter.html?field=${encodeURIComponent(fieldName)}&value=${encodeURIComponent(item)}&isList=${isListField}`;
            tagLink.title = tooltipText;
            
            // Add count badge
            const countBadge = document.createElement('span');
            countBadge.className = 'count-badge';
            countBadge.textContent = participantsWithItem.length;
            tagLink.appendChild(countBadge);
            
            tagsContainer.appendChild(tagLink);
        });
        
        // Remove the original list element since we're replacing it
        listElement.remove();
    } else {
        // Standard list items for other fields
        items.forEach(item => {
            // Get participants with this item
            const participantsWithItem = getParticipantsWithValue(window.allParticipants, fieldName, item, isListField);
            
            // Create tooltip text with participant names
            const participantNames = participantsWithItem.map(p => p['Your Name'] || 'Anonymous').join(', ');
            const tooltipText = `Participants: ${participantNames}`;
            
            const li = document.createElement('li');
            li.textContent = item;
            li.title = tooltipText;
            li.addEventListener('click', () => {
                // Navigate to the filter page with the selected filter
                window.location.href = `filter.html?field=${encodeURIComponent(fieldName)}&value=${encodeURIComponent(item)}&isList=${isListField}`;
            });
            listElement.appendChild(li);
        });
    }
}

// Function to create a bar chart for any field
function createFieldBarChart(participants, fieldName, chartId, isListField = false) {
    const ctx = document.getElementById(chartId).getContext('2d');
    
    // Get unique values for the field
    let values = [];
    if (isListField) {
        values = getUniqueValues(participants, fieldName, true);
    } else {
        values = participants.map(p => p[fieldName]).filter(v => v).filter((v, i, a) => a.indexOf(v) === i);
    }
    
    // Count occurrences of each value
    const valueCounts = {};
    values.forEach(value => {
        let count;
        if (isListField) {
            count = participants.filter(p => {
                const fieldValues = parseListField(p[fieldName]);
                return fieldValues.includes(value);
            }).length;
        } else {
            count = participants.filter(p => p[fieldName] === value).length;
        }
        valueCounts[value] = count;
    });
    
    // Sort values by count (descending)
    const sortedValues = Object.keys(valueCounts).sort((a, b) => {
        return valueCounts[b] - valueCounts[a];
    });
    
    // Prepare data for the chart
    const labels = sortedValues;
    const data = sortedValues.map(value => valueCounts[value]);
    
    // Choose color based on field name
    let color, hoverColor;
    switch(fieldName) {
        case 'Daily Engineering Activities':
            color = 'rgba(52, 152, 219, 0.7)'; // Blue
            hoverColor = 'rgba(52, 152, 219, 0.9)';
            break;
        case 'Activities to Explore':
            color = 'rgba(46, 204, 113, 0.7)'; // Green
            hoverColor = 'rgba(46, 204, 113, 0.9)';
            break;
        case 'Track Participation':
            color = 'rgba(155, 89, 182, 0.7)'; // Purple
            hoverColor = 'rgba(155, 89, 182, 0.9)';
            break;
        case 'Usage Intent':
            color = 'rgba(241, 196, 15, 0.7)'; // Yellow
            hoverColor = 'rgba(241, 196, 15, 0.9)';
            break;
        case 'Code Base':
            color = 'rgba(230, 126, 34, 0.7)'; // Orange
            hoverColor = 'rgba(230, 126, 34, 0.9)';
            break;
        default:
            color = 'rgba(52, 152, 219, 0.7)'; // Default blue
            hoverColor = 'rgba(52, 152, 219, 0.9)';
    }
    
    // Create the chart
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Participants',
                data: data,
                backgroundColor: color,
                borderColor: color.replace('0.7', '1'),
                borderWidth: 1,
                hoverBackgroundColor: hoverColor,
                cursor: 'pointer'
            }]
        },
        options: {
            indexAxis: 'y',  // Horizontal bar chart
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const value = context.label;
                            let participantsWithValue;
                            if (isListField) {
                                participantsWithValue = participants.filter(p => {
                                    const fieldValues = parseListField(p[fieldName]);
                                    return fieldValues.includes(value);
                                });
                            } else {
                                participantsWithValue = participants.filter(p => p[fieldName] === value);
                            }
                            const participantNames = participantsWithValue.map(p => p['Your Name'] || 'Anonymous').join(', ');
                            return `Participants: ${participantNames}`;
                        },
                        footer: function(context) {
                            return 'Click to filter by this value';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                },
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        precision: 0
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements && elements.length > 0) {
                    const index = elements[0].index;
                    const value = labels[index];
                    // Navigate to filter page for this value
                    window.location.href = `filter.html?field=${encodeURIComponent(fieldName)}&value=${encodeURIComponent(value)}&isList=${isListField}`;
                }
            }
        }
    });
    
    // Add custom cursor style to make it clear the bars are clickable
    const canvas = document.getElementById(chartId);
    canvas.style.cursor = 'pointer';
}

// Function to create a pie chart for companies
function createCompaniesPieChart(participants) {
    const ctx = document.getElementById('companies-chart').getContext('2d');
    
    // Count occurrences of each company
    const companyCounts = {};
    const participantsByCompany = {};
    
    participants.forEach(participant => {
        const company = participant.Company || 'Not Specified';
        companyCounts[company] = (companyCounts[company] || 0) + 1;
        
        // Store participants by company for tooltips
        if (!participantsByCompany[company]) {
            participantsByCompany[company] = [];
        }
        participantsByCompany[company].push(participant['Your Name'] || 'Anonymous');
    });
    
    // Sort companies by count (descending)
    const sortedCompanies = Object.keys(companyCounts).sort((a, b) => {
        return companyCounts[b] - companyCounts[a];
    });
    
    // Prepare data for the chart
    const labels = sortedCompanies;
    const data = sortedCompanies.map(company => companyCounts[company]);
    
    // Generate colors for each company
    const colors = generateColors(labels.length);
    
    // Create the chart
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('0.7', '1')),
                borderWidth: 1,
                hoverBackgroundColor: colors.map(color => color.replace('0.7', '0.9')),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 15,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const company = context.label;
                            const participants = participantsByCompany[company];
                            return `Participants: ${participants.join(', ')}`;
                        }
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements && elements.length > 0) {
                    const index = elements[0].index;
                    const company = labels[index];
                    // Navigate to filter page for this company
                    window.location.href = `filter.html?field=${encodeURIComponent('Company')}&value=${encodeURIComponent(company)}`;
                }
            }
        }
    });
    
    // Add custom cursor style to make it clear the chart is clickable
    const canvas = document.getElementById('companies-chart');
    canvas.style.cursor = 'pointer';
}

// Helper function to generate colors for pie chart
function generateColors(count) {
    const baseColors = [
        'rgba(52, 152, 219, 0.7)',  // Blue
        'rgba(46, 204, 113, 0.7)',   // Green
        'rgba(155, 89, 182, 0.7)',    // Purple
        'rgba(241, 196, 15, 0.7)',    // Yellow
        'rgba(230, 126, 34, 0.7)',    // Orange
        'rgba(231, 76, 60, 0.7)',     // Red
        'rgba(26, 188, 156, 0.7)',    // Turquoise
        'rgba(52, 73, 94, 0.7)',      // Dark Blue
    ];
    
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(baseColors[i % baseColors.length]);
    }
    
    return colors;
}

// Function to create a chart for expected time commitment
function createTimeCommitmentChart(participants) {
    const ctx = document.getElementById('time-commitment-chart').getContext('2d');
    
    // Separate numeric and non-numeric time commitments
    const numericData = [];
    const nonNumericData = [];
    
    participants.forEach(participant => {
        const commitmentText = participant['Expected Time Commitment'] || 'Not Specified';
        const participantName = participant['Your Name'] || 'Anonymous';
        
        // Check if the commitment starts with a number
        const numericMatch = commitmentText.match(/^\s*(\d+)/);
        
        if (numericMatch) {
            // For numeric values, add to scatter plot data
            const hours = parseInt(numericMatch[1]);
            numericData.push({
                hours: hours,
                participant: participantName,
                fullText: commitmentText
            });
        } else {
            // For non-numeric values, add to the list
            nonNumericData.push({
                text: commitmentText,
                participant: participantName
            });
        }
    });
    
    // Create scatter plot for numeric data
    if (numericData.length > 0) {
        // Count occurrences of each hour value
        const hourCounts = {};
        numericData.forEach(item => {
            hourCounts[item.hours] = (hourCounts[item.hours] || 0) + 1;
        });
        
        // Prepare data for scatter plot
        const scatterData = [];
        const participantsByHour = {};
        
        Object.keys(hourCounts).forEach(hour => {
            const count = hourCounts[hour];
            scatterData.push({
                x: parseInt(hour),
                y: count
            });
            
            // Store participants for tooltips
            participantsByHour[hour] = numericData
                .filter(item => item.hours === parseInt(hour))
                .map(item => item.participant);
        });
        
        // Create the scatter plot
        const chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Time Commitment (Hours/Week)',
                    data: scatterData,
                    backgroundColor: 'rgba(26, 188, 156, 0.7)', // Turquoise
                    borderColor: 'rgba(26, 188, 156, 1)',
                    borderWidth: 1,
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    hoverBackgroundColor: 'rgba(26, 188, 156, 0.9)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const point = context.raw;
                                return `${point.x} hours/week: ${point.y} participant(s)`;
                            },
                            afterLabel: function(context) {
                                const hour = context.raw.x.toString();
                                const participants = participantsByHour[hour];
                                return `Participants: ${participants.join(', ')}`;
                            },
                            footer: function(context) {
                                return 'Click to filter by this time commitment';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Participants'
                        },
                        ticks: {
                            precision: 0
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Hours per Week'
                        },
                        ticks: {
                            precision: 0
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements && elements.length > 0) {
                        const index = elements[0].index;
                        const dataPoint = scatterData[index];
                        const hours = dataPoint.x.toString();
                        // Navigate to filter page for this time commitment
                        window.location.href = `filter.html?field=${encodeURIComponent('Expected Time Commitment')}&value=${encodeURIComponent(hours)}`;
                    }
                }
            }
        });
        
        // Add custom cursor style to make it clear the chart is clickable
        const canvas = document.getElementById('time-commitment-chart');
        canvas.style.cursor = 'pointer';
    } else {
        // If no numeric data, show a message
        const noDataMessage = document.createElement('div');
        noDataMessage.className = 'no-data-message';
        noDataMessage.textContent = 'No numeric time commitment data available';
        document.querySelector('.chart-side').appendChild(noDataMessage);
    }
    
    // Create scrollable list for non-numeric responses
    const listContainer = document.getElementById('time-commitment-list');
    
    if (nonNumericData.length > 0) {
        nonNumericData.forEach(item => {
            const listItem = document.createElement('div');
            listItem.className = 'commitment-item';
            
            const textSpan = document.createElement('span');
            textSpan.className = 'commitment-text';
            textSpan.textContent = item.text;
            
            const participantSpan = document.createElement('span');
            participantSpan.className = 'commitment-participant';
            participantSpan.textContent = item.participant;
            
            listItem.appendChild(textSpan);
            listItem.appendChild(participantSpan);
            
            // Make the item clickable to filter
            listItem.addEventListener('click', () => {
                window.location.href = `filter.html?field=${encodeURIComponent('Expected Time Commitment')}&value=${encodeURIComponent(item.text)}`;
            });
            
            listContainer.appendChild(listItem);
        });
    } else {
        listContainer.textContent = 'No non-numeric responses available';
    }
}

// These functions have been moved to their respective page files

// Function to populate the participants table
function populateParticipantsTable(participants) {
    const tableBody = document.getElementById('participants-body');
    
    participants.forEach(participant => {
        const row = document.createElement('tr');
        
        // Name column
        const nameCell = document.createElement('td');
        nameCell.textContent = participant['Your Name'] || 'Anonymous';
        row.appendChild(nameCell);
        
        // Company column
        const companyCell = document.createElement('td');
        companyCell.textContent = participant.Company || 'N/A';
        row.appendChild(companyCell);
        
        // Role column
        const roleCell = document.createElement('td');
        roleCell.textContent = participant.Role || 'N/A';
        row.appendChild(roleCell);
        
        // Details column
        const detailsCell = document.createElement('td');
        const detailsLink = document.createElement('a');
        detailsLink.href = `detail.html?id=${participant.ID}`;
        detailsLink.className = 'btn';
        detailsLink.textContent = 'View Details';
        detailsCell.appendChild(detailsLink);
        row.appendChild(detailsCell);
        
        tableBody.appendChild(row);
    });
}
