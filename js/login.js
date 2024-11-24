const passwords = {
    admin: "admin-password", // Change this
    officials: "officials-password" // Change this
};

const portals = {
    admin: 'admin-portal.html',
    officials: 'officials-portal.html'
};

function showAdminModal() {
    document.getElementById('adminModal').style.display = 'block';
}

function showOfficialsModal() {
    document.getElementById('officialsModal').style.display = 'block';
}

function verifyPassword(type) {
    const password = document.getElementById(`${type}Password`).value;
    if (password === passwords[type]) {
        window.location.href = portals[type];
    } else {
        alert('Incorrect password');
    }
}

// Close modals when clicking X or outside
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        this.closest('.modal').style.display = 'none';
    }
});

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
} 