// Prayer Requests & Thanksgiving Management
class PrayerManager {
    constructor() {
        this.prayers = JSON.parse(localStorage.getItem('prayers') || '[]');
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderPrayers();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderPrayers();
            });
        });
    }

    renderPrayers() {
        const prayersGrid = document.querySelector('.prayers-grid');
        const filteredPrayers = this.filterPrayers();

        prayersGrid.innerHTML = filteredPrayers.map(prayer => `
            <div class="prayer-card ${prayer.type}" data-id="${prayer.id}">
                <div class="prayer-header">
                    <div>
                        <span class="prayer-type ${prayer.type}">
                            ${prayer.type === 'request' ? 'Prayer Request' : 'Thanksgiving'}
                        </span>
                        <h3>${prayer.title}</h3>
                    </div>
                    <span class="prayer-status">${prayer.status}</span>
                </div>
                
                <div class="prayer-content">
                    <p>${prayer.content}</p>
                </div>
                
                <div class="prayer-meta">
                    <div class="prayer-info">
                        <span>${prayer.name}</span> • 
                        <span>${this.formatDate(prayer.date)}</span>
                    </div>
                    <div class="prayer-actions">
                        <button onclick="prayerManager.markAsAddressed(${prayer.id})">
                            <i class="fas fa-check"></i>
                        </button>
                        <button onclick="prayerManager.deletePrayer(${prayer.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterPrayers() {
        if (this.currentFilter === 'all') return this.prayers;
        return this.prayers.filter(prayer => prayer.type === this.currentFilter);
    }

    markAsAddressed(id) {
        const prayer = this.prayers.find(p => p.id === id);
        if (prayer) {
            prayer.status = prayer.status === 'Addressed' ? 'Pending' : 'Addressed';
            this.savePrayers();
            this.renderPrayers();
        }
    }

    deletePrayer(id) {
        if (confirm('Are you sure you want to delete this prayer item?')) {
            this.prayers = this.prayers.filter(p => p.id !== id);
            this.savePrayers();
            this.renderPrayers();
        }
    }

    savePrayers() {
        localStorage.setItem('prayers', JSON.stringify(this.prayers));
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Initialize when page loads
let prayerManager;
document.addEventListener('DOMContentLoaded', () => {
    prayerManager = new PrayerManager();
});

// Example prayer item structure
const prayerItem = {
    id: Date.now(),
    type: 'request', // or 'thanksgiving'
    title: 'Prayer Title',
    content: 'Prayer content here...',
    name: 'Member Name',
    date: new Date(),
    status: 'Pending'
}; 