// ==================== WIDGETS MODULE ====================
// Các tiện ích mở rộng

const Widgets = {
    // ==================== STATISTICS COUNTER ====================
    createStatsWidget() {
        const statsWidget = document.createElement('div');
        statsWidget.className = 'stats-widget';
        statsWidget.innerHTML = `
            <div class="stats-container">
                <div class="stat-item">
                    <i class="fas fa-eye"></i>
                    <span class="stat-number" data-target="1234">0</span>
                    <span class="stat-label">Lượt xem</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-mouse-pointer"></i>
                    <span class="stat-number" data-target="567">0</span>
                    <span class="stat-label">Clicks</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-heart"></i>
                    <span class="stat-number" data-target="890">0</span>
                    <span class="stat-label">Likes</span>
                </div>
            </div>
        `;

        document.querySelector('.container').insertBefore(
            statsWidget,
            document.querySelector('.footer')
        );

        // Animate numbers
        this.animateStats();
        this.addStatsStyles();
    },

    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    this.countUp(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => observer.observe(stat));
    },

    countUp(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 20);
    },

    addStatsStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .stats-widget {
                margin: 30px 0;
                padding: 25px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .stats-container {
                display: flex;
                justify-content: space-around;
                gap: 20px;
                flex-wrap: wrap;
            }

            .stat-item {
                text-align: center;
                flex: 1;
                min-width: 100px;
            }

            .stat-item i {
                font-size: 28px;
                margin-bottom: 10px;
                display: block;
                color: var(--primary-color);
            }

            .stat-number {
                display: block;
                font-size: 32px;
                font-weight: 700;
                margin: 10px 0;
                background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.7));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .stat-label {
                font-size: 14px;
                opacity: 0.8;
                display: block;
            }
        `;
        document.head.appendChild(style);
    },

    // ==================== QR CODE GENERATOR ====================
    createQRWidget() {
        const qrButton = document.createElement('button');
        qrButton.className = 'qr-button';
        qrButton.innerHTML = '<i class="fas fa-qrcode"></i>';
        qrButton.title = 'Hiển thị QR Code';
        document.body.appendChild(qrButton);

        qrButton.addEventListener('click', () => {
            this.showQRModal();
        });

        const style = document.createElement('style');
        style.textContent = `
            .qr-button {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
                z-index: 999;
            }

            .qr-button:hover {
                transform: scale(1.1) rotate(5deg);
                box-shadow: 0 8px 35px rgba(0, 0, 0, 0.4);
            }

            @media (max-width: 768px) {
                .qr-button {
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    font-size: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    },

    showQRModal() {
        const currentURL = window.location.href;
        const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentURL)}`;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content qr-modal">
                <button class="modal-close">&times;</button>
                <h2>Quét QR Code</h2>
                <p>Chia sẻ trang của bạn</p>
                <img src="${qrURL}" alt="QR Code" class="qr-image">
                <div class="qr-actions">
                    <button class="btn-primary" onclick="Widgets.downloadQR('${qrURL}')">
                        <i class="fas fa-download"></i> Tải xuống
                    </button>
                    <button class="btn-secondary" onclick="Widgets.shareQR()">
                        <i class="fas fa-share"></i> Chia sẻ
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    },

    downloadQR(url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qr-code.png';
        a.click();
        this.showToast('QR Code đã được tải xuống!', 'success');
    },

    shareQR() {
        if (navigator.share) {
            navigator.share({
                title: 'Bio Link',
                text: 'Xem trang của tôi!',
                url: window.location.href
            });
        } else {
            this.copyToClipboard(window.location.href);
        }
    },

    // ==================== SHARE WIDGET ====================
    createShareWidget() {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'share-widget';
        shareContainer.innerHTML = `
            <button class="share-trigger">
                <i class="fas fa-share-alt"></i>
                <span>Chia sẻ</span>
            </button>
            <div class="share-options">
                <button onclick="Widgets.shareVia('facebook')" class="share-btn facebook">
                    <i class="fab fa-facebook-f"></i>
                </button>
                <button onclick="Widgets.shareVia('twitter')" class="share-btn twitter">
                    <i class="fab fa-twitter"></i>
                </button>
                <button onclick="Widgets.shareVia('whatsapp')" class="share-btn whatsapp">
                    <i class="fab fa-whatsapp"></i>
                </button>
                <button onclick="Widgets.shareVia('telegram')" class="share-btn telegram">
                    <i class="fab fa-telegram"></i>
                </button>
                <button onclick="Widgets.copyToClipboard('${window.location.href}')" class="share-btn copy">
                    <i class="fas fa-link"></i>
                </button>
            </div>
        `;

        document.querySelector('.footer').before(shareContainer);

        shareContainer.querySelector('.share-trigger').addEventListener('click', () => {
            shareContainer.classList.toggle('active');
        });

        this.addShareStyles();
    },

    shareVia(platform) {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Xem trang bio của tôi!');
        
        const shareURLs = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
            whatsapp: `https://wa.me/?text=${text}%20${url}`,
            telegram: `https://t.me/share/url?url=${url}&text=${text}`
        };

        if (shareURLs[platform]) {
            window.open(shareURLs[platform], '_blank', 'width=600,height=400');
        }
    },

    addShareStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .share-widget {
                text-align: center;
                margin: 30px 0;
                position: relative;
            }

            .share-trigger {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                border: none;
                color: white;
                padding: 15px 30px;
                border-radius: 50px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                transition: all 0.3s ease;
            }

            .share-trigger:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }

            .share-options {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 15px;
                opacity: 0;
                transform: translateY(-10px);
                pointer-events: none;
                transition: all 0.3s ease;
            }

            .share-widget.active .share-options {
                opacity: 1;
                transform: translateY(0);
                pointer-events: all;
            }

            .share-btn {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .share-btn.facebook { background: #1877f2; }
            .share-btn.twitter { background: #1da1f2; }
            .share-btn.whatsapp { background: #25d366; }
            .share-btn.telegram { background: #0088cc; }
            .share-btn.copy { background: #6366f1; }

            .share-btn:hover {
                transform: translateY(-5px) scale(1.1);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            }
        `;
        document.head.appendChild(style);
    },

    // ==================== MUSIC PLAYER WIDGET ====================
    createMusicPlayer(audioURL, title = 'My Favorite Song') {
        const player = document.createElement('div');
        player.className = 'music-player';
        player.innerHTML = `
            <div class="music-player-content">
                <div class="music-info">
                    <i class="fas fa-music"></i>
                    <span class="music-title">${title}</span>
                </div>
                <button class="music-control" data-playing="false">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <audio src="${audioURL}" loop></audio>
        `;

        document.querySelector('.profile-section').after(player);

        const audio = player.querySelector('audio');
        const control = player.querySelector('.music-control');
        const icon = control.querySelector('i');

        control.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                icon.className = 'fas fa-pause';
                control.dataset.playing = 'true';
            } else {
                audio.pause();
                icon.className = 'fas fa-play';
                control.dataset.playing = 'false';
            }
        });

        this.addMusicPlayerStyles();
    },

    addMusicPlayerStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .music-player {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border-radius: 15px;
                padding: 15px 20px;
                margin: 20px 0;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .music-player-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
            }

            .music-info {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
            }

            .music-info i {
                font-size: 20px;
                animation: musicPulse 1.5s infinite;
            }

            @keyframes musicPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }

            .music-title {
                font-weight: 600;
                font-size: 14px;
            }

            .music-control {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .music-control:hover {
                transform: scale(1.1);
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            }

            .music-control[data-playing="true"] i {
                animation: spin 2s linear infinite;
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    },

    // ==================== NOTIFICATION TOAST ====================
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);

        this.addToastStyles();
    },

    addToastStyles() {
        if (document.getElementById('toast-styles')) return;

        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
            }

            .toast.show {
                transform: translateX(0);
            }

            .toast i {
                font-size: 20px;
            }

            .toast-success { border-left: 4px solid #10b981; }
            .toast-error { border-left: 4px solid #ef4444; }
            .toast-warning { border-left: 4px solid #f59e0b; }
            .toast-info { border-left: 4px solid #3b82f6; }
        `;
        document.head.appendChild(style);
    },

    // ==================== MODAL SYSTEM ====================
    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h2 class="modal-title">${title}</h2>
                <div class="modal-body">${content}</div>
            </div>
        `;

        document.body.appendChild(modal);

        setTimeout(() => modal.classList.add('show'), 10);

        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });

        this.addModalStyles();

        return modal;
    },

    closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    },

    addModalStyles() {
        if (document.getElementById('modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .modal-overlay.show {
                opacity: 1;
            }

            .modal-content {
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2));
                backdrop-filter: blur(30px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 20px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                animation: modalSlideIn 0.3s ease;
            }

            @keyframes modalSlideIn {
                from {
                    transform: translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 35px;
                height: 35px;
                border: none;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                font-size: 24px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg);
            }

            .modal-title {
                margin-bottom: 20px;
                font-size: 24px;
                background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.7));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .modal-body {
                color: rgba(255, 255, 255, 0.9);
                line-height: 1.6;
            }

            .qr-image {
                width: 100%;
                max-width: 300px;
                margin: 20px auto;
                display: block;
                border-radius: 15px;
                background: white;
                padding: 20px;
            }

            .qr-actions {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin-top: 20px;
            }

            .btn-primary, .btn-secondary {
                padding: 12px 24px;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            .btn-primary {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
            }

            .btn-secondary {
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            .btn-primary:hover, .btn-secondary:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            }
        `;
        document.head.appendChild(style);
    },

    // ==================== COPY TO CLIPBOARD ====================
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Đã sao chép vào clipboard!', 'success');
        }).catch(() => {
            this.showToast('Không thể sao chép', 'error');
        });
    },

    // ==================== VISITOR COUNTER ====================
    createVisitorCounter() {
        const counter = document.createElement('div');
        counter.className = 'visitor-counter';
        
        // Lấy từ localStorage hoặc tạo mới
        let visits = parseInt(localStorage.getItem('visitCount') || '0');
        visits++;
        localStorage.setItem('visitCount', visits);

        counter.innerHTML = `
            <i class="fas fa-users"></i>
            <span>${visits} lượt truy cập</span>
        `;

        document.querySelector('.footer').prepend(counter);

        const style = document.createElement('style');
        style.textContent = `
            .visitor-counter {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                margin-bottom: 15px;
                font-size: 13px;
            }
        `;
        document.head.appendChild(style);
    }
};

// Export
window.Widgets = Widgets;

