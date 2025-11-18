/*========== Mobile Menu Toggle ==========*/
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');

// Show Menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Hide Menu
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Close Menu on Link Click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

// Close Menu on Outside Click
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('show-menu')) {
        navMenu.classList.remove('show-menu');
    }
});

/*========== Smooth Scroll with Header Offset ==========*/
const header = document.getElementById('header');
const headerHeight = header ? header.offsetHeight : 80;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip empty hash or just #
        if (!href || href === '#') {
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/*========== Scroll Header Styling ==========*/
const scrollHeader = () => {
    if (window.scrollY >= 100) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
};

window.addEventListener('scroll', scrollHeader);

/*========== Active Section Detection ==========*/
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollY = window.pageYOffset;
    const offset = headerHeight + 100; // Header height + buffer
    
    let activeSectionId = null;
    
    // Iterate through sections from bottom to top to find the active one
    // We want the section whose top is closest to but above the viewport top
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const sectionId = section.getAttribute('id');
        
        // If scroll position has passed this section's top (accounting for offset)
        if (scrollY + offset >= sectionTop) {
            activeSectionId = sectionId;
            break;
        }
    }
    
    // If we're at the very top, activate the first section
    if (scrollY < 100 && sections.length > 0) {
        activeSectionId = sections[0].getAttribute('id');
    }
    
    // Update active class on all nav links
    navLinks.forEach(link => {
        link.classList.remove('active-link');
        
        if (activeSectionId) {
            const linkHref = link.getAttribute('href');
            // Match link href with section id (handles both #section-id and page.html#section-id)
            if (linkHref && (
                linkHref === `#${activeSectionId}` || 
                linkHref.includes(`#${activeSectionId}`) ||
                linkHref.endsWith(activeSectionId)
            )) {
                link.classList.add('active-link');
            }
        }
    });
};

// Use throttle for better performance
let ticking = false;
const handleScroll = () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            scrollActive();
            ticking = false;
        });
        ticking = true;
    }
};

window.addEventListener('scroll', handleScroll, { passive: true });

// Initial check on page load
window.addEventListener('load', scrollActive);
scrollActive();

/*========== Read More/Less Toggle ==========*/
const readMoreBtn = document.getElementById('read-more-btn');
const aboutMore = document.getElementById('about-more');

if (readMoreBtn && aboutMore) {
    readMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (aboutMore.classList.contains('show')) {
            aboutMore.classList.remove('show');
            readMoreBtn.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
            
            // Smooth scroll to button position
            setTimeout(() => {
                readMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        } else {
            aboutMore.classList.add('show');
            readMoreBtn.innerHTML = 'Read Less <i class="fas fa-chevron-up"></i>';
        }
    });
}

/*========== Device Detection ==========*/
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.matchMedia && window.matchMedia('(max-width: 768px)').matches && 
            window.matchMedia('(pointer: coarse)').matches);
};

const isDesktop = () => {
    return !isMobile();
};

/*========== Email Link Handler ==========*/
const emailLink = document.getElementById('email-link');

