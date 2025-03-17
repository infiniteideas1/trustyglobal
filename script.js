// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS with performance optimizations
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        disable: window.innerWidth < 768 // Disable on mobile for better performance
    });

    // Mobile Menu Handling
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    let isMenuOpen = false;

    // Improved touch handling for mobile navigation
    function toggleMenu(force = null) {
        isMenuOpen = force !== null ? force : !isMenuOpen;
        navLinks.classList.toggle('active', isMenuOpen);
        navToggle.setAttribute('aria-expanded', isMenuOpen);
        
        // Animate hamburger with better performance
        const spans = navToggle.querySelectorAll('span');
        const transforms = isMenuOpen 
            ? ['rotate(45deg) translate(5px, 5px)', 'none', 'rotate(-45deg) translate(7px, -7px)']
            : ['none', 'none', 'none'];
            
        spans.forEach((span, i) => {
            span.style.transform = transforms[i];
            if (i === 1) span.style.opacity = isMenuOpen ? '0' : '1';
        });

        // Prevent body scroll when menu is open
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    // Touch-friendly event listeners
    navToggle.addEventListener('click', () => toggleMenu());

    // Handle dropdown menu
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
            dropdownToggle.setAttribute('aria-expanded', !expanded);
            dropdownToggle.nextElementSibling.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !navToggle.contains(e.target) && isMenuOpen) {
            toggleMenu(false);
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                toggleMenu(false);
            }
        });
    });

    // Optimized smooth scroll with intersection observer
    const smoothScroll = (target) => {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) smoothScroll(target);
        });
    });

    // Optimized navbar scroll handling with throttle
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                // Add shadow and background opacity based on scroll position
                navbar.classList.toggle('scrolled', currentScroll > 50);
                
                // Hide/show navbar based on scroll direction
                if (currentScroll > lastScroll && currentScroll > 500) {
                    navbar.classList.add('nav-hidden');
                } else {
                    navbar.classList.remove('nav-hidden');
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Enhanced form handling with validation and feedback
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable form while submitting
            const submitBtn = contactForm.querySelector('[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Here you would typically send the data to a server
                // Simulating API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-message success';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    Thank you for your message! We will get back to you soon.
                `;
                contactForm.insertAdjacentElement('beforebegin', successMessage);
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => successMessage.remove(), 5000);
            } catch (error) {
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'form-message error';
                errorMessage.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    Sorry, there was an error sending your message. Please try again.
                `;
                contactForm.insertAdjacentElement('beforebegin', errorMessage);
                
                // Remove error message after 5 seconds
                setTimeout(() => errorMessage.remove(), 5000);
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
            }
        });
    }

    // Touch-friendly service cards
    const serviceCards = document.querySelectorAll('.service-card');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                requestAnimationFrame(() => {
                    card.style.transform = 'translateY(-10px)';
                    card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
                });
            });
            
            card.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                });
            });
        });
    }

    // Lazy load images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyLoadScript = document.createElement('script');
        lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(lazyLoadScript);
    }
});

// Initialize Google Map
function initMap() {
    try {
        // Coordinates for Garki, Abuja
        const officeLocation = { lat: 9.0579, lng: 7.4951 };
        
        // Create map
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: officeLocation,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "geometry.fill",
                    "stylers": [{"weight": "2.00"}]
                },
                {
                    "featureType": "all",
                    "elementType": "geometry.stroke",
                    "stylers": [{"color": "#9c9c9c"}]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text",
                    "stylers": [{"visibility": "on"}]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{"color": "#f2f2f2"}]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry.fill",
                    "stylers": [{"color": "#ffffff"}]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry.fill",
                    "stylers": [{"color": "#ffffff"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [{"saturation": -100}, {"lightness": 45}]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry.fill",
                    "stylers": [{"color": "#eeeeee"}]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#7b7b7b"}]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.stroke",
                    "stylers": [{"color": "#ffffff"}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [{"visibility": "simplified"}]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
                }
            ]
        });

        // Add marker with custom icon
        const marker = new google.maps.Marker({
            position: officeLocation,
            map: map,
            title: 'Trusty Global Office',
            animation: google.maps.Animation.DROP,
            optimized: true
        });

        // Add info window with enhanced styling
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 15px; max-width: 250px;">
                    <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 16px; font-weight: 600;">Trusty Global</h3>
                    <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Garki, Abuja 900103<br>Federal Capital Territory</p>
                    <a href="https://www.google.com/maps/dir//Garki,+Abuja+900103,+Federal+Capital+Territory,+Nigeria" 
                       target="_blank" 
                       style="color: #3498db; text-decoration: none; font-size: 14px; display: inline-block; margin-top: 5px;">
                        Get Directions
                    </a>
                </div>
            `,
            maxWidth: 300
        });

        // Show info window when marker is clicked
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        // Add click listener to map to close info window when clicking elsewhere
        map.addListener('click', () => {
            infoWindow.close();
        });

    } catch (error) {
        console.error('Error initializing map:', error);
        handleMapError();
    }
}

// Handle Google Maps loading error with enhanced fallback
function handleMapError() {
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
        mapDiv.innerHTML = `
            <div style="text-align: center; padding: 30px; background: #f8f9fa; border-radius: 10px;">
                <i class="fas fa-map-marker-alt" style="font-size: 2rem; color: #e74c3c; margin-bottom: 15px;"></i>
                <p style="margin: 10px 0; color: #2c3e50;">We're located at:</p>
                <p style="margin: 5px 0; color: #666;">Garki, Abuja 900103<br>Federal Capital Territory</p>
                <a href="https://www.google.com/maps/dir//Garki,+Abuja+900103,+Federal+Capital+Territory,+Nigeria" 
                   target="_blank" 
                   class="directions-btn" 
                   style="margin-top: 15px; display: inline-block;">
                    <i class="fas fa-directions"></i> Get Directions
                </a>
            </div>
        `;
    }
}

// Make functions globally available
window.initMap = initMap;
window.gm_authFailure = handleMapError;

// Hero Slider functionality
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const prevButton = document.querySelector('.prev-slide');
const nextButton = document.querySelector('.next-slide');
let currentSlide = 0;
let slideInterval;

// Function to show a specific slide
function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Add active class to current slide and indicator
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
}

// Function to show next slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Function to show previous slide
function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Add click event listeners to navigation buttons
prevButton.addEventListener('click', () => {
    prevSlide();
    resetSlideInterval();
});

nextButton.addEventListener('click', () => {
    nextSlide();
    resetSlideInterval();
});

// Add click event listeners to indicators
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
        resetSlideInterval();
    });
});

// Function to start automatic sliding
function startSlideInterval() {
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// Function to reset slide interval
function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
}

// Start automatic sliding
startSlideInterval();

// Mobile Services Dropdown
const servicesDropdown = document.querySelector('.services-dropdown');
const dropdownMenu = document.querySelector('.dropdown-menu');

if (window.innerWidth <= 768) {
    servicesDropdown.addEventListener('click', (e) => {
        if (e.target.closest('.services-dropdown')) {
            servicesDropdown.classList.toggle('active');
        }
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.services-dropdown')) {
        servicesDropdown.classList.remove('active');
    }
}); 