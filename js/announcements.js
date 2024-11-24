let currentSlide = 0;
let slideInterval;

document.addEventListener('DOMContentLoaded', displayPublicAnnouncements);

function displayPublicAnnouncements() {
    const announcementsContainer = document.querySelector('.announcements-container');
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    
    console.log('Retrieved announcements:', announcements);
    
    if (announcements.length === 0) {
        announcementsContainer.innerHTML = '<p class="no-announcements">No announcements available.</p>';
        return;
    }

    // Create slideshow container
    announcementsContainer.innerHTML = `
        <div class="slideshow-container">
            ${announcements.map((announcement, index) => `
                <div class="slide fade ${index === 0 ? 'active' : ''}">
                    <div class="card">
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
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
            
            <button class="slide-btn prev" onclick="changeSlide(-1)">❮</button>
            <button class="slide-btn next" onclick="changeSlide(1)">❯</button>
            
            <div class="dots-container">
                ${announcements.map((_, index) => `
                    <span class="dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></span>
                `).join('')}
            </div>
        </div>
    `;

    // Start the slideshow if there are announcements
    if (announcements.length > 0) {
        startSlideshow();
    }
}

function startSlideshow() {
    // Clear any existing interval
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    // Set new interval
    slideInterval = setInterval(() => changeSlide(1), 10000); // 10 seconds
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length) return;

    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Calculate new slide index
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    // Add active class to new slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Restart the timer
    startSlideshow();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length) return;

    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Set new slide index
    currentSlide = index;
    
    // Add active class to new slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Restart the timer
    startSlideshow();
}

// Optional: Pause slideshow when user hovers over it
document.addEventListener('DOMContentLoaded', () => {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slideshowContainer.addEventListener('mouseleave', () => {
            startSlideshow();
        });
    }
});

// Function to display pending announcements in officials portal
function displayPendingAnnouncements() {
    const pendingContainer = document.getElementById('pending-announcements');
    if (!pendingContainer) return;

    const pendingAnnouncements = JSON.parse(localStorage.getItem('pendingAnnouncements') || '[]');
    
    if (pendingAnnouncements.length === 0) {
        pendingContainer.innerHTML = '<p class="no-data">No pending announcements</p>';
        return;
    }

    pendingContainer.innerHTML = pendingAnnouncements.map(announcement => `
        <div class="announcement-card" data-id="${announcement.id}">
            <div class="card-header">
                <h3>${announcement.title}</h3>
                <span class="date">Submitted: ${new Date(announcement.submittedDate).toLocaleDateString()}</span>
            </div>
            <div class="card-content">
                <p>${announcement.content}</p>
                ${announcement.flyerUrl ? `
                    <div class="flyer-preview">
                        <img src="${announcement.flyerUrl}" alt="Announcement Flyer">
                    </div>
                ` : ''}
                <div class="meta-info">
                    <span>Valid Until: ${new Date(announcement.expiryDate).toLocaleDateString()}</span>
                    <span>Submitted By: ${announcement.submittedBy}</span>
                </div>
            </div>
            <div class="card-actions">
                <button onclick="approveAnnouncement(${announcement.id})" class="approve-btn">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button onclick="rejectAnnouncement(${announcement.id})" class="reject-btn">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>
        </div>
    `).join('');
}

// Function to submit a new announcement
function submitAnnouncement(event) {
    event.preventDefault();
    
    const title = document.getElementById('announcement-title').value;
    const content = document.getElementById('announcement-content').value;
    const expiryDate = document.getElementById('announcement-expiry').value;
    const flyerInput = document.getElementById('announcement-flyer');
    
    if (!title || !content || !expiryDate) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    const announcement = {
        id: Date.now(),
        title,
        content,
        expiryDate,
        flyerUrl: '',
        status: 'pending',
        submittedBy: localStorage.getItem('currentUser') || 'Anonymous',
        submittedDate: new Date().toISOString()
    };

    // Handle flyer upload if a file is selected
    if (flyerInput.files.length > 0) {
        const file = flyerInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            announcement.flyerUrl = e.target.result;
            saveAnnouncement(announcement);
        };
        
        reader.readAsDataURL(file);
    } else {
        saveAnnouncement(announcement);
    }
}

// Function to save announcement
function saveAnnouncement(announcement) {
    // Get existing pending announcements
    const pendingAnnouncements = JSON.parse(localStorage.getItem('pendingAnnouncements') || '[]');
    
    // Add new announcement to pending list
    pendingAnnouncements.push(announcement);
    
    // Save back to localStorage
    localStorage.setItem('pendingAnnouncements', JSON.stringify(pendingAnnouncements));
    
    // Clear form
    document.getElementById('announcement-form').reset();
    
    // Show success message
    showNotification('Announcement submitted successfully! Waiting for approval.', 'success');
}

// Function to approve an announcement
function approveAnnouncement(id) {
    const pendingAnnouncements = JSON.parse(localStorage.getItem('pendingAnnouncements') || '[]');
    const approvedAnnouncements = JSON.parse(localStorage.getItem('announcements') || '[]');
    
    const announcementIndex = pendingAnnouncements.findIndex(a => a.id === id);
    if (announcementIndex === -1) return;
    
    const announcement = pendingAnnouncements[announcementIndex];
    announcement.status = 'approved';
    announcement.approvedDate = new Date().toISOString();
    
    // Add to approved announcements
    approvedAnnouncements.push(announcement);
    
    // Remove from pending
    pendingAnnouncements.splice(announcementIndex, 1);
    
    // Save both lists
    localStorage.setItem('pendingAnnouncements', JSON.stringify(pendingAnnouncements));
    localStorage.setItem('announcements', JSON.stringify(approvedAnnouncements));
    
    // Refresh display
    displayPendingAnnouncements();
    showNotification('Announcement approved successfully!', 'success');
}

// Function to reject an announcement
function rejectAnnouncement(id) {
    const pendingAnnouncements = JSON.parse(localStorage.getItem('pendingAnnouncements') || '[]');
    const announcementIndex = pendingAnnouncements.findIndex(a => a.id === id);
    
    if (announcementIndex === -1) return;
    
    // Remove from pending
    pendingAnnouncements.splice(announcementIndex, 1);
    
    // Save updated list
    localStorage.setItem('pendingAnnouncements', JSON.stringify(pendingAnnouncements));
    
    // Refresh display
    displayPendingAnnouncements();
    showNotification('Announcement rejected', 'info');
}

// Function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}