/**
 * Profile Manager
 * Quản lý thông tin profile: tên, bio, social links
 */

class ProfileManager {
    constructor() {
        this.profileNameEl = document.querySelector('.profile-name');
        this.profileBioEl = document.querySelector('.profile-bio');
        this.socialLinksEl = document.querySelector('.social-links');
        
        // Load profile data (from Supabase if available, else localStorage)
        this.loadProfileData();
        
        // Listen for data loaded from Supabase
        window.addEventListener('dataLoadedFromSupabase', (e) => {
            if (e.detail && e.detail.profile) {
                this.loadProfileFromData(e.detail.profile);
            }
        });
        
        this.init();
    }

    init() {
        // Thêm nút edit cho profile name
        this.addEditButton(this.profileNameEl, () => this.editProfileName());
        
        // Thêm nút edit cho profile bio
        this.addEditButton(this.profileBioEl, () => this.editProfileBio());
        
        // Thêm nút edit cho social links
        this.addEditButtonToContainer(this.socialLinksEl, () => this.editSocialLinks());
        
        // Load và render social links
        this.renderSocialLinks();
    }

    addEditButton(element, callback) {
        if (element.querySelector('.edit-btn')) return;
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn profile-edit-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Chỉnh sửa';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            callback();
        });
        
        element.style.position = 'relative';
        element.appendChild(editBtn);
    }

    addEditButtonToContainer(container, callback) {
        if (container.querySelector('.social-edit-btn')) return;
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn social-edit-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Chỉnh sửa';
        editBtn.title = 'Chỉnh sửa social links';
        editBtn.style.cssText = 'position: absolute; top: 0; right: 0;';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            callback();
        });
        
        container.style.position = 'relative';
        container.appendChild(editBtn);
    }

    editProfileName() {
        const currentName = this.profileNameEl.textContent.trim();
        const newName = prompt('Nhập tên mới:', currentName);
        
        if (newName !== null && newName.trim() !== '') {
            this.profileNameEl.textContent = newName.trim();
            this.saveProfileData();
            this.showNotification('Đã cập nhật tên!', 'success');
        }
    }

    editProfileBio() {
        const currentBio = this.profileBioEl.textContent.trim();
        const newBio = prompt('Nhập mô tả mới:', currentBio);
        
        if (newBio !== null) {
            this.profileBioEl.textContent = newBio.trim() || 'Mô tả ngắn gọn về bản thân và mục tiêu của bạn';
            this.saveProfileData();
            this.showNotification('Đã cập nhật mô tả!', 'success');
        }
    }

    editSocialLinks() {
        const socialData = this.getSocialLinksData();
        
        const modal = Widgets.showModal('Chỉnh sửa Social Links', this.createSocialLinksForm(socialData));
        
        const form = modal.querySelector('#socialLinksForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSocialLinksFromForm(form);
            Widgets.closeModal(modal);
        });
    }

    createSocialLinksForm(socialData) {
        const platforms = [
            { key: 'facebook', label: 'Facebook', icon: 'fab fa-facebook-f' },
            { key: 'instagram', label: 'Instagram', icon: 'fab fa-instagram' },
            { key: 'twitter', label: 'Twitter/X', icon: 'fab fa-twitter' },
            { key: 'linkedin', label: 'LinkedIn', icon: 'fab fa-linkedin-in' },
            { key: 'github', label: 'GitHub', icon: 'fab fa-github' },
            { key: 'youtube', label: 'YouTube', icon: 'fab fa-youtube' },
            { key: 'tiktok', label: 'TikTok', icon: 'fab fa-tiktok' },
            { key: 'telegram', label: 'Telegram', icon: 'fab fa-telegram' }
        ];

        let formHTML = '<form id="socialLinksForm">';
        
        platforms.forEach(platform => {
            const value = socialData[platform.key] || '';
            formHTML += `
                <div class="form-group">
                    <label for="${platform.key}">
                        <i class="${platform.icon}"></i> ${platform.label}
                    </label>
                    <input 
                        type="url" 
                        id="${platform.key}" 
                        name="${platform.key}" 
                        value="${value}" 
                        placeholder="https://..."
                    >
                </div>
            `;
        });
        
        formHTML += `
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
                <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').querySelector('.modal-close').click()">Hủy</button>
            </div>
        </form>`;
        
        return formHTML;
    }

    async saveSocialLinksFromForm(form) {
        const formData = new FormData(form);
        const socialData = {};
        
        for (const [key, value] of formData.entries()) {
            if (value.trim() !== '') {
                socialData[key] = value.trim();
            }
        }
        
        // Save to localStorage first
        localStorage.setItem('bioLinkSocialLinks', JSON.stringify(socialData));
        this.renderSocialLinks();
        
        // Save to Supabase if available
        if (window.DataSyncService && typeof Auth !== 'undefined' && Auth.isSupabaseAvailable && Auth.isSupabaseAvailable()) {
            try {
                const profileData = this.getProfileData();
                const profileDataForSupabase = {
                    profile: {
                        name: profileData.name,
                        bio: profileData.bio,
                        image: '',
                        socialLinks: socialData
                    }
                };
                
                await window.DataSyncService.saveProfileToSupabase(profileDataForSupabase);
            } catch (error) {
                console.error('Error saving social links to Supabase:', error);
            }
        }
        
        this.showNotification('Đã cập nhật social links!', 'success');
    }

    getSocialLinksData() {
        return JSON.parse(localStorage.getItem('bioLinkSocialLinks') || '{}');
    }

    renderSocialLinks() {
        const socialData = this.getSocialLinksData();
        const platformMap = {
            facebook: { icon: 'fab fa-facebook-f', title: 'Facebook' },
            instagram: { icon: 'fab fa-instagram', title: 'Instagram' },
            twitter: { icon: 'fab fa-twitter', title: 'Twitter' },
            linkedin: { icon: 'fab fa-linkedin-in', title: 'LinkedIn' },
            github: { icon: 'fab fa-github', title: 'GitHub' },
            youtube: { icon: 'fab fa-youtube', title: 'YouTube' },
            tiktok: { icon: 'fab fa-tiktok', title: 'TikTok' },
            telegram: { icon: 'fab fa-telegram', title: 'Telegram' }
        };

        // Xóa các social icons cũ (trừ edit button và placeholder)
        const existingIcons = this.socialLinksEl.querySelectorAll('.social-icon:not(.edit-btn):not(.social-edit-btn)');
        existingIcons.forEach(icon => icon.remove());

        // Xóa placeholder cũ
        const oldPlaceholder = this.socialLinksEl.querySelector('.social-placeholder');
        if (oldPlaceholder) oldPlaceholder.remove();

        // Thêm các social icons mới
        Object.entries(socialData).forEach(([key, url]) => {
            if (platformMap[key] && url) {
                const icon = document.createElement('a');
                icon.href = url;
                icon.target = '_blank';
                icon.rel = 'noopener noreferrer';
                icon.className = 'social-icon';
                icon.title = platformMap[key].title;
                icon.innerHTML = `<i class="${platformMap[key].icon}"></i>`;
                
                this.socialLinksEl.appendChild(icon);
            }
        });

        // Nếu không có social links nào, hiển thị placeholder
        if (Object.keys(socialData).length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'social-placeholder';
            placeholder.textContent = 'Chưa có social links. Nhấn "Chỉnh sửa" để thêm.';
            placeholder.style.cssText = 'text-align: center; padding: 10px; opacity: 0.6; font-size: 14px; width: 100%;';
            
            this.socialLinksEl.appendChild(placeholder);
        }
    }

    getProfileData() {
        return {
            name: this.profileNameEl.textContent.trim(),
            bio: this.profileBioEl.textContent.trim()
        };
    }

    async saveProfileData() {
        const profileData = this.getProfileData();
        const socialLinks = this.getSocialLinksData();
        
        // Save to localStorage first (always)
        localStorage.setItem('bioLinkProfile', JSON.stringify(profileData));
        localStorage.setItem('bioLinkSocialLinks', JSON.stringify(socialLinks));
        
        // Save to Supabase if available
        if (typeof Auth !== 'undefined' && Auth.isSupabaseAvailable && Auth.isSupabaseAvailable()) {
            // Wait for DataSyncService to be ready
            if (!window.DataSyncService) {
                console.warn('DataSyncService chưa sẵn sàng, sẽ retry sau...');
                setTimeout(() => this.saveProfileData(), 1000);
                return;
            }
            
            try {
                const profileDataForSupabase = {
                    profile: {
                        name: profileData.name,
                        bio: profileData.bio,
                        image: '', // Will be updated separately if needed
                        socialLinks: socialLinks
                    }
                };
                
                const success = await window.DataSyncService.saveProfileToSupabase(profileDataForSupabase);
                if (success) {
                    console.log('✅ Profile đã được lưu vào Supabase');
                } else {
                    console.warn('⚠️ Không thể lưu profile vào Supabase, đã lưu vào localStorage');
                }
            } catch (error) {
                console.error('❌ Error saving profile to Supabase:', error);
                // Continue - localStorage already saved
            }
        } else {
            console.log('ℹ️ Supabase không available, chỉ lưu vào localStorage');
        }
    }

    async loadProfileData() {
        // Try to load from Supabase first if user is logged in
        if (window.DataSyncService && typeof Auth !== 'undefined' && Auth.isSupabaseAvailable && Auth.isSupabaseAvailable()) {
            try {
                const data = await window.DataSyncService.loadProfileFromSupabase();
                if (data && data.profile) {
                    this.loadProfileFromData(data.profile);
                    return; // Use Supabase data, skip localStorage
                }
            } catch (error) {
                console.warn('Error loading from Supabase, using localStorage:', error);
            }
        }
        
        // Fallback to localStorage
        const saved = localStorage.getItem('bioLinkProfile');
        if (saved) {
            try {
                const profileData = JSON.parse(saved);
                if (profileData.name) {
                    this.profileNameEl.textContent = profileData.name;
                }
                if (profileData.bio) {
                    this.profileBioEl.textContent = profileData.bio;
                }
            } catch (e) {
                console.warn('Could not load profile data:', e);
            }
        }
        
        // Also load social links
        const savedSocialLinks = localStorage.getItem('bioLinkSocialLinks');
        if (savedSocialLinks) {
            try {
                const socialData = JSON.parse(savedSocialLinks);
                if (Object.keys(socialData).length > 0) {
                    // Social links are rendered separately
                }
            } catch (e) {
                console.warn('Could not load social links:', e);
            }
        }
    }

    loadProfileFromData(profileData) {
        if (profileData.name) {
            this.profileNameEl.textContent = profileData.name;
        }
        if (profileData.bio) {
            this.profileBioEl.textContent = profileData.bio;
        }
        if (profileData.socialLinks) {
            localStorage.setItem('bioLinkSocialLinks', JSON.stringify(profileData.socialLinks));
            this.renderSocialLinks();
        }
    }

    showNotification(message, type = 'info') {
        if (window.Widgets && window.Widgets.showToast) {
            Widgets.showToast(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
}

// Initialize when DOM is ready
let profileManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        profileManager = new ProfileManager();
    });
} else {
    profileManager = new ProfileManager();
}

// Export
window.ProfileManager = ProfileManager;

