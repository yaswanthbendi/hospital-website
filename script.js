// Hospital Website JavaScript - Interactive Features
// Handles mobile navigation, FAQ accordion, testimonial slider, and form validation

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initMobileNavigation();
    initFAQAccordion();
    initTestimonialSlider();
    initFormValidation();
    initSmoothScrolling();
    initKeyboardNavigation();
});

// Mobile Navigation Toggle
function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', function() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        
        // Toggle ARIA state
        navToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle menu visibility
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    });
    
    // Close menu when clicking on a link
    navMenu.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// FAQ Accordion Functionality
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = document.getElementById(this.getAttribute('aria-controls'));
            
            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    const otherAnswer = document.getElementById(otherQuestion.getAttribute('aria-controls'));
                    if (otherAnswer) {
                        otherAnswer.classList.remove('active');
                        otherAnswer.setAttribute('aria-hidden', 'true');
                    }
                }
            });
            
            // Toggle current FAQ item
            this.setAttribute('aria-expanded', !isExpanded);
            if (answer) {
                answer.classList.toggle('active');
                answer.setAttribute('aria-hidden', isExpanded);
            }
        });
        
        // Handle keyboard navigation for FAQ
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Testimonial Slider Functionality
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dots = document.querySelectorAll('.dot');
    
    if (!testimonials.length || !prevBtn || !nextBtn) return;
    
    let currentSlide = 0;
    const totalSlides = testimonials.length;
    
    // Auto-advance slides every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);
    
    function showSlide(index) {
        // Hide all testimonials
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            testimonial.setAttribute('aria-hidden', 'true');
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            dot.setAttribute('aria-selected', 'false');
        });
        
        // Show current testimonial
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
            testimonials[index].setAttribute('aria-hidden', 'false');
        }
        
        // Update current dot
        if (dots[index]) {
            dots[index].classList.add('active');
            dots[index].setAttribute('aria-selected', 'true');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        showSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prevIndex);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', function() {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    prevBtn.addEventListener('click', function() {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            clearInterval(slideInterval);
            showSlide(index);
            slideInterval = setInterval(nextSlide, 5000);
        });
        
        // Keyboard navigation for dots
        dot.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Pause auto-advance on hover
    const sliderContainer = document.querySelector('.testimonials-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', function() {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Keyboard navigation for slider
    document.addEventListener('keydown', function(e) {
        if (e.target.closest('.testimonials-slider')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        }
    });
    
    // Initialize first slide
    showSlide(0);
}

// Form Validation
function initFormValidation() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;
    
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    
    // Real-time validation
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            validateName(this);
        });
        
        nameInput.addEventListener('input', function() {
            clearError(this);
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            validatePhone(this);
        });
        
        phoneInput.addEventListener('input', function() {
            clearError(this);
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this);
        });
        
        emailInput.addEventListener('input', function() {
            clearError(this);
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all required fields
        if (nameInput && !validateName(nameInput)) isValid = false;
        if (phoneInput && !validatePhone(phoneInput)) isValid = false;
        if (emailInput && emailInput.value && !validateEmail(emailInput)) isValid = false;
        
        if (isValid) {
            // Simulate form submission
            showFormSuccess();
        } else {
            // Focus on first invalid field
            const firstError = form.querySelector('.error-message:not(:empty)');
            if (firstError) {
                const fieldId = firstError.id.replace('-error', '');
                const field = document.getElementById(fieldId);
                if (field) field.focus();
            }
        }
    });
    
    function validateName(input) {
        const value = input.value.trim();
        const errorElement = document.getElementById('name-error');
        
        if (!value) {
            showError(errorElement, 'Name is required');
            return false;
        } else if (value.length < 2) {
            showError(errorElement, 'Name must be at least 2 characters');
            return false;
        } else {
            clearError(input);
            return true;
        }
    }
    
    function validatePhone(input) {
        const value = input.value.trim();
        const errorElement = document.getElementById('phone-error');
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        
        if (!value) {
            showError(errorElement, 'Phone number is required');
            return false;
        } else if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showError(errorElement, 'Please enter a valid phone number');
            return false;
        } else {
            clearError(input);
            return true;
        }
    }
    
    function validateEmail(input) {
        const value = input.value.trim();
        const errorElement = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (value && !emailRegex.test(value)) {
            showError(errorElement, 'Please enter a valid email address');
            return false;
        } else {
            clearError(input);
            return true;
        }
    }
    
    function showError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function clearError(input) {
        const errorId = input.id + '-error';
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    function showFormSuccess() {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <p style="color: #28a745; font-weight: 600; text-align: center; padding: 1rem; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 6px; margin-bottom: 1rem;">
                ✓ Thank you! Your appointment request has been submitted. We will contact you within 24 hours.
            </p>
        `;
        
        // Insert success message at the top of the form
        form.insertBefore(successDiv, form.firstChild);
        
        // Reset form
        form.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 5000);
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navigation
                updateActiveNavigation(this.getAttribute('href'));
            }
        });
    });
    
    // Update active navigation on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === current) {
                link.setAttribute('aria-current', 'page');
            }
        });
    });
    
    function updateActiveNavigation(href) {
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.removeAttribute('aria-current');
        });
        
        const activeLink = document.querySelector(`.nav-menu a[href="${href}"]`);
        if (activeLink) {
            activeLink.setAttribute('aria-current', 'page');
        }
    }
}

// Enhanced Keyboard Navigation
function initKeyboardNavigation() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Escape key to close mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (navToggle && navMenu && navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
                navToggle.focus();
            }
        }
    });
    
    // Tab trap for mobile menu
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && this.classList.contains('active')) {
                const focusableElements = this.querySelectorAll('a');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimizations
window.addEventListener('scroll', debounce(function() {
    // Handle scroll-based animations or updates here
}, 100));

// Accessibility announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could send error reports to monitoring service
});

// Service Worker Registration (for PWA capabilities if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you want to add a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileNavigation,
        initFAQAccordion,
        initTestimonialSlider,
        initFormValidation,
        initSmoothScrolling,
        initKeyboardNavigation
    };
}