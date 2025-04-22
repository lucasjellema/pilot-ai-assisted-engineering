// This file handles the Technology page functionality

document.addEventListener('DOMContentLoaded', async () => {
    // Load the participant data
    const participants = await loadParticipantData();
    
    if (participants.length === 0) return;
    
    // Populate the technology content
    populateTechnologyContent(participants);
    
    // Create technology chart
    createTechnologyChart(participants);
    
    // Create technology cloud
    createTechnologyCloud(participants);
    
    // Set up tab switching
    setupTabs();
});

// Function to populate the technology content
function populateTechnologyContent(participants) {
    // Populate Development Stack tab
    populateDevStackContent(participants);
    
    // Populate Supporting Stack tab
    populateSupportStackContent(participants);
    
    // Populate IDE tab
    populateIdeContent(participants);
}

// Function to populate Development Stack content
function populateDevStackContent(participants) {
    const container = document.getElementById('dev-stack-content');
    
    // Filter out empty responses
    const validResponses = participants.filter(p => {
        const response = p['Technology Stack for Development'];
        return response && response.trim() !== '' && response !== 'N/A' && response !== '-';
    });
    
    if (validResponses.length === 0) {
        const noData = document.createElement('p');
        noData.className = 'no-data-message';
        noData.textContent = 'No responses available';
        container.appendChild(noData);
        return;
    }
    
    // Sort responses by length (longest first) to highlight detailed responses
    validResponses.sort((a, b) => {
        return (b['Technology Stack for Development'] || '').length - 
               (a['Technology Stack for Development'] || '').length;
    });
    
    // Create tech stack items
    validResponses.forEach(participant => {
        const stackItem = document.createElement('div');
        stackItem.className = 'tech-stack-item';
        
        const stackText = document.createElement('div');
        stackText.className = 'tech-stack-text';
        stackText.textContent = participant['Technology Stack for Development'];
        
        // Extract and display technologies as tags
        const stackTags = document.createElement('div');
        stackTags.className = 'tech-stack-tags';
        
        const technologies = extractTechnologies(participant['Technology Stack for Development']);
        technologies.forEach(tech => {
            const techTag = document.createElement('span');
            techTag.className = 'tag-link tech-stack-link';
            techTag.textContent = tech;
            stackTags.appendChild(techTag);
        });
        
        const participantName = document.createElement('div');
        participantName.className = 'tech-stack-participant';
        participantName.textContent = participant['Your Name'] || 'Anonymous';
        
        // Make the item clickable to navigate to participant details
        stackItem.addEventListener('click', () => {
            window.location.href = `detail.html?id=${participant.ID}`;
        });
        stackItem.style.cursor = 'pointer';
        
        stackItem.appendChild(stackText);
        stackItem.appendChild(stackTags);
        stackItem.appendChild(participantName);
        container.appendChild(stackItem);
    });
}

// Function to populate Supporting Stack content
function populateSupportStackContent(participants) {
    const container = document.getElementById('support-stack-content');
    
    // Filter out empty responses
    const validResponses = participants.filter(p => {
        const response = p['Supporting Technology Stack'];
        return response && response.trim() !== '' && response !== 'N/A' && response !== '-';
    });
    
    if (validResponses.length === 0) {
        const noData = document.createElement('p');
        noData.className = 'no-data-message';
        noData.textContent = 'No responses available';
        container.appendChild(noData);
        return;
    }
    
    // Sort responses by length (longest first) to highlight detailed responses
    validResponses.sort((a, b) => {
        return (b['Supporting Technology Stack'] || '').length - 
               (a['Supporting Technology Stack'] || '').length;
    });
    
    // Create tech stack items
    validResponses.forEach(participant => {
        const stackItem = document.createElement('div');
        stackItem.className = 'tech-stack-item';
        
        const stackText = document.createElement('div');
        stackText.className = 'tech-stack-text';
        stackText.textContent = participant['Supporting Technology Stack'];
        
        // Extract and display technologies as tags
        const stackTags = document.createElement('div');
        stackTags.className = 'tech-stack-tags';
        
        const technologies = extractTechnologies(participant['Supporting Technology Stack']);
        technologies.forEach(tech => {
            const techTag = document.createElement('span');
            techTag.className = 'tag-link tech-stack-link';
            techTag.textContent = tech;
            stackTags.appendChild(techTag);
        });
        
        const participantName = document.createElement('div');
        participantName.className = 'tech-stack-participant';
        participantName.textContent = participant['Your Name'] || 'Anonymous';
        
        // Make the item clickable to navigate to participant details
        stackItem.addEventListener('click', () => {
            window.location.href = `detail.html?id=${participant.ID}`;
        });
        stackItem.style.cursor = 'pointer';
        
        stackItem.appendChild(stackText);
        stackItem.appendChild(stackTags);
        stackItem.appendChild(participantName);
        container.appendChild(stackItem);
    });
}

