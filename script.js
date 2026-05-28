/* ══════════════════════════════════════════════════════════════════════════
   AKSHITA MOURYA — PORTFOLIO CLIENT ENGINE
   Interactive Systems: Dual-Cursor Trail, Particles, Counters, Lightbox
   API Integration: Client-side EmailJS Secure Contact Payload Delivery
   ══════════════════════════════════════════════════════════════════════════ */

/* ==========================================
   1. EMAILJS INTEGRATION SETUP
   ==========================================
   To wire this contact form to your own personal email inbox, follow these steps:
   
   1. Sign up for a free account at https://www.emailjs.com/
   2. Connect your email service (e.g. Gmail) to get your SERVICE_ID.
   3. Create an Email Template with form fields: 
      - {{user_name}}
      - {{user_email}}
      - {{subject}}
      - {{message}}
      This gives you your TEMPLATE_ID.
   4. Navigate to Account > API Keys to find your PUBLIC_KEY.
   5. Paste your PUBLIC_KEY below in the emailjs.init("...") line!
   6. Replace the placeholder IDs inside the sendMailPayload() function below.
   
   Once these three strings are updated, client messages will go directly to your mail!
   ========================================== */

// Initialize EmailJS with your Public Key
(function() {
    // Replace "YOUR_PUBLIC_KEY" with your actual EmailJS Public Key
    emailjs.init("F30q2eG2r_u4B-s8z"); 
})();


/* ==========================================
   2. SITE PRELOADER
   ========================================== */
window.addEventListener('DOMContentLoaded', () => {
    const loaderBar = document.getElementById('loaderBar');
    const loader = document.getElementById('loader');
    
    // Simulate loading progress
    if (loaderBar) {
        setTimeout(() => { loaderBar.style.width = '30%'; }, 100);
        setTimeout(() => { loaderBar.style.width = '70%'; }, 400);
        setTimeout(() => { loaderBar.style.width = '100%'; }, 850);
    }
    
    // Smoothly dissolve loader
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader) {
                loader.classList.add('gone');
                // Auto start hero reveal elements
                document.querySelectorAll('.hero .reveal-element').forEach(el => {
                    el.classList.add('reveal-active');
                });
            }
        }, 1100);
    });
});


/* ==========================================
   3. DOUBLE CURSOR DUAL-TRAIL PHYSICS
   ========================================== */
const cursorRing = document.getElementById('customCursor');
const cursorDot = document.getElementById('customCursorDot');

let mouseX = 0, mouseY = 0; // Target coordinates
let ringX = 0, ringY = 0;   // Eased coordinates
let isMoving = false;

if (cursorRing && cursorDot) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor elements on first motion
        if (!isMoving) {
            cursorRing.style.opacity = '1';
            cursorDot.style.opacity = '1';
            isMoving = true;
        }
        
        // Direct absolute positioning for internal dot
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Custom deceleration render loop for trailing ring
    const renderCursorRing = () => {
        // Linear Interpolation (Lerp) for elastic lag trail
        const easeAmount = 0.14; // Deceleration rate
        ringX += (mouseX - ringX) * easeAmount;
        ringY += (mouseY - ringY) * easeAmount;
        
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        
        requestAnimationFrame(renderCursorRing);
    };
    requestAnimationFrame(renderCursorRing);

    // Dynamic scale states when hovering over interactive nodes
    const hoverSelectors = 'a, button, input, textarea, .cert-card, .btn-primary-gold, .btn-secondary-outline, .about-social-pill, .hamburger-menu';
    document.querySelectorAll(hoverSelectors).forEach(node => {
        node.addEventListener('mouseenter', () => {
            if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                cursorRing.classList.add('input-state');
            } else {
                cursorRing.classList.add('hover-state');
            }
        });
        node.addEventListener('mouseleave', () => {
            cursorRing.classList.remove('hover-state');
            cursorRing.classList.remove('input-state');
        });
    });
    
    // Hide cursor when exiting the screen
    document.addEventListener('mouseleave', () => {
        cursorRing.style.opacity = '0';
        cursorDot.style.opacity = '0';
        isMoving = false;
    });
}


/* ==========================================
   4. ENGLISH CLAY-SAND HTML5 CANVAS SPARKS
   ========================================== */
