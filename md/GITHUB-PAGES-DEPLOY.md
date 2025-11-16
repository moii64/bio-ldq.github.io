# 🚀 Deploy Bio Link lên GitHub Pages

## 🌟 Tại Sao GitHub Pages?

- ✅ **100% MIỄN PHÍ** mãi mãi
- ✅ **KHÔNG có ads** hay redirects
- ✅ **HTTPS miễn phí** (cần cho mobile gyroscope!)
- ✅ **Tốc độ cao** - CDN toàn cầu
- ✅ **Custom domain** support
- ✅ **Professional & Reliable**
- ✅ **Deploy trong 5 phút!**

---

## 📋 BƯỚC 1: Tạo GitHub Account

### Nếu chưa có account:

1. Truy cập: **https://github.com/signup**
2. Nhập **Email**
3. Nhập **Password** (ít nhất 15 ký tự hoặc 8 ký tự + số)
4. Nhập **Username** (tên này sẽ là domain của bạn!)
5. **Verify** (giải puzzle)
6. Check email để **Verify account**
7. **Done!** ✅

### Ví dụ username:
```
ducquang      → ducquang.github.io
myportfolio   → myportfolio.github.io
biolink2024   → biolink2024.github.io
```

---

## 📁 BƯỚC 2: Tạo Repository

### Cách 1: Special Repository (Recommended)

1. Sau khi login, click nút **"New"** (màu xanh)
2. **Repository name**: `yourusername.github.io`
   ```
   Ví dụ: nếu username là "ducquang"
   Thì tên repo: ducquang.github.io
   ```
3. **Description**: "My Bio Link Page" (tùy chọn)
4. Chọn **Public** ✅ (bắt buộc cho free)
5. **KHÔNG tick** "Add a README file"
6. Click **"Create repository"** ✅

**URL website sẽ là:** `https://yourusername.github.io`

### Cách 2: Normal Repository (Alternative)

1. Click **"New"**
2. **Repository name**: bất kỳ (ví dụ: `bio-link`)
3. Chọn **Public**
4. Create

**URL website sẽ là:** `https://yourusername.github.io/bio-link`

---

## 📤 BƯỚC 3: Upload Files

### Cách A: Upload qua Web (Dễ nhất!)

1. Sau khi tạo repo, click **"uploading an existing file"**
   
   Hoặc nếu repo đã có files, click **"Add file"** → **"Upload files"**

2. **Kéo thả 6 files** vào (KHÔNG cần .htaccess):
   ```
   ✅ index.html
   ✅ styles.css
   ✅ script.js
   ✅ effects.js
   ✅ widgets.js
   ✅ seasonal-effects.js
   ```

3. Scroll xuống, **Commit message**: "Initial commit"

4. Click **"Commit changes"** ✅

5. **Wait** 30-60 giây để GitHub process

### Cách B: Upload qua GitHub Desktop (Dễ hơn cho lần sau)

1. **Download GitHub Desktop**: https://desktop.github.com/
2. **Install** và **Sign in**
3. Click **"Add"** → **"Clone repository"**
4. Chọn repo vừa tạo → **Clone**
5. **Copy 6 files** vào folder repo (trên máy)
6. Mở GitHub Desktop → thấy files changed
7. **Commit message**: "Initial commit"
8. Click **"Commit to main"**
9. Click **"Push origin"** ✅

### Cách C: Git Command Line (Cho pro)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/yourusername.github.io.git
cd yourusername.github.io

# 2. Copy 6 files vào folder này

