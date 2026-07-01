/* ==========================================
   MafiaMC Network — Hitman-Style Script
   Cinematic Scroll Animations & Interactions
   ========================================== */

// ========================================
// NOTIFICATION SYSTEM (Enhanced)
// ========================================
function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    // Limit to max 1 notification at a time
    while (container.children.length >= 1) {
        container.removeChild(container.firstElementChild);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    const icons = {
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle'
    };
    notification.innerHTML = `
        <div class="notification-body">
            <div class="notification-icon"><i class="${icons[type] || icons.success}"></i></div>
            <div class="notification-text">${message}</div>
        </div>
        <div class="notification-progress"><div class="notification-progress-bar"></div></div>
    `;
    container.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 3200);
}

// ========================================
// COPY IP
// ========================================
function copyIP(btn) {
    const ip = 'MafiaMC.net';
    navigator.clipboard.writeText(ip).then(() => {
        showNotification('IP copied to clipboard!', 'success');

        // Checkmark animation on the clicked button
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                const originalClass = icon.className;
                icon.className = 'fas fa-check';
                btn.classList.add('copied');
                setTimeout(() => {
                    icon.className = originalClass;
                    btn.classList.remove('copied');
                }, 2000);
            }
        }
    }).catch(() => {
        showNotification('Failed to copy IP', 'error');
    });
}

// ========================================
// NAVBAR
// ========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('open');
            });
        });
    }

    // Nav IP copy button
    const ipCopyBtn = document.getElementById('ip-copy-btn');
    if (ipCopyBtn) {
        ipCopyBtn.addEventListener('click', () => copyIP(ipCopyBtn));
    }
}

// ========================================
// HERO ZOOM ON SCROLL (Parallax)
// ========================================
function initHeroZoom() {
    const heroBg = document.getElementById('hero-bg');
    const hero = document.querySelector('.hero');
    if (!heroBg || !hero) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        if (scrollY <= heroHeight) {
            const progress = scrollY / heroHeight;
            const scale = 1 + progress * 0.15;
            const opacity = 1 - progress * 0.5;
            heroBg.style.transform = `scale(${scale})`;
            heroBg.style.opacity = opacity;
        }
    }, { passive: true });
}

// ========================================
// SCROLL FADE-IN ANIMATIONS
// ========================================
function initScrollAnimations() {
    // Group elements by their closest section parent so delays are per-section
    const selectors = [
        '.section-header-row', '.info-tile', '.game-card', '.team-card',
        '.rating-card-new', '.banner-card', '.statement-content', '.cinematic-banner'
    ];
    const allElements = document.querySelectorAll(selectors.join(', '));

    // Group by parent section
    const sectionMap = new Map();
    allElements.forEach(el => {
        const section = el.closest('section') || el.closest('.cinematic-section') || el.parentElement;
        if (!sectionMap.has(section)) sectionMap.set(section, []);
        sectionMap.get(section).push(el);
    });

    // Assign sequential delays within each section group
    sectionMap.forEach(group => {
        group.forEach((el, i) => {
            el.classList.add('fade-in');
            el.dataset.delay = i.toString();
        });
    });

    // Use a single observer — when an element enters, trigger it with its section-local delay
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay
                    ? parseInt(entry.target.dataset.delay) * 80
                    : 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    allElements.forEach(el => observer.observe(el));
}

// ========================================
// SCROLL TO TOP
// ========================================
function initScrollTop() {
    const btn = document.getElementById('scroll-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// ANIMATED COUNTERS
// ========================================
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    function formatNumber(num, separator) {
        if (!separator) return num.toString();
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const suffix = element.dataset.suffix || '';
        const separator = element.dataset.separator || '';
        const duration = 3000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentValue = Math.round(easedProgress * target);
            element.textContent = formatNumber(currentValue, separator) + suffix;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = formatNumber(target, separator) + suffix;
            }
        }
        requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => animateCounter(entry.target), 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(counter => {
        counter.textContent = '0';
        observer.observe(counter);
    });
}

// ========================================
// PROGRESS BAR
// ========================================
function initProgressBar() {
    const fill = document.querySelector('.progress-fill');
    if (!fill) return;

    const progress = parseInt(fill.dataset.progress) || 70;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fill.style.setProperty('--progress-width', progress + '%');
                setTimeout(() => fill.classList.add('animated'), 300);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(fill.closest('.maintenance-card') || fill);
}

