// This file loads and processes the participant data

// Function to load the JSON data
async function loadParticipantData() {
    try {
        const response = await fetch('../data/Baseline_Measurement_PilotAIAssistedSoftwareEngineering.json');
        if (!response.ok) {
            throw new Error('Failed to load participant data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading participant data:', error);
        document.body.innerHTML = `<div class="error-message">
            <h2>Error Loading Data</h2>
            <p>${error.message}</p>
            <p>Please check that the data file exists and is accessible.</p>
        </div>`;
        return [];
    }
}

// Function to parse semicolon-separated values into arrays
function parseListField(field) {
    if (!field) return [];
    return field.split(';')
        .map(item => item.trim())
        .filter(item => item.length > 0);
}

// Function to get unique values from a specific field across all participants
function getUniqueValues(participants, field, isListField = false) {
    const allValues = new Set();
    const caseMap = new Map(); // For case-insensitive fields
    
    // Check if this is a technology-related field that should be case-insensitive
    const isTechField = field === 'Technology Stack for Development' || 
                       field === 'Supporting Technology Stack' || 
                       field === 'IDE';
    
    participants.forEach(participant => {
        if (isListField) {
            const values = parseListField(participant[field]);
            values.forEach(value => {
                if (isTechField && value) {
                    // For tech fields, handle case-insensitively
                    const lowerValue = value.toLowerCase();
                    if (!caseMap.has(lowerValue) || value.length > caseMap.get(lowerValue).length) {
                        caseMap.set(lowerValue, value);
                    }
                } else if (value) {
                    allValues.add(value);
                }
            });
        } else if (participant[field]) {
            if (isTechField) {
                const lowerValue = participant[field].toLowerCase();
                if (!caseMap.has(lowerValue) || participant[field].length > caseMap.get(lowerValue).length) {
                    caseMap.set(lowerValue, participant[field]);
                }
            } else {
                allValues.add(participant[field]);
            }
        }
    });
    
    // Add case-insensitive values if applicable
    if (isTechField) {
        caseMap.forEach(value => allValues.add(value));
    }
    
    return Array.from(allValues).sort();
}

// Function to count occurrences of values in a field
function countFieldValues(participants, field, isListField = false) {
    const counts = {};
    
    participants.forEach(participant => {
        if (isListField) {
            const values = parseListField(participant[field]);
            values.forEach(value => {
                counts[value] = (counts[value] || 0) + 1;
            });
        } else {
            const value = participant[field];
            if (value) {
                counts[value] = (counts[value] || 0) + 1;
            }
        }
    });
    
    return counts;
}

// Function to filter participants based on a field value
function filterParticipants(participants, field, value, isListField = false) {
    return participants.filter(participant => {
        // Special handling for technology stacks and AI experience
        if ((field === 'Technology Stack for Development' || 
             field === 'Supporting Technology Stack' || 
             field === 'IDE' || 
             field === 'Experience with AI Coding Assistants') && participant[field]) {
            // For tech stacks and AI experience, check if the value is contained in the field (case-insensitive)
            return participant[field].toLowerCase().includes(value.toLowerCase());
        } else if (isListField) {
            if (!participant[field]) return false;
            
            // Handle list fields with case-insensitive comparison
            const values = parseListField(participant[field]);
            return values.some(v => v.toLowerCase() === value.toLowerCase());
        } else {
            if (!participant[field]) return false;
            
            // Case-insensitive comparison for regular fields
            return participant[field].toLowerCase() === value.toLowerCase();
        }
    });
}

// Function to get participants with a specific value (for tooltips)
function getParticipantsWithValue(participants, field, value, isListField = false) {
    return filterParticipants(participants, field, value, isListField);
}

// Function to get a participant by ID
function getParticipantById(participants, id) {
    return participants.find(p => p.ID === id);
}

// Function to get the index of a participant in the array
function getParticipantIndex(participants, id) {
    return participants.findIndex(p => p.ID === id);
}

// Helper function to safely extract AI assistants from experience text
function extractAIAssistants(experienceText) {
    if (!experienceText) return [];
    
    // Look for the first sentence which typically contains the list of AI tools
    const firstSentence = experienceText.split('.')[0];
    
    // Common AI assistants to look for
    const commonAssistants = [
        'Copilot', 'GitHub Copilot', 'ChatGPT', 'GPT', 'Claude', 
        'Bard', 'Gemini', 'Codeium', 'Tabnine', 'Kite', 'aiXplain',
        'IntelliJ AI', 'CodeWhisperer', 'Perplexity'
    ];
    
    // Extract mentioned assistants
    const assistants = [];
    commonAssistants.forEach(assistant => {
        if (experienceText.includes(assistant)) {
            assistants.push(assistant);
        }
    });
    
    return assistants;
}

// Helper function to extract technologies from tech stack text
function extractTechnologies(techStackText) {
    if (!techStackText) return [];
    
    // Split by common delimiters
    const rawTechs = techStackText.split(/[,.\n;()]/)
        .map(t => t.trim())
        .filter(t => t.length > 0);
    
    // Extract main technology names (first word or full framework name)
    const technologies = new Set();
    
    // Create a map to track case-insensitive duplicates
    const techMap = new Map();
    
    rawTechs.forEach(tech => {
        // Common multi-word technologies to preserve
        const multiWordTechs = [
            'Visual Studio', 'VS Code', 'Spring Boot', 'Azure DevOps',
            'GitHub Copilot', 'Azure Functions', 'SQL Server', 'App Service',
            'Service Bus', 'Log Analytics', 'Application Insights'
        ];
        
        // Check if this is a multi-word tech we want to preserve
        let foundMultiWord = false;
        for (const multiWordTech of multiWordTechs) {
            if (tech.toLowerCase().includes(multiWordTech.toLowerCase())) {
                // Use the proper case version from our list
                techMap.set(multiWordTech.toLowerCase(), multiWordTech);
                foundMultiWord = true;
                break;
            }
        }
        
        // If not a multi-word tech, take the first word (likely the main tech name)
        if (!foundMultiWord) {
            const firstWord = tech.split(' ')[0];
            // Only add if it's not a version number or empty
            if (firstWord && !firstWord.match(/^\d+(\.\d+)*$/)) {
                // Store with consistent casing (first letter uppercase, rest lowercase)
                const normalizedTech = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
                techMap.set(firstWord.toLowerCase(), normalizedTech);
            }
        }
    });
    
    // Add all unique technologies to the set
    for (const tech of techMap.values()) {
        technologies.add(tech);
    }
    
    return Array.from(technologies);
}
