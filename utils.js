/**
 * Utility Functions for Bio Link
 * Performance, Security, and UX improvements
 */

// ==================== PERFORMANCE OPTIMIZATION ====================

/**
 * Lazy load images
 */
function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * Preload critical resources
 */
function preloadResources() {
    const criticalResources = [
        { href: 'styles.css', as: 'style' },
        { href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', as: 'style' }
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.as === 'style') {
            link.rel = 'preload';
            link.onload = function() {
                this.rel = 'stylesheet';
            };
        }
        document.head.appendChild(link);
    });
}

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==================== SECURITY ====================

/**
 * Sanitize HTML to prevent XSS
 */
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate URL format
 */
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Escape HTML special characters
 */
function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ==================== TOAST NOTIFICATIONS ====================

class ToastManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create toast container
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        this.container.setAttribute('aria-live', 'polite');
        this.container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(this.container);

        // Add styles
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            }

            .toast {
                background: rgba(20, 20, 30, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                padding: 16px 20px;
                color: #ffffff;
                min-width: 300px;
                max-width: 400px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                animation: toastSlideIn 0.3s ease;
                pointer-events: auto;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .toast.success {
                border-left: 4px solid #22c55e;
            }

            .toast.error {
                border-left: 4px solid #ef4444;
            }

            .toast.warning {
                border-left: 4px solid #f59e0b;
            }

            .toast.info {
                border-left: 4px solid #3b82f6;
            }

            .toast-icon {
                font-size: 20px;
                flex-shrink: 0;
            }

            .toast.success .toast-icon {
                color: #22c55e;
            }

            .toast.error .toast-icon {
                color: #ef4444;
            }

            .toast.warning .toast-icon {
                color: #f59e0b;
            }

            .toast.info .toast-icon {
                color: #3b82f6;
            }

            .toast-content {
                flex: 1;
            }

            .toast-title {
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 4px;
            }

            .toast-message {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.8);
            }

            .toast-close {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                cursor: pointer;
                font-size: 18px;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
            }

            .toast-close:hover {
                color: #ffffff;
            }

            @keyframes toastSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes toastSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .toast.slide-out {
                animation: toastSlideOut 0.3s ease forwards;
            }

            @media (max-width: 768px) {
                .toast-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                }

                .toast {
                    min-width: auto;
                    max-width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    show(message, type = 'info', title = '', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info} toast-icon"></i>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${escapeHTML(title)}</div>` : ''}
                <div class="toast-message">${escapeHTML(message)}</div>
            </div>
            <button class="toast-close" aria-label="Đóng thông báo">
                <i class="fas fa-times"></i>
            </button>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        const closeToast = () => {
            toast.classList.add('slide-out');
            setTimeout(() => toast.remove(), 300);
        };

        closeBtn.addEventListener('click', closeToast);

        if (duration > 0) {
            setTimeout(closeToast, duration);
        }

        this.container.appendChild(toast);

        return toast;
    }

    success(message, title = 'Thành công') {
        return this.show(message, 'success', title);
    }

    error(message, title = 'Lỗi') {
        return this.show(message, 'error', title);
    }

    warning(message, title = 'Cảnh báo') {
        return this.show(message, 'warning', title);
    }

    info(message, title = 'Thông tin') {
        return this.show(message, 'info', title);
    }
}

// Initialize Toast Manager
const Toast = new ToastManager();

// ==================== LOADING STATES ====================

class LoadingManager {
    constructor() {
        this.loaders = new Map();
    }

    show(element, text = 'Đang tải...') {
        const loaderId = `loader-${Date.now()}-${Math.random()}`;
        
        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.id = loaderId;
        loader.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p class="loading-text">${escapeHTML(text)}</p>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                border-radius: inherit;
            }

            .loading-spinner {
                text-align: center;
            }

            .spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 255, 255, 0.2);
                border-top-color: #64c8ff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .loading-text {
                color: #ffffff;
                font-size: 14px;
                margin: 0;
            }
        `;
        if (!document.getElementById('loading-styles')) {
            style.id = 'loading-styles';
            document.head.appendChild(style);
        }

        const targetElement = typeof element === 'string' 
            ? document.querySelector(element) 
            : element;

        if (targetElement) {
            targetElement.style.position = 'relative';
            targetElement.appendChild(loader);
            this.loaders.set(loaderId, { element: targetElement, loader });
        }

        return loaderId;
    }

    hide(loaderId) {
        const loaderData = this.loaders.get(loaderId);
        if (loaderData) {
            loaderData.loader.remove();
            this.loaders.delete(loaderId);
        }
    }
}

const Loading = new LoadingManager();

// ==================== SKELETON SCREENS ====================

function createSkeleton(className = 'skeleton') {
    const skeleton = document.createElement('div');
    skeleton.className = className;
    
    const style = document.createElement('style');
    if (!document.getElementById('skeleton-styles')) {
        style.id = 'skeleton-styles';
        style.textContent = `
            .skeleton {
                background: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0.1) 0%,
                    rgba(255, 255, 255, 0.15) 50%,
                    rgba(255, 255, 255, 0.1) 100%
                );
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s ease-in-out infinite;
                border-radius: 8px;
            }

            @keyframes skeleton-loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            .skeleton-text {
                height: 16px;
                margin-bottom: 8px;
            }

            .skeleton-title {
                height: 24px;
                width: 60%;
                margin-bottom: 12px;
            }

            .skeleton-avatar {
                width: 80px;
                height: 80px;
                border-radius: 50%;
            }

            .skeleton-card {
                height: 100px;
                border-radius: 12px;
            }
        `;
        document.head.appendChild(style);
    }

    return skeleton;
}

// ==================== KEYBOARD SHORTCUTS ====================

class KeyboardShortcuts {
    constructor() {
        this.shortcuts = new Map();
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            const key = this.getKeyString(e);
            const handler = this.shortcuts.get(key);
            if (handler && !this.isInputFocused()) {
                e.preventDefault();
                handler();
            }
        });
    }

    getKeyString(e) {
        const parts = [];
        if (e.ctrlKey || e.metaKey) parts.push('ctrl');
        if (e.shiftKey) parts.push('shift');
        if (e.altKey) parts.push('alt');
        parts.push(e.key.toLowerCase());
        return parts.join('+');
    }

    isInputFocused() {
        const active = document.activeElement;
        return active && (
            active.tagName === 'INPUT' ||
            active.tagName === 'TEXTAREA' ||
            active.isContentEditable
        );
    }

    register(key, handler) {
        this.shortcuts.set(key, handler);
    }

    unregister(key) {
        this.shortcuts.delete(key);
    }
}

const Shortcuts = new KeyboardShortcuts();

// Register common shortcuts
Shortcuts.register('ctrl+k', () => {
    // Focus search if exists
    const searchInput = document.querySelector('input[type="search"], #search');
    if (searchInput) {
        searchInput.focus();
    }
});

// ==================== EXPORT ====================

if (typeof window !== 'undefined') {
    window.Utils = {
        lazyLoadImages,
        preloadResources,
        debounce,
        throttle,
        sanitizeHTML,
        isValidEmail,
        isValidURL,
        escapeHTML,
        Toast,
        Loading,
        createSkeleton,
        Shortcuts
    };
}

