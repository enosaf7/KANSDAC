// Display events in member portal
function displayMemberEvents() {
    const weeklySchedule = document.getElementById('weeklySchedule');
    const events = JSON.parse(localStorage.getItem('churchEvents') || '[]');
    
    if (events.length === 0) {
        weeklySchedule.innerHTML = '<p class="no-events">No upcoming events scheduled.</p>';
        return;
    }

    // Sort events by date
    const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    weeklySchedule.innerHTML = sortedEvents.map(event => `
        <div class="schedule-item">
            <div class="event-time">
                <i class="fas fa-clock"></i>
                <span>${event.time}</span>
            </div>
            <div class="event-details">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="event-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
                <div class="event-date">
                    <i class="fas fa-calendar"></i>
                    <span>${event.date}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Live Stream Functions
function checkLiveStreamStatus() {
    const liveSessions = JSON.parse(localStorage.getItem('liveSessions') || '[]');
    const liveSession = liveSessions.find(session => session.status === 'live');
    
    const liveStreamBtn = document.getElementById('liveStreamBtn');
    const streamStatus = document.getElementById('streamStatus');
    
    if (liveSession) {
        liveStreamBtn.disabled = false;
        liveStreamBtn.dataset.link = liveSession.sessionLink;
        liveStreamBtn.dataset.status = 'live';
        streamStatus.textContent = `Live Now: ${liveSession.title}`;
        streamStatus.className = 'status-live';
    } else {
        liveStreamBtn.disabled = true;
        delete liveStreamBtn.dataset.link;
        delete liveStreamBtn.dataset.status;
        streamStatus.textContent = 'No live session at the moment';
        streamStatus.className = '';
    }
}

function joinLiveStream() {
    const liveStreamBtn = document.getElementById('liveStreamBtn');
    const streamLink = liveStreamBtn.dataset.link;
    
    if (streamLink) {
        window.open(streamLink, '_blank');
    }
}

class Slideshow {
    constructor() {
        this.currentSlide = 0;
        this.slideInterval = null;
        this.container = document.querySelector('.slides');
        this.dotsContainer = document.querySelector('.slide-dots');
        this.prevButton = document.querySelector('.slide-nav.prev');
        this.nextButton = document.querySelector('.slide-nav.next');
        this.flyersContainer = document.querySelector('.flyers-container');
        this.timerBar = document.querySelector('.timer-bar');
        this.announcements = [];
        this.SLIDE_DURATION = 5000; // 5 seconds in milliseconds
    }

    init() {
        if (!this.container) return;
        
        // Get announcements from localStorage
        this.announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        
        if (this.announcements.length === 0) {
            this.container.innerHTML = '<div class="slide">No announcements available</div>';
            if (this.flyersContainer) {
                this.flyersContainer.innerHTML = '<p>No flyers available</p>';
            }
            return;
        }

        // Create slides
        this.container.innerHTML = this.announcements
            .map((announcement, index) => `
                <div class="slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <h2>${announcement.title}</h2>
                    <p>${announcement.content}</p>
                    <div class="slide-meta">
                        <span class="date">Valid until: ${new Date(announcement.expiryDate).toLocaleDateString()}</span>
                    </div>
                </div>
            `).join('');

        // Create dots
        this.dotsContainer.innerHTML = this.announcements
            .map((_, index) => `
                <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
            `).join('');

        // Initialize with first announcement's flyer
        this.updateFlyerDisplay(0);

        // Add event listeners
        this.prevButton?.addEventListener('click', () => this.prevSlide());
        this.nextButton?.addEventListener('click', () => this.nextSlide());
        
        document.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                this.showSlide(index);
            });
        });

        // Add hover pause functionality
        const slideshowContainer = document.querySelector('.announcements-slideshow');
        slideshowContainer?.addEventListener('mouseenter', () => this.pauseSlideshow());
        slideshowContainer?.addEventListener('mouseleave', () => this.startSlideshow());

        // Start automatic slideshow
        this.startSlideshow();
    }

    startTimer() {
        if (this.timerBar) {
            this.timerBar.classList.remove('animate');
            // Trigger reflow to restart animation
            void this.timerBar.offsetWidth;
            this.timerBar.classList.add('animate');
        }
    }

    stopTimer() {
        if (this.timerBar) {
            this.timerBar.classList.remove('animate');
        }
    }

    showSlide(index) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        if (!slides.length) return;

        slides[this.currentSlide].classList.remove('active');
        dots[this.currentSlide].classList.remove('active');
        
        this.currentSlide = index;
        
        if (this.currentSlide >= slides.length) {
            this.currentSlide = 0;
        }
        if (this.currentSlide < 0) {
            this.currentSlide = slides.length - 1;
        }
        
        slides[this.currentSlide].classList.add('active');
        dots[this.currentSlide].classList.add('active');

        // Update flyer display when slide changes
        this.updateFlyerDisplay(this.currentSlide);

        // Restart timer animation
        this.startTimer();
    }

    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }

    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    }

    startSlideshow() {
        if (this.slideInterval) return;
        this.startTimer();
        this.slideInterval = setInterval(() => this.nextSlide(), this.SLIDE_DURATION);
    }

    pauseSlideshow() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
            this.stopTimer();
        }
    }

    updateFlyerDisplay(index) {
        if (!this.flyersContainer) return;

        const currentAnnouncement = this.announcements[index];
        
        if (currentAnnouncement && currentAnnouncement.flyerUrl) {
            this.flyersContainer.innerHTML = `
                <div class="flyer-item">
                    <img src="${currentAnnouncement.flyerUrl}" alt="${currentAnnouncement.title}">
                    <div class="flyer-overlay">
                        <p>${currentAnnouncement.title}</p>
                    </div>
                </div>`;
        } else {
            this.flyersContainer.innerHTML = `
                <div class="no-flyer">
                    <p>No flyer for current announcement</p>
                </div>`;
        }
    }
}

// Flyers Display functionality
class FlyersDisplay {
    constructor() {
        this.flyersContainer = document.querySelector('.flyers-container');
        this.init();
    }

    init() {
        if (!this.flyersContainer) return;
        this.loadFlyers();
    }

    loadFlyers() {
        // Get flyers from localStorage
        const flyers = JSON.parse(localStorage.getItem('flyers') || '[]');
        
        if (flyers.length === 0) {
            this.flyersContainer.innerHTML = `
                <div class="no-flyers">
                    <p>No flyers available at this time.</p>
                </div>`;
            return;
        }

        // Display flyers
        this.flyersContainer.innerHTML = flyers
            .map(flyer => `
                <div class="flyer-item">
                    <img src="${flyer.imageUrl}" alt="${flyer.title}">
                    <div class="flyer-overlay">
                        <p>${flyer.title}</p>
                    </div>
                </div>
            `).join('');

        // Add click handlers for flyers
        const flyerItems = this.flyersContainer.querySelectorAll('.flyer-item');
        flyerItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                window.open(img.src, '_blank');
            });
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    const slideshow = new Slideshow();
    slideshow.init();
    
    const flyersDisplay = new FlyersDisplay();
    flyersDisplay.init();

    displayAnnouncements();
    displayMemberEvents();
    checkLiveStreamStatus();
    
    // Check live stream status every minute
    setInterval(checkLiveStreamStatus, 60000);
});

document.getElementById('announcementForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Create announcement object
    const announcement = {
        id: Date.now(),
        title: this.title.value,
        content: this.content.value,
        category: this.category.value,
        expiryDate: this.expiryDate.value,
        date: new Date(),
        status: 'pending',
        author: 'Member Name', // Replace with actual member name
        isRead: false
    };

    // Get existing announcements from localStorage
    let announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    
    // Add new announcement
    announcements.push(announcement);
    
    // Save back to localStorage
    localStorage.setItem('announcements', JSON.stringify(announcements));

    // Show success message
    showNotification('Announcement submitted for approval!', 'success');
    
    // Reset form
    this.reset();
});

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function displayAnnouncements() {
    const announcementsContainer = document.getElementById('announcements');
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    
    if (announcements.length === 0) {
        announcementsContainer.innerHTML = '<p class="no-announcements">No announcements yet.</p>';
        return;
    }
    
    const sortedAnnouncements = announcements.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    announcementsContainer.innerHTML = sortedAnnouncements.map(announcement => `
        <div class="announcement">
            <h3>${announcement.title}</h3>
            <p>${announcement.content}</p>
            <div class="announcement-meta">
                <span class="announcement-date">${new Date(announcement.date).toLocaleDateString()}</span>
                <span class="announcement-category">${announcement.category}</span>
            </div>
        </div>
    `).join('');
}