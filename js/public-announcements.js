let currentSlide = 0;
let slideInterval;

function displayPublicAnnouncements() {
    const announcementsContainer = document.querySelector('.announcements-container');
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    
    console.log('Loading announcements:', announcements); // Debug log
    
    if (!announcements || announcements.length === 0) {
        announcementsContainer.innerHTML = `
            <div class="no-announcements">
                <p>No announcements available at this time.</p>
            </div>
        `;
        return;
    }

    announcements.sort((a, b) => new Date(b.expiryDate) - new Date(a.expiryDate));

    announcementsContainer.innerHTML = `
        <div class="slideshow-container">
            ${announcements.map((announcement, index) => `
                <div class="slide fade ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <div class="announcement-card">
                        <div class="card-image">
                            ${announcement.flyerUrl 
                                ? `<img src="${announcement.flyerUrl}" alt="${announcement.title}" onerror="this.src='images/default-placeholder.jpg'">`
                                : `<div class="no-image">No Image Available</div>`
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

            ${announcements.length > 1 ? `
                <button class="slide-btn prev" onclick="changeSlide(-1)">❮</button>
                <button class="slide-btn next" onclick="changeSlide(1)">❯</button>
                
                <div class="dots-container">
                    ${announcements.map((_, index) => `
                        <span class="dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></span>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;

    if (announcements.length > 1) {
        startSlideshow();
    }
}

function startSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    slideInterval = setInterval(() => changeSlide(1), 10000); // 10 seconds
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length) return;

    slides[currentSlide].classList.remove('active');
    if (dots.length) dots[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    if (dots.length) dots[currentSlide].classList.add('active');
    
    startSlideshow();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length) return;

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    startSlideshow();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    displayPublicAnnouncements();
    
    // Add hover pause functionality
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            if (slideInterval) clearInterval(slideInterval);
        });
        
        slideshowContainer.addEventListener('mouseleave', () => {
            startSlideshow();
        });
    }
});