// Add this to your existing admin-portal.js
document.addEventListener('DOMContentLoaded', function() {
    loadSchedule();
    
    // Handle schedule form submission
    document.getElementById('scheduleForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newActivity = {
            time: document.getElementById('activityTime').value,
            name: document.getElementById('activityName').value,
            id: Date.now()
        };
        
        // Get existing schedule
        let schedule = JSON.parse(localStorage.getItem('weeklySchedule') || '[]');
        
        // Add new activity
        schedule.push(newActivity);
        
        // Sort by time
        schedule.sort((a, b) => a.time.localeCompare(b.time));
        
        // Save to localStorage
        localStorage.setItem('weeklySchedule', JSON.stringify(schedule));
        
        // Reset form and refresh display
        this.reset();
        loadSchedule();
        
        alert('Activity added successfully!');
    });
});

function loadSchedule() {
    const scheduleList = document.getElementById('scheduleList');
    const schedule = JSON.parse(localStorage.getItem('weeklySchedule') || '[]');
    
    if (schedule.length === 0) {
        scheduleList.innerHTML = '<p class="no-schedule">No activities scheduled yet</p>';
        return;
    }

    scheduleList.innerHTML = schedule.map(activity => `
        <div class="schedule-item">
            <span class="time">${formatTime(activity.time)}</span>
            <span class="activity">${activity.name}</span>
            <button onclick="deleteActivity(${activity.id})" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function deleteActivity(id) {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    
    let schedule = JSON.parse(localStorage.getItem('weeklySchedule') || '[]');
    schedule = schedule.filter(activity => activity.id !== id);
    localStorage.setItem('weeklySchedule', JSON.stringify(schedule));
    
    loadSchedule();
}

function formatTime(time) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
} 