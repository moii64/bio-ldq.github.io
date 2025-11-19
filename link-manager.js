/**
 * Link Manager
 * Quản lý các link cards: thêm, sửa, xóa, sắp xếp
 */

class LinkManager {
    constructor() {
        this.linksContainer = document.querySelector('.links-container');
        this.links = JSON.parse(localStorage.getItem('bioLinkCards') || '[]');
        
        this.init();
    }

    init() {
        // Chỉ render links từ localStorage nếu có
        // Nếu localStorage trống, giữ nguyên links HTML ban đầu
        if (this.links.length > 0) {
            // Có links trong localStorage, render chúng
            this.renderLinks();
        }
        // Luôn thêm nút quản lý
        this.addManageButton();
    }

    loadLinksFromHTML() {
        const linkCards = document.querySelectorAll('.links-container .link-card');
        this.links = [];
        
        linkCards.forEach((card, index) => {
            const link = {
                id: Date.now() + index,
                title: card.querySelector('.link-title')?.textContent || '',
                subtitle: card.querySelector('.link-subtitle')?.textContent || '',
                url: card.getAttribute('href') || '#',
                icon: card.querySelector('.link-icon i')?.className || 'fas fa-link',
                special: card.classList.contains('special')
            };
            this.links.push(link);
        });
        
        this.saveLinks();
    }

    addManageButton() {
        // Xóa button cũ nếu có
        const oldBtn = document.querySelector('.manage-links-btn');
        if (oldBtn) oldBtn.remove();
        
        const manageBtn = document.createElement('button');
        manageBtn.className = 'manage-links-btn';
        manageBtn.innerHTML = '<i class="fas fa-cog"></i> Quản lý Links';
        manageBtn.addEventListener('click', () => this.showManageModal());
        
        // Thêm vào trước links container
        this.linksContainer.parentNode.insertBefore(manageBtn, this.linksContainer);
        
        this.addManageButtonStyles();
    }

    showManageModal() {
        // Nếu localStorage trống, load links từ HTML trước
        if (this.links.length === 0) {
            this.loadLinksFromHTML();
        }
        
        const modal = Widgets.showModal('Quản lý Links', this.createManageForm());
        
        // Bind events
        const addBtn = modal.querySelector('.add-link-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddEditModal());
        }
        
        const resetBtn = modal.querySelector('.reset-links-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetToHTML());
        }
        
        // Render links list
        this.renderLinksList(modal);
    }
    
    resetToHTML() {
        if (!confirm('Bạn có chắc muốn xóa tất cả links đã quản lý và quay về links HTML ban đầu?')) {
            return;
        }
        
        // Xóa localStorage
        localStorage.removeItem('bioLinkCards');
        this.links = [];
        
        // Reload trang để hiển thị links HTML ban đầu
        window.location.reload();
    }

    createManageForm() {
        return `
            <div class="links-manager">
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button class="add-link-btn btn btn-primary" style="flex: 1;">
                        <i class="fas fa-plus"></i> Thêm Link Mới
                    </button>
                    <button class="reset-links-btn btn btn-secondary" style="flex: 1;">
                        <i class="fas fa-undo"></i> Reset về HTML
                    </button>
                </div>
                <div class="links-list" id="linksList"></div>
            </div>
        `;
    }

