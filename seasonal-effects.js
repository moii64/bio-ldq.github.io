// ==================== SEASONAL & TIME-BASED EFFECTS ====================
// Hiệu ứng theo mùa và thời gian thực

const SeasonalEffects = {
    config: {
        autoSwitch: true,
        autoTime: true,
        currentSeason: null,
        currentTimeTheme: null
    },

    // ==================== KHỞI TẠO ====================
    init() {
        this.detectSeason();
        this.detectTimeOfDay();
        this.createSeasonSelector();
        
        if (this.config.autoSwitch) {
            this.applySeason(this.config.currentSeason);
        }
        
        if (this.config.autoTime) {
            this.applyTimeTheme(this.config.currentTimeTheme);
        }

        // Update mỗi phút
        setInterval(() => {
            if (this.config.autoTime) {
                this.detectTimeOfDay();
                this.applyTimeTheme(this.config.currentTimeTheme);
            }
        }, 60000);

        console.log(`🌸 Season: ${this.config.currentSeason} | 🕐 Time: ${this.config.currentTimeTheme}`);
    },

    // ==================== PHÁT HIỆN MÙA ====================
    detectSeason() {
        const month = new Date().getMonth() + 1;
        
        // Theo lịch Việt Nam / Châu Á
        if (month >= 2 && month <= 4) {
            this.config.currentSeason = 'spring'; // Xuân
        } else if (month >= 5 && month <= 7) {
            this.config.currentSeason = 'summer'; // Hạ
        } else if (month >= 8 && month <= 10) {
            this.config.currentSeason = 'fall'; // Thu
        } else {
            this.config.currentSeason = 'winter'; // Đông
        }
    },

    // ==================== PHÁT HIỆN THỜI GIAN ====================
    detectTimeOfDay() {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 12) {
            this.config.currentTimeTheme = 'morning'; // Sáng
        } else if (hour >= 12 && hour < 17) {
            this.config.currentTimeTheme = 'afternoon'; // Chiều
        } else if (hour >= 17 && hour < 20) {
            this.config.currentTimeTheme = 'evening'; // Tối
        } else {
            this.config.currentTimeTheme = 'night'; // Đêm
        }
    },

    // ==================== SELECTOR UI ====================
    createSeasonSelector() {
        const selector = document.createElement('div');
        selector.className = 'season-selector';
        selector.innerHTML = `
            <div class="season-toggle">
                <button class="season-btn" data-season="spring" title="Mùa Xuân">
                    🌸
                </button>
                <button class="season-btn" data-season="summer" title="Mùa Hạ">
                    ☀️
                </button>
                <button class="season-btn" data-season="fall" title="Mùa Thu">
                    🍂
                </button>
                <button class="season-btn" data-season="winter" title="Mùa Đông">
                    ❄️
                </button>
            </div>
            <div class="time-toggle">
                <label class="toggle-switch">
                    <input type="checkbox" id="autoTimeToggle" ${this.config.autoTime ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
                <span class="toggle-label">🕐 Auto Time</span>
            </div>
        `;

        document.body.appendChild(selector);

        // Season buttons
        selector.querySelectorAll('.season-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const season = btn.dataset.season;
                this.applySeason(season);
                this.config.autoSwitch = false;
            });
        });

        // Time toggle
        selector.querySelector('#autoTimeToggle').addEventListener('change', (e) => {
            this.config.autoTime = e.target.checked;
            if (e.target.checked) {
                this.detectTimeOfDay();
                this.applyTimeTheme(this.config.currentTimeTheme);
            }
        });

        this.addSelectorStyles();
    },

    // ==================== XUÂN - SPRING ====================
    applySeason(season) {
        // Remove tất cả effects cũ
        this.removeAllSeasonalEffects();

        switch(season) {
            case 'spring':
                this.createSpringEffect();
                break;
            case 'summer':
                this.createSummerEffect();
                break;
            case 'fall':
                this.createFallEffect();
                break;
            case 'winter':
                this.createWinterEffect();
                break;
        }

        // Update active button
        document.querySelectorAll('.season-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.season === season);
        });

        this.config.currentSeason = season;
    },

    // XUÂN - HOA ANH ĐÀO RƠI
    createSpringEffect() {
        document.body.classList.add('season-spring');
        
        const canvas = document.createElement('canvas');
        canvas.className = 'season-canvas';
        canvas.id = 'spring-canvas';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const petals = [];

        class Petal {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -20;
                this.size = Math.random() * 8 + 4;
                this.speedY = Math.random() * 2 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 4 - 2;
                this.opacity = Math.random() * 0.6 + 0.4;
                this.swayAmplitude = Math.random() * 2 + 1;
                this.swaySpeed = Math.random() * 0.02 + 0.01;
                this.swayOffset = Math.random() * Math.PI * 2;
            }

            update() {
                this.y += this.speedY;
                this.x += Math.sin(this.y * this.swaySpeed + this.swayOffset) * this.swayAmplitude;
                this.rotation += this.rotationSpeed;

                if (this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.globalAlpha = this.opacity;

                // Vẽ hoa anh đào
                ctx.fillStyle = '#FFB7C5';
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 72) * Math.PI / 180;
                    const x = Math.cos(angle) * this.size;
                    const y = Math.sin(angle) * this.size;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();

                // Nhụy hoa
                ctx.fillStyle = '#FF69B4';
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }

        // Tạo cánh hoa
        for (let i = 0; i < 30; i++) {
            petals.push(new Petal());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petals.forEach(petal => {
                petal.update();
                petal.draw();
            });
            requestAnimationFrame(animate);
        }

        animate();

        // Theme colors
        document.documentElement.style.setProperty('--primary-color', '#FF69B4');
        document.documentElement.style.setProperty('--secondary-color', '#FFB7C5');

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    },

    // HẠ - BÃI BIỂN & SÓNG NƯỚC
    createSummerEffect() {
        document.body.classList.add('season-summer');
        
        const canvas = document.createElement('canvas');
        canvas.className = 'season-canvas';
        canvas.id = 'summer-canvas';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let waveOffset = 0;
        const particles = [];

        // Sun particles (ánh nắng)
        class SunParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height * 0.3;
                this.size = Math.random() * 3 + 1;
                this.speedY = Math.random() * 0.5 + 0.2;
                this.opacity = Math.random() * 0.5 + 0.3;
            }

            update() {
                this.y += this.speedY;
                if (this.y > canvas.height) {
                    this.y = 0;
                    this.x = Math.random() * canvas.width;
                }
            }

            draw() {
                ctx.fillStyle = `rgba(255, 223, 0, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 20; i++) {
            particles.push(new SunParticle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Vẽ sóng nước
            ctx.beginPath();
            ctx.moveTo(0, canvas.height * 0.7);
            
            for (let x = 0; x < canvas.width; x += 10) {
                const y = canvas.height * 0.7 + Math.sin((x + waveOffset) * 0.02) * 20;
                ctx.lineTo(x, y);
            }
            
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            
            const gradient = ctx.createLinearGradient(0, canvas.height * 0.7, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(0, 191, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(30, 144, 255, 0.2)');
            ctx.fillStyle = gradient;
            ctx.fill();

            // Particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            waveOffset += 2;
            requestAnimationFrame(animate);
        }

        animate();

        document.documentElement.style.setProperty('--primary-color', '#00BFFF');
        document.documentElement.style.setProperty('--secondary-color', '#FFD700');

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    },

    // THU - LÁ RƠI
    createFallEffect() {
        document.body.classList.add('season-fall');
        
        const canvas = document.createElement('canvas');
        canvas.className = 'season-canvas';
        canvas.id = 'fall-canvas';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const leaves = [];
        const colors = ['#FF6B35', '#F7931E', '#FDC830', '#C1502E', '#8B4513'];

        class Leaf {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -20;
                this.size = Math.random() * 15 + 10;
                this.speedY = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 2 - 1;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 5 - 2.5;
                this.swayAmplitude = Math.random() * 3 + 1;
                this.swaySpeed = Math.random() * 0.03 + 0.01;
                this.swayOffset = Math.random() * Math.PI * 2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.5 + 0.5;
            }

            update() {
                this.y += this.speedY;
                this.x += Math.sin(this.y * this.swaySpeed + this.swayOffset) * this.swayAmplitude;
                this.rotation += this.rotationSpeed;

                if (this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.globalAlpha = this.opacity;

                // Vẽ lá
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 0.6, this.size, 0, 0, Math.PI * 2);
                ctx.fill();

                // Gân lá
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(0, this.size);
                ctx.stroke();

                ctx.restore();
            }
        }

        for (let i = 0; i < 40; i++) {
            leaves.push(new Leaf());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            leaves.forEach(leaf => {
                leaf.update();
                leaf.draw();
            });
            requestAnimationFrame(animate);
        }

        animate();

        document.documentElement.style.setProperty('--primary-color', '#FF6B35');
        document.documentElement.style.setProperty('--secondary-color', '#FDC830');

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    },

    // ĐÔNG - TUYẾT RƠI
    createWinterEffect() {
        document.body.classList.add('season-winter');
        
        const canvas = document.createElement('canvas');
        canvas.className = 'season-canvas';
        canvas.id = 'winter-canvas';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const snowflakes = [];

        class Snowflake {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -20;
                this.size = Math.random() * 5 + 2;
                this.speedY = Math.random() * 1 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.opacity = Math.random() * 0.7 + 0.3;
                this.swayAmplitude = Math.random() * 2 + 1;
                this.swaySpeed = Math.random() * 0.02 + 0.01;
                this.swayOffset = Math.random() * Math.PI * 2;
            }

            update() {
                this.y += this.speedY;
                this.x += Math.sin(this.y * this.swaySpeed + this.swayOffset) * this.swayAmplitude;

                if (this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = '#FFFFFF';
                
                // Vẽ bông tuyết 6 cánh
                ctx.translate(this.x, this.y);
                for (let i = 0; i < 6; i++) {
                    ctx.rotate(Math.PI / 3);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, -this.size);
                    ctx.lineTo(-this.size * 0.3, -this.size * 0.7);
                    ctx.moveTo(0, -this.size);
                    ctx.lineTo(this.size * 0.3, -this.size * 0.7);
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                ctx.restore();
            }
        }

        for (let i = 0; i < 50; i++) {
            snowflakes.push(new Snowflake());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            snowflakes.forEach(flake => {
                flake.update();
                flake.draw();
            });
            requestAnimationFrame(animate);
        }

        animate();

        document.documentElement.style.setProperty('--primary-color', '#4FC3F7');
        document.documentElement.style.setProperty('--secondary-color', '#E3F2FD');

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    },

    // ==================== TIME-BASED THEMES ====================
    applyTimeTheme(timeTheme) {
        document.body.className = document.body.className.replace(/time-\w+/g, '');
        document.body.classList.add(`time-${timeTheme}`);

        // Thay đổi độ sáng và màu sắc
        const timeStyles = {
            morning: {
                brightness: 1.1,
                hue: 'rotate(10deg)',
                saturation: 1.2
            },
            afternoon: {
                brightness: 1.2,
                hue: 'rotate(0deg)',
                saturation: 1.3
            },
            evening: {
                brightness: 0.9,
                hue: 'rotate(-10deg)',
                saturation: 1.1
            },
            night: {
                brightness: 0.7,
                hue: 'rotate(-20deg)',
                saturation: 0.9
            }
        };

        const style = timeStyles[timeTheme];
        document.body.style.filter = `brightness(${style.brightness}) hue-${style.hue} saturate(${style.saturation})`;
    },

    // ==================== XÓA EFFECTS ====================
    removeAllSeasonalEffects() {
        const canvases = document.querySelectorAll('.season-canvas');
        canvases.forEach(canvas => canvas.remove());
        
        document.body.className = document.body.className.replace(/season-\w+/g, '');
    },

    // ==================== STYLES ====================
    addSelectorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .season-selector {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .season-toggle {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                padding: 10px;
                border-radius: 20px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .season-btn {
                width: 50px;
                height: 50px;
                border: none;
                border-radius: 15px;
                background: rgba(255, 255, 255, 0.2);
                font-size: 24px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .season-btn:hover {
                transform: scale(1.1);
                background: rgba(255, 255, 255, 0.3);
            }

            .season-btn.active {
                background: rgba(255, 255, 255, 0.4);
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
                transform: scale(1.15);
            }

            .time-toggle {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                padding: 12px;
                border-radius: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }

            .toggle-label {
                font-size: 12px;
                font-weight: 600;
                color: white;
            }

            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 26px;
            }

            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(255, 255, 255, 0.3);
                transition: .3s;
                border-radius: 26px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
            }

            input:checked + .slider {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            }

            input:checked + .slider:before {
                transform: translateX(24px);
            }

            .season-canvas {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            }

            @media (max-width: 768px) {
                .season-selector {
                    top: 80px;
                    right: 10px;
                }

                .season-btn {
                    width: 45px;
                    height: 45px;
                    font-size: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SeasonalEffects.init());
} else {
    SeasonalEffects.init();
}

window.SeasonalEffects = SeasonalEffects;

