// This file handles the filter page functionality

// Function to filter participants based on criteria
function filterParticipants(participants, field, value, isList = false) {
    return participants.filter(participant => {
        const fieldValue = participant[field];
        
        if (!fieldValue) return false;
        
        if (isList) {
            // For list fields, check if the value is included in the field
            return fieldValue.toLowerCase().includes(value.toLowerCase());
        } else {
            // For non-list fields, check for exact match (case-insensitive)
            return fieldValue.toLowerCase() === value.toLowerCase();
        }
    });
}

// Function to handle complex filtering across multiple fields
function complexFilter(participants, filters) {
    return participants.filter(participant => {
        // A participant matches if they match ANY of the filters (OR logic)
        return filters.some(filter => {
            const { field, value, isList } = filter;
            const fieldValue = participant[field];
            
            if (!fieldValue) return false;
            
            if (isList) {
                return fieldValue.toLowerCase().includes(value.toLowerCase());
            } else {
                return fieldValue.toLowerCase() === value.toLowerCase();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const complexFilterParam = urlParams.get('complexFilter') === 'true';
    const filtersParam = urlParams.get('filters');
    const field = urlParams.get('field');
    const value = urlParams.get('value');
    const isList = urlParams.get('isList') === 'true';
    
    // Load the participant data
    const participants = await loadParticipantData();
    
    if (participants.length === 0) return;
    
    let filteredParticipants = [];
    let filterTitle = '';
    let filterValue = '';
    let filterDescription = '';
    
    if (complexFilterParam && filtersParam) {
        // Handle complex filtering
        try {
            const filters = JSON.parse(decodeURIComponent(filtersParam));
            filteredParticipants = complexFilter(participants, filters);
            
            // Use the first filter's value for display purposes
            filterValue = filters[0].value;
            filterTitle = 'Technology';
            filterDescription = `Showing participants who use "${filterValue}" in any technology field.`;
        } catch (error) {
            console.error('Error parsing complex filters:', error);
            document.body.innerHTML = `<div class="error-message">
                <h2>Invalid Filter</h2>
                <p>Error parsing complex filter parameters.</p>
                <a href="index.html" class="btn">Return to Overview</a>
            </div>`;
            return;
        }
    } else if (field && value) {
        // Handle simple filtering
        filteredParticipants = filterParticipants(participants, field, value, isList);
        filterValue = value;
        filterTitle = field;
        
        // Update filter description based on field type
        if (field === 'Technology Stack for Development' || field === 'Supporting Technology Stack' || field === 'IDE') {
            filterDescription = `Showing participants who use "${value}" in their ${field}.`;
        } else {
            filterDescription = `Showing participants who ${isList ? 'included' : 'selected'} "${value}" in their ${field}.`;
        }
    } else {
        document.body.innerHTML = `<div class="error-message">
            <h2>Invalid Filter</h2>
            <p>Missing required filter parameters.</p>
            <a href="index.html" class="btn">Return to Overview</a>
        </div>`;
        return;
    }
    
    // Update the page title and filter info
    document.getElementById('filter-title').textContent = `Filtered by ${filterTitle}`;
    
    // Special styling for tag values
    const valueSpan = document.getElementById('filter-value');
    valueSpan.innerHTML = ''; // Clear existing content
    
    if (complexFilterParam) {
        // For complex filters (technology cloud)
        const techLink = document.createElement('span');
        techLink.className = 'tag-link tech-stack-link';
        techLink.textContent = filterValue;
        valueSpan.appendChild(techLink);
    } else if (filterTitle === 'Daily Engineering Activities' || filterTitle === 'Activities to Explore') {
        const activityLink = document.createElement('span');
        activityLink.className = 'activity-link';
        activityLink.textContent = filterValue;
        valueSpan.appendChild(activityLink);
    } else if (filterTitle === 'Technology Stack for Development' || filterTitle === 'Supporting Technology Stack' || filterTitle === 'IDE') {
        const techLink = document.createElement('span');
        techLink.className = 'tag-link tech-stack-link';
        techLink.textContent = filterValue;
        valueSpan.appendChild(techLink);
    } else if (filterTitle === 'Role') {
        const roleLink = document.createElement('span');
        roleLink.className = 'tag-link role-link';
        roleLink.textContent = filterValue;
        valueSpan.appendChild(roleLink);
    } else {
        valueSpan.textContent = filterValue;
    }
    
    // Update filter description
    document.getElementById('filter-description').textContent = filterDescription;
    
    // Show the number of matching participants
    document.getElementById('participants-count').textContent = 
        `Found ${filteredParticipants.length} matching participant${filteredParticipants.length !== 1 ? 's' : ''}.`;
    
    // Populate the filtered participants table
    populateFilteredTable(filteredParticipants);
});

// Function to populate the filtered participants table
function populateFilteredTable(participants) {
    const tableBody = document.getElementById('filtered-body');
    
    if (participants.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.textContent = 'No matching participants found.';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }
    
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