// Function to populate IDE content
function populateIdeContent(participants) {
    const container = document.getElementById('ide-content');
    
    // Filter out empty responses
    const validResponses = participants.filter(p => {
        const response = p['IDE'];
        return response && response.trim() !== '' && response !== 'N/A' && response !== '-';
    });
    
    if (validResponses.length === 0) {
        const noData = document.createElement('p');
        noData.className = 'no-data-message';
        noData.textContent = 'No responses available';
        container.appendChild(noData);
        return;
    }
    
    // Sort responses by length (longest first) to highlight detailed responses
    validResponses.sort((a, b) => {
        return (b['IDE'] || '').length - 
               (a['IDE'] || '').length;
    });
    
    // Create IDE items
    validResponses.forEach(participant => {
        const ideItem = document.createElement('div');
        ideItem.className = 'tech-stack-item';
        
        const ideText = document.createElement('div');
        ideText.className = 'tech-stack-text';
        ideText.textContent = participant['IDE'];
        
        // Extract and display IDEs as tags
        const ideTags = document.createElement('div');
        ideTags.className = 'tech-stack-tags';
        
        const ides = participant['IDE'].split(/[,\n]/).map(ide => ide.trim()).filter(ide => ide.length > 0);
        ides.forEach(ide => {
            const ideTag = document.createElement('span');
            ideTag.className = 'tag-link tech-stack-link';
            ideTag.textContent = ide;
            ideTags.appendChild(ideTag);
        });
        
        const participantName = document.createElement('div');
        participantName.className = 'tech-stack-participant';
        participantName.textContent = participant['Your Name'] || 'Anonymous';
        
        // Make the item clickable to navigate to participant details
        ideItem.addEventListener('click', () => {
            window.location.href = `detail.html?id=${participant.ID}`;
        });
        ideItem.style.cursor = 'pointer';
        
        ideItem.appendChild(ideText);
        ideItem.appendChild(ideTags);
        ideItem.appendChild(participantName);
        container.appendChild(ideItem);
    });
}

// Function to create technology chart
function createTechnologyChart(participants) {
    const ctx = document.getElementById('tech-chart').getContext('2d');
    
    // Count all technologies
    const techCounts = {};
    
    participants.forEach(participant => {
        // Process development stack
        const devStack = participant['Technology Stack for Development'];
        if (devStack) {
            const technologies = extractTechnologies(devStack);
            technologies.forEach(tech => {
                techCounts[tech] = (techCounts[tech] || 0) + 1;
            });
        }
        
        // Process supporting stack
        const supportStack = participant['Supporting Technology Stack'];
        if (supportStack) {
            const technologies = extractTechnologies(supportStack);
            technologies.forEach(tech => {
                techCounts[tech] = (techCounts[tech] || 0) + 1;
            });
        }
        
        // Process IDEs
        const ideText = participant['IDE'];
        if (ideText) {
            const ides = ideText.split(/[,\n]/).map(ide => ide.trim()).filter(ide => ide.length > 0);
            ides.forEach(ide => {
                techCounts[ide] = (techCounts[ide] || 0) + 1;
            });
        }
    });
    
    // Sort technologies by count (descending) and take top 10
    const sortedTechs = Object.keys(techCounts).sort((a, b) => {
        return techCounts[b] - techCounts[a];
    }).slice(0, 10);
    
    // Prepare data for the chart
    const labels = sortedTechs;
    const data = sortedTechs.map(tech => techCounts[tech]);
    
    // Generate colors for each technology
    const colors = generateColors(labels.length);
    
    // Create the chart
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Participants',
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('0.7', '1')),
                borderWidth: 1
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
                            const tech = context.label;
                            const count = context.raw;
                            return `${count} participant${count !== 1 ? 's' : ''}`;
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
            }
        }
    });
}

