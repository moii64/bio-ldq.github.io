// ==================== ADVANCED EFFECTS MODULE ====================
// Các hiệu ứng nâng cao có thể bật/tắt

const Effects = {
    // Cấu hình
    config: {
        particles: true,
        cursorEffect: true,
        parallax: true,
        mouseTrail: true,
        floatingShapes: true
    },

    // Khởi tạo tất cả effects
    init() {
        if (this.config.particles) this.initParticles();
        if (this.config.cursorEffect) this.initCursorEffect();
        // Parallax is merged into Global Mouse Tilt
        if (this.config.mouseTrail) this.initMouseTrail();
        if (this.config.floatingShapes) this.initFloatingShapes();
        this.initHoverEffects(); // Now includes Global Mouse Tilt
        this.initScrollEffects();
    },

    // ==================== PARTICLE SYSTEM ====================
    initParticles() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.5;
        `;
        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            }

            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Tạo particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Vẽ đường nối giữa các particles gần nhau
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    },

    // ==================== CUSTOM CURSOR EFFECT ====================
    initCursorEffect() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor-follower';
        
        document.body.appendChild(cursor);
        document.body.appendChild(cursorFollower);

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follower animation (Tăng độ nhạy: 0.1 → 0.3)
        function animateFollower() {
            followerX += (mouseX - followerX) * 0.3;
            followerY += (mouseY - followerY) * 0.3;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .link-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorFollower.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorFollower.classList.remove('cursor-hover');
            });
        });

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor, .cursor-follower {
                position: fixed;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
            }
            
            .custom-cursor {
                width: 10px;
                height: 10px;
                background: white;
                transform: translate(-50%, -50%);
                transition: transform 0.1s ease;
            }
            
            .cursor-follower {
                width: 40px;
                height: 40px;
                border: 2px solid white;
                transform: translate(-50%, -50%);
                transition: transform 0.15s ease;
            }
            
            .cursor-hover.custom-cursor {
                transform: translate(-50%, -50%) scale(1.5);
            }
            
            .cursor-hover.cursor-follower {
                transform: translate(-50%, -50%) scale(1.5);
            }

            @media (max-width: 768px) {
                .custom-cursor, .cursor-follower {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    },

    // ==================== PARALLAX EFFECT ====================
    initParallax() {
        // Parallax is now handled by initGlobalMouseTilt in initHoverEffects
        // This function is kept for compatibility but does nothing
        console.log('Parallax merged with Global Mouse Tilt');
    },

    // ==================== MOUSE TRAIL EFFECT ====================
    initMouseTrail() {
        const trail = [];
        const trailLength = 15; // Tăng từ 10 → 15

        document.addEventListener('mousemove', (e) => {
            const dot = document.createElement('div');
            dot.className = 'trail-dot';
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px';
            document.body.appendChild(dot);

            trail.push(dot);

            if (trail.length > trailLength) {
                const oldDot = trail.shift();
                oldDot.remove();
            }

            setTimeout(() => {
                dot.remove();
            }, 400); // Giảm từ 500ms → 400ms
        });

        const style = document.createElement('style');
        style.textContent = `
            .trail-dot {
                position: fixed;
                width: 5px;
                height: 5px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transform: translate(-50%, -50%);
                animation: trailFade 0.5s ease-out forwards;
            }
            
            @keyframes trailFade {
                to {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(2.5);
                }
            }

            @media (max-width: 768px) {
                .trail-dot {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    },

    // ==================== FLOATING SHAPES ====================
    initFloatingShapes() {
        const shapes = ['circle', 'square', 'triangle'];
        const shapeCount = 5;

        for (let i = 0; i < shapeCount; i++) {
            const shape = document.createElement('div');
            shape.className = `floating-shape ${shapes[Math.floor(Math.random() * shapes.length)]}`;
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            shape.style.animationDelay = Math.random() * 5 + 's';
            shape.style.animationDuration = (Math.random() * 10 + 10) + 's';
            document.body.appendChild(shape);
        }

        const style = document.createElement('style');
        style.textContent = `
            .floating-shape {
                position: fixed;
                width: 50px;
                height: 50px;
                pointer-events: none;
                z-index: 0;
                opacity: 0.1;
                animation: floatAround 15s infinite ease-in-out;
            }
            
            .floating-shape.circle {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                border-radius: 50%;
            }
            
            .floating-shape.square {
                background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
                border-radius: 10px;
                transform: rotate(45deg);
            }
            
            .floating-shape.triangle {
                width: 0;
                height: 0;
                background: transparent;
                border-left: 25px solid transparent;
                border-right: 25px solid transparent;
                border-bottom: 50px solid var(--primary-color);
            }
            
            @keyframes floatAround {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                }
                25% {
                    transform: translate(100px, 50px) rotate(90deg);
                }
                50% {
                    transform: translate(50px, 100px) rotate(180deg);
                }
                75% {
                    transform: translate(-50px, 50px) rotate(270deg);
                }
            }
        `;
        document.head.appendChild(style);
    },

    // ==================== HOVER EFFECTS NÂNG CAO ====================
    initHoverEffects() {
        const linkCards = document.querySelectorAll('.link-card');
        
        linkCards.forEach(card => {
            // Glow effect on hover only - no individual card tilt
            card.addEventListener('mouseenter', () => {
                card.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.5)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = '';
            });
        });
        
        // 3D Tilt for ENTIRE PAGE based on mouse position
        this.initGlobalMouseTilt();
        
        // 3D Tilt on Mobile using Gyroscope (like Facebook photos)
        this.initMobile3DTilt();
    },
    
    // ==================== GLOBAL MOUSE TILT (ENTIRE PAGE) ====================
    initGlobalMouseTilt() {
        const container = document.querySelector('.container');
        if (!container) return;
        
        // Only on desktop
        if (window.innerWidth > 768) {
            document.addEventListener('mousemove', (e) => {
                // Get mouse position relative to viewport center
                const x = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to 1
                const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
                
                // Calculate rotation (more sensitive than before)
                const rotateY = x * 8;  // Left-right tilt (max ±8deg)
                const rotateX = -y * 8; // Up-down tilt (max ±8deg)
                
                // Apply 3D transform to entire container
                container.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                container.style.transition = 'transform 0.1s ease-out';
            });
            
            // Reset on mouse leave window
            document.addEventListener('mouseleave', () => {
                container.style.transform = 'perspective(2000px) rotateX(0deg) rotateY(0deg)';
                container.style.transition = 'transform 0.3s ease';
            });
        }
    },
    
    // ==================== MOBILE 3D TILT (GYROSCOPE) ====================
    initMobile3DTilt() {
        // Check if device supports orientation
        if (window.DeviceOrientationEvent) {
            const linkCards = document.querySelectorAll('.link-card');
            let isGyroActive = false;
            
            // Request permission for iOS 13+
            const requestPermission = () => {
                if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                    DeviceOrientationEvent.requestPermission()
                        .then(response => {
                            if (response === 'granted') {
                                activateGyroscope();
                            }
                        })
                        .catch(console.error);
                } else {
                    activateGyroscope();
                }
            };
            
            const activateGyroscope = () => {
                isGyroActive = true;
                window.addEventListener('deviceorientation', handleOrientation);
            };
            
            const handleOrientation = (event) => {
                // Get device orientation
                const beta = event.beta;   // Front-to-back tilt (-180 to 180)
                const gamma = event.gamma; // Left-to-right tilt (-90 to 90)
                
                linkCards.forEach(card => {
                    // Only apply if card is visible
                    const rect = card.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    
                    if (isVisible) {
                        // Convert device orientation to card rotation
                        // Limit rotation to reasonable values
                        const rotateX = Math.max(-20, Math.min(20, beta / 3));
                        const rotateY = Math.max(-20, Math.min(20, gamma / 2));
                        
                        card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
                        card.style.transition = 'transform 0.1s ease-out';
                    }
                });
            };
            
            // Auto-activate on mobile
            if (window.innerWidth <= 768) {
                // Add touch listener to activate gyroscope
                document.addEventListener('touchstart', function initGyro() {
                    if (!isGyroActive) {
                        requestPermission();
                        document.removeEventListener('touchstart', initGyro);
                    }
                }, { once: true });
            }
            
            // Reset on page visibility change
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    linkCards.forEach(card => {
                        card.style.transform = '';
                    });
                }
            });
        }
    },

    // ==================== SCROLL EFFECTS ====================
    initScrollEffects() {
        let lastScroll = 0;
        const container = document.querySelector('.container');

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll) {
                // Scrolling down
                container.style.opacity = '0.95';
            } else {
                // Scrolling up
                container.style.opacity = '1';
            }
            
            lastScroll = currentScroll;
        });

        // Parallax scroll effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.profile-section, .social-links');
            
            parallaxElements.forEach((el, index) => {
                const speed = (index + 1) * 0.5;
                el.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
            });
        });
    },

    // ==================== TOGGLE EFFECTS ====================
    toggle(effectName, state) {
        this.config[effectName] = state;
        console.log(`Effect ${effectName} ${state ? 'enabled' : 'disabled'}`);
    }
};

// Auto-initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Effects.init());
} else {
    Effects.init();
}

// Export để có thể sử dụng
window.Effects = Effects;

