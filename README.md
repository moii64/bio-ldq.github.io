# 🎨 Bio Link - Trang Profile Cá Nhân Hiện Đại

Một trang bio link đẹp mắt, hiện đại với nhiều theme tùy chọn - giống như Linktree nhưng hoàn toàn miễn phí và có thể tùy chỉnh!

![Bio Link Preview](https://img.shields.io/badge/Version-1.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Tính Năng

### 🎨 Themes & Effects
- 🎨 **5 Theme Hiện Đại**: Gradient, Glassmorphism, Neon Dark, Minimal Clean, Nature Green
- 🌸 **Seasonal Effects**: Xuân (hoa rơi), Hạ (sóng biển), Thu (lá vàng), Đông (tuyết rơi)
- 🕐 **Time-based**: Tự động đổi màu theo giờ trong ngày (Sáng/Chiều/Tối/Đêm)
- ⚡ **Advanced Effects**: Particles, custom cursor, parallax, mouse trail
- 💫 **Smooth Animations**: Hiệu ứng chuyển động mượt mà, chuyên nghiệp

### 🛠️ Widgets & Tools
- 📊 **Statistics Widget**: Hiển thị lượt xem, clicks, likes
- 🔗 **QR Code Generator**: Tạo & tải QR code
- 📤 **Share Buttons**: Facebook, Twitter, WhatsApp, Telegram
- 🎵 **Music Player**: Phát nhạc background
- 👥 **Visitor Counter**: Đếm lượt truy cập

### 🎯 Core Features
- 📱 **Responsive Design**: Hoạt động mượt mà trên mọi thiết bị
- 🎯 **Dễ Tùy Chỉnh**: Chỉ cần sửa HTML để thay đổi nội dung
- 🚀 **Performance Tối Ưu**: Load nhanh, 60 FPS
- 💾 **Auto Save**: Tự động nhớ theme & settings
- 🎭 **Easter Eggs**: Rainbow mode, copy link, và nhiều hơn
- ♿ **Accessibility**: Keyboard navigation, screen reader friendly

## 🚀 Bắt Đầu Nhanh

> **📖 Đọc [QUICK-START.md](QUICK-START.md) để bắt đầu nhanh trong 1 phút!**

### Cách 1: Mở Trực Tiếp

1. Mở file `index.html` bằng trình duyệt web
2. Thế thôi! Trang đã sẵn sàng với seasonal effects!

### Cách 2: Local Server (Khuyến nghị)

```bash
# Sử dụng Python
python -m http.server 8000

# Hoặc sử dụng Node.js
npx serve

# Hoặc sử dụng PHP
php -S localhost:8000
```

Sau đó mở: `http://localhost:8000`

## 🎨 Themes & Seasons

### Themes Cơ Bản

| Theme | Mô Tả | Phù Hợp Với |
|-------|-------|-------------|
| **Gradient** | Gradient màu sắc rực rỡ | Content Creator, Artist |
| **Glassmorphism** | Hiệu ứng kính mờ sang trọng | Designer, Photographer |
| **Neon Dark** | Phong cách neon tối | Gamer, Tech Enthusiast |
| **Minimal Clean** | Tối giản, thanh lịch | Professional, Business |
| **Nature Green** | Xanh tự nhiên, thân thiện | Eco Brand, Health & Wellness |

### 🌸☀️🍂❄️ Seasonal Effects (MỚI!)

> **📖 Xem chi tiết tại [SEASONAL-GUIDE.md](SEASONAL-GUIDE.md)**

| Mùa | Hiệu Ứng | Tháng | Màu Sắc |
|-----|----------|-------|---------|
| 🌸 **Xuân** | Hoa anh đào rơi | 2-4 | Hồng pastel |
| ☀️ **Hạ** | Sóng biển & ánh nắng | 5-7 | Xanh & Vàng |
| 🍂 **Thu** | Lá vàng rơi | 8-10 | Cam & Đỏ |
| ❄️ **Đông** | Tuyết rơi | 11-1 | Xanh lạnh |

**Features:**
- ✅ Tự động theo tháng hiện tại
- ✅ Thủ công chuyển mùa
- ✅ Kết hợp với themes cơ bản
- ✅ 🕐 Auto-switch theo giờ trong ngày

## 📝 Tùy Chỉnh Nội Dung

### 1. Thông Tin Cá Nhân

Mở `index.html` và tìm phần Profile Section:

```html
<div class="profile-image">
    <img src="ĐƯA_LINK_ẢNH_CỦA_BẠN" alt="Profile Picture">
</div>
<h1 class="profile-name">Tên của bạn</h1>
<p class="profile-bio">
    ✨ Mô tả về bạn<br>
    📍 Vị trí
</p>
```

### 2. Social Media Links

Cập nhật links trong phần Social Links:

```html
<a href="https://facebook.com/yourpage" class="social-icon">
    <i class="fab fa-facebook-f"></i>
</a>
```

### 3. Thêm/Sửa Link Cards

```html
<a href="YOUR_LINK_HERE" class="link-card">
    <div class="link-icon">
        <i class="fas fa-YOUR-ICON"></i>
    </div>
    <div class="link-content">
        <span class="link-title">Tiêu đề link</span>
        <span class="link-subtitle">Mô tả ngắn</span>
    </div>
    <i class="fas fa-arrow-right link-arrow"></i>
</a>
```

### 4. Link Đặc Biệt (Highlighted)

Thêm class `special` để làm nổi bật:

```html
<a href="#" class="link-card special">
    <!-- Nội dung -->
</a>
```

## 🎯 Icons

Project sử dụng [Font Awesome 6](https://fontawesome.com/icons):

- `fa-globe` - Website
- `fa-shopping-bag` - Shop
- `fa-video` - Video/YouTube
- `fa-book` - Blog
- `fa-envelope` - Email
- `fa-star` - Featured
- `fa-music` - Music
- `fa-camera` - Photography
- `fa-gamepad` - Gaming

[Xem thêm icons tại đây](https://fontawesome.com/search?o=r&m=free)

## ⌨️ Phím Tắt

- `1` - Theme Gradient
- `2` - Theme Glassmorphism
- `3` - Theme Neon
- `4` - Theme Minimal
- `5` - Theme Nature
- **Gõ "rainbow"** - Kích hoạt Rainbow Mode 🌈
- **Double-click tên** - Copy link trang

## 🎭 Easter Eggs

1. **Rainbow Mode**: Gõ "rainbow" trên bàn phím
2. **Copy Link**: Double-click vào tên của bạn
3. **Profile Animation**: Click vào ảnh đại diện
4. **Ripple Effect**: Click vào bất kỳ link nào

## 🌐 Deploy Lên Internet

### GitHub Pages (Miễn Phí)

1. Tạo repository mới trên GitHub
2. Upload các file lên repo
3. Vào Settings → Pages
4. Chọn branch `main` và Save
5. Xong! Link sẽ là: `https://username.github.io/repo-name`

### Netlify (Miễn Phí)

1. Đăng ký tại [Netlify](https://netlify.com)
2. Kéo thả folder vào Netlify
3. Nhận link miễn phí ngay lập tức!

### Vercel (Miễn Phí)

```bash
npm i -g vercel
cd bio_link
vercel
```

## 🎨 Tùy Chỉnh Theme

### Tạo Theme Riêng

Thêm vào `styles.css`:

```css
body.theme-yourtheme {
    --primary-color: #YOUR_COLOR;
    --secondary-color: #YOUR_COLOR;
}

body.theme-yourtheme::before {
    background: linear-gradient(135deg, #COLOR1, #COLOR2);
}

body.theme-yourtheme .link-card {
    background: YOUR_STYLE;
    border: YOUR_BORDER;
}
```

Thêm button trong `index.html`:

```html
<button class="theme-btn" data-theme="yourtheme" title="Your Theme">
    <i class="fas fa-your-icon"></i>
</button>
```

## 📊 Analytics (Tùy Chọn)

Để theo dõi lượt truy cập, thêm Google Analytics vào `index.html`:

```html
<head>
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'YOUR_GA_ID');
    </script>
</head>
```

## 🔧 Tối Ưu Hóa

### SEO

Thêm meta tags vào `<head>`:

```html
<meta name="description" content="Mô tả về bạn">
<meta name="keywords" content="tên bạn, nghề nghiệp, kỹ năng">
<meta property="og:title" content="Tên của bạn">
<meta property="og:description" content="Mô tả">
<meta property="og:image" content="URL_ẢNH">
```

### Performance

- Ảnh nên < 200KB
- Sử dụng WebP format cho ảnh
- Enable caching trên hosting

## 🆘 Troubleshooting

### Icons không hiển thị?
- Kiểm tra kết nối internet
- Font Awesome CDN có thể bị chặn, thử CDN khác

### Theme không lưu?
- Kiểm tra localStorage có bị disable không
- Thử ở chế độ incognito/private

### Không responsive?
- Đảm bảo có meta viewport tag
- Clear cache và reload

## 📚 Cấu Trúc File

```
bio_link/
│
├── index.html          # File HTML chính
├── styles.css          # Tất cả CSS và themes
├── script.js           # JavaScript và interactivity
└── README.md           # File này
```

## 🎓 Học Thêm

- **HTML/CSS Basics**: [MDN Web Docs](https://developer.mozilla.org)
- **Font Awesome Icons**: [FontAwesome.com](https://fontawesome.com)
- **CSS Animations**: [Animate.css](https://animate.style)
- **Color Palettes**: [Coolors.co](https://coolors.co)

## 💡 Ý Tưởng Mở Rộng

- [ ] Thêm dark/light mode toggle
- [ ] Tích hợp form liên hệ
- [ ] Thêm visitor counter
- [ ] QR code generator
- [ ] Share buttons
- [ ] Music player
- [ ] Video background option
- [ ] Language switcher

## 🤝 Contributing

Mọi đóng góp đều được chào đón! Feel free to:

1. Fork project
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 🙏 Credits

- **Icons**: [Font Awesome](https://fontawesome.com)
- **Inspiration**: Linktree, Beacons, Carrd
- **Made with**: ❤️ và ☕

## 📞 Support

Gặp vấn đề? Có câu hỏi?

- 📧 Email: your@email.com
- 💬 Issues: [GitHub Issues](https://github.com/yourname/bio-link/issues)
- 🌟 Star project nếu thích!

---

**Happy Coding! 🚀**

Made with ❤️ in Vietnam 🇻🇳