// Function to create technology cloud
function createTechnologyCloud(participants) {
    const container = document.getElementById('tech-cloud');
    
    // Count all technologies
    const techCounts = {};
    
    participants.forEach(participant => {
        // Process development stack
        const devStack = participant['Technology Stack for Development'];
        if (devStack) {
            const technologies = extractTechnologies(devStack);
            technologies.forEach(tech => {
                techCounts[tech] = (techCounts[tech] || 0) + 1;
            });
        }
        
        // Process supporting stack
        const supportStack = participant['Supporting Technology Stack'];
        if (supportStack) {
            const technologies = extractTechnologies(supportStack);
            technologies.forEach(tech => {
                techCounts[tech] = (techCounts[tech] || 0) + 1;
            });
        }
        
        // Process IDEs
        const ideText = participant['IDE'];
        if (ideText) {
            const ides = ideText.split(/[,\n]/).map(ide => ide.trim()).filter(ide => ide.length > 0);
            ides.forEach(ide => {
                techCounts[ide] = (techCounts[ide] || 0) + 1;
            });
        }
    });
    
    // Sort technologies by count (descending)
    const sortedTechs = Object.keys(techCounts).sort((a, b) => {
        return techCounts[b] - techCounts[a];
    });
    
    // Create technology cloud
    sortedTechs.forEach(tech => {
        const count = techCounts[tech];
        const techTag = document.createElement('a');
        techTag.className = 'tech-tag';
        techTag.textContent = tech;
        
        // Calculate font size based on count (min 12px, max 24px)
        const fontSize = Math.max(12, Math.min(24, 12 + count * 2));
        techTag.style.fontSize = `${fontSize}px`;
        
        // Calculate color intensity based on count
        const intensity = Math.min(0.9, 0.3 + count * 0.1);
        const hue = (sortedTechs.indexOf(tech) * 137) % 360; // Golden angle for color distribution
        techTag.style.backgroundColor = `hsla(${hue}, 70%, 60%, ${intensity})`;
        techTag.style.color = intensity > 0.6 ? 'white' : 'black';
        
        // Find participants who use this technology
        const participantsWithTech = [];
        participants.forEach(participant => {
            const devStack = participant['Technology Stack for Development'] || '';
            const supportStack = participant['Supporting Technology Stack'] || '';
            const ide = participant['IDE'] || '';
            
            // Check if this technology appears in any of the tech fields
            if (devStack.includes(tech) || supportStack.includes(tech) || ide.includes(tech)) {
                participantsWithTech.push(participant['Your Name'] || 'Anonymous');
            }
        });
        
        // Add tooltip with participant names
        if (participantsWithTech.length > 0) {
            techTag.title = `Used by: ${participantsWithTech.join(', ')}`;
        }
        
        // Make tag clickable to filter by technology across all tech fields
        techTag.addEventListener('click', (e) => {
            e.preventDefault();
            // Create a complex filter URL that searches across all tech fields
            const filterUrl = `filter.html?complexFilter=true&filters=${encodeURIComponent(
                JSON.stringify([
                    { field: 'Technology Stack for Development', value: tech, isList: true },
                    { field: 'Supporting Technology Stack', value: tech, isList: true },
                    { field: 'IDE', value: tech, isList: true }
                ])
            )}`;
            window.location.href = filterUrl;
        });
        
        container.appendChild(techTag);
    });
}

// Function to set up tab switching
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Helper function to generate colors for charts
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
