// Animated Counter for Stats
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Scroll Animation Observer
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Counter Animation Observer
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        scrollObserver.observe(section);
    });
    
    // Observe feature cards
    const cards = document.querySelectorAll('.feature-card, .service-card, .blog-card, .process-step');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
        scrollObserver.observe(card);
    });
    
    // Stats counter
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }
    
    // Play button
    const playButton = document.querySelector('.play-button');
    if (playButton) {
        playButton.addEventListener('click', () => {
            alert('Video player would open here!');
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        const submitButton = newsletterForm.querySelector('button');
        const emailInput = newsletterForm.querySelector('input');
        
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailInput.value;
            
            if (email && email.includes('@')) {
                alert('Thank you for subscribing! We\'ll send updates to ' + email);
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address');
            }
        });
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});