if (emailLink) {
    emailLink.addEventListener('click', (e) => {
        const email = 'ishmaelharrydeckor@gmail.com';
        
        if (isMobile()) {
            // Mobile: Open mailto link
            e.preventDefault();
            window.location.href = `mailto:${email}`;
        } else {
            // Desktop: Open Gmail compose
            e.preventDefault();
            const subject = encodeURIComponent('Contact from Portfolio');
            const body = encodeURIComponent('Hello,\n\n');
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`, '_blank');
        }
    });
}

/*========== Phone Link Handler ==========*/
const phoneLink = document.getElementById('phone-link');

if (phoneLink) {
    phoneLink.addEventListener('click', (e) => {
        const phone = '+233555908380';
        
        if (isMobile()) {
            // Mobile: Use tel: protocol
            e.preventDefault();
            window.location.href = `tel:${phone}`;
        } else {
            // Desktop: Copy to clipboard with feedback
            e.preventDefault();
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(phone).then(() => {
                    // Show feedback
                    const originalText = phoneLink.textContent;
                    phoneLink.textContent = 'Copied!';
                    phoneLink.style.color = '#28a745';
                    
                    setTimeout(() => {
                        phoneLink.textContent = originalText;
                        phoneLink.style.color = '';
                    }, 2000);
                }).catch(() => {
                    // Fallback: Open tel link anyway
                    window.location.href = `tel:${phone}`;
                });
            } else {
                // Fallback: Open tel link
                window.location.href = `tel:${phone}`;
            }
        }
    });
}

/*========== Strict Regex Validation Patterns ==========*/
// Name: 2-50 characters, letters, spaces, hyphens, apostrophes, dots
const nameRegex = /^[a-zA-Z\s'-.]{2,50}$/;

// Ghana Phone: +233 followed by 9 digits OR 0 followed by 9 digits (can include spaces/dashes)
const phoneRegex = /^(\+233|0)[\s-]?[0-9]{2}[\s-]?[0-9]{3}[\s-]?[0-9]{4}$/;

// Email: Strict RFC 5322 compliant
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Message: Minimum 10 characters, maximum 1000 characters
const messageRegex = /^.{10,1000}$/;

/*========== Contact Form Validation Functions ==========*/
const validateName = (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
        return { isValid: false, message: 'Name is required.' };
    }
    if (!nameRegex.test(trimmedName)) {
        return { isValid: false, message: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, apostrophes, or dots.' };
    }
    return { isValid: true, message: '' };
};

const validatePhone = (phone) => {
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
        return { isValid: false, message: 'Phone number is required.' };
    }
    if (!phoneRegex.test(trimmedPhone)) {
        return { isValid: false, message: 'Please enter a valid Ghana phone number (e.g., +233 55 590 8380 or 055 590 8380).' };
    }
    return { isValid: true, message: '' };
};

const validateEmail = (email) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
        return { isValid: false, message: 'Email is required.' };
    }
    if (!emailRegex.test(trimmedEmail)) {
        return { isValid: false, message: 'Please enter a valid email address (e.g., name@example.com).' };
    }
    return { isValid: true, message: '' };
};

const validateMessage = (message) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
        return { isValid: false, message: 'Message is required.' };
    }
    if (!messageRegex.test(trimmedMessage)) {
        return { isValid: false, message: 'Message must be between 10 and 1000 characters.' };
    }
    return { isValid: true, message: '' };
};

/*========== WhatsApp Contact Form Integration ==========*/
const contactForm = document.getElementById('contact-form');
const whatsappBtn = document.getElementById('whatsapp-btn');

const formatWhatsAppMessage = (formData) => {
    const name = formData.get('name') || '';
    const phone = formData.get('phone') || '';
    const email = formData.get('email') || '';
    const message = formData.get('message') || '';
    
    const whatsappMessage = `Hello! I'm contacting you through your portfolio website.

*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}

*Message:*
${message}

Looking forward to your response!`;
    
    return encodeURIComponent(whatsappMessage);
};

if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!contactForm) return;
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Strict validation using regex
        const nameValidation = validateName(name);
        const phoneValidation = validatePhone(phone);
        const emailValidation = validateEmail(email);
        const messageValidation = validateMessage(message);
        
        // Check all validations
        if (!nameValidation.isValid) {
            alert(nameValidation.message);
            document.getElementById('name').focus();
            return;
        }
        
        if (!phoneValidation.isValid) {
            alert(phoneValidation.message);
            document.getElementById('phone').focus();
            return;
        }
        
        if (!emailValidation.isValid) {
            alert(emailValidation.message);
            document.getElementById('email').focus();
            return;
        }
        
        if (!messageValidation.isValid) {
            alert(messageValidation.message);
            document.getElementById('message').focus();
            return;
        }
        
        const whatsappNumber = '233555908380';
        const formattedMessage = formatWhatsAppMessage(formData);
        
        // Open WhatsApp Web or App
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${formattedMessage}`;
        window.open(whatsappUrl, '_blank');
    });
}

