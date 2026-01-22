// Real Estate Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const filterBtn = document.getElementById('filterBtn');
    const propertiesGrid = document.getElementById('propertiesGrid');
    const propertyCount = document.getElementById('propertyCount');
    const propertyCards = document.querySelectorAll('.property-card');
    
    // Filter Properties Function
    function filterProperties() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const selectedStatus = statusFilter.value;
        
        let visibleCount = 0;
        
        propertyCards.forEach(card => {
            const cardType = card.getAttribute('data-type');
            const cardStatus = card.getAttribute('data-status');
            const cardName = card.querySelector('.property-name').textContent.toLowerCase();
            const cardDescription = card.querySelector('.property-description').textContent.toLowerCase();
            
            // Check all filters
            const matchesSearch = searchTerm === '' || cardName.includes(searchTerm) || cardDescription.includes(searchTerm);
            const matchesType = selectedType === 'all' || cardType === selectedType;
            const matchesStatus = selectedStatus === 'all' || cardStatus === selectedStatus;
            
            if (matchesSearch && matchesType && matchesStatus) {
                card.style.display = 'block';
                visibleCount++;
                
                // Add animation
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Update count
        propertyCount.textContent = visibleCount;
    }
    
    // Event Listeners
    filterBtn.addEventListener('click', filterProperties);
    
    searchInput.addEventListener('input', () => {
        // Real-time search
        filterProperties();
    });
    
    typeFilter.addEventListener('change', filterProperties);
    statusFilter.addEventListener('change', filterProperties);
    
    // Contact Button Click
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const propertyName = btn.closest('.property-card').querySelector('.property-name').textContent;
            alert(`Contact agent for: ${propertyName}\n\nPhone: +234 123 456 7890\nEmail: info@graciousproperty.com`);
        });
    });
    
    // Property Card Click (View Details)
    propertyCards.forEach(card => {
        card.addEventListener('click', () => {
            const propertyName = card.querySelector('.property-name').textContent;
            // In future, this can open a modal or navigate to detail page
            console.log('Viewing details for:', propertyName);
        });
    });
    
    // Load More Button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            alert('Loading more properties... (This will load more listings from your database)');
        });
    }
    
    // Smooth scroll for navigation links
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
    
    // Initial animation for property cards
    propertyCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});