# 🚀 HƯỚNG DẪN CHI TIẾT: Setup Professional & Free

## 📋 Setup Option 2: Professional & Free

```
Hosting: GitHub Pages
Domain: yourname.tk (Freenom)
DNS: Cloudflare
SSL: Cloudflare SSL
Analytics: Google Analytics
CDN: Cloudflare

Total: $0 (100% MIỄN PHÍ)
Thời gian: 30-45 phút
```

---

## 🎯 BƯỚC 1: GITHUB PAGES (10 phút)

### 1.1 Tạo GitHub Account

```
1. Vào: https://github.com/signup
2. Nhập Email của bạn
3. Nhập Password (tối thiểu 15 ký tự)
4. Nhập Username (ví dụ: ducquang)
   → Username này sẽ là part của URL!
5. Verify (giải puzzle)
6. Check email để verify account
7. Done! ✅
```

### 1.2 Tạo Repository

```
1. Click nút "New" (màu xanh) hoặc dấu +
2. Repository name: yourusername.github.io
   Ví dụ: ducquang.github.io
3. Description: "My Bio Link Page"
4. Chọn: Public ✅
5. KHÔNG tick "Add a README file"
6. Click "Create repository"
```

### 1.3 Upload Files

```
1. Trong repo vừa tạo, click "uploading an existing file"
2. Kéo thả 6 files vào:
   ✅ index.html
   ✅ styles.css
   ✅ script.js
   ✅ effects.js
   ✅ widgets.js
   ✅ seasonal-effects.js
   
   ⚠️ KHÔNG upload .htaccess (không cần cho GitHub Pages)

3. Commit message: "Initial commit"
4. Click "Commit changes"
5. Wait 1-2 phút
```

### 1.4 Verify Website

```
1. Truy cập: https://yourusername.github.io
2. Website nên hiển thị đúng
3. Nếu 404 → đợi thêm 2-3 phút
```

✅ **XONG BƯỚC 1!** Website đã live tại: `https://yourusername.github.io`

---

## 🌐 BƯỚC 2: FREENOM DOMAIN (5 phút)

### 2.1 Đăng ký Domain

```
1. Vào: https://www.freenom.com
2. Tìm domain muốn (ví dụ: ducquang)
3. Click "Check Availability"
4. Chọn TLD miễn phí:
   ✅ .tk (Tokelau) - Khuyến nghị
   ✅ .ml (Mali)
   ✅ .ga (Gabon)
   ✅ .cf (Central African Republic)
   ✅ .gq (Equatorial Guinea)

5. Click "Get it now!" bên cạnh domain muốn
6. Click "Checkout"
```

### 2.2 Configure Domain

```
1. Period: Chọn "12 Months @ FREE" ✅
2. Click "Continue"
3. Email: Nhập email của bạn
4. Click "Verify My Email Address"
5. Check email và click link verify
```

### 2.3 Complete Order

```
1. Quay lại Freenom
2. Điền thông tin:
   - First Name
   - Last Name
   - Address (có thể fake)
   - City
   - Country: Vietnam
   - Zip Code: 70000 (hoặc bất kỳ)
   
3. Tick: "I have read and agree..."
4. Click "Complete Order"
5. Done! ✅
```

✅ **XONG BƯỚC 2!** Bạn đã có domain: `ducquang.tk`

---

## ☁️ BƯỚC 3: CLOUDFLARE SETUP (10 phút)

### 3.1 Tạo Cloudflare Account

```
1. Vào: https://www.cloudflare.com
2. Click "Sign Up"
3. Nhập Email
4. Nhập Password
5. Verify email
6. Done!
```

### 3.2 Add Domain

```
1. Sau khi login, click "Add a Site"
2. Nhập domain: ducquang.tk
3. Click "Add site"
4. Chọn plan: "Free" ✅
5. Click "Continue"
```

### 3.3 Wait for Scan

```
1. Cloudflare đang scan DNS records hiện tại
2. Click "Continue" (sau khi scan xong)
```

### 3.4 Add DNS Records

**XÓA tất cả records cũ** (nếu có), rồi thêm mới:

#### A Records (GitHub Pages IPs):

```
Type: A
Name: @
IPv4 address: 185.199.108.153
TTL: Auto
Proxy: ✅ Proxied (cloud icon màu cam)
→ Click "Save"

Type: A
Name: @
IPv4 address: 185.199.109.153
TTL: Auto
Proxy: ✅ Proxied
→ Click "Save"https://console.anthropic.com/

Type: A
Name: @
IPv4 address: 185.199.110.153
TTL: Auto
Proxy: ✅ Proxied
→ Click "Save"

Type: A
Name: @
IPv4 address: 185.199.111.153
TTL: Auto
Proxy: ✅ Proxied
→ Click "Save"
```

#### CNAME Record (WWW):