// ========================================
// DRAG SCROLL FOR GALLERIES
// ========================================
function initDragScroll() {
    const galleries = document.querySelectorAll('.team-gallery');

    galleries.forEach(gallery => {
        let isDown = false;
        let startX;
        let scrollLeft;

        gallery.addEventListener('mousedown', (e) => {
            isDown = true;
            gallery.style.cursor = 'grabbing';
            startX = e.pageX - gallery.offsetLeft;
            scrollLeft = gallery.scrollLeft;
        });

        gallery.addEventListener('mouseleave', () => {
            isDown = false;
            gallery.style.cursor = 'grab';
        });

        gallery.addEventListener('mouseup', () => {
            isDown = false;
            gallery.style.cursor = 'grab';
        });

        gallery.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - gallery.offsetLeft;
            const walk = (x - startX) * 2;
            gallery.scrollLeft = scrollLeft - walk;
        });
    });
}

// ========================================
// RATINGS MARQUEE (Duplicate cards for seamless loop)
// ========================================
function initRatingsMarquee() {
    const scroll = document.getElementById('ratings-scroll');
    if (!scroll) return;

    const cards = scroll.querySelectorAll('.rating-card-new');
    // Duplicate all cards for seamless infinite loop
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone-card');
        scroll.appendChild(clone);
    });
}

// ========================================
// HERO CTA BUTTON (IP COPY)
// ========================================
function initHeroCTA() {
    const btn = document.getElementById('hero-copy-btn');
    if (btn) {
        btn.addEventListener('click', () => copyIP(btn));
    }
}

// ========================================
// RATING MODAL (Enhanced — 24hr limit, blocked names, adds card)
// ========================================
const BLOCKED_USERNAMES = ['dghem', 'immosta', 'imMosta'];
const RATING_COOLDOWN_KEY = 'mafiamc_last_rating';
const RATING_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

function canRate() {
    const last = localStorage.getItem(RATING_COOLDOWN_KEY);
    if (!last) return true;
    return (Date.now() - parseInt(last)) >= RATING_COOLDOWN_MS;
}

function addUserRatingCard(username, review, stars) {
    const scroll = document.getElementById('ratings-scroll');
    if (!scroll) return;

    let starsHTML = '';
    for (let i = 0; i < 5; i++) {
        starsHTML += i < stars
            ? '<i class="fas fa-star"></i>'
            : '<i class="far fa-star" style="color:var(--text-muted)"></i>';
    }

    const card = document.createElement('div');
    card.className = 'rating-card-new';
    card.style.animation = 'modalIn 0.5s var(--ease) both';
    card.innerHTML = `
        <div class="rating-stars-row">${starsHTML}</div>
        <p class="rating-text">"${review}"</p>
        <div class="rating-user-row">
            <img src="https://mc-heads.net/avatar/${encodeURIComponent(username)}/40" alt="${username}" />
            <span>${username}</span>
        </div>
    `;

    // Insert at the beginning
    scroll.prepend(card);

    // Insert clone for seamless loop
    const firstClone = scroll.querySelector('.clone-card');
    const clone = card.cloneNode(true);
    clone.classList.add('clone-card');
    if (firstClone) {
        scroll.insertBefore(clone, firstClone);
    } else {
        scroll.appendChild(clone);
    }

    // Reset animation to show new card immediately
    scroll.style.animation = 'none';
    scroll.offsetHeight; /* trigger reflow */
    scroll.style.animation = null;
}

