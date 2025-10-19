// ==================== THEME MANAGEMENT ====================
const themeButtons = document.querySelectorAll('.theme-btn');
const body = document.body;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('bioTheme') || 'gradient';
applyTheme(savedTheme);

// Theme button click handlers
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme');
        applyTheme(theme);
        localStorage.setItem('bioTheme', theme);
        
        // Add click animation
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    });
});

function applyTheme(theme) {
    // Remove all theme classes more explicitly
    body.classList.remove('theme-glassmorphism', 'theme-neon', 'theme-minimal', 'theme-nature', 'theme-sunset');
    
    // Add new theme class (gradient is default, no class needed)
    if (theme !== 'gradient') {
        body.classList.add(`theme-${theme}`);
    }
    
    // Update active button
    themeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === theme) {
            btn.classList.add('active');
        }
    });
    
    // Save to localStorage
    localStorage.setItem('bioTheme', theme);
    
    console.log(`🎨 Theme changed to: ${theme}`, {
        classList: body.className,
        hasClass: body.classList.contains(`theme-${theme}`)
    });
}

// Make changeTheme available globally for AssistiveTouch
window.changeTheme = applyTheme;

// ==================== LINK ANIMATIONS ====================
const linkCards = document.querySelectorAll('.link-card');

// Add hover sound effect (optional - can be enabled)
linkCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // You can add sound here if desired
        // new Audio('hover.mp3').play();
    });
    
    // Add ripple effect on click
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .link-card {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all link cards
linkCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `all 0.5s ease ${index * 0.1}s`;
    observer.observe(card);
});

// ==================== PROFILE IMAGE CLICK ====================
const profileImg = document.getElementById('profileImg');
const profileImage = document.querySelector('.profile-image');

profileImage.addEventListener('click', () => {
    profileImg.style.animation = 'none';
    setTimeout(() => {
        profileImg.style.animation = 'bounceIn 1s ease';
    }, 10);
});

// ==================== SOCIAL LINKS ANIMATION ====================
const socialIcons = document.querySelectorAll('.social-icon');

socialIcons.forEach((icon, index) => {
    icon.style.opacity = '0';
    icon.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        icon.style.transition = 'all 0.5s ease';
        icon.style.opacity = '1';
        icon.style.transform = 'translateY(0)';
    }, 300 + (index * 50));
});

// ==================== PARTICLE EFFECT (OPTIONAL) ====================
// Uncomment to enable particle effect background

/*
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 5000);
}

// Create particles periodically
setInterval(createParticle, 300);

// Add particle CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    .particle {
        position: fixed;
        bottom: -10px;
        width: 10px;
        height: 10px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        animation: floatUp 5s ease-in infinite;
        z-index: -1;
    }
    
    @keyframes floatUp {
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);
*/

// ==================== KEYBOARD NAVIGATION ====================
document.addEventListener('keydown', (e) => {
    // Press 1-5 to switch themes
    const themeKeys = {
        '1': 'gradient',
        '2': 'glassmorphism',
        '3': 'neon',
        '4': 'minimal',
        '5': 'nature'
    };
    
    if (themeKeys[e.key]) {
        applyTheme(themeKeys[e.key]);
        localStorage.setItem('bioTheme', themeKeys[e.key]);
    }
});

// ==================== PERFORMANCE MONITORING ====================
// Log page load time
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`✨ Page loaded in ${loadTime.toFixed(2)}ms`);
});

// ==================== COPY LINK FUNCTIONALITY ====================
// Add a secret feature: Double click on profile name to copy URL
document.querySelector('.profile-name').addEventListener('dblclick', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        // Show tooltip
        const tooltip = document.createElement('div');
        tooltip.textContent = '✓ Link copied!';
        tooltip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(16, 185, 129, 0.9);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 10000;
            animation: fadeInOut 2s ease;
        `;
        document.body.appendChild(tooltip);
        
        setTimeout(() => tooltip.remove(), 2000);
    });
});

// Add animation for tooltip
const tooltipStyle = document.createElement('style');
tooltipStyle.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        10%, 90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
`;
document.head.appendChild(tooltipStyle);

// ==================== ANALYTICS (OPTIONAL) ====================
// Track link clicks
linkCards.forEach(card => {
    card.addEventListener('click', () => {
        const linkTitle = card.querySelector('.link-title').textContent;
        console.log(`📊 Link clicked: ${linkTitle}`);
        
        // You can send this to your analytics service
        // Example: gtag('event', 'click', { 'link_title': linkTitle });
    });
});

// ==================== EASTER EGG ====================
// Type "rainbow" to enable rainbow mode
let secretCode = '';
const secret = 'rainbow';

document.addEventListener('keypress', (e) => {
    secretCode += e.key;
    if (secretCode.includes(secret)) {
        enableRainbowMode();
        secretCode = '';
    }
    if (secretCode.length > 10) {
        secretCode = secretCode.slice(-10);
    }
});

function enableRainbowMode() {
    const rainbowStyle = document.createElement('style');
    rainbowStyle.id = 'rainbow-mode';
    rainbowStyle.textContent = `
        body::before {
            animation: rainbow 3s linear infinite !important;
        }
        
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        
        .link-card {
            animation: rainbow 3s linear infinite !important;
        }
    `;
    
    if (!document.getElementById('rainbow-mode')) {
        document.head.appendChild(rainbowStyle);
        console.log('🌈 Rainbow mode activated!');
        
        // Disable after 10 seconds
        setTimeout(() => {
            rainbowStyle.remove();
        }, 10000);
    }
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== WELCOME MESSAGE ====================
console.log(`
╔═══════════════════════════════════════╗
║   🎨 Bio Link Page - Modern Theme    ║
║   Made with ❤️                       ║
║                                       ║
║   Keyboard Shortcuts:                 ║
║   1-5: Switch themes                  ║
║   Type "rainbow": Secret mode 🌈      ║
║   Double-click name: Copy link        ║
╚═══════════════════════════════════════╝
`);