# 3. Add, commit, push
git add .
git commit -m "Initial commit"
git push origin main
```

---

## ⚙️ BƯỚC 4: Enable GitHub Pages

### Nếu dùng username.github.io:
**✅ TỰ ĐỘNG BẬT!** Không cần làm gì!

### Nếu dùng repository thường:

1. Vào repository
2. Click **"Settings"** (tab trên cùng)
3. Scroll xuống hoặc click **"Pages"** (menu bên trái)
4. **Source**: chọn **"Deploy from a branch"**
5. **Branch**: chọn **"main"** (hoặc "master") → **"/ (root)"**
6. Click **"Save"** ✅
7. **Wait** 1-2 phút

---

## 🌐 BƯỚC 5: Truy Cập Website

### Kiểm tra URL:

**Special repo:**
```
https://yourusername.github.io
```

**Normal repo:**
```
https://yourusername.github.io/repo-name
```

### Ví dụ:
```
Username: ducquang
Repo: ducquang.github.io
→ https://ducquang.github.io ✅

Username: ducquang
Repo: bio-link
→ https://ducquang.github.io/bio-link ✅
```

---

## ✅ KIỂM TRA

### Website nên có:
- ✅ Trang hiển thị đúng
- ✅ CSS/JS load được
- ✅ Seasonal effects hoạt động
- ✅ 3D tilt hoạt động
- ✅ Mobile gyroscope hoạt động (HTTPS!)
- ✅ Themes đổi được
- ✅ Links hoạt động
- ✅ **KHÔNG có ads/redirects!** 🎉

---

## 🔧 TROUBLESHOOTING

### 1. Trang 404 Not Found?

**Đợi 2-3 phút** cho GitHub build & deploy.

Nếu vẫn 404:
```
1. Check Settings → Pages
2. Đảm bảo Source: main branch
3. Check file tên chính xác: index.html (chữ thường)
4. Clear browser cache (Ctrl + F5)
```

### 2. CSS/JS không load?

**Đường dẫn phải relative!**

✅ Đúng:
```html
<link rel="stylesheet" href="styles.css">
<script src="script.js"></script>
```

❌ Sai:
```html
<link rel="stylesheet" href="/styles.css">
<script src="/script.js"></script>
```

Nếu dùng normal repo, sửa thành:
```html
<link rel="stylesheet" href="./styles.css">
<script src="./script.js"></script>
```

### 3. Seasonal effects không hoạt động?

Check Console (F12):
```
1. Mở F12 → Console tab
2. Xem có lỗi gì không
3. Thường là file seasonal-effects.js chưa upload
4. Hoặc đường dẫn sai trong index.html
```

### 4. Mobile gyroscope không hoạt động?

```
✅ GitHub Pages có HTTPS → Gyroscope hoạt động!
✅ Check Settings > Safari > Motion & Orientation Access
✅ Touch vào màn hình lần đầu để activate
```

---

## 🎨 UPDATE WEBSITE

### Khi muốn sửa:

**Cách 1: Upload lại (Web)**
```
1. Vào repo
2. Click vào file cần sửa (ví dụ: index.html)
3. Click biểu tượng ✏️ (Edit)
4. Sửa nội dung
5. Scroll xuống → "Commit changes"
6. Wait 1 phút → Website update!
```

**Cách 2: Upload file mới**
```
1. Add file → Upload files
2. Kéo thả file mới (overwrite)
3. Commit changes
4. Done!
```

**Cách 3: GitHub Desktop**
```
1. Sửa files trên máy
2. Mở GitHub Desktop
3. Commit changes
4. Push origin
5. Done!
```

---

## 🌍 CUSTOM DOMAIN (Optional)

### Nếu có domain riêng (ví dụ: yourname.com):

#### Bước 1: Cấu hình DNS

Vào nhà cung cấp domain (Namecheap, GoDaddy, etc.), thêm records:

```
Type: A
Host: @
Value: 185.199.108.153

Type: A
Host: @
Value: 185.199.109.153

Type: A
Host: @
Value: 185.199.110.153

Type: A
Host: @
Value: 185.199.111.153

