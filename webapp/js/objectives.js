// This file handles the Objectives & Expectations page functionality

document.addEventListener('DOMContentLoaded', async () => {
    // Load the participant data
    const participants = await loadParticipantData();
    
    if (participants.length === 0) return;
    
    // Populate the Objectives & Expectations content
    populateObjectivesContent(participants);
});

// Function to populate the Objectives & Expectations content
function populateObjectivesContent(participants) {
    const container = document.getElementById('objectives-content');
    
    // Filter out empty responses
    const validResponses = participants.filter(p => {
        const response = p['Objectives, Priorities and Expectations'];
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
        return (b['Objectives, Priorities and Expectations'] || '').length - 
               (a['Objectives, Priorities and Expectations'] || '').length;
    });
    
    // Create feedback items
    validResponses.forEach(participant => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        
        const feedbackText = document.createElement('div');
        feedbackText.className = 'feedback-text';
        feedbackText.textContent = participant['Objectives, Priorities and Expectations'];
        
        const participantName = document.createElement('div');
        participantName.className = 'feedback-participant';
        participantName.textContent = participant['Your Name'] || 'Anonymous';
        
        // Make the item clickable to navigate to participant details
        feedbackItem.addEventListener('click', () => {
            window.location.href = `detail.html?id=${participant.ID}`;
        });
        feedbackItem.style.cursor = 'pointer';
        
        feedbackItem.appendChild(feedbackText);
        feedbackItem.appendChild(participantName);
        container.appendChild(feedbackItem);
    });
}
