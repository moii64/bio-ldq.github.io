/**
 * Search Functionality for Bio Link
 */

class SearchManager {
    constructor() {
        this.searchInput = null;
        this.searchResults = null;
        this.searchOverlay = null;
        this.init();
    }

    init() {
        this.createSearchUI();
        this.setupKeyboardShortcut();
    }

    createSearchUI() {
        // Create search button
        const searchBtn = document.createElement('button');
        searchBtn.className = 'search-button';
        searchBtn.setAttribute('aria-label', 'Tìm kiếm');
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        searchBtn.title = 'Tìm kiếm (Ctrl+K)';
        
        // Add to theme selector area
        const themeSelector = document.querySelector('.theme-selector');
        if (themeSelector) {
            themeSelector.insertBefore(searchBtn, themeSelector.firstChild);
        }

        // Create search overlay
        this.searchOverlay = document.createElement('div');
        this.searchOverlay.className = 'search-overlay';
        this.searchOverlay.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <div class="search-input-wrapper">
                        <i class="fas fa-search search-icon"></i>
                        <input 
                            type="search" 
                            id="searchInput" 
                            class="search-input" 
                            placeholder="Tìm kiếm..." 
                            autocomplete="off"
                            aria-label="Tìm kiếm"
                        >
                        <button class="search-close" aria-label="Đóng tìm kiếm">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="search-results" id="searchResults" role="listbox">
                    <div class="search-empty">
                        <i class="fas fa-search"></i>
                        <p>Nhập từ khóa để tìm kiếm</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.searchOverlay);

        // Add styles
        this.addStyles();

        // Event listeners
        searchBtn.addEventListener('click', () => this.open());
        this.searchOverlay.querySelector('.search-close').addEventListener('click', () => this.close());
        this.searchOverlay.addEventListener('click', (e) => {
            if (e.target === this.searchOverlay) {
                this.close();
            }
        });

        this.searchInput = this.searchOverlay.querySelector('#searchInput');
        this.searchResults = this.searchOverlay.querySelector('#searchResults');

        // Search input handler
        this.searchInput.addEventListener('input', Utils.debounce((e) => {
            this.performSearch(e.target.value);
        }, 300));

        // Keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            } else if (e.key === 'Enter') {
                const firstResult = this.searchResults.querySelector('.search-result-item');
                if (firstResult) {
                    firstResult.click();
                }
            }
        });
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .search-button {
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

            .search-button:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }

            .search-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                z-index: 10000;
                display: none;
                align-items: flex-start;
                justify-content: center;
                padding-top: 10vh;
                animation: fadeIn 0.3s ease;
            }

            .search-overlay.active {
                display: flex;
            }

            .search-container {
                width: 100%;
                max-width: 600px;
                background: rgba(20, 20, 30, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(100, 200, 255, 0.3);
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: slideDown 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .search-header {
                padding: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .search-input-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }

            .search-icon {
                position: absolute;
                left: 16px;
                color: rgba(255, 255, 255, 0.6);
                font-size: 18px;
                pointer-events: none;
            }

            .search-input {
                width: 100%;
                padding: 14px 50px 14px 50px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                color: #ffffff;
                font-size: 16px;
                font-family: inherit;
                transition: all 0.3s ease;
            }

            .search-input:focus {
                outline: none;
                border-color: #64c8ff;
                background: rgba(255, 255, 255, 0.08);
                box-shadow: 0 0 0 3px rgba(100, 200, 255, 0.1);
            }

            .search-close {
                position: absolute;
                right: 16px;
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                cursor: pointer;
                font-size: 18px;
                padding: 8px;
                transition: color 0.3s;
            }

            .search-close:hover {
                color: #ffffff;
            }

            .search-results {
                max-height: 400px;
                overflow-y: auto;
                padding: 10px;
            }

            .search-empty {
                text-align: center;
                padding: 40px 20px;
                color: rgba(255, 255, 255, 0.6);
            }

            .search-empty i {
                font-size: 48px;
                margin-bottom: 16px;
                opacity: 0.5;
            }

            .search-result-item {
                padding: 12px 16px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-bottom: 4px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .search-result-item:hover,
            .search-result-item:focus {
                background: rgba(100, 200, 255, 0.1);
                transform: translateX(4px);
            }

            .search-result-icon {
                width: 40px;
                height: 40px;
                background: rgba(100, 200, 255, 0.2);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #64c8ff;
                flex-shrink: 0;
            }

            .search-result-content {
                flex: 1;
            }

            .search-result-title {
                font-weight: 600;
                font-size: 14px;
                color: #ffffff;
                margin-bottom: 4px;
            }

            .search-result-description {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
            }

            .search-result-arrow {
                color: rgba(255, 255, 255, 0.4);
                font-size: 14px;
            }

            .search-highlight {
                background: rgba(100, 200, 255, 0.3);
                padding: 2px 4px;
                border-radius: 4px;
                font-weight: 600;
            }

            @media (max-width: 768px) {
                .search-overlay {
                    padding-top: 5vh;
                }

                .search-container {
                    margin: 0 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupKeyboardShortcut() {
        Utils.Shortcuts.register('ctrl+k', () => {
            this.open();
        });
    }

    open() {
        this.searchOverlay.classList.add('active');
        this.searchInput.focus();
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.searchOverlay.classList.remove('active');
        this.searchInput.value = '';
        this.searchResults.innerHTML = `
            <div class="search-empty">
                <i class="fas fa-search"></i>
                <p>Nhập từ khóa để tìm kiếm</p>
            </div>
        `;
        document.body.style.overflow = '';
    }

    performSearch(query) {
        if (!query || query.trim().length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-empty">
                    <i class="fas fa-search"></i>
                    <p>Nhập từ khóa để tìm kiếm</p>
                </div>
            `;
            return;
        }

        const results = this.searchContent(query.toLowerCase().trim());
        this.displayResults(results, query);
    }

    searchContent(query) {
        const results = [];

        // Search in links
        const linkCards = document.querySelectorAll('.link-card');
        linkCards.forEach(card => {
            const title = card.querySelector('.link-title')?.textContent || '';
            const subtitle = card.querySelector('.link-subtitle')?.textContent || '';
            const href = card.getAttribute('href') || '';

            if (title.toLowerCase().includes(query) || 
                subtitle.toLowerCase().includes(query)) {
                results.push({
                    type: 'link',
                    title: title,
                    description: subtitle,
                    url: href,
                    icon: 'fa-link'
                });
            }
        });

        // Search in tasks
        const taskItems = document.querySelectorAll('.task-item');
        taskItems.forEach(item => {
            const title = item.querySelector('.task-title')?.textContent || '';
            const description = item.querySelector('.task-description')?.textContent || '';

            if (title.toLowerCase().includes(query) || 
                description.toLowerCase().includes(query)) {
                results.push({
                    type: 'task',
                    title: title,
                    description: description,
                    url: '#',
                    icon: 'fa-tasks'
                });
            }
        });

        // Search in profile
        const profileName = document.querySelector('.profile-name')?.textContent || '';
        const profileBio = document.querySelector('.profile-bio')?.textContent || '';

        if (profileName.toLowerCase().includes(query) || 
            profileBio.toLowerCase().includes(query)) {
            results.push({
                type: 'profile',
                title: profileName,
                description: profileBio,
                url: '#profile',
                icon: 'fa-user'
            });
        }

        return results;
    }

    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-empty">
                    <i class="fas fa-search"></i>
                    <p>Không tìm thấy kết quả cho "${Utils.escapeHTML(query)}"</p>
                </div>
            `;
            return;
        }

        this.searchResults.innerHTML = results.map(result => {
            const highlightedTitle = this.highlightText(result.title, query);
            const highlightedDesc = this.highlightText(result.description, query);

            return `
                <div class="search-result-item" role="option" tabindex="0">
                    <div class="search-result-icon">
                        <i class="fas ${result.icon}"></i>
                    </div>
                    <div class="search-result-content">
                        <div class="search-result-title">${highlightedTitle}</div>
                        <div class="search-result-description">${highlightedDesc}</div>
                    </div>
                    <div class="search-result-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers
        this.searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const result = results[index];
                if (result.url && result.url !== '#') {
                    if (result.url.startsWith('#')) {
                        const element = document.querySelector(result.url);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else {
                        window.location.href = result.url;
                    }
                    this.close();
                }
            });

            // Keyboard navigation
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });
        });
    }

    highlightText(text, query) {
        if (!query) return Utils.escapeHTML(text);
        const regex = new RegExp(`(${Utils.escapeHTML(query)})`, 'gi');
        return Utils.escapeHTML(text).replace(regex, '<span class="search-highlight">$1</span>');
    }
}

// Initialize search when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.SearchManager = new SearchManager();
    });
} else {
    window.SearchManager = new SearchManager();
}