/*========== Real-time Form Validation ==========*/
const setupRealTimeValidation = () => {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Create error message containers
    const createErrorElement = (input) => {
        let errorEl = input.parentElement.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.style.color = '#dc3545';
            errorEl.style.fontSize = '0.875rem';
            errorEl.style.marginTop = '0.25rem';
            errorEl.style.display = 'block';
            input.parentElement.appendChild(errorEl);
        }
        return errorEl;
    };
    
    // Remove error styling
    const removeError = (input) => {
        input.style.borderColor = '';
        const errorEl = input.parentElement.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
    };
    
    // Show error
    const showError = (input, message) => {
        input.style.borderColor = '#dc3545';
        const errorEl = createErrorElement(input);
        errorEl.textContent = message;
    };
    
    // Show success
    const showSuccess = (input) => {
        input.style.borderColor = '#28a745';
        removeError(input);
    };
    
    // Name validation
    if (nameInput) {
        nameInput.addEventListener('blur', () => {
            const validation = validateName(nameInput.value);
            if (!validation.isValid) {
                showError(nameInput, validation.message);
            } else {
                showSuccess(nameInput);
            }
        });
        
        nameInput.addEventListener('input', () => {
            if (nameInput.value.trim()) {
                const validation = validateName(nameInput.value);
                if (validation.isValid) {
                    showSuccess(nameInput);
                }
            } else {
                removeError(nameInput);
            }
        });
    }
    
    // Phone validation
    if (phoneInput) {
        phoneInput.addEventListener('blur', () => {
            const validation = validatePhone(phoneInput.value);
            if (!validation.isValid) {
                showError(phoneInput, validation.message);
            } else {
                showSuccess(phoneInput);
            }
        });
        
        phoneInput.addEventListener('input', () => {
            if (phoneInput.value.trim()) {
                const validation = validatePhone(phoneInput.value);
                if (validation.isValid) {
                    showSuccess(phoneInput);
                }
            } else {
                removeError(phoneInput);
            }
        });
    }
    
    // Email validation
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const validation = validateEmail(emailInput.value);
            if (!validation.isValid) {
                showError(emailInput, validation.message);
            } else {
                showSuccess(emailInput);
            }
        });
        
        emailInput.addEventListener('input', () => {
            if (emailInput.value.trim()) {
                const validation = validateEmail(emailInput.value);
                if (validation.isValid) {
                    showSuccess(emailInput);
                }
            } else {
                removeError(emailInput);
            }
        });
    }
    
    // Message validation
    if (messageInput) {
        messageInput.addEventListener('blur', () => {
            const validation = validateMessage(messageInput.value);
            if (!validation.isValid) {
                showError(messageInput, validation.message);
            } else {
                showSuccess(messageInput);
            }
        });
        
        messageInput.addEventListener('input', () => {
            if (messageInput.value.trim()) {
                const validation = validateMessage(messageInput.value);
                if (validation.isValid) {
                    showSuccess(messageInput);
                } else {
                    const errorEl = createErrorElement(messageInput);
                    errorEl.textContent = validation.message;
                }
            } else {
                removeError(messageInput);
            }
        });
    }
};

// Initialize real-time validation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupRealTimeValidation);
} else {
    setupRealTimeValidation();
}

