/**
 * Analytics and Performance Monitoring
 */

class Analytics {
    constructor() {
        this.events = [];
        this.performance = {
            pageLoad: null,
            domContentLoaded: null,
            firstPaint: null,
            firstContentfulPaint: null
        };
        this.init();
    }

    init() {
        this.trackPerformance();
        this.trackUserInteractions();
        this.trackErrors();
        this.trackPageViews();
    }

    trackPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    this.performance = {
                        pageLoad: perfData.loadEventEnd - perfData.fetchStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
                        firstPaint: this.getFirstPaint(),
                        firstContentfulPaint: this.getFirstContentfulPaint()
                    };

                    this.log('performance', {
                        ...this.performance,
                        timestamp: new Date().toISOString()
                    });
                }
            });
        }
    }

    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fpEntry = paintEntries.find(entry => entry.name === 'first-paint');
        return fpEntry ? fpEntry.startTime : null;
    }

    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcpEntry ? fcpEntry.startTime : null;
    }

    trackUserInteractions() {
        // Track clicks
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, .link-card');
            if (target) {
                const data = {
                    type: 'click',
                    element: target.tagName.toLowerCase(),
                    text: target.textContent?.trim().substring(0, 50),
                    href: target.href || target.getAttribute('href'),
                    timestamp: new Date().toISOString()
                };
                this.log('interaction', data);
            }
        }, true);

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                this.log('form_submit', {
                    formId: form.id || 'unknown',
                    formAction: form.action || 'unknown',
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        const trackScroll = Utils.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) {
                    this.log('scroll', {
                        depth: maxScroll,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        }, 1000);

        window.addEventListener('scroll', trackScroll);
    }

    trackErrors() {
        // Track JavaScript errors
        window.addEventListener('error', (e) => {
            this.log('error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack,
                timestamp: new Date().toISOString()
            });
        }, true);

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.log('error', {
                type: 'unhandled_promise_rejection',
                reason: e.reason?.toString(),
                timestamp: new Date().toISOString()
            });
        });
    }

    trackPageViews() {
        this.log('page_view', {
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
    }

    log(eventType, data) {
        const event = {
            type: eventType,
            data: data,
            timestamp: new Date().toISOString()
        };

        this.events.push(event);

        // Keep only last 100 events in memory
        if (this.events.length > 100) {
            this.events.shift();
        }

        // Store in localStorage (for demo purposes)
        try {
            const stored = JSON.parse(localStorage.getItem('bioLinkAnalytics') || '[]');
            stored.push(event);
            
            // Keep only last 500 events in storage
            if (stored.length > 500) {
                stored.splice(0, stored.length - 500);
            }
            
            localStorage.setItem('bioLinkAnalytics', JSON.stringify(stored));
        } catch (e) {
            console.warn('Failed to store analytics:', e);
        }

        // Console log in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('[Analytics]', eventType, data);
        }
    }

    getEvents(type = null, limit = 50) {
        let events = this.events;
        if (type) {
            events = events.filter(e => e.type === type);
        }
        return events.slice(-limit);
    }

    getStats() {
        const stats = {
            totalEvents: this.events.length,
            eventTypes: {},
            performance: this.performance,
            lastEvent: this.events[this.events.length - 1]
        };

        this.events.forEach(event => {
            stats.eventTypes[event.type] = (stats.eventTypes[event.type] || 0) + 1;
        });

        return stats;
    }

    exportData() {
        const data = {
            events: this.events,
            performance: this.performance,
            stats: this.getStats(),
            exportedAt: new Date().toISOString()
        };

        return JSON.stringify(data, null, 2);
    }

    clear() {
        this.events = [];
        localStorage.removeItem('bioLinkAnalytics');
    }
}

// Initialize analytics
if (typeof window !== 'undefined') {
    window.Analytics = new Analytics();
}

