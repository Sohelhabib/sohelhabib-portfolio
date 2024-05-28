// Navigation toggle functionality
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav__link')

navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
    });
});

// Visit counter functionality
document.addEventListener('DOMContentLoaded', (event) => {
    // Check if the visit count is stored in localStorage
    let visitCount = localStorage.getItem('visitCount');
    
    // If not, initialize it to 0
    if (!visitCount) {
        visitCount = 0;
    }
    
    // Increment the visit count
    visitCount++;
    
    // Save the updated visit count back to localStorage
    localStorage.setItem('visitCount', visitCount);
    
    // Display the visit count in the span with id 'visit-count'
    document.getElementById('visit-count').textContent = visitCount;
});
