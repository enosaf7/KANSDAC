document.getElementById('prayerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const prayerData = {
        id: Date.now(),
        type: this.prayerType.value,
        name: this.name.value,
        title: this.title.value,
        content: this.content.value,
        date: new Date(),
        status: 'Pending',
        isRead: false
    };

    // Get existing prayers from localStorage
    let prayers = JSON.parse(localStorage.getItem('prayers') || '[]');
    
    // Add new prayer
    prayers.push(prayerData);
    
    // Save back to localStorage
    localStorage.setItem('prayers', JSON.stringify(prayers));

    // Reset form
    this.reset();
    
    // Show success message
    alert('Your prayer/thanksgiving has been submitted successfully!');
}); 