/**
 * Profile Image Upload Handler
 * Handles double-click on profile image to change it
 */

class ProfileImageUploader {
    constructor() {
        this.imageElement = document.getElementById('profileImg');
        this.inputElement = document.getElementById('profileImageInput');
        this.wrapper = document.querySelector('.profile-image');
        this.cropper = null;
        this.cropModal = document.getElementById('cropModal');
        this.cropImage = document.getElementById('cropImage');
        this.cropLoading = document.getElementById('cropLoading');
        this.cropContainer = document.getElementById('cropContainer');
        this.cropFooter = document.getElementById('cropFooter');
        this.saveCropBtn = document.getElementById('cropConfirm');

        if (!this.imageElement || !this.inputElement || !this.wrapper) {
            console.warn('Profile image elements not found');
            return;
        }

        this.init();
        this.loadSavedImage();
        this.initCropperModal();
    }

    init() {
        // Detect if device is mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0);

        if (isMobile) {
            this.initMobileHandlers();
        } else {
            this.initDesktopHandlers();
        }

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

    initDesktopHandlers() {
        // Double click handler for desktop
        this.wrapper.addEventListener('dblclick', (e) => {
            e.preventDefault();
            this.openFileSelector();
        });

        // Hover effect for desktop
        this.wrapper.addEventListener('mouseenter', () => {
            this.wrapper.classList.add('hover');
        });

        this.wrapper.addEventListener('mouseleave', () => {
            this.wrapper.classList.remove('hover');
        });
    }

    initMobileHandlers() {
        let tapCount = 0;
        let tapTimer = null;
        let longPressTimer = null;
        let touchStartTime = 0;
        let touchStartX = 0;
        let touchStartY = 0;

        // Touch start - start long press timer
        this.wrapper.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;

            // Start long press timer
            longPressTimer = setTimeout(() => {
                // Vibrate if supported
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
                this.openFileSelector();
            }, 800); // Reduced from 1000ms for better UX

            // Add visual feedback
            this.wrapper.classList.add('touching');
        }, {
            passive: true
        });

        // Touch end - handle tap/double tap
        this.wrapper.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            const touch = e.changedTouches[0];
            const touchEndX = touch.clientX;
            const touchEndY = touch.clientY;