function initRatingModal() {
    const modal = document.getElementById('rating-modal');
    const openBtn = document.getElementById('open-rating-modal');
    const closeBtn = document.getElementById('close-rating-modal');
    const cancelBtn = document.getElementById('cancel-rating');
    const submitBtn = document.getElementById('submit-rating');
    const stars = document.querySelectorAll('#star-rating-input i');
    const ratingLabel = document.getElementById('rating-label');
    const ratingForm = document.getElementById('rating-form');
    const ratingSuccess = document.getElementById('rating-success');

    if (!modal || !openBtn) return;

    let selectedRating = 0;
    const labels = ['', 'Terrible', 'Bad', 'Average', 'Good', 'Excellent!'];

    function openModal() {
        // Check 24hr cooldown
        if (!canRate()) {
            showNotification('You can only rate once every 24 hours!', 'warning');
            return;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            selectedRating = 0;
            stars.forEach(s => { s.className = 'far fa-star'; });
            if (ratingLabel) ratingLabel.textContent = 'Select your rating';
            const usernameInput = document.getElementById('rating-username');
            const reviewInput = document.getElementById('rating-review');
            if (usernameInput) usernameInput.value = '';
            if (reviewInput) reviewInput.value = '';
            if (ratingForm) ratingForm.style.display = '';
            if (ratingSuccess) ratingSuccess.classList.remove('active');
        }, 300);
    }

    openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Removed click-outside-to-close feature per user request
    // modal.addEventListener('click', (e) => {
    //     if (e.target === modal) closeModal();
    // });

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            stars.forEach(s => {
                const rating = parseInt(s.dataset.rating);
                s.className = rating <= selectedRating ? 'fas fa-star active' : 'far fa-star';
            });
            if (ratingLabel) ratingLabel.textContent = labels[selectedRating] || '';
        });

        star.addEventListener('mouseenter', () => {
            const hoverRating = parseInt(star.dataset.rating);
            stars.forEach(s => {
                const rating = parseInt(s.dataset.rating);
                if (rating <= hoverRating) {
                    s.classList.add('active');
                }
            });
        });

        star.addEventListener('mouseleave', () => {
            stars.forEach(s => {
                const rating = parseInt(s.dataset.rating);
                if (rating > selectedRating) {
                    s.classList.remove('active');
                    s.className = 'far fa-star';
                }
            });
        });
    });

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const username = document.getElementById('rating-username').value.trim();
            const review = document.getElementById('rating-review').value.trim();

            if (selectedRating === 0) {
                showNotification('Please select a rating first!', 'warning');
                return;
            }
            if (!username) {
                showNotification('Please enter your username!', 'warning');
                return;
            }
            if (!review) {
                showNotification('Please write your review!', 'warning');
                return;
            }

            // Block reserved usernames
            if (BLOCKED_USERNAMES.includes(username.toLowerCase())) {
                showNotification('This username is not allowed!', 'error');
                return;
            }

            // Save cooldown timestamp
            localStorage.setItem(RATING_COOLDOWN_KEY, Date.now().toString());

            // Add rating card to the ratings section
            addUserRatingCard(username, review, selectedRating);

            if (ratingForm) ratingForm.style.display = 'none';
            if (ratingSuccess) ratingSuccess.classList.add('active');
            showNotification('Thank you for your rating!', 'success');
            setTimeout(closeModal, 2500);
        });
    }
}