/*========== Contact Form Submission ==========*/
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Strict validation using regex
        const nameValidation = validateName(name);
        const phoneValidation = validatePhone(phone);
        const emailValidation = validateEmail(email);
        const messageValidation = validateMessage(message);
        
        // Check all validations
        if (!nameValidation.isValid) {
            alert(nameValidation.message);
            document.getElementById('name').focus();
            return;
        }
        
        if (!phoneValidation.isValid) {
            alert(phoneValidation.message);
            document.getElementById('phone').focus();
            return;
        }
        
        if (!emailValidation.isValid) {
            alert(emailValidation.message);
            document.getElementById('email').focus();
            return;
        }
        
        if (!messageValidation.isValid) {
            alert(messageValidation.message);
            document.getElementById('message').focus();
            return;
        }
        
        // All validations passed - send via WhatsApp
        const whatsappNumber = '233555908380';
        const formattedMessage = formatWhatsAppMessage(formData);
        
        // Open WhatsApp Web or App
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${formattedMessage}`;
        window.open(whatsappUrl, '_blank');
        
        // Optionally reset form
        // contactForm.reset();
    });
}

/*========== Scroll Animations ==========*/
const scrollElements = document.querySelectorAll('.home__content, .about__content, .leadership__card, .projects__card, .skills__card, .awards__card');

const elementInView = (el, offset = 0) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <= ((window.innerHeight || document.documentElement.clientHeight) - offset)
    );
};

const displayScrollElement = (element) => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
};

const hideScrollElement = (element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 100)) {
            displayScrollElement(el);
        }
    });
};

// Initialize scroll elements
scrollElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Check on scroll and load
window.addEventListener('scroll', handleScrollAnimation);
handleScrollAnimation(); // Check on initial load

/*========== Hero Content Animation ==========*/
const heroContent = document.querySelector('.home__content');
if (heroContent) {
    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 100);
}

/*========== Smooth Scroll for Anchor Links on Page Load ==========*/
window.addEventListener('load', () => {
    // Check if there's a hash in the URL
    if (window.location.hash) {
        const hash = window.location.hash;
        const target = document.querySelector(hash);
        
        if (target) {
            setTimeout(() => {
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});

/*========== Form Input Focus Effects ==========*/
const formInputs = document.querySelectorAll('.contact__form-input, .contact__form-textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
    
    // Check if input has value on load
    if (input.value) {
        input.parentElement.classList.add('focused');
    }
});

/*========== Image Lazy Loading ==========*/
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/*========== Show Only Selected Project on projects.html ==========*/
let isInitialLoad = true;

const showSelectedProject = () => {
    const projectDetails = document.querySelectorAll('.project-detail');
    
    // Only run on projects.html page
    if (projectDetails.length === 0) {
        return;
    }
    
    const hash = window.location.hash.replace('#', '');
    const validProjectIds = ['ai-training', 'fufu-machine', 'vending-machine'];
    
    // If hash exists and is a valid project ID, show only that project
    if (hash && validProjectIds.includes(hash)) {
        projectDetails.forEach(project => {
            if (project.id === hash) {
                project.style.display = 'block';
            } else {
                project.style.display = 'none';
            }
        });
        
        // Smooth scroll to the project
        setTimeout(() => {
            const targetProject = document.getElementById(hash);
            if (targetProject) {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetProject.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
        
        isInitialLoad = false;
    } else {
        // If no hash or invalid hash
        if (isInitialLoad && !hash) {
            // On initial load without hash, redirect to projects overview on index page
            window.location.href = 'index.html#projects';
            return;
        }
        
        // If hash was removed or invalid, show all projects
        projectDetails.forEach(project => {
            project.style.display = 'block';
        });
        
        isInitialLoad = false;
    }
};

// Run on page load and hash change
window.addEventListener('load', () => {
    isInitialLoad = true;
    showSelectedProject();
});

window.addEventListener('hashchange', () => {
    isInitialLoad = false;
    showSelectedProject();
});

// Initial check
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showSelectedProject);
} else {
    showSelectedProject();
}

/*========== Console Message ==========*/
console.log('%c Portfolio Website ', 'background: linear-gradient(135deg, #007bff 0%, #0056d6 50%, #0047b3 100%); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 5px;');
console.log('%c Ishmael Harry-Deckor | Engineering Student & Innovation Leader ', 'color: #007bff; font-size: 14px; font-weight: bold;');
console.log('%c Built with passion for technology and community impact ', 'color: #666; font-size: 12px;');

/*========== Accessibility: Keyboard Navigation ==========*/
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('show-menu')) {
        navMenu.classList.remove('show-menu');
    }
});

// Ensure all interactive elements are keyboard accessible
const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
interactiveElements.forEach(element => {
    if (!element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '0') {
        if (element.tagName === 'A' || element.tagName === 'BUTTON') {
            element.setAttribute('tabindex', '0');
        }
    }
});

/*========== Prevent Default on Empty Hash Links ==========*/
document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

/*========== Update Active Link Based on Current Page ==========*/
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
        link.classList.add('active-link');
    }
});