            // Clear long press timer
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }

            // Remove visual feedback
            this.wrapper.classList.remove('touching');

            // Check if it's a tap (not a swipe)
            const deltaX = Math.abs(touchEndX - touchStartX);
            const deltaY = Math.abs(touchEndY - touchStartY);
            const isTap = deltaX < 10 && deltaY < 10 && touchDuration < 500;

            if (isTap) {
                tapCount++;

                if (tapCount === 1) {
                    tapTimer = setTimeout(() => {
                        tapCount = 0;
                    }, 300);
                } else if (tapCount === 2) {
                    clearTimeout(tapTimer);
                    tapCount = 0;
                    e.preventDefault();
                    this.openFileSelector();
                }
            } else {
                // Reset tap count if it's not a tap
                tapCount = 0;
                if (tapTimer) {
                    clearTimeout(tapTimer);
                }
            }
        }, {
            passive: false
        });

        // Touch move - cancel long press if user moves finger
        this.wrapper.addEventListener('touchmove', (e) => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }

            // Remove visual feedback if moving
            this.wrapper.classList.remove('touching');
        }, {
            passive: true
        });

        // Touch cancel - cleanup
        this.wrapper.addEventListener('touchcancel', () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            this.wrapper.classList.remove('touching');
        }, {
            passive: true
        });
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
            this.showCropModal(imageUrl);
        };

        reader.onerror = () => {
            this.showNotification('Không thể đọc file!', 'error');
        };

        reader.readAsDataURL(file);
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

    // ==================== CROPPER FUNCTIONALITY ====================

    initCropperModal() {
        if (!this.cropModal) return;

        // Close modal when clicking outside
        this.cropModal.addEventListener('click', (e) => {
            if (e.target === this.cropModal) {
                this.closeCropModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.cropModal.classList.contains('show')) {
                this.closeCropModal();
            }
        });
    }

    showCropModal(imageSrc) {
        if (!this.cropModal || !this.cropImage || !this.cropLoading) return;

        // Show modal
        this.cropModal.style.display = 'flex';
        this.cropModal.classList.add('show');

        // Show loading, hide container and footer
        this.cropLoading.style.display = 'block';
        if (this.cropContainer) this.cropContainer.style.display = 'none';
        if (this.cropFooter) this.cropFooter.style.display = 'none';
        if (this.saveCropBtn) this.saveCropBtn.disabled = true;

        // Set image source
        this.cropImage.src = imageSrc;

        // Initialize cropper when image loads
        this.cropImage.onload = () => {
            this.cropLoading.style.display = 'none';
            if (this.cropContainer) this.cropContainer.style.display = 'block';
            if (this.cropFooter) this.cropFooter.style.display = 'flex';

            // Destroy existing cropper
            if (this.cropper) {
                this.cropper.destroy();
            }

            // Initialize new cropper
            this.cropper = new Cropper(this.cropImage, {
                aspectRatio: 1,
                viewMode: 1,
                guides: true,
                center: true,
                highlight: false,
                background: true,
                autoCrop: true,
                autoCropArea: 0.8,
                movable: true,
                rotatable: true,
                scalable: true,
                zoomable: true,
                zoomOnTouch: true,
                zoomOnWheel: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: true,
                minCropBoxWidth: 100,
                minCropBoxHeight: 100,
                ready: () => {
                    if (this.saveCropBtn) this.saveCropBtn.disabled = false;
                    console.log('✅ Cropper initialized');
                },
                cropstart: () => {
                    if (this.saveCropBtn) this.saveCropBtn.disabled = false;
                },
                cropmove: () => {
                    if (this.saveCropBtn) this.saveCropBtn.disabled = false;
                }
            });
        };

        this.cropImage.onerror = () => {
            this.cropLoading.style.display = 'none';
            if (this.cropContainer) this.cropContainer.style.display = 'none';
            if (this.cropFooter) this.cropFooter.style.display = 'none';
            this.showNotification('Không thể tải ảnh!', 'error');
            this.closeCropModal();
        };
    }

    closeCropModal() {
        if (!this.cropModal) return;

        this.cropModal.classList.remove('show');
        setTimeout(() => {
            this.cropModal.style.display = 'none';
        }, 300);

        // Destroy cropper
        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = null;
        }

        // Reset file input
        this.inputElement.value = '';

        // Reset modal state
        this.cropLoading.style.display = 'block';
        if (this.cropContainer) this.cropContainer.style.display = 'none';
        if (this.cropFooter) this.cropFooter.style.display = 'none';
        if (this.saveCropBtn) this.saveCropBtn.disabled = true;
    }

    saveCroppedImage() {
        if (!this.cropper) {
            this.showNotification('Cropper chưa sẵn sàng!', 'error');
            return;
        }

        try {
            // Get cropped canvas
            const canvas = this.cropper.getCroppedCanvas({
                width: 400,
                height: 400,
                minWidth: 256,
                minHeight: 256,
                maxWidth: 4096,
                maxHeight: 4096,
                fillColor: '#fff',
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            });

            if (!canvas) {
                this.showNotification('Không thể tạo ảnh đã cắt!', 'error');
                return;
            }

            // Show loading
            this.showNotification('Đang xử lý ảnh...', 'loading');

            // Convert to blob and update image
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    this.updateImage(url);
                    this.saveImage(url);
                    this.showNotification('Đã cập nhật ảnh!', 'success');
                    this.closeCropModal();
                } else {
                    this.showNotification('Không thể tạo ảnh!', 'error');
                }
            }, 'image/jpeg', 0.9);

        } catch (error) {
            console.error('Error saving cropped image:', error);
            this.showNotification('Lỗi khi xử lý ảnh!', 'error');
        }
    }
}

// Initialize when DOM is ready
let profileImageUploader;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        profileImageUploader = new ProfileImageUploader();
    });
} else {
    profileImageUploader = new ProfileImageUploader();
}

// Global functions for HTML onclick handlers
window.closeCropModal = function() {
    if (profileImageUploader) {
        profileImageUploader.closeCropModal();
    }
};

window.saveCroppedImage = function() {
    if (profileImageUploader) {
        profileImageUploader.saveCroppedImage();
    }
};