// ========================================
// SIGNATURE PARTICLES (Footer) — Hover only on image
// ========================================
function initSignatureParticles() {
    const wrap = document.getElementById('footer-signature-wrap');
    const link = wrap ? wrap.querySelector('.signature-link') : null;
    const imgNode = link ? link.querySelector('.signature-img') : null;
    const canvas = document.getElementById('signature-particles');
    if (!wrap || !canvas || !imgNode) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let isHovering = false;
    let animId = null;
    let w, h;
    let mouseX = 0, mouseY = 0;

    function resize() {
        w = canvas.offsetWidth;
        h = canvas.offsetHeight;
        canvas.width = w;
        canvas.height = h;
    }

    resize();
    window.addEventListener('resize', resize);

    // Track mouse position relative to canvas
    wrap.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = w / 2 + (Math.random() - 0.5) * 80;
            this.y = h / 2 + (Math.random() - 0.5) * 50;
            this.baseVx = (Math.random() - 0.5) * 1.2;
            this.baseVy = (Math.random() - 0.5) * 1.2 - 0.4;
            this.vx = this.baseVx;
            this.vy = this.baseVy;
            this.size = Math.random() * 2.8 + 0.5;
            this.life = 1;
            this.decay = Math.random() * 0.012 + 0.006;
            this.isRed = Math.random() > 0.25;
        }
        update() {
            // Interactive: particles react to mouse position
            if (isHovering) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 40) {
                    // Repel from cursor
                    const force = (40 - dist) / 40;
                    this.vx += (dx / dist) * force * 0.8;
                    this.vy += (dy / dist) * force * 0.8;
                } else {
                    // Orbit gently around cursor
                    const attract = 0.02;
                    this.vx += (mouseX - this.x) * attract * 0.03;
                    this.vy += (mouseY - this.y) * attract * 0.03;
                }
            }

            // Dampen velocity
            this.vx *= 0.96;
            this.vy *= 0.96;

            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;

            if (this.life <= 0) {
                if (isHovering) {
                    this.reset();
                } else {
                    this.life = 0;
                }
            }
        }
        draw() {
            const alpha = Math.max(0, this.life);
            if (alpha <= 0) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
            if (this.isRed) {
                ctx.fillStyle = `rgba(220, 38, 38, ${alpha * 0.8})`;
            } else {
                ctx.fillStyle = `rgba(255, 200, 200, ${alpha * 0.5})`;
            }
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < 35; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);

        let anyAlive = false;
        particles.forEach(p => {
            p.update();
            if (p.life > 0) {
                p.draw();
                anyAlive = true;
            }
        });

        if (isHovering || anyAlive) {
            animId = requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, w, h);
            animId = null;
        }
    }

    // Only trigger on the actual signature image
    imgNode.addEventListener('mouseenter', () => {
        isHovering = true;
        createParticles();
        if (!animId) animate();
    });

    imgNode.addEventListener('mouseleave', () => {
        isHovering = false;
    });
}

// ========================================
// PLAY NOW BUTTON (copies server IP)
// ========================================
function initPlayNowBtn() {
    const playBtns = document.querySelectorAll('.game-play-btn');
    playBtns.forEach(btn => {
        btn.addEventListener('click', () => copyIP(btn));
    });
}

// ========================================
// SITE PROTECTION
// ========================================
function initProtection() {
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    document.querySelectorAll('img').forEach(img => {
        img.setAttribute('draggable', 'false');
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.key === 'u') ||
            (e.ctrlKey && e.key === 'U') ||
            (e.metaKey && e.altKey && e.key === 'I')
        ) {
            e.preventDefault();
            return false;
        }
    });
}

// ========================================
// BLOCK FILE PROTOCOL (TEMPORARILY DISABLED)
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.protocol === 'file:') {
        document.title = "Access Denied";
        const e = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
        if (e) e.remove();
        const t = document.createElement('link');
        t.rel = 'icon';
        t.href = 'data:image/x-icon;base64,';
        document.head.appendChild(t);

        document.body.innerHTML = `
        <div style="min-height: 100vh; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #f9fafb; color: #111827; font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 2rem; margin: 0; position: fixed; inset: 0; z-index: 999999; box-sizing: border-box;">
            <svg style="width: 64px; height: 64px; color: #ef4444; margin-bottom: 1.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; margin-top: 0;">File Protocol is Disabled</h1>
            <p style="color: #4b5563; max-width: 28rem; line-height: 1.5; margin-bottom: 2rem; margin-top: 0;">For security reasons and to ensure all features function correctly, this website cannot be run directly from a local file.</p>
            <a href="https://mafiamc.net" style="background-color: #2563eb; color: white; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-weight: 500; font-size: 0.875rem;">Go to Official Website</a>
        </div>
        `;
        return;
    }

    initNavbar();
    initHeroZoom();
    initScrollAnimations();
    initScrollTop();
    initCounters();
    initProgressBar();
    initDragScroll();
    initRatingsMarquee();
    initHeroCTA();
    initRatingModal();
    initSignatureParticles();
    initProtection();
    initPlayNowBtn();
    initVoteAnimations();
    init3DLogo();
});

window.addEventListener('load', () => {
    document.body.style.opacity = '1';

    // Main loader timeout (hide after a slight delay to allow video to buffer)
    const mainLoader = document.getElementById('main-loader');
    if (mainLoader) {
        setTimeout(() => {
            mainLoader.classList.add('fade-out');
            setTimeout(() => { mainLoader.remove(); }, 800);
        }, 1500);
    }
});

