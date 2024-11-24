document.addEventListener('DOMContentLoaded', function() {
    // Update current date
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update active members count
    updateActiveMembersCount();

    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.dataset.section;
            showSection(sectionId);
        });
    });

    // Calendar functionality
    initializeCalendar();

    // Prayer functionality
    prayerManager = new PrayerManager();

    // Get the logout button
    const logoutBtn = document.querySelector('.logout-btn');
    
    // Add click event listener
    logoutBtn.addEventListener('click', function() {
        // Optional: Clear any session data or localStorage if needed
        // localStorage.clear(); // Uncomment if you want to clear all localStorage
        
        // Redirect to index.html
        window.location.href = 'index.html';
    });
});

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
}

// Calendar Functions
function initializeCalendar() {
    const calendar = document.querySelector('.calendar-grid');
    const currentMonth = document.querySelector('.current-month');
    const prevBtn = document.querySelector('.prev-month');
    const nextBtn = document.querySelector('.next-month');
    
    let date = new Date();
    
    function renderCalendar() {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const startDayIndex = firstDay.getDay();
        const totalDays = lastDay.getDate();
        
        currentMonth.textContent = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        
        let calendarHTML = `
            <div class="calendar-day-header">Sun</div>
            <div class="calendar-day-header">Mon</div>
            <div class="calendar-day-header">Tue</div>
            <div class="calendar-day-header">Wed</div>
            <div class="calendar-day-header">Thu</div>
            <div class="calendar-day-header">Fri</div>
            <div class="calendar-day-header">Sat</div>
        `;
        
        for(let i = 0; i < startDayIndex; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }
        
        for(let day = 1; day <= totalDays; day++) {
            calendarHTML += `
                <div class="calendar-day">
                    <span>${day}</span>
                </div>
            `;
        }
        
        calendar.innerHTML = calendarHTML;
    }
    
    renderCalendar();
    
    prevBtn.addEventListener('click', () => {
        date.setMonth(date.getMonth() - 1);
        renderCalendar();
    });
    
    nextBtn.addEventListener('click', () => {
        date.setMonth(date.getMonth() + 1);
        renderCalendar();
    });
}

// Document Management
function initializeDocuments() {
    const uploadBtn = document.querySelector('.upload-doc-btn');
    const searchInput = document.querySelector('input[type="search"]');
    
    uploadBtn.addEventListener('click', () => {
        // Implement document upload functionality
        console.log('Upload document clicked');
    });
    
    searchInput.addEventListener('input', (e) => {
        // Implement search functionality
        console.log('Searching for:', e.target.value);
    });
}

// Profile Management
function initializeProfile() {
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    
    editProfileBtn.addEventListener('click', () => {
        // Implement profile edit functionality
        console.log('Edit profile clicked');
    });
}

// Messages
function initializeMessages() {
    const messagesList = document.querySelector('.messages-list');
    const messageView = document.querySelector('.message-view');
    
    // Implement message loading and display
}

// Function to count active members
function updateActiveMembersCount() {
    const members = JSON.parse(localStorage.getItem('members') || '[]');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeMembers = members.filter(member => {
        const lastLogin = new Date(member.lastLogin || 0);
        return lastLogin > thirtyDaysAgo;
    });

    const countElement = document.getElementById('activeMembersCount');
    countElement.textContent = `${activeMembers.length} Active`;
}

// Function to count prayer requests and thanksgiving
function updatePrayerRequestsCount() {
    // Get submissions from localStorage
    const submissions = JSON.parse(localStorage.getItem('testimonies_submissions') || '[]');
    
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count new submissions from today
    const newSubmissions = submissions.filter(submission => {
        const submissionDate = new Date(submission.timestamp);
        return submissionDate >= today;
    });

    const countElement = document.getElementById('prayerRequestsCount');
    countElement.innerHTML = `
        ${newSubmissions.length} New<br>
        <span class="total-count">${submissions.length} Total</span>
    `;
}

// Update all stats
function updateAllStats() {
    updateActiveMembersCount();
    updatePrayerRequestsCount();
}

// Listen for changes in localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'testimonies_submissions') {
        updatePrayerRequestsCount();
    }
});

// Update stats when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateAllStats();
    
    // Update every 30 seconds
    setInterval(updateAllStats, 30000);
});

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    initializeDocuments();
    initializeProfile();
    initializeMessages();
});

