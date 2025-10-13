/**
 * Profile Image Upload Handler
 * Handles double-click on profile image to change it
 */

class ProfileImageUploader {
    constructor() {
        this.imageElement = document.getElementById('profileImg');
        this.inputElement = document.getElementById('profileImageInput');
        this.wrapper = document.querySelector('.profile-image');
        
        if (!this.imageElement || !this.inputElement || !this.wrapper) {
            console.warn('Profile image elements not found');
            return;
        }
        
        this.init();
        this.loadSavedImage();
    }
    
    init() {
        // Double click handler for desktop
        this.wrapper.addEventListener('dblclick', () => {
            this.openFileSelector();
        });
        
        // Mobile: Double tap handler
        let tapCount = 0;
        let tapTimer = null;
        
        this.wrapper.addEventListener('touchend', (e) => {
            tapCount++;
            
            if (tapCount === 1) {
                tapTimer = setTimeout(() => {
                    tapCount = 0;
                }, 300); // 300ms window for double tap
            } else if (tapCount === 2) {
                clearTimeout(tapTimer);
                tapCount = 0;
                e.preventDefault();
                this.openFileSelector();
            }
        });
        
        // Mobile: Long press (1 second)
        let longPressTimer = null;
        
        this.wrapper.addEventListener('touchstart', (e) => {
            longPressTimer = setTimeout(() => {
                // Vibrate if supported
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
                this.openFileSelector();
            }, 1000);
        });
        
        this.wrapper.addEventListener('touchend', () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
            }
        });
        
        this.wrapper.addEventListener('touchmove', () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
            }
        });
        
        // File input change handler
        this.inputElement.addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });
        
        // Prevent default drag behavior
        this.wrapper.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.wrapper.style.transform = 'scale(1.05)';
        });
        
        this.wrapper.addEventListener('dragleave', () => {
            this.wrapper.style.transform = '';
        });
        
        // Drag and drop support
        this.wrapper.addEventListener('drop', (e) => {
            e.preventDefault();
            this.wrapper.style.transform = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.processImage(files[0]);
            }
        });
        
        console.log('✅ Profile Image Uploader initialized (Desktop + Mobile)');
    }
    
    openFileSelector() {
        // Mark as interacted (hide mobile hint)
        this.wrapper.classList.add('interacted');
        
        this.inputElement.click();
    }
    
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showNotification('Vui lòng chọn file ảnh', 'error');
            return;
        }
        
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            this.showNotification('Ảnh quá lớn! Tối đa 5MB', 'error');
            return;
        }
        
        // Show loading state
        this.showNotification('Đang tải ảnh...', 'loading');
        
        this.processImage(file);
    }
    
    processImage(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            
            // Compress if too large
            this.compressImage(imageUrl, (compressedUrl) => {
                this.updateImage(compressedUrl);
                this.saveImage(compressedUrl);
                this.showNotification('Đã cập nhật ảnh!', 'success');
            });
        };
        
        reader.onerror = () => {
            this.showNotification('Không thể đọc file!', 'error');
        };
        
        reader.readAsDataURL(file);
    }
    
    compressImage(imageUrl, callback) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Max dimensions for profile image
            const maxSize = 500;
            let width = img.width;
            let height = img.height;
            
            // Calculate new dimensions
            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            
            // Compress to JPEG with 0.85 quality
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.85);
            callback(compressedUrl);
        };
        
        img.src = imageUrl;
    }
    
    updateImage(imageUrl) {
        // Add animation
        this.imageElement.classList.add('changing');
        
        // Change image after animation starts
        setTimeout(() => {
            this.imageElement.src = imageUrl;
        }, 300);
        
        // Remove animation class
        setTimeout(() => {
            this.imageElement.classList.remove('changing');
        }, 600);
    }
    
    saveImage(imageUrl) {
        try {
            localStorage.setItem('profileImage', imageUrl);
            console.log('💾 Saved profile image to localStorage');
        } catch (e) {
            console.warn('Could not save image (localStorage full?):', e);
            this.showNotification('⚠️ Không thể lưu ảnh', 'error');
        }
    }
    
    loadSavedImage() {
        try {
            const savedImage = localStorage.getItem('profileImage');
            if (savedImage) {
                this.imageElement.src = savedImage;
                console.log('📦 Loaded saved profile image');
            }
        } catch (e) {
            console.warn('Could not load saved image:', e);
        }
    }
    
    showNotification(message, type = 'success') {
        // Use AssistiveTouch toast if available
        if (window.assistiveTouch && window.assistiveTouch.showToast) {
            window.assistiveTouch.showToast(message);
            return;
        }
        
        // Fallback to custom toast
        const toast = document.createElement('div');
        toast.className = `profile-toast profile-toast-${type}`;
        toast.innerHTML = message;
        document.body.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ProfileImageUploader();
    });
} else {
    new ProfileImageUploader();
}