    renderLinksList(modal) {
        const listContainer = modal.querySelector('#linksList');
        if (!listContainer) return;
        
        if (this.links.length === 0) {
            listContainer.innerHTML = '<p style="text-align: center; opacity: 0.6; padding: 20px;">Chưa có links nào. Nhấn "Thêm Link Mới" để bắt đầu.</p>';
            return;
        }
        
        listContainer.innerHTML = this.links.map((link, index) => `
            <div class="link-item" data-id="${link.id}">
                <div class="link-item-content">
                    <div class="link-item-icon">
                        <i class="${link.icon}"></i>
                    </div>
                    <div class="link-item-info">
                        <div class="link-item-title">${link.title}</div>
                        <div class="link-item-subtitle">${link.subtitle || link.url}</div>
                    </div>
                    <div class="link-item-badge ${link.special ? 'special' : ''}">
                        ${link.special ? '<i class="fas fa-star"></i> Đặc biệt' : ''}
                    </div>
                </div>
                <div class="link-item-actions">
                    <button class="btn-icon" onclick="linkManager.moveLink('${link.id}', 'up')" ${index === 0 ? 'disabled' : ''} title="Di chuyển lên">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <button class="btn-icon" onclick="linkManager.moveLink('${link.id}', 'down')" ${index === this.links.length - 1 ? 'disabled' : ''} title="Di chuyển xuống">
                        <i class="fas fa-arrow-down"></i>
                    </button>
                    <button class="btn-icon" onclick="linkManager.editLink('${link.id}')" title="Sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="linkManager.deleteLink('${link.id}')" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        this.addLinksListStyles();
    }

    showAddEditModal(linkId = null) {
        const link = linkId ? this.links.find(l => l.id === linkId) : null;
        const isEdit = !!link;
        
        const modal = Widgets.showModal(
            isEdit ? 'Sửa Link' : 'Thêm Link Mới',
            this.createLinkForm(link)
        );
        
        const form = modal.querySelector('#linkForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveLinkFromForm(form, linkId);
            Widgets.closeModal(modal);
            // Refresh manage modal if open
            const manageModal = document.querySelector('.modal-overlay');
            if (manageModal) {
                this.renderLinksList(manageModal);
            }
        });
    }

    createLinkForm(link = null) {
        const icons = [
            { value: 'fas fa-globe', label: 'Website' },
            { value: 'fas fa-envelope', label: 'Email' },
            { value: 'fas fa-file-alt', label: 'CV/Resume' },
            { value: 'fas fa-shopping-bag', label: 'Shop' },
            { value: 'fas fa-video', label: 'Video' },
            { value: 'fas fa-book', label: 'Blog' },
            { value: 'fas fa-star', label: 'Featured' },
            { value: 'fas fa-music', label: 'Music' },
            { value: 'fas fa-camera', label: 'Photography' },
            { value: 'fas fa-gamepad', label: 'Gaming' },
            { value: 'fab fa-youtube', label: 'YouTube' },
            { value: 'fab fa-spotify', label: 'Spotify' }
        ];
        
        const iconOptions = icons.map(icon => 
            `<option value="${icon.value}" ${link?.icon === icon.value ? 'selected' : ''}>${icon.label}</option>`
        ).join('');
        
        return `
            <form id="linkForm">
                <div class="form-group">
                    <label for="linkTitle">Tiêu đề *</label>
                    <input type="text" id="linkTitle" name="title" required value="${link?.title || ''}" placeholder="Ví dụ: Website chính">
                </div>
                <div class="form-group">
                    <label for="linkSubtitle">Mô tả</label>
                    <input type="text" id="linkSubtitle" name="subtitle" value="${link?.subtitle || ''}" placeholder="Ví dụ: Khám phá thêm về tôi">
                </div>
                <div class="form-group">
                    <label for="linkUrl">URL *</label>
                    <input type="url" id="linkUrl" name="url" required value="${link?.url || ''}" placeholder="https://...">
                </div>
                <div class="form-group">
                    <label for="linkIcon">Icon</label>
                    <select id="linkIcon" name="icon">
                        ${iconOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="special" ${link?.special ? 'checked' : ''}>
                        Đánh dấu là link đặc biệt
                    </label>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Cập nhật' : 'Thêm'}</button>
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').querySelector('.modal-close').click()">Hủy</button>
                </div>
            </form>
        `;
    }

    saveLinkFromForm(form, linkId) {
        const formData = new FormData(form);
        const linkData = {
            id: linkId || Date.now() + Math.random(),
            title: formData.get('title'),
            subtitle: formData.get('subtitle') || '',
            url: formData.get('url'),
            icon: formData.get('icon') || 'fas fa-link',
            special: formData.get('special') === 'on'
        };
        
        if (linkId) {
            // Edit existing
            const index = this.links.findIndex(l => l.id === linkId);
            if (index !== -1) {
                this.links[index] = linkData;
            }
        } else {
            // Add new
            this.links.push(linkData);
        }
        
        this.saveLinks();
        this.renderLinks();
        Widgets.showToast(linkId ? 'Đã cập nhật link!' : 'Đã thêm link mới!', 'success');
    }

    deleteLink(linkId) {
        if (!confirm('Bạn có chắc muốn xóa link này?')) return;
        
        this.links = this.links.filter(l => l.id !== linkId);
        this.saveLinks();
        this.renderLinks();
        
        // Refresh manage modal
        const manageModal = document.querySelector('.modal-overlay');
        if (manageModal) {
            this.renderLinksList(manageModal);
        }
        
        Widgets.showToast('Đã xóa link!', 'success');
    }

    editLink(linkId) {
        this.showAddEditModal(linkId);
    }

    moveLink(linkId, direction) {
        const index = this.links.findIndex(l => l.id === linkId);
        if (index === -1) return;
        
        if (direction === 'up' && index > 0) {
            [this.links[index - 1], this.links[index]] = [this.links[index], this.links[index - 1]];
        } else if (direction === 'down' && index < this.links.length - 1) {
            [this.links[index], this.links[index + 1]] = [this.links[index + 1], this.links[index]];
        } else {
            return;
        }
        
        this.saveLinks();
        this.renderLinks();
        
        // Refresh manage modal
        const manageModal = document.querySelector('.modal-overlay');
        if (manageModal) {
            this.renderLinksList(manageModal);
        }
    }

    renderLinks() {
        // Chỉ render nếu có links trong localStorage và đã được chỉnh sửa
        // Nếu không, giữ nguyên links HTML ban đầu
        if (this.links.length === 0) {
            // Không làm gì, giữ nguyên links HTML
            return;
        }
        
        // Xóa tất cả links cũ
        this.linksContainer.innerHTML = '';
        
        // Render các links
        this.links.forEach(link => {
            const linkCard = document.createElement('a');
            linkCard.href = link.url;
            
            // Chỉ mở tab mới cho links ngoài (http/https), không phải links nội bộ
            if (link.url && (link.url.startsWith('http://') || link.url.startsWith('https://'))) {
                linkCard.target = '_blank';
                linkCard.rel = 'noopener noreferrer';
            } else {
                // Links nội bộ (relative paths) mở trong cùng tab
                linkCard.target = '_self';
            }
            
            linkCard.className = `link-card ${link.special ? 'special' : ''}`;
            
            linkCard.innerHTML = `
                <div class="link-icon">
                    <i class="${link.icon}"></i>
                </div>
                <div class="link-content">
                    <span class="link-title">${link.title}</span>
                    <span class="link-subtitle">${link.subtitle || ''}</span>
                </div>
                <div class="link-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>
            `;
            
            this.linksContainer.appendChild(linkCard);
        });
        
        // Re-initialize link animations
        this.reinitLinkAnimations();
    }

    reinitLinkAnimations() {
        // Re-run ripple effect setup from script.js
        const linkCards = document.querySelectorAll('.link-card');
        linkCards.forEach(card => {
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
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    saveLinks() {
        localStorage.setItem('bioLinkCards', JSON.stringify(this.links));
    }

    addManageButtonStyles() {
        if (document.getElementById('link-manager-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'link-manager-styles';
        style.textContent = `
            .manage-links-btn {
                display: block;
                margin: 20px auto;
                padding: 12px 24px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .manage-links-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }
            
            .links-manager {
                display: flex;
                flex-direction: column;
                max-height: 70vh;
                overflow: hidden;
            }
            
            .links-list {
                margin-top: 20px;
                max-height: calc(70vh - 100px);
                overflow-y: auto;
                overflow-x: hidden;
                padding-right: 10px;
                -webkit-overflow-scrolling: touch;
            }
            
            .links-list::-webkit-scrollbar {
                width: 8px;
            }
            
            .links-list::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }
            
            .links-list::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 10px;
            }
            
            .links-list::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .link-item {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-height: 60px;
            }
            
            .link-item-content {
                display: flex;
                align-items: center;
                gap: 15px;
                flex: 1;
                min-width: 0;
                overflow: hidden;
            }
            
            .link-item-icon {
                font-size: 24px;
                width: 40px;
                text-align: center;
                flex-shrink: 0;
            }
            
            .link-item-info {
                flex: 1;
                min-width: 0;
                overflow: hidden;
            }
            
            .link-item-title {
                font-weight: 600;
                display: block;
                margin-bottom: 5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .link-item-subtitle {
                font-size: 12px;
                opacity: 0.7;
                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .link-item-badge {
                padding: 4px 8px;
                background: rgba(255, 215, 0, 0.2);
                border-radius: 5px;
                font-size: 11px;
            }
            
            .link-item-badge.special {
                color: #ffd700;
            }
            
            .link-item-actions {
                display: flex;
                gap: 5px;
                flex-shrink: 0;
            }
            
            .btn-icon {
                width: 32px;
                height: 32px;
                border: none;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .btn-icon:hover:not(:disabled) {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
            
            .btn-icon:disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }
            
            .btn-icon.delete:hover {
                background: rgba(239, 68, 68, 0.3);
            }
            
            .empty-links {
                text-align: center;
                padding: 40px 20px;
                opacity: 0.6;
            }
            
            .empty-links i {
                font-size: 48px;
                display: block;
                margin-bottom: 15px;
            }
            
            .form-actions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
        `;
        document.head.appendChild(style);
    }

    addLinksListStyles() {
        // Styles already added in addManageButtonStyles
    }
}

// Initialize when DOM is ready
let linkManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        linkManager = new LinkManager();
    });
} else {
    linkManager = new LinkManager();
}

// Export
window.LinkManager = LinkManager;