(function() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    
    // Adapt to layout sizes
    const setCanvasDimensions = () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    };
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Helpers
    const getRandom = (min, max) => Math.random() * (max - min) + min;
    
    // Particle Blueprints
    class Spark {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = getRandom(0, W);
            this.y = getRandom(H + 10, H + 100); // Spawn off bottom screen
            this.radius = getRandom(0.4, 1.8);
            this.speedY = getRandom(-0.4, -1.2); // Slow upward float
            this.speedX = getRandom(-0.3, 0.3);
            this.opacity = getRandom(0.1, 0.55);
            // Curated off-white sand-brown and clay brown palette spectrum
            this.color = Math.random() > 0.65 ? '222, 217, 208' : '182, 165, 146';
            this.oscillationSpeed = getRandom(0.01, 0.03);
            this.angle = getRandom(0, Math.PI * 2);
        }
        
        update() {
            this.y += this.speedY;
            this.angle += this.oscillationSpeed;
            // Drifts left and right on cosine curves
            this.x += this.speedX + Math.cos(this.angle) * 0.18;
            
            // Fade particles out as they reach the top 20%
            if (this.y < H * 0.2) {
                this.opacity -= 0.005;
            }
            
            // Reset particle if completely transparent or off screen
            if (this.y < -10 || this.opacity <= 0 || this.x < -10 || this.x > W + 10) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.shadowBlur = 4;
            ctx.shadowColor = `rgba(${this.color}, 0.2)`;
            ctx.fill();
        }
    }
    
    // Populate particle matrix
    const particleCount = Math.min(65, Math.floor(W * 0.05)); // Density scales with screen width
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Spark());
        // Randomize initial heights to scatter them across viewport
        particles[i].y = getRandom(0, H);
    }
    
    // Core animation frame render loop
    const animateSparks = () => {
        ctx.clearRect(0, 0, W, H);
        
        // Render sparks
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        requestAnimationFrame(animateSparks);
    };
    animateSparks();
})();


/* ==========================================
   5. STICKY GLASS NAVIGATION & ACTIVE STATE
   ========================================== */