Type: CNAME
Host: www
Value: yourusername.github.io
```

#### Bước 2: Cấu hình GitHub

1. Repo → Settings → Pages
2. **Custom domain**: nhập `yourname.com`
3. Click **Save**
4. Tick **"Enforce HTTPS"**
5. **Wait** 24-48 giờ cho DNS propagate

---

## 📊 ANALYTICS (Optional)

### Thêm Google Analytics:

Thêm vào `<head>` của index.html:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Lấy tracking ID tại: https://analytics.google.com

---

## 🚀 PRO TIPS

### 1. Tối ưu Images
```
- Resize ảnh: 500x500px
- Compress: https://tinypng.com/
- Upload lên GitHub cùng folder
```

### 2. SEO
Thêm vào `<head>`:
```html
<meta name="description" content="Bio Link của tôi">
<meta property="og:title" content="Tên bạn">
<meta property="og:description" content="Mô tả">
<meta property="og:image" content="URL_ảnh">
```

### 3. Favicon
```
1. Tạo favicon.ico (16x16 hoặc 32x32)
2. Upload lên repo
3. Thêm vào <head>:
   <link rel="icon" href="favicon.ico">
```

### 4. README.md
Tạo file README.md trong repo:
```markdown
# My Bio Link

🌐 Live: https://yourusername.github.io

Bio link page with seasonal effects and 3D tilt!

## Features
- 5 Modern themes
- Seasonal effects
- 3D tilt (desktop & mobile)
- Responsive design
```

---

## 📱 SHARE WEBSITE

### URL ngắn gọn:
```
https://yourusername.github.io
```

### QR Code:
```
1. Vào: https://www.qr-code-generator.com/
2. Nhập URL
3. Download QR code
4. Share!
```

### Social Media:
```
Facebook: Paste URL trực tiếp
Instagram: Link in bio
Twitter/X: Tweet URL
LinkedIn: Add to profile
```

---

## 🔐 BẢO MẬT

### Public Repository:
- ✅ Code sẽ public (mọi người xem được)
- ✅ Điều này OK cho bio link page
- ❌ ĐỪNG commit passwords, API keys

### Private Repository:
- ❌ Không dùng được GitHub Pages free
- ✅ Cần GitHub Pro ($4/month)

---

## 💰 CHI PHÍ

```
✅ GitHub Pages: FREE
✅ HTTPS: FREE
✅ CDN: FREE
✅ Bandwidth: FREE (unlimited)
✅ Custom domain DNS: FREE
✅ Domain name: $10-15/year (optional)

Total: $0 (hoặc $10-15/year nếu muốn custom domain)
```

---

## 🆚 SO SÁNH

| | GitHub Pages | AwardSpace Free |
|---|---|---|
| **Ads/Redirects** | ✅ KHÔNG | ❌ Có |
| **HTTPS** | ✅ Free | ❌ Không |
| **Speed** | 🚀 Nhanh | 🐌 Chậm |
| **Uptime** | ✅ 99.9% | ❓ Không ổn định |
| **Deploy** | 😊 Dễ | 😓 Khó |
| **Storage** | 1GB | 256MB |
| **Bandwidth** | Unlimited | Limited |
| **Control** | ✅ 100% | ❌ Hạn chế |

---

## 📚 TÀI LIỆU

- **GitHub Pages Docs**: https://docs.github.com/pages
- **Custom Domain**: https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site
- **Troubleshooting**: https://docs.github.com/pages/setting-up-a-github-pages-site-with-jekyll/troubleshooting-jekyll-build-errors-for-github-pages-sites

---

## 🎉 HOÀN TẤT!

Chúc mừng! Website của bạn giờ đã LIVE tại:

```
🌐 https://yourusername.github.io
```

**Tính năng:**
- ✅ 5 themes hiện đại
- ✅ 4 mùa với hiệu ứng đặc biệt
- ✅ 3D tilt toàn trang
- ✅ Mobile gyroscope
- ✅ Ripple effects
- ✅ HTTPS miễn phí
- ✅ Tốc độ cao
- ✅ **KHÔNG ADS!**

---

## 📞 CẦN GIÚP?

- 📧 GitHub Support: https://support.github.com/
- 📖 Docs: https://docs.github.com/
- 💬 Community: https://github.community/

---

**Made with ❤️ in Vietnam 🇻🇳**

Deploy thành công? Share với bạn bè! 🚀✨