class PrayerManager {
    constructor() {
        this.prayers = [];
        this.currentFilter = 'all';
        this.prayedTimers = new Map(); // Store timers for prayed requests
        this.init();
    }

    init() {
        this.loadPrayers();
        this.setupEventListeners();
        this.updateStats();
        this.initializePrayedTimers();
    }

    initializePrayedTimers() {
        // Set up timers for already prayed-for requests
        this.prayers.forEach(prayer => {
            if (prayer.isPrayedFor && prayer.prayedForTime) {
                const timeLeft = (new Date(prayer.prayedForTime).getTime() + 600000) - Date.now();
                if (timeLeft > 0) {
                    this.setPrayedTimer(prayer.id, timeLeft);
                } else {
                    this.removePrayer(prayer.id);
                }
            }
        });
    }

    loadPrayers() {
        // Load prayers from localStorage
        this.prayers = JSON.parse(localStorage.getItem('prayers') || '[]');
        this.displayPrayers();
    }

    savePrayers() {
        localStorage.setItem('prayers', JSON.stringify(this.prayers));
    }

    setPrayedTimer(prayerId, timeLeft) {
        // Clear existing timer if any
        if (this.prayedTimers.has(prayerId)) {
            clearTimeout(this.prayedTimers.get(prayerId));
        }

        // Set new timer
        const timerId = setTimeout(() => {
            this.removePrayer(prayerId);
        }, timeLeft);
        
        this.prayedTimers.set(prayerId, timerId);
    }

    removePrayer(prayerId) {
        this.prayers = this.prayers.filter(p => p.id !== prayerId);
        this.prayedTimers.delete(prayerId);
        this.savePrayers();
        this.displayPrayers();
    }

    markAsPrayedFor(prayerId) {
        const prayer = this.prayers.find(p => p.id === prayerId);
        if (prayer) {
            prayer.isPrayedFor = true;
            prayer.prayedForTime = new Date().toISOString();
            this.setPrayedTimer(prayerId, 600000); // 10 minutes in milliseconds
            this.savePrayers();
            this.displayPrayers();
        }
    }

    displayPrayers() {
        const prayersGrid = document.querySelector('.prayers-grid');
        const filteredPrayers = this.prayers;

        prayersGrid.innerHTML = filteredPrayers.map(prayer => this.createPrayerCard(prayer)).join('');
        this.updateStats();
    }

    createPrayerCard(prayer) {
        let timeLeftDisplay = '';
        if (prayer.isPrayedFor && prayer.prayedForTime) {
            const endTime = new Date(prayer.prayedForTime).getTime() + 600000;
            const timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timeLeftDisplay = `<span class="time-left">(${minutes}:${seconds.toString().padStart(2, '0')} left)</span>`;
        }

        return `
            <div class="prayer-card ${prayer.isPrayedFor ? 'prayed' : ''}" data-id="${prayer.id}">
                <div class="prayer-header">
                    <span class="prayer-badge ${prayer.type}">${prayer.type}</span>
                    <span class="prayer-date">${new Date(prayer.date).toLocaleDateString()}</span>
                </div>
                
                <div class="prayer-content">
                    <h3>${prayer.title}</h3>
                    <p>${prayer.content}</p>
                </div>
                
                <div class="prayer-meta">
                    <span>From: ${prayer.name}</span>
                    ${prayer.isPrayedFor ? 
                        `<span class="prayed-status">
                            <i class="fas fa-check"></i> Prayed for ${timeLeftDisplay}
                        </span>` : ''
                    }
                </div>
                
                <div class="prayer-actions">
                    ${!prayer.isPrayedFor ? `
                        <button onclick="prayerManager.markAsPrayedFor(${prayer.id})" class="action-btn pray-btn">
                            <i class="fas fa-pray"></i> Mark as Prayed
                        </button>
                    ` : ''}
                    <button onclick="prayerManager.sendFeedback(${prayer.id})" class="action-btn feedback-btn">
                        <i class="fas fa-comment"></i> Send Feedback
                    </button>
                </div>
            </div>
        `;
    }

    updateStats() {
        document.getElementById('totalRequests').textContent = this.prayers.length;
        document.getElementById('prayedCount').textContent = 
            this.prayers.filter(p => p.isPrayedFor).length;
        document.getElementById('pendingCount').textContent = 
            this.prayers.filter(p => !p.isPrayedFor).length;
    }
}

// Initialize
const prayerManager = new PrayerManager();

class PortalManager {
    constructor() {
        this.currentPrayerFilter = 'all';
        this.currentAnnouncementFilter = 'all';
        this.init();
    }

