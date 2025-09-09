// Hospital Website JavaScript - Main functionality
(function() {
    'use strict';

    // DOM Content Loaded Event
    document.addEventListener('DOMContentLoaded', function() {
        initializeNavigation();
        initializeTestimonialSlider();
        initializeFAQAccordion();
        initializeSmoothScrolling();
        initializeFormValidation();
        initializeAccessibility();
    });

    // Navigation functionality
    function initializeNavigation() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
                
                mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
                mobileMenuBtn.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Trap focus when menu is open
                if (!isExpanded) {
                    trapFocus(navMenu);
                } else {
                    mobileMenuBtn.focus();
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                    closeMobileMenu();
                }
            });

            // Close mobile menu on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        }

        // Navigation link active state and mobile menu closing
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Close mobile menu if open
                closeMobileMenu();

                // Handle smooth scrolling
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = target.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // Update active link on scroll
        window.addEventListener('scroll', updateActiveNavLink);
    }

    function closeMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const scrollPosition = window.scrollY + headerHeight + 50;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Testimonial Slider functionality
    function initializeTestimonialSlider() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.testimonial-dots .dot');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentSlide = 0;
        let slideInterval;

        if (slides.length === 0) return;

        function showSlide(index) {
            // Hide all slides
            slides.forEach(slide => {
                slide.classList.remove('active');
                slide.setAttribute('aria-hidden', 'true');
            });
            
            // Remove active class from all dots
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Show current slide
            slides[index].classList.add('active');
            slides[index].setAttribute('aria-hidden', 'false');
            
            // Activate current dot
            if (dots[index]) {
                dots[index].classList.add('active');
            }
            
            currentSlide = index;
        }

        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        function prevSlide() {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev);
        }

        function startAutoSlide() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoSlide() {
            clearInterval(slideInterval);
        }

        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopAutoSlide();
                startAutoSlide();
            });
        });

        // Keyboard navigation
        const slider = document.querySelector('.testimonial-slider');
        if (slider) {
            slider.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    stopAutoSlide();
                    startAutoSlide();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    stopAutoSlide();
                    startAutoSlide();
                }
            });
        }

        // Pause on hover
        const testimonialSection = document.querySelector('.testimonial-slider');
        if (testimonialSection) {
            testimonialSection.addEventListener('mouseenter', stopAutoSlide);
            testimonialSection.addEventListener('mouseleave', startAutoSlide);
        }

        // Initialize
        showSlide(0);
        startAutoSlide();

        // Reduce motion support
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            stopAutoSlide();
        }
    }

    // FAQ Accordion functionality
    function initializeFAQAccordion() {
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                const answer = this.nextElementSibling;

                // Close all other FAQ items
                faqQuestions.forEach(q => {
                    if (q !== this) {
                        q.setAttribute('aria-expanded', 'false');
                        q.nextElementSibling.classList.remove('expanded');
                    }
                });

                // Toggle current FAQ item
                this.setAttribute('aria-expanded', !isExpanded);
                
                if (!isExpanded) {
                    answer.classList.add('expanded');
                    // Set max-height for smooth animation
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.classList.remove('expanded');
                    answer.style.maxHeight = '0';
                }
            });

            // Keyboard support
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // Smooth scrolling for internal links
    function initializeSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target && href !== '#') {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Form validation
    function initializeFormValidation() {
        const form = document.querySelector('form[role="form"]');
        
        if (!form) return;

        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Here you would typically send the form data to a server
                showFormSuccess();
            } else {
                // Focus on first invalid field
                const firstInvalid = form.querySelector('.error');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');
        removeErrorMessage(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\(\)\+]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            showErrorMessage(field, errorMessage);
            field.setAttribute('aria-invalid', 'true');
        } else {
            field.setAttribute('aria-invalid', 'false');
        }

        return isValid;
    }

    function showErrorMessage(field, message) {
        const errorId = field.id + '-error';
        let errorElement = document.getElementById(errorId);
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = errorId;
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        field.setAttribute('aria-describedby', errorId);
    }

    function removeErrorMessage(field) {
        const errorId = field.id + '-error';
        const errorElement = document.getElementById(errorId);
        
        if (errorElement) {
            errorElement.remove();
        }
        
        field.removeAttribute('aria-describedby');
    }

    function showFormSuccess() {
        const form = document.querySelector('form[role="form"]');
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.setAttribute('role', 'alert');
        successMessage.textContent = 'Thank you! Your message has been sent successfully.';
        
        form.insertBefore(successMessage, form.firstChild);
        form.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // Accessibility enhancements
    function initializeAccessibility() {
        // Skip link functionality
        addSkipLink();
        
        // Keyboard navigation enhancements
        enhanceKeyboardNavigation();
        
        // Screen reader enhancements
        enhanceScreenReaderSupport();
    }

    function addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link sr-only';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Give main element an id if it doesn't have one
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main';
        }
    }

    function enhanceKeyboardNavigation() {
        // Add tab index to interactive elements that need it
        const interactiveElements = document.querySelectorAll('button, [role="button"], [role="tab"]');
        
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
        });

        // Handle Enter and Space key presses for custom buttons
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const target = e.target;
                if (target.getAttribute('role') === 'button' && target.tagName !== 'BUTTON') {
                    e.preventDefault();
                    target.click();
                }
            }
        });
    }

    function enhanceScreenReaderSupport() {
        // Add live region for dynamic content updates
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);

        // Add descriptions to form fields if missing
        const formFields = document.querySelectorAll('input, textarea, select');
        formFields.forEach(field => {
            if (!field.getAttribute('aria-describedby') && !field.getAttribute('aria-label')) {
                const label = document.querySelector(`label[for="${field.id}"]`);
                if (label && !field.getAttribute('aria-labelledby')) {
                    field.setAttribute('aria-labelledby', label.id || generateId());
                }
            }
        });
    }

    // Utility function to trap focus within an element
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });

        // Focus first element
        if (firstElement) {
            firstElement.focus();
        }
    }

    // Utility function to generate unique IDs
    function generateId() {
        return 'element-' + Math.random().toString(36).substr(2, 9);
    }

    // Handle page visibility changes (pause animations when not visible)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Pause animations and intervals when page is not visible
            document.body.classList.add('page-hidden');
        } else {
            // Resume animations when page becomes visible
            document.body.classList.remove('page-hidden');
        }
    });

    // Error handling for JavaScript errors
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // In production, you might want to send this to an error tracking service
    });

    // CSS for dynamic styles
    const dynamicStyles = `
        .error {
            border-color: #e53e3e !important;
            box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1) !important;
        }
        
        .error-message {
            color: #e53e3e;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        
        .success-message {
            background-color: #48bb78;
            color: white;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
        }
        
        .page-hidden * {
            animation-play-state: paused !important;
        }
    `;

    // Add dynamic styles to the page
    const styleSheet = document.createElement('style');
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);

})();