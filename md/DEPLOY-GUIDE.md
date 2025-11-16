# 🚀 Hướng Dẫn Deploy lên AwardSpace

## 📋 Checklist Trước Khi Upload

### ✅ Files Cần Upload:

```
bio_link/
├── index.html              ✅ Bắt buộc
├── styles.css              ✅ Bắt buộc
├── script.js               ✅ Bắt buộc
├── effects.js              ✅ Bắt buộc (nếu dùng effects)
├── widgets.js              ✅ Bắt buộc (nếu dùng widgets)
├── seasonal-effects.js     ✅ Bắt buộc (nếu dùng seasonal)
├── .htaccess               ✅ Khuyến nghị
│
├── README.md               ⚠️ Tùy chọn (không cần)
├── SEASONAL-GUIDE.md       ⚠️ Tùy chọn (không cần)
├── QUICK-START.md          ⚠️ Tùy chọn (không cần)
├── threads-icon.html       ⚠️ Tùy chọn (không cần)
├── mobile-3d-tilt.js       ⚠️ Tùy chọn (không cần)
└── GLOBAL-TILT-GUIDE.md    ⚠️ Tùy chọn (không cần)
```

## 🌐 Bước 1: Đăng Nhập AwardSpace

1. Truy cập: [https://cp1.awardspace.net/](https://cp1.awardspace.net/)
2. Nhập **Client ID** hoặc **E-mail**
3. Nhập **Password**
4. Click **Log in**

## 📁 Bước 2: Truy Cập File Manager

1. Sau khi đăng nhập, tìm **File Manager**
2. Hoặc tìm **FTP Accounts** để dùng FTP client

## 📤 Bước 3: Upload Files

### Cách 1: Dùng File Manager (Khuyến nghị cho người mới)

1. **Mở File Manager** trong control panel
2. **Navigate** đến folder `public_html` hoặc `htdocs`
3. **Delete** file `index.html` mặc định (nếu có)
4. **Upload** các files sau:
   ```
   ✅ index.html
   ✅ styles.css
   ✅ script.js
   ✅ effects.js
   ✅ widgets.js
   ✅ seasonal-effects.js
   ✅ .htaccess
   ```

5. **Kiểm tra** tất cả files đã upload thành công

### Cách 2: Dùng FTP Client (Nhanh hơn, cho người có kinh nghiệm)

#### Thông tin FTP từ AwardSpace:
```
FTP Host: ftp.yoursite.awardspace.net
FTP Port: 21
Username: your_username
Password: your_password
```

#### Sử dụng FileZilla:

1. **Download FileZilla**: [https://filezilla-project.org/](https://filezilla-project.org/)
2. **Mở FileZilla**
3. **Nhập thông tin FTP** (lấy từ control panel)
4. **Connect**
5. **Navigate** đến folder `public_html` bên phải
6. **Kéo thả** tất cả files từ máy tính sang server
7. **Wait** cho upload hoàn tất

## 🔧 Bước 4: Cấu Hình (Optional)

### Kiểm tra file .htaccess:
```apache
# Đảm bảo .htaccess đã upload
# File này ẩn, có thể cần "Show hidden files"
```

### Kiểm tra quyền files:
```
index.html  → 644 (rw-r--r--)
*.css       → 644
*.js        → 644
.htaccess   → 644
```

## 🌍 Bước 5: Truy Cập Website

1. **URL mặc định**: `http://yoursite.awardspace.net`
2. **Custom domain** (nếu đã setup): `http://yourdomain.com`

### Kiểm tra:
- ✅ Trang hiển thị đúng
- ✅ Seasonal effects hoạt động
- ✅ 3D tilt hoạt động
- ✅ Links hoạt động
- ✅ Mobile responsive

## 🐛 Troubleshooting

### 1. Trang không hiển thị?
```
❌ Lỗi: "Index of /" hoặc blank page

✅ Giải pháp:
- Đảm bảo file tên là "index.html" (chữ thường)
- File phải ở trong public_html
- Xóa file index.html mặc định cũ
```

### 2. CSS/JS không load?
```
❌ Lỗi: Trang hiển thị nhưng không có style

✅ Giải pháp:
- Check đường dẫn trong index.html
- Đảm bảo styles.css, script.js đã upload
- Check Console (F12) xem lỗi gì
- Đường dẫn phải là relative: "styles.css" KHÔNG "/styles.css"
```

### 3. Seasonal effects không hoạt động?
```
❌ Lỗi: Không có tuyết/lá/hoa rơi

✅ Giải pháp:
- Đảm bảo seasonal-effects.js đã upload
- Check Console (F12) xem có lỗi JavaScript
- Kiểm tra file có được include trong index.html
```

### 4. 3D Tilt không hoạt động trên mobile?
```
❌ Lỗi: Nghiêng phone không làm gì

✅ Giải pháp:
- iOS 13+ cần HTTPS (upgrade hosting hoặc dùng Cloudflare)
- Check Settings > Safari > Motion & Orientation Access
- Chỉ hoạt động sau khi touch vào màn hình lần đầu
```

### 5. Images không hiển thị?
```
❌ Lỗi: Ảnh đại diện không hiển thị

✅ Giải pháp:
- Nếu dùng link Facebook: Link có thể hết hạn
- Upload ảnh lên cùng folder và dùng đường dẫn local
- Hoặc dùng image hosting: imgur.com, imgbb.com
```

## 🔐 Bảo Mật

### Files KHÔNG nên upload:
```
❌ .git/
❌ .env
❌ node_modules/
❌ *.md (nếu không cần)
❌ package.json
❌ *.config.js
```

### Tối ưu bảo mật:
```apache
# Trong .htaccess
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>
```

## ⚡ Tối Ưu Hóa

### 1. Minify CSS/JS (Optional)
```
Sử dụng online tools:
- https://www.minifier.org/
- https://cssminifier.com/
- https://javascript-minifier.com/
```

### 2. Optimize Images
```
- Resize ảnh đại diện: 500x500px
- Compress: https://tinypng.com/
- Format: WebP hoặc JPG
```

### 3. Enable Caching
```apache
# Đã có trong .htaccess
# Cache 1 year cho images
# Cache 1 month cho CSS/JS
```

## 📊 Monitoring

### Google Analytics (Optional)

Thêm vào `<head>` của index.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🆙 Update Website

### Khi có thay đổi:

1. **Edit local files** trên máy tính
2. **Test** trên local (mở index.html)
3. **Upload** files đã sửa lên server (overwrite)
4. **Clear cache** trên browser (Ctrl + F5)
5. **Check** website đã update chưa

### Quick Update qua FTP:
```
1. Connect FTP
2. Upload only changed files
3. Overwrite existing files
4. Done!
```

## 🌟 Nâng Cấp (Optional)

### 1. Custom Domain
```
1. Mua domain (Namecheap, GoDaddy, etc.)
2. Point domain to AwardSpace nameservers
3. Add domain trong AwardSpace control panel
4. Wait 24-48 hours cho DNS propagate
```

### 2. HTTPS/SSL
```
- Free plan: Dùng Cloudflare SSL
- Paid plan: AwardSpace cung cấp SSL
```

### 3. CDN
```
- Cloudflare (Free)
- jsDelivr cho static files
- Tăng tốc load page
```

## 📋 Checklist Sau Khi Deploy

- [ ] Website load được
- [ ] CSS/JS hoạt động
- [ ] Seasonal effects hoạt động
- [ ] Themes có thể đổi
- [ ] Links hoạt động
- [ ] Mobile responsive
- [ ] 3D tilt hoạt động (desktop)
- [ ] Gyroscope tilt hoạt động (mobile)
- [ ] Images hiển thị
- [ ] Social links đúng
- [ ] QR code (nếu có) hoạt động
- [ ] Analytics setup (nếu có)

## 🎉 Hoàn Tất!

Website của bạn giờ đã LIVE tại:
```
http://yoursite.awardspace.net
```

### Share với bạn bè:
```
📱 QR Code
🔗 Direct link
📤 Social media
```

## 📞 Support

### AwardSpace Support:
- Website: https://www.awardspace.com/
- Forums: https://www.awardspace.com/forum/
- Contact: support@awardspace.com

### Issues với code:
- Check Console (F12)
- Xem SEASONAL-GUIDE.md
- Xem README.md

---

**Chúc bạn deploy thành công! 🚀**

Made with ❤️ in Vietnam 🇻🇳

