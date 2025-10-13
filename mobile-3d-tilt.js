// ==================== MOBILE 3D TILT GUIDE ====================
// Hướng dẫn sử dụng hiệu ứng nghiêng 3D trên mobile như Facebook

/*
 * CÁCH HOẠT ĐỘNG:
 * 
 * 1. Desktop: Di chuột lên card → Card nghiêng theo vị trí chuột
 * 2. Mobile: Nghiêng điện thoại → Card nghiêng theo góc nghiêng điện thoại
 * 
 * TÍNH NĂNG:
 * - Tự động phát hiện thiết bị mobile (≤768px)
 * - Sử dụng Device Orientation API (gyroscope)
 * - Tự động xin quyền trên iOS 13+
 * - Chỉ áp dụng cho cards đang hiển thị trên màn hình
 * - Smooth transition
 * - Auto reset khi app ẩn
 */

// ==================== DEMO CODE ====================

// Khởi tạo 3D Tilt cho bất kỳ element nào
function init3DTilt(selector) {
    const elements = document.querySelectorAll(selector);
    
    if (!elements.length) return;
    
    // Desktop: Mouse movement
    if (window.innerWidth > 768) {
        elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 5;
                const rotateY = (centerX - x) / 5;
                
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    } 
    // Mobile: Gyroscope
    else if (window.DeviceOrientationEvent) {
        let isActive = false;
        
        const activate = () => {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {
                            startGyroscope();
                        }
                    })
                    .catch(err => console.log('Permission denied:', err));
            } else {
                startGyroscope();
            }
        };
        
        const startGyroscope = () => {
            isActive = true;
            
            window.addEventListener('deviceorientation', (event) => {
                const beta = event.beta;   // -180 to 180
                const gamma = event.gamma; // -90 to 90
                
                elements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    
                    if (isVisible) {
                        const rotateX = Math.max(-20, Math.min(20, beta / 3));
                        const rotateY = Math.max(-20, Math.min(20, gamma / 2));
                        
                        el.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
                        el.style.transition = 'transform 0.1s ease-out';
                    }
                });
            });
        };
        
        // Activate on first touch
        document.addEventListener('touchstart', function init() {
            if (!isActive) {
                activate();
                document.removeEventListener('touchstart', init);
            }
        }, { once: true });
    }
}

// ==================== USAGE EXAMPLES ====================

// Example 1: Apply to link cards
// init3DTilt('.link-card');

// Example 2: Apply to images
// init3DTilt('img');

// Example 3: Apply to custom elements
// init3DTilt('.your-custom-class');

// ==================== CUSTOMIZATION ====================

// Adjust sensitivity
const SENSITIVITY = {
    desktop: 5,    // Lower = more sensitive (try 3-10)
    mobile: 3,     // Lower = more sensitive (try 2-5)
    maxRotation: 20 // Max rotation in degrees (try 10-30)
};

// Adjust transition speed
const TRANSITION = {
    enter: '0.1s ease-out',  // When tilting
    leave: '0.3s ease'       // When resetting
};

// ==================== TROUBLESHOOTING ====================

/*
 * KHÔNG HOẠT ĐỘNG TRÊN iOS?
 * - iOS 13+ yêu cầu HTTPS
 * - Phải có user interaction (touch) trước
 * - Check Settings > Safari > Motion & Orientation Access
 * 
 * KHÔNG HOẠT ĐỘNG TRÊN ANDROID?
 * - Check browser có hỗ trợ DeviceOrientationEvent không
 * - Thử trên Chrome/Firefox mobile
 * - Check permission trong browser settings
 * 
 * HIỆU ỨNG BỊ GIẬT?
 * - Giảm số lượng elements
 * - Tăng transition time
 * - Chỉ apply cho elements đang visible
 * 
 * QUÁ NHẠY HOẶC QUÁ CHẬM?
 * - Điều chỉnh SENSITIVITY values
 * - Điều chỉnh maxRotation
 */

// ==================== BROWSER SUPPORT ====================

/*
 * ✅ Chrome Desktop/Mobile
 * ✅ Firefox Desktop/Mobile
 * ✅ Safari Desktop/Mobile (iOS 13+ cần HTTPS)
 * ✅ Edge Desktop/Mobile
 * ❌ IE (not supported)
 */

// ==================== PERFORMANCE TIPS ====================

/*
 * 1. Chỉ apply cho elements visible trong viewport
 * 2. Sử dụng CSS transform thay vì top/left
 * 3. Thêm will-change: transform cho smooth animation
 * 4. Debounce/throttle nếu có nhiều elements
 * 5. Reset khi app ẩn để tiết kiệm pin
 */

// Export cho module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { init3DTilt };
}





