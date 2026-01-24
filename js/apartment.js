// Apartments Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Image Slideshow for Locations
    initLocationSlideshows();
    
    // Multi-step form
    initBookingForm();
    
    // Occupation conditional fields
    initOccupationFields();
    
    // File upload handlers
    initFileUploads();
    
    // Select location buttons
    initLocationButtons();
    
    // FAQ accordion
    initFAQ();
    
    // Complaint form
    initComplaintForm();
});

// Location Image Slideshow
function initLocationSlideshows() {
    const locationCards = document.querySelectorAll('.location-card');
    
    locationCards.forEach(card => {
        const images = card.querySelectorAll('.location-images img');
        let currentIndex = 0;
        
        if (images.length > 1) {
            setInterval(() => {
                images[currentIndex].style.opacity = '0';
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].style.opacity = '1';
            }, 3000); // Change image every 3 seconds
        }
    });
}

// Multi-step Booking Form
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    let currentStep = 1;
    
    // Next button click
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateCurrentStep(currentStep)) {
                if (currentStep < 5) {
                    goToStep(currentStep + 1);
                }
            }
        });
    });
    
    // Previous button click
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        });
    });
    
    // Go to specific step
    function goToStep(step) {
        // Hide all steps
        steps.forEach(s => s.classList.remove('active'));
        progressSteps.forEach(s => s.classList.remove('active'));
        
        // Show current step
        steps[step - 1].classList.add('active');
        progressSteps[step - 1].classList.add('active');
        
        currentStep = step;
        
        // Update payment summary if on step 5
        if (step === 5) {
            updatePaymentSummary();
        }
        
        // Scroll to top of form
        document.querySelector('.booking-form-container').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Validate current step
    function validateCurrentStep(step) {
        const currentStepElement = steps[step - 1];
        const requiredInputs = currentStepElement.querySelectorAll('[required]');
        
        for (let input of requiredInputs) {
            if (input.type === 'radio') {
                const radioGroup = currentStepElement.querySelectorAll(`[name="${input.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) {
                    alert('Please select an option');
                    return false;
                }
            } else if (input.type === 'checkbox') {
                if (!input.checked) {
                    alert('Please accept the declaration');
                    return false;
                }
            } else if (!input.value.trim()) {
                alert(`Please fill in all required fields`);
                input.focus();
                return false;
            }
        }
        return true;
    }
    
    // Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    console.log('Booking Data:', data);
    
    // Show success message
    showSuccessMessage();
    
    // Reset form after delay
    setTimeout(() => {
        form.reset();
        goToStep(1);
    }, 3000);
    
    // TODO: Send to backend when ready
    // fetch('/api/apartment-bookings', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // })
    // .then(response => response.json())
    // .then(result => {
    //     if (result.success) {
    //         showSuccessMessage();
    //         // Optionally send confirmation email here
    //     }
    // })
    // .catch(error => {
    //     alert('An error occurred. Please try again.');
    // });
});
}

// Occupation Conditional Fields
function initOccupationFields() {
    const occupationSelect = document.querySelector('select[name="occupation"]');
    const studentFields = document.getElementById('studentFields');
    const workplaceFields = document.getElementById('workplaceFields');
    const employedFields = document.getElementById('employedFields');
    
    if (occupationSelect) {
        occupationSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            
            // Hide all conditional fields
            studentFields.style.display = 'none';
            workplaceFields.style.display = 'none';
            employedFields.style.display = 'none';
            
            // Clear inputs in hidden fields
            const clearFields = (container) => {
                container.querySelectorAll('input').forEach(input => {
                    input.value = '';
                    input.removeAttribute('required');
                });
            };
            
            // Show relevant fields based on selection
            if (value === 'Student') {
                studentFields.style.display = 'block';
                studentFields.querySelectorAll('input').forEach(input => {
                    input.setAttribute('required', 'required');
                });
            } else if (value === 'NYSC Member' || value === 'Intern') {
                workplaceFields.style.display = 'block';
                workplaceFields.querySelectorAll('input').forEach(input => {
                    input.setAttribute('required', 'required');
                });
            } else if (value === 'Young Professional') {
                employedFields.style.display = 'block';
                employedFields.querySelectorAll('input').forEach(input => {
                    input.setAttribute('required', 'required');
                });
            }
        });
    }
}

// File Upload Handlers
function initFileUploads() {
    const idUpload = document.getElementById('idUpload');
    const photoUpload = document.getElementById('photoUpload');
    const idFileName = document.getElementById('idFileName');
    const photoFileName = document.getElementById('photoFileName');
    
    if (idUpload) {
        idUpload.addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name || 'No file chosen';
            idFileName.textContent = fileName;
        });
    }
    
    if (photoUpload) {
        photoUpload.addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name || 'No file chosen';
            photoFileName.textContent = fileName;
        });
    }
}

// Select Location Buttons
function initLocationButtons() {
    const locationBtns = document.querySelectorAll('.select-location-btn');
    
    locationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const location = btn.getAttribute('data-location');
            
            // Scroll to booking section
            document.getElementById('booking').scrollIntoView({ 
                behavior: 'smooth' 
            });
            
            // Pre-select the location in form
            setTimeout(() => {
                const locationRadio = document.querySelector(`input[name="location"][value="${location}"]`);
                if (locationRadio) {
                    locationRadio.checked = true;
                }
            }, 500);
        });
    });
}

// Payment Summary Update
function updatePaymentSummary() {
    const location = document.querySelector('input[name="location"]:checked')?.value || '-';
    const roomType = document.querySelector('input[name="roomType"]:checked')?.value || '-';
    
    document.getElementById('summaryLocation').textContent = location;
    document.getElementById('summaryRoom').textContent = roomType;
    
    // Extract monthly rent from room type
    let monthlyRent = 0;
    if (roomType.includes('₦35,000')) monthlyRent = 35000;
    else if (roomType.includes('₦28,000')) monthlyRent = 28000;
    else if (roomType.includes('₦22,000')) monthlyRent = 22000;
    else if (roomType.includes('₦18,000')) monthlyRent = 18000;
    
    const twoMonths = monthlyRent * 2;
    const registrationFee = 7000;
    const cautionFee = 5000;
    const gasFee = 5000;
    const total = twoMonths + registrationFee + cautionFee + gasFee;
    
    document.getElementById('monthlyRent').textContent = `₦${monthlyRent.toLocaleString()}`;
    document.getElementById('twoMonths').textContent = `₦${twoMonths.toLocaleString()}`;
    document.getElementById('totalPayment').textContent = `₦${total.toLocaleString()}`;
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            item.classList.toggle('active');
        });
    });
}

// Complaint Form Submission
function initComplaintForm() {
    const complaintForm = document.querySelector('.complaint-form');
    
    if (complaintForm) {
        complaintForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(complaintForm);
            const data = Object.fromEntries(formData);
            
            console.log('Complaint Data:', data);
            
            alert('Your complaint has been submitted successfully. We will respond within 24 hours.');
            
            complaintForm.reset();
            
            // In production, send to backend
        });
    }
}

// Smooth scroll for navigation
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