    init() {
        this.loadPrayers();
        this.loadAnnouncements();
        this.setupEventListeners();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Prayer filters
        document.querySelectorAll('#prayers .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter('prayer', btn.dataset.filter);
            });
        });

        // Announcement filters
        document.querySelectorAll('#announcements .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter('announcement', btn.dataset.filter);
            });
        });

        // Search functionality
        document.getElementById('prayerSearch').addEventListener('input', (e) => {
            this.searchItems('prayer', e.target.value);
        });

        document.getElementById('announcementSearch').addEventListener('input', (e) => {
            this.searchItems('announcement', e.target.value);
        });
    }

    setupNavigation() {
        document.querySelectorAll('.nav-links li').forEach(link => {
            link.addEventListener('click', () => {
                // Remove active class from all links
                document.querySelectorAll('.nav-links li').forEach(l => 
                    l.classList.remove('active'));
                // Add active class to clicked link
                link.classList.add('active');
                
                // Show corresponding section
                const sectionId = link.dataset.section;
                this.showSection(sectionId);
            });
        });
    }

    showSection(sectionId) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    loadPrayers() {
        const prayers = JSON.parse(localStorage.getItem('prayers') || '[]');
        const prayersGrid = document.querySelector('.prayers-grid');
        
        prayersGrid.innerHTML = prayers
            .filter(prayer => this.filterPrayer(prayer))
            .map(prayer => this.createPrayerCard(prayer))
            .join('');
    }

    loadAnnouncements() {
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        const announcementsGrid = document.querySelector('.announcements-grid');
        
        announcementsGrid.innerHTML = announcements
            .filter(announcement => this.filterAnnouncement(announcement))
            .map(announcement => this.createAnnouncementCard(announcement))
            .join('');
    }

    createPrayerCard(prayer) {
        return `
            <div class="card prayer-card ${prayer.type}" data-id="${prayer.id}">
                <div class="card-header">
                    <span class="badge ${prayer.type}">${prayer.type}</span>
                    <span class="date">${new Date(prayer.date).toLocaleDateString()}</span>
                </div>
                <h3>${prayer.title}</h3>
                <p>${prayer.content}</p>
                <div class="card-footer">
                    <span class="author">By: ${prayer.name}</span>
                    <div class="actions">
                        <button onclick="portalManager.deletePrayer(${prayer.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createAnnouncementCard(announcement) {
        return `
            <div class="card announcement-card ${announcement.status}" data-id="${announcement.id}">
                <div class="card-header">
                    <span class="badge ${announcement.status}">${announcement.status}</span>
                    <span class="category">${announcement.category}</span>
                </div>
                <h3>${announcement.title}</h3>
                <p>${announcement.content}</p>
                <div class="meta-info">
                    <span>By: ${announcement.author}</span>
                    <span>Posted: ${new Date(announcement.date).toLocaleDateString()}</span>
                    ${announcement.expiryDate ? 
                        `<span>Expires: ${new Date(announcement.expiryDate).toLocaleDateString()}</span>` 
                        : ''
                    }
                </div>
                <div class="card-actions">
                    ${announcement.status === 'pending' ? `
                        <button onclick="portalManager.approveAnnouncement(${announcement.id})" class="approve-btn">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button onclick="portalManager.rejectAnnouncement(${announcement.id})" class="reject-btn">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : `
                        <button onclick="portalManager.deleteAnnouncement(${announcement.id})" class="delete-btn">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    approveAnnouncement(id) {
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        const announcement = announcements.find(a => a.id === id);
        
        if (announcement) {
            announcement.status = 'approved';
            announcement.approvedDate = new Date();
            localStorage.setItem('announcements', JSON.stringify(announcements));
            
            // Refresh the display
            this.loadAnnouncements();
            
            // Show success message
            this.showNotification('Announcement approved successfully!');
        }
    }

    rejectAnnouncement(id) {
        if (confirm('Are you sure you want to reject this announcement?')) {
            const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
            const filteredAnnouncements = announcements.filter(a => a.id !== id);
            
            localStorage.setItem('announcements', JSON.stringify(filteredAnnouncements));
            
            // Refresh the display
            this.loadAnnouncements();
            
            // Show notification
            this.showNotification('Announcement rejected', 'warning');
        }
    }

    // ... (additional methods for filtering, searching, and actions)
}

// Initialize the portal manager
const portalManager = new PortalManager(); 