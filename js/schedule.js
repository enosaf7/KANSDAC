// Initialize displays when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // For Member Portal
    if (document.getElementById('weeklySchedule')) {
        displayWeeklySchedule();
    }
    
    // For Officials Portal
    const scheduleSection = document.getElementById('weekly-schedule');
    if (scheduleSection) {
        // Add initial empty event row
        addEventRow();
        // Display preview
        displaySchedulePreview();
        // Set default date to today
        const dateInput = document.getElementById('schedule-date');
        if (dateInput) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            dateInput.value = `${yyyy}-${mm}-${dd}`;
        }
    }
});

// Function to upload weekly schedule (Officials Portal)
function uploadWeeklySchedule(event) {
    event.preventDefault();
    
    const scheduleData = {
        id: Date.now(),
        title: document.getElementById('schedule-title').value,
        date: document.getElementById('schedule-date').value,
        events: [],
        status: 'active',
        uploadedAt: new Date().toISOString()
    };

    // Get all event rows
    const eventRows = document.querySelectorAll('.schedule-event-row');
    if (eventRows.length === 0) {
        showNotification('Please add at least one event', 'error');
        return;
    }

    // Validate and collect events
    let hasError = false;
    eventRows.forEach(row => {
        const timeInput = row.querySelector('.event-time');
        const activityInput = row.querySelector('.event-activity');
        const leaderInput = row.querySelector('.event-leader');

        if (!timeInput.value || !activityInput.value || !leaderInput.value) {
            hasError = true;
            showNotification('Please fill in all event details', 'error');
            return;
        }

        const event = {
            time: timeInput.value,
            activity: activityInput.value,
            leader: leaderInput.value
        };
        scheduleData.events.push(event);
    });

    if (hasError) return;

    // Sort events by time
    scheduleData.events.sort((a, b) => {
        return new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time);
    });

    // Get existing schedules
    const schedules = JSON.parse(localStorage.getItem('weeklySchedules') || '[]');
    
    // Mark all other schedules as inactive
    schedules.forEach(schedule => {
        schedule.status = 'inactive';
    });

    // Add new schedule
    schedules.push(scheduleData);
    
    // Save to localStorage
    localStorage.setItem('weeklySchedules', JSON.stringify(schedules));

    // Clear form
    document.getElementById('schedule-form').reset();
    
    // Clear event rows
    const eventsContainer = document.getElementById('schedule-events');
    eventsContainer.innerHTML = '';
    
    // Add one empty event row
    addEventRow();

    // Set today's date
    const dateInput = document.getElementById('schedule-date');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // Show success message
    showNotification('Weekly schedule uploaded successfully!', 'success');

    // Refresh displays
    displaySchedulePreview();
    displayWeeklySchedule();
}

// Function to add new event row (Officials Portal)
function addEventRow() {
    const eventsContainer = document.getElementById('schedule-events');
    if (!eventsContainer) return;

    const newRow = document.createElement('div');
    newRow.className = 'schedule-event-row';
    newRow.innerHTML = `
        <div class="event-inputs">
            <input type="time" class="event-time" required>
            <input type="text" class="event-activity" placeholder="Activity" required>
            <input type="text" class="event-leader" placeholder="Leader/Responsible" required>
        </div>
        <button type="button" class="remove-event" onclick="removeEventRow(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    eventsContainer.appendChild(newRow);
}

// Function to remove event row (Officials Portal)
function removeEventRow(button) {
    const row = button.closest('.schedule-event-row');
    if (row) {
        // Check if this is the last row
        const container = row.parentElement;
        if (container.children.length === 1) {
            showNotification('Cannot remove the last event row', 'error');
            return;
        }
        row.remove();
    }
}

// Function to display weekly schedule (Both Portals)
function displayWeeklySchedule() {
    const scheduleContainer = document.getElementById('weeklySchedule');
    if (!scheduleContainer) return;

    const schedules = JSON.parse(localStorage.getItem('weeklySchedules') || '[]');
    
    // Get the active schedule
    const currentSchedule = schedules.find(schedule => schedule.status === 'active');
    
    if (!currentSchedule) {
        scheduleContainer.innerHTML = '<p class="no-schedule">No schedule available for this week.</p>';
        return;
    }

    // Generate schedule HTML
    let scheduleHtml = `
        <div class="schedule-header">
            <h3>${currentSchedule.title}</h3>
            <span class="schedule-date">${new Date(currentSchedule.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</span>
        </div>
        <div class="schedule-events">
    `;

    currentSchedule.events.forEach(event => {
        scheduleHtml += `
            <div class="schedule-event">
                <div class="event-time">${formatTime(event.time)}</div>
                <div class="event-details">
                    <div class="event-activity">${event.activity}</div>
                    <div class="event-leader">${event.leader}</div>
                </div>
            </div>
        `;
    });

    scheduleHtml += `
        </div>
        <div class="schedule-footer">
            <small class="last-updated">Last updated: ${new Date(currentSchedule.uploadedAt).toLocaleString()}</small>
        </div>
    `;
    
    scheduleContainer.innerHTML = scheduleHtml;
}

// Function to display schedule preview in Officials Portal
function displaySchedulePreview() {
    const previewContainer = document.getElementById('schedule-preview');
    if (!previewContainer) return;

    const schedules = JSON.parse(localStorage.getItem('weeklySchedules') || '[]');
    const activeSchedule = schedules.find(schedule => schedule.status === 'active');

    if (!activeSchedule) {
        previewContainer.innerHTML = '<p class="no-schedule">No active schedule</p>';
        return;
    }

    previewContainer.innerHTML = `
        <div class="preview-header">
            <h4>Current Active Schedule</h4>
            <span class="preview-date">${new Date(activeSchedule.date).toLocaleDateString()}</span>
        </div>
        <div class="preview-title">${activeSchedule.title}</div>
        <div class="preview-events">
            ${activeSchedule.events.map(event => `
                <div class="preview-event">
                    <span class="preview-time">${formatTime(event.time)}</span>
                    <span class="preview-activity">${event.activity}</span>
                </div>
            `).join('')}
        </div>
        <div class="preview-footer">
            <button onclick="deactivateSchedule(${activeSchedule.id})" class="deactivate-btn">
                <i class="fas fa-times"></i> Deactivate Schedule
            </button>
        </div>
    `;
}

// Function to deactivate a schedule
function deactivateSchedule(scheduleId) {
    const schedules = JSON.parse(localStorage.getItem('weeklySchedules') || '[]');
    const scheduleIndex = schedules.findIndex(s => s.id === scheduleId);
    
    if (scheduleIndex !== -1) {
        schedules[scheduleIndex].status = 'inactive';
        localStorage.setItem('weeklySchedules', JSON.stringify(schedules));
        
        showNotification('Schedule deactivated successfully', 'info');
        displaySchedulePreview();
        displayWeeklySchedule();
    }
}

// Helper function to format time
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
}

// Helper function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
