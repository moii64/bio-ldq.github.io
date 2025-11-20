/**
 * Dark/Light Mode Toggle
 */

class ThemeToggle {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createToggleButton();
        this.listenToSystemTheme();
    }

    getStoredTheme() {
        return localStorage.getItem('colorScheme');
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('colorScheme', theme);
        this.currentTheme = theme;

        // Update meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = theme === 'dark' ? '#0f172a' : '#ffffff';
        }

        // Dispatch event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.updateToggleButton();
    }

    createToggleButton() {
        // Check if button already exists
        if (document.getElementById('theme-toggle-btn')) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle-btn';
        toggleBtn.className = 'theme-toggle-btn';
        toggleBtn.setAttribute('aria-label', 'Chuyển đổi chế độ sáng/tối');
        toggleBtn.setAttribute('title', 'Chuyển đổi chế độ sáng/tối (Ctrl+Shift+T)');
        this.updateToggleButtonContent(toggleBtn);

        toggleBtn.addEventListener('click', () => this.toggle());

        // Add to theme selector
        const themeSelector = document.querySelector('.theme-selector');
        if (themeSelector) {
            themeSelector.insertBefore(toggleBtn, themeSelector.firstChild);
        }

        // Keyboard shortcut
        Utils.Shortcuts.register('ctrl+shift+t', () => this.toggle());

        this.addStyles();
    }

    updateToggleButton() {
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) {
            this.updateToggleButtonContent(btn);
        }
    }

    updateToggleButtonContent(btn) {
        if (this.currentTheme === 'dark') {
            btn.innerHTML = '<i class="fas fa-sun"></i>';
            btn.title = 'Chuyển sang chế độ sáng';
        } else {
            btn.innerHTML = '<i class="fas fa-moon"></i>';
            btn.title = 'Chuyển sang chế độ tối';
        }
    }

    listenToSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('colorScheme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                    this.updateToggleButton();
                }
            });
        }
    }

    addStyles() {
        if (document.getElementById('theme-toggle-styles')) return;

        const style = document.createElement('style');
        style.id = 'theme-toggle-styles';
        style.textContent = `
            .theme-toggle-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 16px;
            }

            .theme-toggle-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1) rotate(15deg);
            }

            /* Light theme styles */
            [data-theme="light"] {
                --bg-color: #ffffff;
                --text-color: #1a1a2e;
                --card-bg: rgba(0, 0, 0, 0.05);
                --border-color: rgba(0, 0, 0, 0.1);
            }

            [data-theme="light"] body {
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                color: var(--text-color);
            }

            [data-theme="light"] .link-card,
            [data-theme="light"] .task-item,
            [data-theme="light"] .login-card,
            [data-theme="light"] .register-card {
                background: rgba(255, 255, 255, 0.9);
                color: var(--text-color);
                border-color: var(--border-color);
            }

            [data-theme="light"] .theme-toggle-btn {
                background: rgba(0, 0, 0, 0.1);
                border-color: rgba(0, 0, 0, 0.2);
                color: #1a1a2e;
            }

            [data-theme="light"] input,
            [data-theme="light"] textarea,
            [data-theme="light"] select {
                background: rgba(255, 255, 255, 0.9);
                color: var(--text-color);
                border-color: var(--border-color);
            }

            /* Smooth transition */
            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize theme toggle
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ThemeToggle = new ThemeToggle();
    });
} else {
    window.ThemeToggle = new ThemeToggle();
}

