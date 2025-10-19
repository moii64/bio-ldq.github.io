// ==================== ASSISTIVE TOUCH ====================
// Floating control button for all effects
// Inspired by iOS AssistiveTouch

class AssistiveTouch {
    constructor() {
        this.button = null;
        this.menu = null;
        this.isOpen = false;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        
        // Double tap detection
        this.lastTapTime = 0;
        this.doubleTapDelay = 300; // ms
        
        // Initialize settings FIRST
        this.settings = this.getDefaultSettings();
        const saved = localStorage.getItem('assistiveTouch_settings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                console.log('📦 Loaded settings from localStorage');
            } catch (e) {
                console.error('Failed to load settings:', e);
            }
        }
        
        this.init();
    }
    
    init() {
        this.createButton();
        this.createMenu();
        this.loadPosition();
        this.attachEventListeners();
        this.attachKeyboardShortcuts();
        this.applySettings();
        
        // Welcome message disabled for cleaner UX
        // setTimeout(() => {
        //     this.showToast('Ctrl+Shift+E to open menu');
        // }, 3000);
    }
    
    // Create floating button
    createButton() {
        this.button = document.createElement('div');
        this.button.className = 'assistive-touch-btn';
        this.button.innerHTML = `
            <div class="at-icon">
                <i class="fas fa-magic"></i>
            </div>
        `;
        document.body.appendChild(this.button);
    }
    
    // Create popup menu
    createMenu() {
        this.menu = document.createElement('div');
        this.menu.className = 'assistive-touch-menu';
        this.menu.innerHTML = `
            <div class="at-menu-header">
                <span>⚡ Điều khiển</span>
                <button class="at-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="at-menu-body">
                <!-- Seasonal Themes Control -->
                <div class="at-section">
                    <div class="at-section-title">🌈 Seasonal Themes</div>
                    <div class="seasonal-control-grid">
                        <button class="season-btn" data-season="spring" title="Spring">
                            🌸
                        </button>
                        <button class="season-btn" data-season="summer" title="Summer">
                            ☀️
                        </button>
                        <button class="season-btn" data-season="fall" title="Fall">
                            🍂
                        </button>
                        <button class="season-btn" data-season="winter" title="Winter">
                            ❄️
                        </button>
                    </div>
                    <div class="at-option" style="margin-top: 10px;">
                        <label>
                            <input type="checkbox" id="autoTimeToggle" ${this.settings && this.settings.autoTime !== false ? 'checked' : ''}>
                            <span>🕐 Auto Time</span>
                        </label>
                    </div>
                </div>

                <!-- Color Themes -->
                <div class="at-section">
                    <div class="at-section-title">🎨 Color Themes</div>
                    <div class="theme-control-grid">
                        <button class="theme-select-btn" data-theme="gradient" title="Gradient">
                            <span class="theme-icon">🌈</span>
                            <span class="theme-name">Gradient</span>
                        </button>
                        <button class="theme-select-btn" data-theme="glassmorphism" title="Glassmorphism">
                            <span class="theme-icon">💎</span>
                            <span class="theme-name">Glass</span>
                        </button>
                        <button class="theme-select-btn" data-theme="neon" title="Neon Dark">
                            <span class="theme-icon">⚡</span>
                            <span class="theme-name">Neon</span>
                        </button>
                        <button class="theme-select-btn" data-theme="minimal" title="Minimal Clean">
                            <span class="theme-icon">⚪</span>
                            <span class="theme-name">Minimal</span>
                        </button>
                        <button class="theme-select-btn" data-theme="nature" title="Nature Green">
                            <span class="theme-icon">🍃</span>
                            <span class="theme-name">Nature</span>
                        </button>
                        <button class="theme-select-btn" data-theme="sunset" title="Sunset Orange">
                            <span class="theme-icon">🌅</span>
                            <span class="theme-name">Sunset</span>
                        </button>
                    </div>
                </div>
                
                <!-- Mouse Effects -->
                <div class="at-section">
                    <div class="at-section-title">🖱️ Hiệu ứng chuột</div>
                    <div class="at-option">
                        <label>
                            <input type="checkbox" data-effect="customCursor" ${this.settings.customCursor ? 'checked' : ''}>
                            <span>Custom Cursor</span>
                        </label>
                    </div>
                    <div class="at-option">
                        <label>
                            <input type="checkbox" data-effect="mouseTrail" ${this.settings.mouseTrail ? 'checked' : ''}>
                            <span>Mouse Trail</span>
                        </label>
                    </div>
                    <div class="at-option">
                        <label>
                            <input type="checkbox" data-effect="globalTilt" ${this.settings.globalTilt ? 'checked' : ''}>
                            <span>3D Tilt (Desktop)</span>
                        </label>
                    </div>
                    <div class="at-option">
                        <label>
                            <input type="checkbox" data-effect="mobileTilt" ${this.settings.mobileTilt ? 'checked' : ''}>
                            <span>Gyroscope (Mobile)</span>
                        </label>
                    </div>
                    <div class="at-option">
                        <label>
                            <input type="checkbox" data-effect="scrollReveal" ${this.settings.scrollReveal ? 'checked' : ''}>
                            <span>Scroll Reveal</span>
                        </label>
                    </div>
                </div>
                
                <!-- Particles -->
                <div class="at-section">
                    <div class="at-section-title">✨ Particles</div>
                    <div class="at-option">
                        <label>
                            <input type="checkbox" data-effect="floatingShapes" ${this.settings.floatingShapes ? 'checked' : ''}>
                            <span>Floating Shapes</span>
                        </label>
                    </div>
                    <div class="at-option">
                        <label>
                            <input type="checkbox" data-effect="seasonalEffects" ${this.settings.seasonalEffects ? 'checked' : ''}>
                            <span>Seasonal Effects</span>
                        </label>
                    </div>
                </div>
                
                <!-- Card Effects -->
                <div class="at-section">
                    <div class="at-section-title">💳 Card Effects</div>
                    <div class="at-option">
                        <label>
                            <input type="checkbox" data-effect="rippleEffect" ${this.settings.rippleEffect ? 'checked' : ''}>
                            <span>Ripple on Click</span>
                        </label>
                    </div>
                    <div class="at-option">
                        <label>
                            <input type="checkbox" data-effect="cardSlide" ${this.settings.cardSlide ? 'checked' : ''}>
                            <span>Card Slide</span>
                        </label>
                    </div>
                </div>
                
                <!-- Performance -->
                <div class="at-section">
                    <div class="at-section-title">⚙️ Performance</div>
                    <div class="at-option">
                        <label>
                            <select data-setting="quality" class="at-select">
                                <option value="high" ${this.settings.quality === 'high' ? 'selected' : ''}>High Quality</option>
                                <option value="medium" ${this.settings.quality === 'medium' ? 'selected' : ''}>Medium</option>
                                <option value="low" ${this.settings.quality === 'low' ? 'selected' : ''}>Low (Battery Save)</option>
                            </select>
                        </label>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="at-actions">
                    <button class="at-btn at-btn-primary" data-action="applyAll">
                        <i class="fas fa-check"></i> Áp dụng
                    </button>
                    <button class="at-btn at-btn-secondary" data-action="resetAll">
                        <i class="fas fa-undo"></i> Reset
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(this.menu);
    }
    
    // Attach event listeners
    attachEventListeners() {
        // Button click with double tap detection
        this.button.addEventListener('click', (e) => {
            if (!this.isDragging) {
                const currentTime = Date.now();
                const timeDiff = currentTime - this.lastTapTime;
                
                if (timeDiff < this.doubleTapDelay) {
                    // Double tap detected
                    this.handleDoubleTap();
                } else {
                    // Single tap
                    this.toggleMenu();
                }
                
                this.lastTapTime = currentTime;
            }
        });
        
        // Button drag
        this.button.addEventListener('mousedown', this.onDragStart.bind(this));
        this.button.addEventListener('touchstart', this.onDragStart.bind(this));
        
        document.addEventListener('mousemove', this.onDragMove.bind(this));
        document.addEventListener('touchmove', this.onDragMove.bind(this));
        
        document.addEventListener('mouseup', this.onDragEnd.bind(this));
        document.addEventListener('touchend', this.onDragEnd.bind(this));
        
        // Close button
        const closeBtn = this.menu.querySelector('.at-close');
        closeBtn.addEventListener('click', () => this.closeMenu());
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.menu.contains(e.target) && 
                !this.button.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Effect toggles
        const checkboxes = this.menu.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', (e) => {
                const effect = e.target.dataset.effect;
                this.settings[effect] = e.target.checked;
                this.toggleEffect(effect, e.target.checked);
            });
        });
        
        // Quality select
        const qualitySelect = this.menu.querySelector('select[data-setting="quality"]');
        qualitySelect.addEventListener('change', (e) => {
            this.settings.quality = e.target.value;
            this.applyQuality(e.target.value);
        });
        
        // Seasonal buttons
        const seasonBtns = this.menu.querySelectorAll('.season-btn');
        seasonBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const season = e.currentTarget.dataset.season;
                // Trigger seasonal change
                if (window.SeasonalEffects) {
                    window.SeasonalEffects.changeSeason(season);
                }
                
                // Save to settings
                this.settings.selectedSeason = season;
                this.saveSettings();
                
                // Subtle feedback (disabled by default)
                // this.showToast(`${season}`);
            });
        });
        
        // Auto time toggle
        const autoTimeToggle = this.menu.querySelector('#autoTimeToggle');
        if (autoTimeToggle) {
            autoTimeToggle.addEventListener('change', (e) => {
                this.settings.autoTime = e.target.checked;
                if (window.SeasonalEffects) {
                    window.SeasonalEffects.toggleAutoTime(e.target.checked);
                }
                this.saveSettings();
            });
        }

        // Theme selector buttons
        const themeButtons = this.menu.querySelectorAll('.theme-select-btn');
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                
                // Remove active class from all
                themeButtons.forEach(b => b.classList.remove('active'));
                
                // Add active to clicked
                btn.classList.add('active');
                
                // Change theme
                if (window.changeTheme) {
                    window.changeTheme(theme);
                } else if (typeof changeTheme === 'function') {
                    changeTheme(theme);
                } else {
                    // Fallback: manually change theme
                    document.body.className = `theme-${theme}`;
                    localStorage.setItem('selectedTheme', theme);
                }
                
                // Save to settings
                this.settings.selectedTheme = theme;
                this.saveSettings();
                
                // Show subtle toast (optional - comment out to disable)
                // this.showToast(`${btn.querySelector('.theme-name').textContent}`);
            });
        });

        // Set active theme on load
        const currentTheme = localStorage.getItem('selectedTheme') || 'gradient';
        const activeThemeBtn = this.menu.querySelector(`.theme-select-btn[data-theme="${currentTheme}"]`);
        if (activeThemeBtn) {
            activeThemeBtn.classList.add('active');
        }
        
        // Action buttons
        const applyBtn = this.menu.querySelector('[data-action="applyAll"]');
        applyBtn.addEventListener('click', () => {
            this.saveSettings();
            // this.showToast('Saved'); // Disabled - auto-save enabled
            this.closeMenu();
        });
        
        const resetBtn = this.menu.querySelector('[data-action="resetAll"]');
        resetBtn.addEventListener('click', () => {
            if (confirm('Reset all settings to default?')) {
                this.resetSettings();
                this.showToast('Reset');
            }
        });
    }
    
    // Drag handlers
    onDragStart(e) {
        this.isDragging = true;
        const touch = e.type === 'touchstart' ? e.touches[0] : e;
        this.startX = touch.clientX - this.offsetX;
        this.startY = touch.clientY - this.offsetY;
        this.button.style.transition = 'none';
    }
    
    onDragMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const touch = e.type === 'touchmove' ? e.touches[0] : e;
        this.offsetX = touch.clientX - this.startX;
        this.offsetY = touch.clientY - this.startY;
        
        // Keep within viewport
        const maxX = window.innerWidth - this.button.offsetWidth;
        const maxY = window.innerHeight - this.button.offsetHeight;
        
        this.offsetX = Math.max(0, Math.min(this.offsetX, maxX));
        this.offsetY = Math.max(0, Math.min(this.offsetY, maxY));
        
        this.button.style.left = this.offsetX + 'px';
        this.button.style.top = this.offsetY + 'px';
        this.button.style.right = 'auto';
        this.button.style.bottom = 'auto';
    }
    
    onDragEnd(e) {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.button.style.transition = '';
        this.savePosition();
        
        // Snap to edge
        setTimeout(() => {
            this.snapToEdge();
        }, 100);
    }
    
    snapToEdge() {
        const rect = this.button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        
        if (centerX < window.innerWidth / 2) {
            // Snap to left
            this.button.style.left = '20px';
        } else {
            // Snap to right
            this.button.style.left = 'auto';
            this.button.style.right = '20px';
        }
        
        this.savePosition();
    }
    
    // Toggle menu
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.menu.classList.add('at-menu-open');
        this.button.classList.add('at-btn-active');
        
        // Position menu near button
        const btnRect = this.button.getBoundingClientRect();
        const menuWidth = 300;
        const menuHeight = 500;
        
        let left = btnRect.right + 10;
        let top = btnRect.top;
        
        // Adjust if off screen
        if (left + menuWidth > window.innerWidth) {
            left = btnRect.left - menuWidth - 10;
        }
        if (top + menuHeight > window.innerHeight) {
            top = window.innerHeight - menuHeight - 20;
        }
        if (top < 20) top = 20;
        
        this.menu.style.left = left + 'px';
        this.menu.style.top = top + 'px';
    }
    
    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('at-menu-open');
        this.button.classList.remove('at-btn-active');
    }
    
    // Toggle effects
    toggleEffect(effect, enabled) {
        const body = document.body;
        
        switch(effect) {
            case 'customCursor':
                body.classList.toggle('cursor-disabled', !enabled);
                break;
                
            case 'mouseTrail':
                body.classList.toggle('trail-disabled', !enabled);
                break;
                
            case 'globalTilt':
                body.classList.toggle('tilt-disabled', !enabled);
                if (window.globalTiltEnabled !== undefined) {
                    window.globalTiltEnabled = enabled;
                }
                break;
                
            case 'mobileTilt':
                body.classList.toggle('mobile-tilt-disabled', !enabled);
                if (window.mobileTiltEnabled !== undefined) {
                    window.mobileTiltEnabled = enabled;
                }
                break;
                
            case 'scrollReveal':
                this.toggleScrollReveal(enabled);
                break;
                
            case 'floatingShapes':
                body.classList.toggle('shapes-disabled', !enabled);
                break;
                
            case 'seasonalEffects':
                body.classList.toggle('seasonal-disabled', !enabled);
                break;
                
            case 'rippleEffect':
                body.classList.toggle('ripple-disabled', !enabled);
                break;
                
            case 'cardSlide':
                body.classList.toggle('slide-disabled', !enabled);
                break;
        }
    }
    
    // Apply quality setting
    applyQuality(quality) {
        const body = document.body;
        body.classList.remove('quality-high', 'quality-medium', 'quality-low');
        body.classList.add(`quality-${quality}`);
        
        // Adjust particle counts based on quality
        if (window.SeasonalEffects) {
            const counts = {
                high: { default: 50 },
                medium: { default: 30 },
                low: { default: 15 }
            };
            // Update particle counts if needed
        }
    }
    
    // Apply all settings
    applySettings() {
        Object.keys(this.settings).forEach(key => {
            if (key === 'quality') {
                this.applyQuality(this.settings[key]);
            } else if (typeof this.settings[key] === 'boolean') {
                this.toggleEffect(key, this.settings[key]);
            }
        });
    }
    
    // Reset settings
    resetSettings() {
        this.settings = this.getDefaultSettings();
        this.saveSettings();
        this.showToast('Reset');
        setTimeout(() => location.reload(), 1000);
    }
    
    // Get default settings
    getDefaultSettings() {
        return {
            customCursor: true,
            mouseTrail: true,
            globalTilt: true,
            mobileTilt: true,
            scrollReveal: true,
            floatingShapes: true,
            seasonalEffects: true,
            rippleEffect: true,
            cardSlide: true,
            quality: 'high',
            autoTime: true,
            selectedTheme: 'gradient',
            selectedSeason: 'auto'
        };
    }
    
    // Save/Load settings
    saveSettings() {
        localStorage.setItem('assistiveTouch_settings', JSON.stringify(this.settings));
    }
    
    loadSettings() {
        // Settings already loaded in constructor
        // Apply saved settings on page load (after UI is ready)
        setTimeout(() => this.applyAllSettings(), 1000);
    }
    
    applyAllSettings() {
        // Apply theme
        if (this.settings.selectedTheme && window.changeTheme) {
            window.changeTheme(this.settings.selectedTheme);
            const themeBtn = this.menu.querySelector(`.theme-select-btn[data-theme="${this.settings.selectedTheme}"]`);
            if (themeBtn) {
                this.menu.querySelectorAll('.theme-select-btn').forEach(b => b.classList.remove('active'));
                themeBtn.classList.add('active');
            }
        }
        
        // Apply season
        if (this.settings.selectedSeason && this.settings.selectedSeason !== 'auto' && window.SeasonalEffects) {
            window.SeasonalEffects.changeSeason(this.settings.selectedSeason);
        }
        
        // Apply all effect toggles
        Object.keys(this.settings).forEach(key => {
            if (typeof this.settings[key] === 'boolean') {
                const checkbox = this.menu.querySelector(`input[type="checkbox"][data-effect="${key}"]`);
                if (checkbox) {
                    checkbox.checked = this.settings[key];
                }
                this.toggleEffect(key, this.settings[key]);
            }
        });
        
        // Apply quality
        if (this.settings.quality) {
            const qualitySelect = this.menu.querySelector('#qualitySelect');
            if (qualitySelect) {
                qualitySelect.value = this.settings.quality;
            }
            this.applyQuality(this.settings.quality);
        }
        
        console.log('✅ All settings applied from localStorage:', this.settings);
    }
    
    savePosition() {
        const style = window.getComputedStyle(this.button);
        const position = {
            left: style.left,
            top: style.top,
            right: style.right,
            bottom: style.bottom
        };
        localStorage.setItem('assistiveTouch_position', JSON.stringify(position));
    }
    
    loadPosition() {
        const saved = localStorage.getItem('assistiveTouch_position');
        if (saved) {
            const position = JSON.parse(saved);
            Object.assign(this.button.style, position);
        }
    }
    
    // Keyboard shortcuts
    attachKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + E → Toggle menu
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                this.toggleMenu();
                // No toast - keyboard shortcut is silent
            }
            
            // Ctrl/Cmd + Shift + R → Reset settings
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'r') {
                e.preventDefault();
                if (confirm('🔄 Reset tất cả về mặc định?\n\n✅ Shortcuts:\n• Ctrl+Shift+E: Toggle menu\n• Ctrl+Shift+R: Reset settings\n• Double tap button: Toggle all effects')) {
                    this.resetSettings();
                }
            }
            
            // ESC → Close menu
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    // Toggle Scroll Reveal Effect
    toggleScrollReveal(enabled) {
        const cards = document.querySelectorAll('.link-card');
        
        if (enabled) {
            // Add scroll reveal
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease';
            });
            
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            this.scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            cards.forEach(card => this.scrollObserver.observe(card));
        } else {
            // Remove scroll reveal
            if (this.scrollObserver) {
                cards.forEach(card => this.scrollObserver.unobserve(card));
                this.scrollObserver.disconnect();
            }
            cards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }
    }
    
    // Double tap handler
    handleDoubleTap() {
        const allEnabled = Object.keys(this.settings)
            .filter(key => typeof this.settings[key] === 'boolean')
            .every(key => this.settings[key]);
        
        const newState = !allEnabled;
        
        // Toggle all boolean settings
        Object.keys(this.settings).forEach(key => {
            if (typeof this.settings[key] === 'boolean') {
                this.settings[key] = newState;
                this.toggleEffect(key, newState);
            }
        });
        
        // Update checkboxes in menu
        const checkboxes = this.menu.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = newState;
        });
        
        // Save settings
        this.saveSettings();
        
        // Visual feedback only (no toast)
        if (newState) {
            this.button.style.animation = 'pulse-glow 1s ease-out';
        } else {
            this.button.style.animation = 'none';
        }
        
        setTimeout(() => {
            this.button.style.animation = '';
        }, 1000);
    }
    
    // Toast notification
    // Show toast notification - Modern & Subtle
    showToast(message, duration = 1500) {
        // Remove existing toasts
        document.querySelectorAll('.at-toast').forEach(t => t.remove());
        
        const toast = document.createElement('div');
        toast.className = 'at-toast';
        toast.innerHTML = `
            <div class="at-toast-content">
                <span class="at-toast-icon">✓</span>
                <span class="at-toast-message">${message}</span>
            </div>
        `;
        document.body.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('at-toast-show');
        });
        
        // Auto hide
        setTimeout(() => {
            toast.classList.remove('at-toast-show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// Initialize AssistiveTouch
document.addEventListener('DOMContentLoaded', () => {
    window.assistiveTouch = new AssistiveTouch();
});