const navbar = document.getElementById('navbar');
const navLinkItems = document.querySelectorAll('.nav-link-item');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    // 1. Sticky background toggle
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // 2. Nav Active Highlight tracker
    let activeSectionId = '';
    sections.forEach(sec => {
        const secTop = sec.offsetTop - 140; // Offset layout height
        const secHeight = sec.offsetHeight;
        if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
            activeSectionId = sec.getAttribute('id');
        }
    });
    
    navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSectionId}`) {
            link.style.color = 'var(--gold-light)';
            link.style.borderBottom = '1.5px solid var(--gold-sand)';
        } else {
            link.style.color = '';
            link.style.borderBottom = '';
        }
    });
});


/* ==========================================
   6. MOBILE NAVIGATION OVERLAY MENU
   ========================================== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (hamburger && mobileMenu) {
    const toggleMobileNav = () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        
        // Animate hamburger lines
        const lines = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            lines[0].style.transform = 'translateY(7.5px) rotate(45deg)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'translateY(-7.5px) rotate(-45deg)';
            document.body.style.overflow = 'hidden'; // Stop scrolling background
        } else {
            lines[0].style.transform = '';
            lines[1].style.opacity = '1';
            lines[2].style.transform = '';
            document.body.style.overflow = '';
        }
    };
    
    hamburger.addEventListener('click', toggleMobileNav);
    
    // Close overlay when clicking any navigation link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMobileNav();
            }
        });
    });
}


/* ==========================================
   7. STAGGERED SCROLL REVEAL OBSERVER
   ========================================== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            // Stop watching after initial trigger
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    root: null,
    threshold: 0.08, // Fire when 8% of card is in viewport
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal-element').forEach(el => {
    // If element belongs to hero, it reveals on page load inside Preloader
    if (!el.closest('.hero')) {
        revealObserver.observe(el);
    }
});


/* ==========================================
   8. STATS RUNNING COUNT ANIMATOR
   ========================================== */
const countNumbers = () => {
    document.querySelectorAll('.count-num').forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        let count = 0;
        
        // Speed control variables
        const steps = 60; // 60 updates
        const increment = target / steps;
        const intervalTime = 25; // 25ms
        
        let currentStep = 0;
        
        const updateCount = setInterval(() => {
            currentStep++;
            count += increment;
            
            if (currentStep >= steps) {
                // Set final exact target to prevent floating point differences
                counter.innerText = isDecimal ? target.toFixed(2) : Math.floor(target);
                clearInterval(updateCount);
            } else {
                counter.innerText = isDecimal ? count.toFixed(2) : Math.floor(count);
            }
        }, intervalTime);
    });
};

// Trigger count logic once when Hero section is visible
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(countNumbers, 500); // Tiny visual delay after preloader exit
            counterObserver.disconnect();
        }
    });
}, { threshold: 0.15 });

const heroSection = document.getElementById('hero');
if (heroSection) {
    counterObserver.observe(heroSection);
}


/* ==========================================
   9. CERTIFICATES LIGHTBOX PREVIEW MODAL
   ========================================== */
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxCaptionTitle = document.getElementById('lightboxCaptionTitle');
const lightboxCaptionSubtitle = document.getElementById('lightboxCaptionSubtitle');

if (lightboxModal && lightboxImage && lightboxClose) {
    
    // Bind click trigger to all certificate cards
    document.querySelectorAll('.cert-card').forEach(card => {
        card.addEventListener('click', () => {
            const certImgSrc = card.getAttribute('data-cert-img');
            const certTitle = card.getAttribute('data-cert-title');
            const certOrg = card.getAttribute('data-cert-org');
            
            // Check if actual user image exists, otherwise draw the placeholder SVG to lightbox
            const actualImg = card.querySelector('.cert-img-actual');
            const hasActualImg = actualImg && actualImg.naturalWidth > 0;
            
            if (hasActualImg) {
                lightboxImage.src = certImgSrc;
                lightboxImage.style.display = 'block';
                // Remove previous SVG clones if any
                const prevSvg = lightboxModal.querySelector('.lightbox-svg-clone');
                if (prevSvg) prevSvg.remove();
            } else {
                // If missing actual file, clone the beautiful inline vector SVG to lightbox container
                lightboxImage.style.display = 'none';
                const prevSvg = lightboxModal.querySelector('.lightbox-svg-clone');
                if (prevSvg) prevSvg.remove();
                
                const originalSvg = card.querySelector('.cert-placeholder-svg svg');
                if (originalSvg) {
                    const clonedSvg = originalSvg.cloneNode(true);
                    clonedSvg.classList.add('lightbox-svg-clone');
                    clonedSvg.style.width = '80vw';
                    clonedSvg.style.maxWidth = '550px';
                    clonedSvg.style.height = 'auto';
                    lightboxImage.parentNode.insertBefore(clonedSvg, lightboxImage);
                }
            }
            
            // Set metadata caption fields
            lightboxCaptionTitle.innerText = certTitle;
            lightboxCaptionSubtitle.innerText = certOrg;
            
            // Show modal and freeze background scroll
            lightboxModal.classList.add('modal-active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal function
    const closeLightbox = () => {
        lightboxModal.classList.remove('modal-active');
        document.body.style.overflow = '';
        // Small delay to remove cloned svg after fade out
        setTimeout(() => {
            const clone = lightboxModal.querySelector('.lightbox-svg-clone');
            if (clone) clone.remove();
        }, 500);
    };
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close when clicking empty dark overlay backdrop
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });
    
    // Close modal with keyboard 'Escape' button
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('modal-active')) {
            closeLightbox();
        }
    });
}


/* ==========================================
   10. SECURE EMAILJS CONTACT FORM TRANSMISSION
   ========================================== */
function sendMailPayload(e) {
    e.preventDefault(); // Stop normal HTTP form submission page reload
    
    const submitBtn = document.getElementById('submitBtn');
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');
    
    // Close open alerts
    if (successAlert) successAlert.classList.remove('show-active');
    if (errorAlert) errorAlert.classList.remove('show-active');
    
    // Visual indicators: spin submit loader
    if (submitBtn) {
        submitBtn.classList.add('loading-active');
        submitBtn.disabled = true;
    }
    
    // EmailJS Send Form API
    // Parameters: emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formElement)
    // Replace service ID "service_x" and template ID "template_x" with your custom ones
    emailjs.sendForm('service_ep156s4', 'template_5t3m08d', e.target)
        .then((result) => {
            console.log('API Transmission Success:', result.text);
            
            // Visual success indicator
            if (successAlert) successAlert.classList.add('show-active');
            e.target.reset(); // Clear all form inputs
            
            // Auto dismiss alert after 6 seconds
            setTimeout(() => {
                if (successAlert) successAlert.classList.remove('show-active');
            }, 6000);
            
        }, (error) => {
            console.error('API Transmission Failure:', error.text);
            
            // Visual error alert indicator
            if (errorAlert) errorAlert.classList.add('show-active');
            
            // Auto dismiss error after 8 seconds
            setTimeout(() => {
                if (errorAlert) errorAlert.classList.remove('show-active');
            }, 8000);
            
        })
        .finally(() => {
            // Restore button properties
            if (submitBtn) {
                submitBtn.classList.remove('loading-active');
                submitBtn.disabled = false;
            }
        });
}


/* ==========================================
   11. ANCHOR SMOOTH SCROLL ACCELERATION
   ========================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            e.preventDefault(); // Stop default hash instant jumps
            
            // Calculate height offset for sticky header
            const headerHeight = navbar ? navbar.offsetHeight : 80;
            const targetPosition = targetSection.offsetTop - (headerHeight - 15);
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
