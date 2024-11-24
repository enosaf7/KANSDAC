document.addEventListener('DOMContentLoaded', function() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Reinitialize theme toggle after loading header
            const script = document.createElement('script');
            script.src = 'js/theme.js';
            document.body.appendChild(script);
        });
}); 