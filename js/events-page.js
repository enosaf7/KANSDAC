document.addEventListener('DOMContentLoaded', function() {
    displayEvents('all');

    // Add event listeners to filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class to clicked button
            this.classList.add('active');
            // Display filtered events
            displayEvents(this.dataset.filter);
        });
    });
});

function displayEvents(filter) {
    const eventsGrid = document.getElementById('eventsGrid');
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const currentDate = new Date();

    // Filter events based on selected filter
    let filteredEvents = events;
    if (filter === 'upcoming') {
        filteredEvents = events.filter(event => new Date(event.date) >= currentDate);
    } else if (filter === 'past') {
        filteredEvents = events.filter(event => new Date(event.date) < currentDate);
    }

    // Sort events by date
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (filteredEvents.length === 0) {
        eventsGrid.innerHTML = `
            <div class="no-events">
                <p>No ${filter === 'all' ? '' : filter} events found.</p>
            </div>
        `;
        return;
    }

    eventsGrid.innerHTML = filteredEvents.map(event => `
        <div class="event-card" style="background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${event.image}')">
            <div class="event-content">
                <div class="event-date">
                    <i class="fas fa-calendar-alt"></i>
                    ${formatDate(event.date)}
                </div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-details">${event.description}</p>
                <div class="event-meta">
                    <div class="event-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    <div class="event-time">
                        <i class="fas fa-clock"></i>
                        <span>${formatTime(event.time)}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeStr) {
    return new Date(`2000/01/01 ${timeStr}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
} 