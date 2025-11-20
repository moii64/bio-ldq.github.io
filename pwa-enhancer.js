/**
 * PWA Enhancement Features
 */

class PWAEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.addInstallPrompt();
        this.addUpdateNotification();
        this.addOfflineIndicator();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => {
                        console.log('Service Worker registered:', registration);
                        
                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    this.showUpdateNotification();
                                }
                            });
                        });
                    })
                    .catch(error => {
                        console.error('Service Worker registration failed:', error);
                    });

                // Listen for controller change (update available)
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    window.location.reload();
                });
            });
        }
    }

    addInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallButton();
        });

        // Show install button if already installable
        if (window.matchMedia('(display-mode: standalone)').matches) {
            // Already installed
            return;
        }

        // Check if app is installable
        if (deferredPrompt) {
            this.showInstallButton();
        }
    }

    showInstallButton() {
        // Check if button already exists
        if (document.getElementById('pwa-install-btn')) return;

        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-btn';
        installBtn.className = 'pwa-install-btn';
        installBtn.innerHTML = '<i class="fas fa-download"></i> <span>Cài đặt App</span>';
        installBtn.setAttribute('aria-label', 'Cài đặt ứng dụng');

        installBtn.addEventListener('click', async () => {
            if (window.deferredPrompt) {
                window.deferredPrompt.prompt();
                const { outcome } = await window.deferredPrompt.userChoice;
                console.log('User response to install prompt:', outcome);
                window.deferredPrompt = null;
                installBtn.remove();
            }
        });

        // Add to theme selector area
        const themeSelector = document.querySelector('.theme-selector');
        if (themeSelector) {
            themeSelector.appendChild(installBtn);
        }

        // Add styles
        this.addInstallButtonStyles();
    }

    addInstallButtonStyles() {
        if (document.getElementById('pwa-install-styles')) return;

        const style = document.createElement('style');
        style.id = 'pwa-install-styles';
        style.textContent = `
            .pwa-install-btn {
                background: rgba(34, 197, 94, 0.2);
                border: 1px solid rgba(34, 197, 94, 0.3);
                color: #22c55e;
                padding: 8px 16px;
                border-radius: 50px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 6px;
                white-space: nowrap;
            }

            .pwa-install-btn:hover {
                background: rgba(34, 197, 94, 0.3);
                transform: translateY(-2px);
            }

            .pwa-install-btn i {
                font-size: 14px;
            }

            @media (max-width: 768px) {
                .pwa-install-btn span {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addUpdateNotification() {
        // This will be called when update is available
    }

    showUpdateNotification() {
        if (typeof Utils !== 'undefined' && Utils.Toast) {
            const toast = Utils.Toast.info(
                'Có bản cập nhật mới! Nhấn để tải lại.',
                'Cập nhật',
                0 // Don't auto-close
            );

            toast.addEventListener('click', () => {
                window.location.reload();
            });
        }
    }

    addOfflineIndicator() {
        // Create offline indicator
        const indicator = document.createElement('div');
        indicator.id = 'offline-indicator';
        indicator.className = 'offline-indicator';
        indicator.innerHTML = '<i class="fas fa-wifi"></i> <span>Đang offline</span>';
        indicator.style.display = 'none';
        document.body.appendChild(indicator);

        // Listen for online/offline events
        window.addEventListener('online', () => {
            indicator.style.display = 'none';
            if (typeof Utils !== 'undefined' && Utils.Toast) {
                Utils.Toast.success('Đã kết nối lại internet');
            }
        });

        window.addEventListener('offline', () => {
            indicator.style.display = 'flex';
            if (typeof Utils !== 'undefined' && Utils.Toast) {
                Utils.Toast.warning('Đã mất kết nối internet', 'Offline');
            }
        });

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .offline-indicator {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(245, 158, 11, 0.9);
                color: #ffffff;
                padding: 12px 24px;
                border-radius: 50px;
                display: flex;
                align-items: center;
                gap: 8px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }

            .offline-indicator i {
                font-size: 16px;
            }
        `;
        document.head.appendChild(style);
    }

    // Request notification permission
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    Utils.Toast.success('Đã bật thông báo');
                }
            });
        }
    }

    // Show notification
    showNotification(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });
        }
    }
}

// Initialize PWA Enhancer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.PWAEnhancer = new PWAEnhancer();
    });
} else {
    window.PWAEnhancer = new PWAEnhancer();
}

