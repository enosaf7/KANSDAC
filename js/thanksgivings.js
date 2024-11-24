// Thanksgiving handling
let thanksgivings = JSON.parse(localStorage.getItem('thanksgivings')) || [];

// Function to submit a thanksgiving
function submitThanksgiving(data) {
    const newThanksgiving = {
        id: Date.now(),
        type: data.type,
        testimony: data.testimony,
        anonymous: data.anonymous,
        timestamp: new Date().toISOString(),
        status: 'pending',
        approved: false
    };
    
    thanksgivings.push(newThanksgiving);
    localStorage.setItem('thanksgivings', JSON.stringify(thanksgivings));
    return newThanksgiving;
}

// Function to get all thanksgivings
function getAllThanksgivings() {
    return thanksgivings;
}

// Function to update thanksgiving status
function updateThanksgivingStatus(id, approved) {
    thanksgivings = thanksgivings.map(thanksgiving => {
        if (thanksgiving.id === id) {
            return { ...thanksgiving, approved: approved };
        }
        return thanksgiving;
    });
    localStorage.setItem('thanksgivings', JSON.stringify(thanksgivings));
}

// Function to filter thanksgivings
function filterThanksgivings(filter) {
    switch(filter) {
        case 'approved':
            return thanksgivings.filter(t => t.approved);
        case 'pending':
            return thanksgivings.filter(t => !t.approved);
        case 'healing':
        case 'provision':
        case 'protection':
        case 'guidance':
        case 'other':
            return thanksgivings.filter(t => t.type === filter);
        default:
            return thanksgivings;
    }
}

// Function to search thanksgivings
function searchThanksgivings(query) {
    return thanksgivings.filter(t => 
        t.testimony.toLowerCase().includes(query.toLowerCase()) ||
        t.type.toLowerCase().includes(query.toLowerCase())
    );
}

// Function to format date
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to get testimony type label
function getTestimonyTypeLabel(type) {
    const labels = {
        'healing': 'Divine Healing',
        'provision': 'Divine Provision',
        'protection': 'Divine Protection',
        'guidance': 'Divine Guidance',
        'other': 'Other Blessings'
    };
    return labels[type] || type;
}
