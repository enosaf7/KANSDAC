// Prayer requests handling
let prayerRequests = JSON.parse(localStorage.getItem('prayerRequests')) || [];

// Function to submit a prayer request
function submitPrayerRequest(request) {
    const newRequest = {
        id: Date.now(),
        request: request,
        timestamp: new Date().toISOString(),
        status: 'pending',
        prayedFor: false
    };
    
    prayerRequests.push(newRequest);
    localStorage.setItem('prayerRequests', JSON.stringify(prayerRequests));
    return newRequest;
}

// Function to get all prayer requests
function getAllPrayerRequests() {
    return prayerRequests;
}

// Function to update prayer request status
function updatePrayerRequestStatus(id, prayedFor) {
    prayerRequests = prayerRequests.map(request => {
        if (request.id === id) {
            return { ...request, prayedFor: prayedFor };
        }
        return request;
    });
    localStorage.setItem('prayerRequests', JSON.stringify(prayerRequests));
}

// Function to filter prayer requests
function filterPrayerRequests(filter) {
    switch(filter) {
        case 'prayed':
            return prayerRequests.filter(req => req.prayedFor);
        case 'pending':
            return prayerRequests.filter(req => !req.prayedFor);
        default:
            return prayerRequests;
    }
}

// Function to search prayer requests
function searchPrayerRequests(query) {
    return prayerRequests.filter(req => 
        req.request.toLowerCase().includes(query.toLowerCase())
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
