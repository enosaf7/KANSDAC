document.addEventListener('DOMContentLoaded', function() {
    loadPrayerRequests();
    loadTestimonies();
});

function loadPrayerRequests() {
    const prayers = JSON.parse(localStorage.getItem('prayers') || '[]');
    const container = document.getElementById('prayerRequestsList');
    
    if (prayers.length === 0) {
        container.innerHTML = '<p class="no-data">No prayer requests submitted yet</p>';
        return;
    }

    container.innerHTML = prayers
        .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted))
        .map(prayer => `
            <div class="prayer-item">
                <div class="item-content">${prayer.request}</div>
                <div class="item-meta">
                    <span><i class="fas fa-clock"></i> ${formatDate(prayer.dateSubmitted)}</span>
                    ${prayer.anonymous ? 
                        '<span class="anonymous-tag"><i class="fas fa-user-secret"></i> Anonymous</span>' : 
                        ''}
                </div>
            </div>
        `).join('');
}

function loadTestimonies() {
    const testimonies = JSON.parse(localStorage.getItem('testimonies') || '[]');
    const container = document.getElementById('testimoniesList');
    
    if (testimonies.length === 0) {
        container.innerHTML = '<p class="no-data">No testimonies shared yet</p>';
        return;
    }

    container.innerHTML = testimonies
        .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted))
        .map(testimony => `
            <div class="testimony-item">
                <div class="item-content">
                    <strong>${testimony.type}</strong>
                    <p>${testimony.testimony}</p>
                </div>
                <div class="item-meta">
                    <span><i class="fas fa-clock"></i> ${formatDate(testimony.dateSubmitted)}</span>
                    ${testimony.isAnonymous ? 
                        '<span class="anonymous-tag"><i class="fas fa-user-secret"></i> Anonymous</span>' : 
                        ''}
                </div>
            </div>
        `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
} 