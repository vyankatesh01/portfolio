/* ===========================
   DEMON SLAYER INFINITY CASTLE
   Developer Portfolio — JS
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

    // ── Katana Cursor System ───────────────────
    const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const katanaCursor = document.getElementById('katanaCursor');
    const trailCanvas = document.getElementById('trailCanvas');
    const tctx = trailCanvas ? trailCanvas.getContext('2d') : null;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let katanaX = mouseX;
    let katanaY = mouseY;
    let prevKatanaX = katanaX;
    let prevKatanaY = katanaY;

    // Trail particles
    let trailPoints = [];
    const MAX_TRAIL_AGE = 25; // How long the trail lasts
    let sparks = [];

    if (!isMobile && trailCanvas && katanaCursor) {
        function resizeTrail() {
            trailCanvas.width = window.innerWidth;
            trailCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeTrail);
        resizeTrail();

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function createSparkParticle(x, y) {
            const spark = {
                x: x, y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1, age: 0,
                color: Math.random() > 0.5 ? '#ef4444' : '#a855f7'
            };
            sparks.push(spark);
        }

        function animateKatana() {
            // Smooth easing for katana movement (micro lag)
            katanaX += (mouseX - katanaX) * 0.35;
            katanaY += (mouseY - katanaY) * 0.35;

            // Calculate velocity for rotation and 3D light effect
            const dx = katanaX - prevKatanaX;
            const dy = katanaY - prevKatanaY;
            const speed = Math.sqrt(dx * dx + dy * dy);

            // Subtle rotation based on horizontal movement
            // If moving right (dx > 0), tilt left. If moving left (dx < 0), tilt right.
            const tilt = dx * -0.5; // Rotate up to -25 / +25 degrees ideally
            const clampedTilt = Math.max(-25, Math.min(25, tilt));

            katanaCursor.style.transform = `translate(${katanaX}px, ${katanaY}px) rotate(${clampedTilt}deg)`;

            // 3D Lighting effect based on speed - brightness increases when moving fast
            if (speed > 2) {
                const brightness = Math.min(1.8, 1 + speed * 0.02);
                katanaCursor.style.filter = `drop-shadow(0 0 ${Math.min(15, speed)}px rgba(255, 196, 0, 0.6)) brightness(${brightness})`;
            } else {
                katanaCursor.style.filter = `drop-shadow(0 0 5px rgba(255, 196, 0, 0.4)) brightness(1)`;
            }

            prevKatanaX = katanaX;
            prevKatanaY = katanaY;

            // --- Trail Drawing ---
            // Only add points if moving or starting
            if (speed > 0.5 || trailPoints.length === 0) {
                trailPoints.push({ x: katanaX, y: katanaY, age: 0 });
            }

            tctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
            tctx.lineJoin = 'round';
            tctx.lineCap = 'round';

            if (trailPoints.length > 1) {
                for (let i = 0; i < trailPoints.length - 1; i++) {
                    const p = trailPoints[i];
                    const nextP = trailPoints[i + 1];
                    p.age += 1;

                    const progress = 1 - (p.age / MAX_TRAIL_AGE);
                    if (progress > 0) {
                        tctx.beginPath();
                        tctx.moveTo(p.x, p.y);
                        tctx.lineTo(nextP.x, nextP.y);
                        tctx.shadowBlur = 15 * progress;
                        tctx.shadowColor = '#FFC400';

                        // Deep yellow/blue energy trail
                        tctx.strokeStyle = `rgba(255, 196, 0, ${progress * 0.8})`;
                        // Add some blue inner core for younger points
                        if (progress > 0.7) {
                            tctx.strokeStyle = `rgba(0, 191, 255, ${progress})`;
                            tctx.lineWidth = progress * 4;
                            tctx.stroke();

                            tctx.beginPath();
                            tctx.moveTo(p.x, p.y);
                            tctx.lineTo(nextP.x, nextP.y);
                            tctx.strokeStyle = `rgba(255, 255, 255, ${progress})`;
                            tctx.lineWidth = progress * 1.5;
                        } else {
                            tctx.lineWidth = progress * 6;
                        }

                        tctx.stroke();
                    }
                }
            }

            // Optional: emit soft particle sparks occasionally based on speed
            if (speed > 10 && Math.random() > 0.7) {
                createSparkParticle(katanaX, katanaY);
            }

            // Draw Sparks
            if (sparks.length > 0) {
                sparks.forEach(s => {
                    s.x += s.vx;
                    s.y += s.vy;
                    s.age += 0.05;
                    const opacity = Math.max(0, 1 - s.age);
                    tctx.beginPath();
                    tctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
                    tctx.fillStyle = s.color;
                    tctx.globalAlpha = opacity;
                    tctx.fill();
                    tctx.globalAlpha = 1.0;
                });
                sparks = sparks.filter(s => s.age < 1);
            }

            // Remove old trail points
            trailPoints = trailPoints.filter(p => p.age < MAX_TRAIL_AGE);

            requestAnimationFrame(animateKatana);
        }
        animateKatana();

        // Hover Contexts
        const hoverTargets = document.querySelectorAll('a, button, .btn, .skill-card, .project-card, .nav-toggle, input, textarea');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                katanaCursor.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                katanaCursor.classList.remove('hovering');
            });
        });

        // Click Slash Effect
        document.addEventListener('click', (e) => {
            // Global Ripple
            const ripple = document.createElement('div');
            ripple.className = 'click-ripple';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top = e.clientY + 'px';
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            // Dynamic Slash
            const slash = document.createElement('div');
            slash.className = 'slash-effect';
            slash.style.left = e.clientX + 'px';
            slash.style.top = e.clientY + 'px';
            // Random angle for slash
            const angle = Math.random() * 360;
            slash.style.setProperty('--angle', `${angle}deg`);
            document.body.appendChild(slash);
            setTimeout(() => slash.remove(), 400);
        });
    }


    // ── Particle System ────────────────────────
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3 - 0.15;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = Math.random() > 0.5
                ? `rgba(255, 196, 0, ${this.opacity})`
                : `rgba(0, 191, 255, ${this.opacity})`;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }
        update(time) {
            this.x += this.speedX;
            this.y += this.speedY;
            const pulse = Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.3 + 0.7;
            this.currentOpacity = this.opacity * pulse;

            if (this.x < -10 || this.x > canvas.width + 10 ||
                this.y < -10 || this.y > canvas.height + 10) {
                this.reset();
                this.y = canvas.height + 5;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace(/[\d.]+\)$/, this.currentOpacity + ')');
            ctx.fill();

            // Glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace(/[\d.]+\)$/, (this.currentOpacity * 0.15) + ')');
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    let animTime = 0;
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animTime++;
        particles.forEach(p => {
            p.update(animTime);
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // ── Hero Parallax on Mouse Move ────────────
    const heroContent = document.querySelector('.hero-content');
    const hero = document.querySelector('.hero');

    if (hero && heroContent) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            heroContent.style.transform = `translate(${x * 15}px, ${y * 10}px)`;
        });
        hero.addEventListener('mouseleave', () => {
            heroContent.style.transform = 'translate(0, 0)';
            heroContent.style.transition = 'transform 0.5s ease';
            setTimeout(() => { heroContent.style.transition = ''; }, 500);
        });
    }


    // ── Hero Text Entrance Animation ───────────
    const revealTexts = document.querySelectorAll('.reveal-text');
    setTimeout(() => {
        revealTexts.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, i * 200);
        });
    }, 500);


    // ── Scroll Reveal (IntersectionObserver) ───
    const revealElements = document.querySelectorAll('.reveal-section');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ── Skill Bars Animation ───────────────────
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.getAttribute('data-level');
                entry.target.style.width = level + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillFills.forEach(el => skillObserver.observe(el));


    // ── Navbar Scroll Effect ───────────────────
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Navbar background
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom > 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });


    // ── Mobile Navigation Toggle ───────────────
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('open');
        });
    });


    // ── Button Ripple Effect ───────────────────
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });


    // ── Smooth Scroll for Anchor Links ─────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    // ── Katana Divider Slash Animation ─────────
    document.querySelectorAll('.katana-divider').forEach(divider => {
        divider.addEventListener('mouseenter', () => {
            const line = divider.querySelector('.katana-line');
            line.style.animation = 'none';
            void line.offsetWidth; // Trigger reflow
            line.style.animation = 'katanaSlash 0.5s ease-out';
        });
    });


    // ── Contact Form Handler (placeholder) ─────
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn');
            const originalText = btn.querySelector('span').textContent;
            btn.querySelector('span').textContent = 'Message Sent! ✓';
            btn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
            setTimeout(() => {
                btn.querySelector('span').textContent = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }


    // ── Perspective Shift on Scroll (subtle) ───
    const infinityGrid = document.querySelector('.infinity-grid');
    if (infinityGrid) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const rotation = Math.sin(scrolled * 0.001) * 2;
            const translateY = scrolled * 0.03;
            infinityGrid.style.transform = `perspective(500px) rotateX(${rotation}deg) translateY(${-translateY}px)`;
        }, { passive: true });
    }

    // ── Loading Screen Logic ───────────────────
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingSlash = document.querySelector('.loading-slash');

    // Disable scroll while loading
    document.body.style.overflow = 'hidden';

    // Simulate loading sequence
    setTimeout(() => {
        // Trigger slash animation
        if (loadingSlash) loadingSlash.classList.add('active');

        // Hide entire screen shortly after slash starts
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = ''; // Re-enable scroll

                // Trigger initial scroll reveals
                setTimeout(() => {
                    revealElements.forEach(el => revealObserver.observe(el));
                }, 100);
            }
        }, 350); // wait for slash to cross middle

    }, 2500); // 2.5s total visible loading time

});