```
Type: CNAME
Name: www
Target: yourusername.github.io
TTL: Auto
Proxy: ✅ Proxied
→ Click "Save"

Ví dụ target: ducquang.github.io
```

Click **"Continue"** sau khi add xong 5 records.

### 3.5 Copy Nameservers

Cloudflare sẽ cho bạn 2 nameservers, ví dụ:
```
ns1.cloudflare.com
ns2.cloudflare.com

(Hoặc có thể là dạng:)
aron.ns.cloudflare.com
jade.ns.cloudflare.com
```

**COPY 2 dòng này!** 📝

---

## 🔗 BƯỚC 4: POINT FREENOM TO CLOUDFLARE (5 phút)

### 4.1 Truy cập Freenom

```
1. Vào: https://my.freenom.com
2. Login
3. Click "Services" → "My Domains"
4. Click "Manage Domain" bên cạnh domain của bạn
```

### 4.2 Change Nameservers

```
1. Click "Management Tools" → "Nameservers"
2. Chọn "Use custom nameservers"
3. Xóa nameservers cũ
4. Paste 2 nameservers từ Cloudflare:
   Nameserver 1: ns1.cloudflare.com (hoặc nameserver bạn copy)
   Nameserver 2: ns2.cloudflare.com
5. Click "Change Nameservers"
6. Done! ✅
```

### 4.3 Quay lại Cloudflare

```
1. Quay lại tab Cloudflare
2. Click "Done, check nameservers"
3. Cloudflare sẽ kiểm tra
4. Có thể mất 24 giờ để active
5. Bạn sẽ nhận email khi active
```

✅ **XONG BƯỚC 4!** DNS đã được point.

---

## 🔐 BƯỚC 5: CONNECT DOMAIN TO GITHUB (2 phút)

### 5.1 Add Custom Domain

```
1. Vào GitHub repo: yourusername.github.io
2. Click "Settings"
3. Scroll xuống hoặc click "Pages" (menu trái)
4. Phần "Custom domain":
   → Nhập: ducquang.tk (domain của bạn)
5. Click "Save"
6. Wait 1 phút
```

### 5.2 Wait for DNS Check

```
GitHub sẽ check DNS records
Có thể thấy error: "DNS check is still in progress"
→ Bình thường! Đợi 24 giờ cho DNS propagate
```

### 5.3 HTTPS (Sau khi DNS active - sau 24h)

```
1. Quay lại Settings → Pages
2. Tick: "Enforce HTTPS" ✅
3. Done!
```

✅ **XONG BƯỚC 5!** Domain đã connect với GitHub!

---

## 📊 BƯỚC 6: GOOGLE ANALYTICS (Optional - 5 phút)

### 6.1 Tạo Account

```
1. Vào: https://analytics.google.com
2. Sign in với Google account
3. Click "Start measuring"
4. Account name: "My Bio Link"
5. Next
```

### 6.2 Create Property

```
1. Property name: "ducquang.tk"
2. Time zone: Vietnam
3. Currency: VND
4. Next
```

### 6.3 Get Tracking Code

```
1. Platform: Web
2. Website URL: https://ducquang.tk
3. Stream name: "Main site"
4. Create stream
5. Copy "Measurement ID" (dạng: G-XXXXXXXXXX)
```

### 6.4 Add to Website

Thêm vào `<head>` của `index.html`:

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

Thay `G-XXXXXXXXXX` bằng Measurement ID của bạn.

### 6.5 Upload lại file

```
1. Sửa index.html trên máy
2. Vào GitHub repo
3. Click vào index.html
4. Click biểu tượng ✏️ (Edit)
5. Paste code analytics vào <head>
6. Scroll xuống → "Commit changes"
7. Done! ✅
```

✅ **XONG BƯỚC 6!** Analytics đã hoạt động!

---

## ⏰ BƯỚC 7: WAIT & VERIFY (24 giờ)

### 7.1 DNS Propagation

```
DNS cần 24-48 giờ để propagate toàn cầu
Có thể check tại: https://dnschecker.org/

1. Nhập domain: ducquang.tk
2. Type: A
3. Check xem có IP của GitHub chưa
```

### 7.2 Sau 24 giờ

```
1. Truy cập: https://ducquang.tk
2. Website nên hiển thị đúng
3. HTTPS nên hoạt động (khóa xanh)
4. Cloudflare CDN đã active
```

### 7.3 Enable HTTPS

```
1. GitHub → Settings → Pages
2. Tick "Enforce HTTPS" ✅
3. Save
```

### 7.4 Cloudflare SSL Settings

```
1. Cloudflare Dashboard
2. SSL/TLS tab
3. Chọn: "Full" (recommended)
4. Enable "Always Use HTTPS"
5. Save
```

✅ **XONG!** Website hoàn chỉnh!

---

## ✅ CHECKLIST HOÀN TẤT

