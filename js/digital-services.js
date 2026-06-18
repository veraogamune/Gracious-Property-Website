// =============================================
//  Gracious Digital Services - JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
        window.location.href = 'auth.html?redirect=digital';
        return;
    }

    // -------------------------------------------------------
    // 1. BOOK NOW BUTTONS — Pre-select service & scroll to form
    // -------------------------------------------------------
    const bookButtons = document.querySelectorAll('.book-btn');
    const serviceSelect = document.getElementById('serviceSelect');

    bookButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const serviceName = this.getAttribute('data-service');

            // Pre-select the matching option in the dropdown
            for (let i = 0; i < serviceSelect.options.length; i++) {
                if (serviceSelect.options[i].value === serviceName) {
                    serviceSelect.selectedIndex = i;
                    break;
                }
            }

            // Scroll smoothly to the booking form
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        });
        // -------------------------------------------------------
    // 6. ENROLLMENT FORM SUBMISSION
    // -------------------------------------------------------
    const enrollmentForm = document.getElementById('enrollmentForm');

    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = {
                fullName: enrollmentForm.querySelector('input[name="fullName"]').value.trim(),
                email: enrollmentForm.querySelector('input[name="email"]').value.trim(),
                phone: enrollmentForm.querySelector('input[name="phone"]').value.trim(),
                course: enrollmentForm.querySelector('select[name="course"]').value,
                schedule: enrollmentForm.querySelector('select[name="schedule"]').value,
                mode: enrollmentForm.querySelector('select[name="mode"]').value,
                experience: enrollmentForm.querySelector('select[name="experience"]').value,
                occupation: enrollmentForm.querySelector('input[name="occupation"]').value.trim(),
                reason: enrollmentForm.querySelector('textarea[name="reason"]').value.trim()
            };

            try {
                const response = await fetch('http://localhost:3000/api/enrollments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    showSuccessPopup();
                    enrollmentForm.reset();
                } else {
                    showFormError('Something went wrong. Please try again.');
                }
            } catch (error) {
                showFormError('Could not connect to server. Please try again later.');
            }
        });
    }
    });


    // -------------------------------------------------------
    // 2. ENROLL NOW BUTTONS — Pre-fill form with course name
    // -------------------------------------------------------
    const enrollButtons = document.querySelectorAll('.enroll-btn');

   enrollButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Get the course name from the parent card
            const courseTitle = this.closest('.schedule-card').querySelector('h3').textContent;

            // Pre-select the course in the enrollment form
            const courseSelect = document.getElementById('courseSelect');
            for (let i = 0; i < courseSelect.options.length; i++) {
                if (courseSelect.options[i].value === courseTitle) {
                    courseSelect.selectedIndex = i;
                    break;
                }
            }

            // Scroll to enrollment form
            document.getElementById('enrollment').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // -------------------------------------------------------
    // 3. BOOKING FORM SUBMISSION — Validate & show success popup
    // -------------------------------------------------------
    const bookingForm = document.getElementById('digitalBookingForm');

    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Basic validation
        const fullName = bookingForm.querySelector('input[name="fullName"]').value.trim();
        const email = bookingForm.querySelector('input[name="email"]').value.trim();
        const phone = bookingForm.querySelector('input[name="phone"]').value.trim();
        const service = bookingForm.querySelector('select[name="service"]').value;

        if (!fullName || !email || !phone || !service) {
            showFormError('Please fill in all required fields.');
            return;
        }

        // Simple email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormError('Please enter a valid email address.');
            return;
        }

        // Simple phone check — must be at least 7 digits
        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 7) {
            showFormError('Please enter a valid phone number.');
            return;
        }

        // All good — send to backend
        const formData = {
            fullName: fullName,
            email: email,
            phone: phone,
            service: service,
            date: bookingForm.querySelector('input[name="date"]').value,
            time: bookingForm.querySelector('input[name="time"]').value,
            details: bookingForm.querySelector('textarea[name="details"]').value.trim()
        };

        fetch('http://localhost:3000/api/digital-bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                showSuccessPopup();
                bookingForm.reset();
            } else {
                showFormError('Something went wrong. Please try again.');
            }
        })
        .catch(error => {
            showFormError('Could not connect to server. Please try again later.');
        });
    });


    // -------------------------------------------------------
    // 4. FAQ ACCORDION — Toggle open/close on click
    // -------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            // Close all open FAQs first
            faqItems.forEach(function (el) {
                el.classList.remove('active');
                el.querySelector('.faq-answer').style.maxHeight = null;
                el.querySelector('.fas.fa-chevron-down').style.transform = 'rotate(0deg)';
            });

            // If this one wasn't already open, open it
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                item.querySelector('.fas.fa-chevron-down').style.transform = 'rotate(180deg)';
            }
        });
    });


    // -------------------------------------------------------
    // 5. NAVBAR — Highlight active link on scroll (optional UX)
    // -------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', function () {
        let currentSection = '';

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });

});


// -------------------------------------------------------
// HELPER: Show inline form error message
// -------------------------------------------------------
function showFormError(message) {
    // Remove any existing error message
    const existing = document.querySelector('.form-error-msg');
    if (existing) existing.remove();

    const error = document.createElement('p');
    error.classList.add('form-error-msg');
    error.style.cssText = 'color: #e74c3c; text-align: center; margin-bottom: 12px; font-weight: 500;';
    error.textContent = message;

    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.parentNode.insertBefore(error, submitBtn);

    // Auto-remove after 4 seconds
    setTimeout(function () {
        error.remove();
    }, 4000);
}


// -------------------------------------------------------
// SUCCESS POPUP — Show & Close
// -------------------------------------------------------
function showSuccessPopup() {
    const overlay = document.getElementById('successOverlay');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSuccessPopup() {
    const overlay = document.getElementById('successOverlay');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

// Also close popup if user clicks outside the card
document.getElementById('successOverlay').addEventListener('click', function (e) {
    if (e.target === this) {
        closeSuccessPopup();
    }
});