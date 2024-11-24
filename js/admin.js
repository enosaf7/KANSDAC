// ========== ANNOUNCEMENTS ==========
// Function to convert file to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Updated submitAnnouncement function
async function submitAnnouncement(event) {
    event.preventDefault();
    
    const form = event.target;
    const file = form.flyer.files[0];
    
    // Convert image to Base64 if a file was selected
    const flyerUrl = file ? await fileToBase64(file) : null;

    const formData = {
        id: Date.now(),
        title: form.title.value,
        content: form.content.value,
        expiryDate: form.expiryDate.value,
        flyerUrl: flyerUrl
    };

    // Save to localStorage
    let announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    announcements.push(formData);
    localStorage.setItem('announcements', JSON.stringify(announcements));
    
    // Add this console.log to verify data is being saved
    console.log('Saved announcements:', announcements);

    // Update display
    displayAnnouncements();
    
    // Reset and hide form
    form.reset();
    hideAnnouncementForm();
}

function displayAnnouncements() {
    const announcementsList = document.querySelector('.announcements-list');
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    
    announcementsList.innerHTML = announcements.map(announcement => `
        <div class="card" data-id="${announcement.id}">
            <div class="card-image">
                ${announcement.flyerUrl 
                    ? `<img src="${announcement.flyerUrl}" alt="Announcement Flyer">`
                    : `<div class="no-image">No Flyer Available</div>`
                }
            </div>
            <div class="card-content">
                <h3 class="card-title">${announcement.title}</h3>
                <p class="card-text">${announcement.content}</p>
                <div class="card-footer">
                    <span class="date">Valid until: ${new Date(announcement.expiryDate).toLocaleDateString()}</span>
                    <button class="delete-btn" onclick="deleteAnnouncement(${announcement.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function deleteAnnouncement(id) {
    if (confirm('Delete this announcement?')) {
        let announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        announcements = announcements.filter(a => a.id !== id);
        localStorage.setItem('announcements', JSON.stringify(announcements));
        displayAnnouncements();
    }
}

// ========== EVENTS ==========
// Do the same for events
async function submitEvent(event) {
    event.preventDefault();
    
    const form = event.target;
    const file = form.eventFlyer.files[0];
    
    // Convert image to Base64 if a file was selected
    const flyerUrl = file ? await fileToBase64(file) : null;
    
    const eventData = {
        id: Date.now(),
        title: form.title.value,
        description: form.description.value,
        location: form.location.value,
        date: form.date.value,
        time: form.time.value,
        flyerUrl: flyerUrl
    };

    // Save to localStorage
    let events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push(eventData);
    localStorage.setItem('events', JSON.stringify(events));
    
    console.log('Saved event:', eventData); // Debug log

    // Update display
    displayEvents();
    
    // Reset and hide form
    form.reset();
    hideEventForm();
}

function displayEvents() {
    const eventsList = document.querySelector('.events-list');
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    
    console.log('Retrieved events:', events); // Debug log
    
    eventsList.innerHTML = events.map(event => `
        <div class="card" data-id="${event.id}">
            <div class="card-image">
                ${event.flyerUrl 
                    ? `<img src="${event.flyerUrl}" alt="Event Flyer">`
                    : `<div class="no-image">No Flyer Available</div>`
                }
            </div>
            <div class="card-content">
                <h3 class="card-title">${event.title}</h3>
                <p class="card-text">${event.description}</p>
                <div class="event-details">
                    <span><i class="fas fa-calendar"></i> ${event.date}</span>
                    <span><i class="fas fa-clock"></i> ${event.time}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                </div>
                <div class="card-footer">
                    <button class="delete-btn" onclick="deleteEvent(${event.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function deleteEvent(id) {
    if (confirm('Delete this event?')) {
        let events = JSON.parse(localStorage.getItem('events') || '[]');
        events = events.filter(e => e.id !== id);
        localStorage.setItem('events', JSON.stringify(events));
        displayEvents();
    }
}

// ========== FORM VISIBILITY TOGGLES ==========
function showAnnouncementForm() {
    document.getElementById('announcementForm').style.display = 'block';
}

function hideAnnouncementForm() {
    document.getElementById('announcementForm').style.display = 'none';
}

function showEventForm() {
    document.getElementById('eventForm').style.display = 'block';
}

function hideEventForm() {
    document.getElementById('eventForm').style.display = 'none';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    displayAnnouncements();
    displayEvents();
});