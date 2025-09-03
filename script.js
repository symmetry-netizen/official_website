// ================== Gallery Slideshow ==================
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;
    const SLIDE_INTERVAL = 5000; // 5 seconds

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, SLIDE_INTERVAL);
    }

    function resetSlideshow() {
        clearInterval(slideInterval);
        startSlideshow();
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideshow();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideshow();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetSlideshow();
        });
    });

    if (slides.length > 0) {
        showSlide(0);
        startSlideshow();
    }

    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        slideshowContainer.addEventListener('mouseleave', () => {
            resetSlideshow();
        });
    }
}
document.addEventListener('DOMContentLoaded', initSlideshow);

// ================== Navigation & Dropdown ==================
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const isMobile = () => window.innerWidth <= 992;

    const toggleMenu = (forceClose = false) => {
        if (forceClose) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }
    };

    const toggleDropdown = (dropdown, show = null) => {
        const isShowing = show !== null ? show : !dropdown.classList.contains('show');
        dropdown.classList.toggle('show', isShowing);
        const toggle = dropdown.previousElementSibling;
        if (toggle && toggle.matches('.dropdown-toggle')) {
            toggle.setAttribute('aria-expanded', isShowing);
        }
    };

    const initDropdowns = () => {
        dropdownToggles.forEach(toggle => {
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);

            newToggle.addEventListener('click', (e) => {
                const dropdown = newToggle.nextElementSibling;
                if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                    if (isMobile()) {
                        e.preventDefault();
                        e.stopPropagation();

                        document.querySelectorAll('.dropdown-menu').forEach(menu => {
                            if (menu !== dropdown) {
                                toggleDropdown(menu, false);
                            }
                        });

                        toggleDropdown(dropdown);
                    }
                }
            });
        });
    };

    if (hamburger && navMenu) {
        initDropdowns();

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                if (isMobile()) {
                    toggleMenu(true);
                }
            });
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (!isMobile()) {
                    toggleMenu(true);
                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                        menu.classList.remove('show');
                    });
                }
                initDropdowns();
            }, 250);
        });

        document.addEventListener('click', (e) => {
            if (isMobile() && navMenu.classList.contains('active')) {
                if (!e.target.closest('.nav-menu') && !e.target.closest('.hamburger')) {
                    toggleMenu(true);
                }
            }

            if (isMobile() && !e.target.closest('.dropdown') && !e.target.closest('.hamburger')) {
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    toggleDropdown(menu, false);
                });
            }
        });
    }
});

// ================== Smooth Scroll ==================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ================== FAQ Accordion ==================
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        faqItems.forEach(otherItem => {
            if (otherItem !== item) otherItem.classList.remove('active');
        });
        item.classList.toggle('active');
    });
});

// ================== Contact Form (EmailJS) ==================
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    function showMessage(type, message) {
        const messageDiv = document.getElementById('form-message');
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        setTimeout(() => { messageDiv.style.display = 'none'; }, 5000);
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.submit-btn');
        const originalBtnText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        try {
            const formData = {
                from_name: document.getElementById('name').value.trim(),
                from_email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            await emailjs.send('service_3xjtfoe', 'template_pp78m0d', formData);
            showMessage('success', 'Message sent successfully!');
            contactForm.reset();
        } catch (error) {
            console.error('Failed to send message:', error);
            showMessage('error', 'Failed to send message. Please try again later.');
        } finally {
            btn.textContent = originalBtnText;
            btn.disabled = false;
        }
    });
});

// ================== Navbar Scroll Background ==================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(60, 80, 95, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(60, 80, 95, 0.1)';
    }
});

// ================== Scroll Animation ==================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature, .event-card, .contact-item, .faq-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ================== Other Enhancements ==================
document.querySelectorAll('.register-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const eventName = this.closest('.event-card').querySelector('h3').textContent;
        console.log(`User clicked register for: ${eventName}`);
    });
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const symmetryArt = document.querySelector('.symmetry-art');
    if (hero && symmetryArt) {
        const rate = scrolled * -0.5;
        symmetryArt.style.transform = `translateY(${rate}px)`;
    }
});

document.querySelectorAll('.event-card, .feature, .contact-item').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        faqItems.forEach(item => item.classList.remove('active'));
    }
});

document.querySelectorAll('a, button, input, textarea').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #3c5060';
        this.style.outlineOffset = '2px';
    });
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

const preloadLinks = [
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];
preloadLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
});

const style = document.createElement('style');
style.textContent = `
    body.loaded .hero-content {
        animation: fadeInUp 1s ease-out;
    }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