```
□ GitHub Pages setup
□ Files uploaded
□ Website live tại yourusername.github.io
□ Freenom domain registered
□ Cloudflare account created
□ Domain added to Cloudflare
□ DNS records configured (4 A + 1 CNAME)
□ Nameservers pointed to Cloudflare
□ Custom domain added to GitHub
□ DNS propagated (24h)
□ HTTPS enabled
□ Cloudflare SSL configured
□ Google Analytics added (optional)
□ Website live tại https://yourname.tk
□ HTTPS working (green lock)
```

---

## 🎉 KẾT QUẢ CUỐI CÙNG

Sau khi hoàn tất, bạn có:

```
✅ Website professional: https://ducquang.tk
✅ HTTPS miễn phí (Cloudflare SSL)
✅ CDN toàn cầu (Cloudflare)
✅ DDoS protection (Cloudflare)
✅ Analytics (Google Analytics)
✅ Tốc độ cao
✅ SEO-friendly
✅ Mobile gyroscope hoạt động (HTTPS!)
✅ Seasonal effects
✅ 3D tilt effects
✅ All features working

Total cost: $0
Website URL: https://yourname.tk
```

---

## 🐛 TROUBLESHOOTING

### 1. Domain không hoạt động sau 24h?

**Check DNS:**
```
1. Vào: https://dnschecker.org
2. Nhập domain
3. Type: A
4. Check có IP GitHub chưa (185.199.108.153)
```

**Nếu chưa:**
```
1. Check Freenom nameservers đã đổi chưa
2. Check Cloudflare DNS records đúng chưa
3. Đợi thêm 24h
```

### 2. HTTPS không hoạt động?

```
1. Check DNS đã propagate chưa
2. Trong GitHub: Untick và tick lại "Enforce HTTPS"
3. Trong Cloudflare: SSL/TLS → Full
4. Clear browser cache (Ctrl + Shift + Delete)
5. Thử incognito mode
```

### 3. Website hiển thị "404"?

```
1. Check file index.html đã upload đúng chưa
2. Check file tên đúng: "index.html" (chữ thường)
3. Check GitHub Pages settings có custom domain đúng
4. Wait thêm vài phút
```

### 4. CSS/JS không load?

```
1. Check đường dẫn trong index.html
2. Phải là relative path:
   ✅ href="styles.css"
   ❌ href="/styles.css"
3. Check tất cả files đã upload
```

### 5. Freenom không cho đăng ký?

```
1. Thử domain khác
2. Thử TLD khác (.ml thay vì .tk)
3. Clear cookies & cache
4. Thử browser khác
5. Thử VPN
```

### 6. Cloudflare "Site not found"?

```
1. Check nameservers đã point đúng chưa
2. Check trong Freenom: Management Tools → Nameservers
3. Đảm bảo dùng "Use custom nameservers"
4. Wait 24-48 giờ
```

---

## 📞 SUPPORT LINKS

- **GitHub Support:** https://support.github.com
- **Freenom FAQ:** https://www.freenom.com/en/faq.html
- **Cloudflare Help:** https://support.cloudflare.com
- **DNS Checker:** https://dnschecker.org
- **Google Analytics Help:** https://support.google.com/analytics

---

## 💡 PRO TIPS

### Tip 1: Cloudflare Settings

```
1. Speed → Optimization
   → Enable Auto Minify (CSS, JS, HTML)
   
2. Caching → Configuration
   → Browser Cache TTL: 4 hours
   
3. Security → Settings
   → Security Level: Medium
```

### Tip 2: Backup

```
1. Download tất cả files từ GitHub
2. Lưu local trên máy
3. Backup định kỳ
```

### Tip 3: Update Website

```
1. Sửa files trên máy
2. Test local (open index.html)
3. Upload lên GitHub (edit file hoặc upload mới)
4. Wait 1-2 phút → Live!
```

### Tip 4: Monitor

```
1. Check Google Analytics mỗi tuần
2. Check Cloudflare analytics
3. Monitor uptime
```

---

## 🎓 NEXT STEPS

Sau khi setup xong:

1. **Share với bạn bè:**
   - Facebook, Instagram, Twitter
   - QR Code (dùng https://www.qr-code-generator.com)

2. **SEO:**
   - Add meta description
   - Add Open Graph tags
   - Submit to Google Search Console

3. **Monitor:**
   - Google Analytics
   - Cloudflare Analytics
   - Uptime monitoring

4. **Improve:**
   - Add more links
   - Change themes theo mùa
   - Update content thường xuyên

---

## 🌟 CONGRATULATIONS!

Bạn đã có một website **PROFESSIONAL** với:

- ✅ Custom domain
- ✅ HTTPS
- ✅ Global CDN
- ✅ Analytics
- ✅ DDoS protection
- ✅ High performance

Và tất cả **100% MIỄN PHÍ!** 🎉

---

**Made with ❤️ in Vietnam 🇻🇳**

**Thời gian setup:** 30-45 phút
**Chi phí:** $0
**Kết quả:** Professional website! ✨

