/**
 * Data Export/Import Manager
 */

class DataManager {
    constructor() {
        this.init();
    }

    init() {
        // Create export/import UI if user is logged in
        if (typeof Auth !== 'undefined' && Auth.isLoggedIn()) {
            this.createUI();
        }
    }

    createUI() {
        // Add to user menu or create new section
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            const exportBtn = document.createElement('button');
            exportBtn.className = 'data-btn export-btn';
            exportBtn.innerHTML = '<i class="fas fa-download"></i> <span>Xuất dữ liệu</span>';
            exportBtn.addEventListener('click', () => this.exportData());
            
            const importBtn = document.createElement('button');
            importBtn.className = 'data-btn import-btn';
            importBtn.innerHTML = '<i class="fas fa-upload"></i> <span>Nhập dữ liệu</span>';
            importBtn.addEventListener('click', () => this.importData());

            // Create wrapper
            const dataWrapper = document.createElement('div');
            dataWrapper.className = 'data-manager-wrapper';
            dataWrapper.appendChild(exportBtn);
            dataWrapper.appendChild(importBtn);
            
            userMenu.appendChild(dataWrapper);
        }

        // Add styles
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .data-manager-wrapper {
                display: flex;
                gap: 8px;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .data-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .data-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }

            .data-btn i {
                font-size: 14px;
            }

            .import-file-input {
                display: none;
            }
        `;
        if (!document.getElementById('data-manager-styles')) {
            style.id = 'data-manager-styles';
            document.head.appendChild(style);
        }
    }

    exportData() {
        try {
            const user = Auth.getCurrentUser();
            if (!user) {
                Utils.Toast.error('Vui lòng đăng nhập để xuất dữ liệu');
                return;
            }

            const data = {
                version: '1.0',
                exportedAt: new Date().toISOString(),
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    profile: user.profile || {},
                    links: user.links || [],
                    tasks: user.tasks || [],
                    settings: user.settings || {}
                },
                analytics: typeof Analytics !== 'undefined' ? Analytics.exportData() : null
            };

            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bio-link-backup-${user.username}-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            Utils.Toast.success('Xuất dữ liệu thành công!', 'Đã tải xuống file backup');
        } catch (error) {
            console.error('Export error:', error);
            Utils.Toast.error('Có lỗi xảy ra khi xuất dữ liệu');
        }
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.className = 'import-file-input';
        
        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const data = JSON.parse(text);

                // Validate data structure
                if (!data.user || !data.version) {
                    throw new Error('File không hợp lệ');
                }

                // Confirm import
                const confirmed = confirm(
                    'Bạn có chắc chắn muốn nhập dữ liệu này? Dữ liệu hiện tại sẽ bị ghi đè.'
                );

                if (!confirmed) return;

                // Show loading
                const loaderId = Utils.Loading.show(document.body, 'Đang nhập dữ liệu...');

                try {
                    // Update user data
                    const currentUser = Auth.getCurrentUser();
                    if (currentUser && currentUser.id === data.user.id) {
                        // Merge data
                        const updatedUser = {
                            ...currentUser,
                            profile: { ...currentUser.profile, ...data.user.profile },
                            links: data.user.links || currentUser.links,
                            tasks: data.user.tasks || currentUser.tasks,
                            settings: { ...currentUser.settings, ...data.user.settings }
                        };

                        // Save to storage
                        const users = JSON.parse(localStorage.getItem(Auth.STORAGE_KEY) || '[]');
                        const userIndex = users.findIndex(u => u.id === currentUser.id);
                        if (userIndex !== -1) {
                            users[userIndex] = updatedUser;
                            localStorage.setItem(Auth.STORAGE_KEY, JSON.stringify(users));
                        }

                        Utils.Loading.hide(loaderId);
                        Utils.Toast.success('Nhập dữ liệu thành công!', 'Đang tải lại trang...');
                        
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        throw new Error('Dữ liệu không khớp với tài khoản hiện tại');
                    }
                } catch (error) {
                    Utils.Loading.hide(loaderId);
                    throw error;
                }
            } catch (error) {
                console.error('Import error:', error);
                Utils.Toast.error('Có lỗi xảy ra khi nhập dữ liệu: ' + error.message);
            }
        });

        input.click();
    }

    // Export specific data type
    exportLinks() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const links = user.links || [];
        const data = {
            type: 'links',
            exportedAt: new Date().toISOString(),
            links: links
        };

        this.downloadJSON(data, `links-${Date.now()}.json`);
        Utils.Toast.success('Đã xuất danh sách liên kết');
    }

    exportTasks() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const tasks = user.tasks || [];
        const data = {
            type: 'tasks',
            exportedAt: new Date().toISOString(),
            tasks: tasks
        };

        this.downloadJSON(data, `tasks-${Date.now()}.json`);
        Utils.Toast.success('Đã xuất danh sách nhiệm vụ');
    }

    downloadJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof Auth !== 'undefined') {
            // Wait for auth to be ready
            setTimeout(() => {
                window.DataManager = new DataManager();
            }, 1000);
        }
    });
} else {
    if (typeof Auth !== 'undefined') {
        setTimeout(() => {
            window.DataManager = new DataManager();
        }, 1000);
    }
}

