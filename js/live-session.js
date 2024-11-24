// Live Session Management
let currentLiveSession = null;

// Initialize live session status
document.addEventListener('DOMContentLoaded', function() {
    checkLiveSessionStatus();
});

// Function to start a live session (Officials Portal)
function startLiveSession(event) {
    event.preventDefault();
    const sessionData = {
        id: Date.now(),
        title: document.getElementById('session-title').value,
        streamUrl: document.getElementById('stream-url').value,
        startTime: new Date().toISOString(),
        isActive: true
    };

    // Save to localStorage
    localStorage.setItem('currentLiveSession', JSON.stringify(sessionData));
    currentLiveSession = sessionData;

    // Update UI
    updateLiveSessionUI();
    showNotification('Live session started successfully!', 'success');
}

// Function to end the current live session (Officials Portal)
function endLiveSession() {
    if (currentLiveSession) {
        currentLiveSession.isActive = false;
        currentLiveSession.endTime = new Date().toISOString();
        
        // Archive the session
        const archivedSessions = JSON.parse(localStorage.getItem('archivedSessions') || '[]');
        archivedSessions.push(currentLiveSession);
        localStorage.setItem('archivedSessions', JSON.stringify(archivedSessions));
        
        // Clear current session
        localStorage.removeItem('currentLiveSession');
        currentLiveSession = null;
        
        // Update UI
        updateLiveSessionUI();
        showNotification('Live session ended', 'info');
    }
}

// Function to check live session status
function checkLiveSessionStatus() {
    const savedSession = localStorage.getItem('currentLiveSession');
    if (savedSession) {
        currentLiveSession = JSON.parse(savedSession);
        updateLiveSessionUI();
    }
}

// Function to update UI based on session status
function updateLiveSessionUI() {
    // Update Officials Portal UI
    const liveSessionForm = document.getElementById('live-session-form');
    const activeSessionInfo = document.getElementById('active-session-info');
    
    if (liveSessionForm && activeSessionInfo) {
        if (currentLiveSession && currentLiveSession.isActive) {
            liveSessionForm.style.display = 'none';
            activeSessionInfo.style.display = 'block';
            activeSessionInfo.innerHTML = `
                <div class="active-session">
                    <h3>${currentLiveSession.title}</h3>
                    <p>Started at: ${new Date(currentLiveSession.startTime).toLocaleString()}</p>
                    <p>Stream URL: <a href="${currentLiveSession.streamUrl}" target="_blank">${currentLiveSession.streamUrl}</a></p>
                    <button onclick="endLiveSession()" class="end-session-btn">
                        <i class="fas fa-stop-circle"></i> End Session
                    </button>
                </div>
            `;
        } else {
            liveSessionForm.style.display = 'block';
            activeSessionInfo.style.display = 'none';
        }
    }

    // Update Member Portal UI
    const liveStreamBtn = document.getElementById('liveStreamBtn');
    if (liveStreamBtn) {
        if (currentLiveSession && currentLiveSession.isActive) {
            liveStreamBtn.classList.add('active');
            liveStreamBtn.onclick = () => window.open(currentLiveSession.streamUrl, '_blank');
        } else {
            liveStreamBtn.classList.remove('active');
            liveStreamBtn.onclick = () => showNotification('No active live stream at the moment', 'info');
        }
    }
}

// Function to open live stream (Member Portal)
function openLiveStream(event) {
    event.preventDefault();
    if (currentLiveSession && currentLiveSession.isActive) {
        window.open(currentLiveSession.streamUrl, '_blank');
    } else {
        showNotification('No active live stream at the moment', 'info');
    }
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