function initVoteAnimations() {
    const voteCards = document.querySelectorAll('.vote-card');
    if (!voteCards.length) return;
    const observer = new IntersectionObserver((entries) => {
        let delay = 0;
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                delay += 100;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    voteCards.forEach(card => {
        card.classList.add('animate-on-scroll');
        observer.observe(card);
    });
}

function init3DLogo() {
    const container = document.getElementById('logo-3d-container');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    // Limit pixel ratio to 1.5 to save massive amounts of GPU on high-DPI (Retina) screens
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.localClippingEnabled = true;
    container.appendChild(renderer.domElement);

    const shape = new THREE.Shape();
    shape.moveTo(-5, -5);
    shape.lineTo(-5, 2);
    shape.lineTo(-2.5, 5);
    shape.lineTo(0, 1.5);
    shape.lineTo(2.5, 5);
    shape.lineTo(5, 2);
    shape.lineTo(5, -5);
    shape.lineTo(2.5, -5);
    shape.lineTo(2.5, 1);
    shape.lineTo(0, -2);
    shape.lineTo(-2.5, 1);
    shape.lineTo(-2.5, -5);
    shape.lineTo(-5, -5);

    const extrudeSettings = {
        steps: 1,
        depth: 1.5,
        bevelEnabled: true,
        bevelThickness: 0.3,
        bevelSize: 0.2, // standard classy bevel
        bevelOffset: 0,
        bevelSegments: 2 // Reduced from 4 to 2 for performance
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.computeBoundingBox();
    let bx = geometry.boundingBox;
    const xOff = -0.5 * (bx.max.x + bx.min.x);
    const yOff = -0.5 * (bx.max.y + bx.min.y);
    const zOff = -0.5 * (bx.max.z + bx.min.z);
    geometry.translate(xOff, yOff, zOff);

    geometry.computeBoundingBox();
    bx = geometry.boundingBox;
    const minY = bx.min.y - 0.5;
    const maxY = bx.max.y + 0.5;

    const buildPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), minY);

    const faceMat = new THREE.MeshStandardMaterial({
        color: 0xee1111,
        metalness: 0.5,
        roughness: 0.15,
        emissive: 0x330000,
        clippingPlanes: [buildPlane],
        side: THREE.DoubleSide
    });

    // Performance: removed double side from sideMat to save rendering
    const sideMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x222222,
        clippingPlanes: [buildPlane]
    });

    const mesh = new THREE.Mesh(geometry, [faceMat, sideMat]);
    scene.add(mesh);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
    keyLight.position.set(15, 20, 20);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xff5555, 0.7);
    fillLight.position.set(-15, -5, 10);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2);
    rimLight.position.set(0, 15, -20);
    scene.add(rimLight);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    let isBuilding = false;
    let hasPlayedIntro = false;
    let buildStartTime = 0;
    let isVisible = false;
    const buildDuration = 5000;

    document.addEventListener('mousemove', (event) => {
        if (!isVisible) return; // Save computations
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !hasPlayedIntro) {
            hasPlayedIntro = true;
            isBuilding = true;
            buildStartTime = Date.now();
        }
    }, { threshold: 0.1 }); // Lower threshold so it starts rendering slightly earlier
    observer.observe(container);

    function animate() {
        requestAnimationFrame(animate);

        // PERFORMANCE: If not visible, do not render or calculate!
        if (!isVisible) return;

        let now = Date.now();

        if (isBuilding) {
            let progress = (now - buildStartTime) / buildDuration;
            if (progress >= 1) {
                progress = 1;
                isBuilding = false;
                faceMat.clippingPlanes = [];
                sideMat.clippingPlanes = [];
                renderer.localClippingEnabled = false; // Save performance
            }

            buildPlane.constant = minY + (maxY - minY) * progress;

            const easeOut = 1 - Math.pow(1 - progress, 3);
            mesh.rotation.y = (1 - easeOut) * (Math.PI * 2);

        } else if (hasPlayedIntro) {
            targetX = mouseX * 0.7;
            targetY = mouseY * 0.5;

            mesh.rotation.y += (targetX - mesh.rotation.y) * 0.1;
            mesh.rotation.x += (-targetY - mesh.rotation.x) * 0.1;

            mesh.position.y = Math.sin(now * 0.0015) * 0.3;
        }

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        if (!container.clientWidth) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}
