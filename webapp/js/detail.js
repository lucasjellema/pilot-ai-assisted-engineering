// This file handles the detail page functionality

document.addEventListener('DOMContentLoaded', async () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const participantId = urlParams.get('id');
    
    if (!participantId) {
        document.body.innerHTML = `<div class="error-message">
            <h2>Participant Not Found</h2>
            <p>No participant ID specified.</p>
            <a href="index.html" class="btn">Return to Overview</a>
        </div>`;
        return;
    }
    
    // Load the participant data
    const participants = await loadParticipantData();
    
    if (participants.length === 0) return;
    
    // Find the participant with the specified ID
    const participant = getParticipantById(participants, participantId);
    
    if (!participant) {
        document.body.innerHTML = `<div class="error-message">
            <h2>Participant Not Found</h2>
            <p>No participant found with ID: ${participantId}</p>
            <a href="index.html" class="btn">Return to Overview</a>
        </div>`;
        return;
    }
    
    // Populate the participant details
    populateParticipantDetails(participant);
    
    // Set up navigation buttons
    setupNavigation(participants, participantId);
});

// Function to populate the participant details
function populateParticipantDetails(participant) {
    // Set page title
    document.title = `Participant Details - ${participant['Your Name'] || 'Anonymous'}`;
    
    // Basic information
    document.getElementById('participant-name').textContent = participant['Your Name'] || 'Anonymous';
    document.getElementById('participant-company').textContent = participant.Company || 'N/A';
    // Display role as a styled tag
    const roleContainer = document.createElement('div');
    roleContainer.className = 'roles-container';
    document.getElementById('participant-role').appendChild(roleContainer);
    
    if (participant.Role) {
        const roleLink = document.createElement('a');
        roleLink.className = 'tag-link role-link';
        roleLink.textContent = participant.Role;
        roleLink.href = `filter.html?field=${encodeURIComponent('Role')}&value=${encodeURIComponent(participant.Role)}`;
        roleContainer.appendChild(roleLink);
    } else {
        document.getElementById('participant-role').textContent = 'N/A';
    }
    document.getElementById('start-time').textContent = participant['Start time'] || 'N/A';
    document.getElementById('completion-time').textContent = participant['Completion time'] || 'N/A';
    
    // Technical information
    const activitiesContainer = document.createElement('div');
    activitiesContainer.className = 'activities-container';
    document.getElementById('activities').appendChild(activitiesContainer);
    
    const activities = parseListField(participant['Daily Engineering Activities']);
    if (activities.length > 0) {
        activities.forEach(activity => {
            const activityLink = document.createElement('a');
            activityLink.className = 'activity-link';
            activityLink.textContent = activity;
            activityLink.href = `filter.html?field=${encodeURIComponent('Daily Engineering Activities')}&value=${encodeURIComponent(activity)}&isList=true`;
            activitiesContainer.appendChild(activityLink);
        });
    } else {
        const noActivities = document.createElement('p');
        noActivities.textContent = 'No activities specified';
        activitiesContainer.appendChild(noActivities);
    }
    
    // Display Technology Stack as tags
    const techStackContainer = document.createElement('div');
    techStackContainer.className = 'activities-container';
    document.getElementById('tech-stack').appendChild(techStackContainer);
    
    const techStackText = participant['Technology Stack for Development'];
    if (techStackText) {
        const technologies = extractTechnologies(techStackText);
        if (technologies.length > 0) {
            technologies.forEach(tech => {
                const techLink = document.createElement('a');
                techLink.className = 'tag-link tech-stack-link';
                techLink.textContent = tech;
                techLink.href = `filter.html?field=${encodeURIComponent('Technology Stack for Development')}&value=${encodeURIComponent(tech)}&isList=true`;
                techStackContainer.appendChild(techLink);
            });
        } else {
            document.getElementById('tech-stack').textContent = techStackText;
        }
    } else {
        document.getElementById('tech-stack').textContent = 'N/A';
    }
    // Display Supporting Technology Stack as tags
    const supportingTechContainer = document.createElement('div');
    supportingTechContainer.className = 'activities-container';
    document.getElementById('supporting-tech').appendChild(supportingTechContainer);
    
    const supportingTechText = participant['Supporting Technology Stack'];
    if (supportingTechText) {
        const technologies = extractTechnologies(supportingTechText);
        if (technologies.length > 0) {
            technologies.forEach(tech => {
                const techLink = document.createElement('a');
                techLink.className = 'tag-link tech-stack-link';
                techLink.textContent = tech;
                techLink.href = `filter.html?field=${encodeURIComponent('Supporting Technology Stack')}&value=${encodeURIComponent(tech)}&isList=true`;
                supportingTechContainer.appendChild(techLink);
            });
        } else {
            document.getElementById('supporting-tech').textContent = supportingTechText;
        }
    } else {
        document.getElementById('supporting-tech').textContent = 'N/A';
    }
    // Display IDEs as tags
    const ideContainer = document.createElement('div');
    ideContainer.className = 'activities-container';
    document.getElementById('ide').appendChild(ideContainer);
    
    const ideText = participant['IDE'];
    if (ideText) {
        // Split IDE text by commas and newlines
        const ides = ideText.split(/[,\n]/).map(ide => ide.trim()).filter(ide => ide.length > 0);
        if (ides.length > 0) {
            ides.forEach(ide => {
                const ideLink = document.createElement('a');
                ideLink.className = 'tag-link tech-stack-link';
                ideLink.textContent = ide;
                ideLink.href = `filter.html?field=${encodeURIComponent('IDE')}&value=${encodeURIComponent(ide)}&isList=true`;
                ideContainer.appendChild(ideLink);
            });
        } else {
            document.getElementById('ide').textContent = ideText;
        }
    } else {
        document.getElementById('ide').textContent = 'N/A';
    }
    
    // AI experience
    document.getElementById('ai-experience-text').textContent = participant['Experience with AI Coding Assistants'] || 'N/A';
    document.getElementById('objectives').textContent = participant['Objectives, Priorities and Expectations'] || 'N/A';
    
    // Participation information
    document.getElementById('track-participation').textContent = participant['Track Participation'] || 'N/A';
    document.getElementById('time-commitment').textContent = participant['Expected Time Commitment'] || 'N/A';
    
    const exploreActivitiesContainer = document.createElement('div');
    exploreActivitiesContainer.className = 'activities-container';
    document.getElementById('explore-activities').appendChild(exploreActivitiesContainer);
    
    const exploreActivities = parseListField(participant['Activities to Explore']);
    if (exploreActivities.length > 0) {
        exploreActivities.forEach(activity => {
            const activityLink = document.createElement('a');
            activityLink.className = 'activity-link';
            activityLink.textContent = activity;
            activityLink.href = `filter.html?field=${encodeURIComponent('Activities to Explore')}&value=${encodeURIComponent(activity)}&isList=true`;
            exploreActivitiesContainer.appendChild(activityLink);
        });
    } else {
        const noActivities = document.createElement('p');
        noActivities.textContent = 'No activities specified';
        exploreActivitiesContainer.appendChild(noActivities);
    }
    
    document.getElementById('usage-intent').textContent = participant['Usage Intent'] || 'N/A';
    document.getElementById('code-base').textContent = participant['Code Base'] || 'N/A';
}

// Function to set up navigation buttons
function setupNavigation(participants, currentId) {
    const currentIndex = getParticipantIndex(participants, currentId);
    const prevButton = document.getElementById('prev-participant');
    const nextButton = document.getElementById('next-participant');
    
    // Previous participant button
    if (currentIndex > 0) {
        const prevId = participants[currentIndex - 1].ID;
        prevButton.addEventListener('click', () => {
            window.location.href = `detail.html?id=${prevId}`;
        });
    } else {
        prevButton.disabled = true;
        prevButton.classList.add('disabled');
    }
    
    // Next participant button
    if (currentIndex < participants.length - 1) {
        const nextId = participants[currentIndex + 1].ID;
        nextButton.addEventListener('click', () => {
            window.location.href = `detail.html?id=${nextId}`;
        });
    } else {
        nextButton.disabled = true;
        nextButton.classList.add('disabled');
    }
}
