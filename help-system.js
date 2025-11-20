/**
 * Help and Tutorial System
 */

class HelpSystem {
    constructor() {
        this.tutorials = [];
        this.currentTutorial = null;
        this.init();
    }

    init() {
        this.createHelpButton();
        this.createHelpModal();
        this.loadTutorials();
    }

    createHelpButton() {
        const helpBtn = document.createElement('button');
        helpBtn.className = 'help-button';
        helpBtn.innerHTML = '<i class="fas fa-question-circle"></i>';
        helpBtn.setAttribute('aria-label', 'Trợ giúp');
        helpBtn.setAttribute('title', 'Trợ giúp (F1)');
        helpBtn.addEventListener('click', () => this.showHelp());

        // Add to theme selector
        const themeSelector = document.querySelector('.theme-selector');
        if (themeSelector) {
            themeSelector.appendChild(helpBtn);
        }

        // Keyboard shortcut
        Utils.Shortcuts.register('f1', () => this.showHelp());

        this.addStyles();
    }

    createHelpModal() {
        const modal = document.createElement('div');
        modal.id = 'helpModal';
        modal.className = 'help-modal';
        modal.innerHTML = `
            <div class="help-modal-content">
                <div class="help-modal-header">
                    <h2><i class="fas fa-question-circle"></i> Trợ giúp</h2>
                    <button class="help-modal-close" aria-label="Đóng">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="help-modal-body">
                    <div class="help-tabs">
                        <button class="help-tab active" data-tab="shortcuts">Phím tắt</button>
                        <button class="help-tab" data-tab="tutorials">Hướng dẫn</button>
                        <button class="help-tab" data-tab="faq">FAQ</button>
                    </div>
                    <div class="help-content">
                        <div class="help-panel active" id="shortcuts-panel">
                            ${this.getShortcutsHTML()}
                        </div>
                        <div class="help-panel" id="tutorials-panel">
                            ${this.getTutorialsHTML()}
                        </div>
                        <div class="help-panel" id="faq-panel">
                            ${this.getFAQHTML()}
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.help-modal-close').addEventListener('click', () => this.hideHelp());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideHelp();
            }
        });

        // Tab switching
        modal.querySelectorAll('.help-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    getShortcutsHTML() {
        const shortcuts = [
            { key: 'Ctrl + K', desc: 'Mở tìm kiếm' },
            { key: 'Ctrl + Shift + T', desc: 'Chuyển đổi chế độ sáng/tối' },
            { key: 'F1', desc: 'Mở trợ giúp' },
            { key: 'Esc', desc: 'Đóng modal/hộp thoại' },
            { key: 'Enter', desc: 'Xác nhận trong form' }
        ];

        return `
            <div class="shortcuts-list">
                ${shortcuts.map(s => `
                    <div class="shortcut-item">
                        <kbd class="shortcut-key">${s.key}</kbd>
                        <span class="shortcut-desc">${s.desc}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getTutorialsHTML() {
        return `
            <div class="tutorials-list">
                <div class="tutorial-item">
                    <h3><i class="fas fa-user-plus"></i> Đăng ký tài khoản</h3>
                    <p>Nhấn vào nút "Đăng Ký" ở góc trên bên trái để tạo tài khoản mới.</p>
                </div>
                <div class="tutorial-item">
                    <h3><i class="fas fa-link"></i> Thêm liên kết</h3>
                    <p>Sau khi đăng nhập, bạn có thể thêm và quản lý các liên kết của mình.</p>
                </div>
                <div class="tutorial-item">
                    <h3><i class="fas fa-tasks"></i> Quản lý nhiệm vụ</h3>
                    <p>Sử dụng phần "Danh sách nhiệm vụ" để theo dõi công việc của bạn.</p>
                </div>
                <div class="tutorial-item">
                    <h3><i class="fas fa-palette"></i> Tùy chỉnh giao diện</h3>
                    <p>Chọn từ nhiều theme khác nhau bằng các nút ở góc trên bên phải.</p>
                </div>
            </div>
        `;
    }

    getFAQHTML() {
        const faqs = [
            {
                q: 'Làm thế nào để đăng ký?',
                a: 'Nhấn vào nút "Đăng Ký" ở góc trên bên trái, điền thông tin và nhấn "Đăng Ký".'
            },
            {
                q: 'Tôi có thể xuất dữ liệu không?',
                a: 'Có, sau khi đăng nhập, bạn sẽ thấy nút "Xuất dữ liệu" trong menu người dùng.'
            },
            {
                q: 'Website có hỗ trợ offline không?',
                a: 'Có, website là một Progressive Web App (PWA) và có thể hoạt động offline.'
            },
            {
                q: 'Làm thế nào để tìm kiếm?',
                a: 'Nhấn Ctrl+K hoặc nhấn vào biểu tượng tìm kiếm để mở hộp tìm kiếm.'
            },
            {
                q: 'Tôi quên mật khẩu thì sao?',
                a: 'Tính năng khôi phục mật khẩu đang được phát triển. Vui lòng liên hệ quản trị viên.'
            }
        ];

        return `
            <div class="faq-list">
                ${faqs.map((faq, index) => `
                    <div class="faq-item">
                        <div class="faq-question">
                            <i class="fas fa-question-circle"></i>
                            <span>${faq.q}</span>
                        </div>
                        <div class="faq-answer">
                            <i class="fas fa-check-circle"></i>
                            <span>${faq.a}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    switchTab(tabName) {
        // Update tabs
        document.querySelectorAll('.help-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update panels
        document.querySelectorAll('.help-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabName}-panel`);
        });
    }

    showHelp() {
        const modal = document.getElementById('helpModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideHelp() {
        const modal = document.getElementById('helpModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    loadTutorials() {
        // Can load from API or localStorage
        this.tutorials = [];
    }

    addStyles() {
        if (document.getElementById('help-system-styles')) return;

        const style = document.createElement('style');
        style.id = 'help-system-styles';
        style.textContent = `
            .help-button {
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
                font-size: 18px;
            }

            .help-button:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }

            .help-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 20px;
                animation: fadeIn 0.3s ease;
            }

            .help-modal.active {
                display: flex;
            }

            .help-modal-content {
                background: rgba(20, 20, 30, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(100, 200, 255, 0.3);
                border-radius: 16px;
                width: 100%;
                max-width: 700px;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: slideUp 0.3s ease;
            }

            .help-modal-header {
                padding: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .help-modal-header h2 {
                margin: 0;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 24px;
            }

            .help-modal-close {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                font-size: 24px;
                cursor: pointer;
                padding: 8px;
                transition: color 0.3s;
            }

            .help-modal-close:hover {
                color: #ffffff;
            }

            .help-modal-body {
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .help-tabs {
                display: flex;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding: 0 20px;
            }

            .help-tab {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                padding: 16px 20px;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.3s ease;
                font-size: 14px;
                font-weight: 500;
            }

            .help-tab:hover {
                color: #ffffff;
            }

            .help-tab.active {
                color: #64c8ff;
                border-bottom-color: #64c8ff;
            }

            .help-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            .help-panel {
                display: none;
            }

            .help-panel.active {
                display: block;
                animation: fadeIn 0.3s ease;
            }

            .shortcuts-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .shortcut-item {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 12px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }

            .shortcut-key {
                background: rgba(100, 200, 255, 0.2);
                border: 1px solid rgba(100, 200, 255, 0.3);
                padding: 6px 12px;
                border-radius: 6px;
                font-family: monospace;
                font-size: 12px;
                color: #64c8ff;
                min-width: 120px;
                text-align: center;
            }

            .shortcut-desc {
                color: rgba(255, 255, 255, 0.8);
            }

            .tutorials-list,
            .faq-list {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .tutorial-item,
            .faq-item {
                padding: 16px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }

            .tutorial-item h3 {
                margin: 0 0 8px 0;
                display: flex;
                align-items: center;
                gap: 8px;
                color: #64c8ff;
            }

            .tutorial-item p {
                margin: 0;
                color: rgba(255, 255, 255, 0.8);
            }

            .faq-question {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
                color: #64c8ff;
                font-weight: 600;
            }

            .faq-answer {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                color: rgba(255, 255, 255, 0.8);
            }

            @media (max-width: 768px) {
                .help-modal-content {
                    max-height: 90vh;
                }

                .help-tabs {
                    flex-wrap: wrap;
                }

                .help-tab {
                    padding: 12px 16px;
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize help system
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.HelpSystem = new HelpSystem();
    });
} else {
    window.HelpSystem = new HelpSystem();
}

