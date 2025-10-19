# 🌐 Domain Miễn Phí cho GitHub Pages

## 🆓 CÁC DỊCH VỤ DOMAIN MIỄN PHÍ

---

## 1. 🔥 FREENOM (Tốt nhất - Miễn phí 1 năm)

### Domains miễn phí:
- `.tk` (Tokelau)
- `.ml` (Mali)
- `.ga` (Gabon)
- `.cf` (Central African Republic)
- `.gq` (Equatorial Guinea)

### Ưu điểm:
- ✅ Hoàn toàn miễn phí 1 năm
- ✅ Gia hạn miễn phí mỗi năm
- ✅ Không cần thẻ tín dụng
- ✅ Full DNS control
- ✅ Dễ setup

### Nhược điểm:
- ⚠️ TLD không chuyên nghiệp lắm
- ⚠️ Có thể bị thu hồi nếu vi phạm
- ⚠️ Cần gia hạn manual

### Cách đăng ký:

```
1. Truy cập: https://www.freenom.com
2. Tìm domain: nhập tên muốn (ví dụ: ducquang)
3. Check availability
4. Chọn domain (.tk, .ml, .ga, etc.)
5. "Get it now!" → "Checkout"
6. Period: 12 Months @ FREE
7. Email: nhập email
8. Tạo account hoặc login
9. Complete Order
10. Done! ✅
```

**Kết nối với GitHub Pages:** Xem phần dưới ⬇️

---

## 2. 🌍 FREENOM Alternatives

### A. **EU.ORG** (Domain .eu.org)

**Website:** https://nic.eu.org/

**Ưu điểm:**
- ✅ Miễn phí vĩnh viễn
- ✅ TLD professional hơn
- ✅ Ổn định
- ✅ Không ads

**Nhược điểm:**
- ⚠️ Phê duyệt thủ công (1-2 tuần)
- ⚠️ Chỉ cho mục đích phi lợi nhuận

**Cách đăng ký:**
```
1. Vào: https://nic.eu.org/
2. Click "Register"
3. Điền form (mục đích phi lợi nhuận)
4. Submit
5. Đợi approve (1-2 tuần)
6. Setup DNS
```

---

### B. **IS-A.DEV** (Domain .is-a.dev)

**Website:** https://www.is-a.dev/

**Ưu điểm:**
- ✅ Free cho developers
- ✅ Professional TLD
- ✅ HTTPS auto
- ✅ Via GitHub

**Nhược điểm:**
- ⚠️ Chỉ dành cho developers
- ⚠️ Cần verify GitHub

**Cách đăng ký:**
```
1. Fork repo: https://github.com/is-a-dev/register
2. Tạo file JSON với domain info
3. Pull request
4. Đợi approve
5. Done!
```

---

### C. **PP.UA** (Domain .pp.ua)

**Website:** https://pp.ua/

**Ưu điểm:**
- ✅ Miễn phí
- ✅ Không cần thẻ
- ✅ Easy setup

**Nhược điểm:**
- ⚠️ Ukraine TLD
- ⚠️ Ít phổ biến

---

### D. **JS.ORG** (Domain .js.org)

**Website:** https://js.org/

**Ưu điểm:**
- ✅ Miễn phí cho JS developers
- ✅ Professional
- ✅ HTTPS auto

**Nhược điểm:**
- ⚠️ Phải là JavaScript project
- ⚠️ Cần GitHub repo public

---

## 3. 🎁 Domain Miễn Phí từ Hosting

### A. **InfinityFree Subdomain**
```
yourname.rf.gd
yourname.42web.io
```

### B. **000webhost Subdomain**
```
yourname.000webhostapp.com
```

### C. **Netlify Subdomain** (Tốt!)
```
yourname.netlify.app
```

**Có thể đổi tên miễn phí!**

---

## 🔗 KẾT NỐI DOMAIN VỚI GITHUB PAGES

### FREENOM → GitHub Pages:

#### Bước 1: Lấy Domain từ Freenom

```
1. Đăng ký domain .tk, .ml, .ga, .cf, hoặc .gq
2. Vào "Services" → "My Domains"
3. Click "Manage Domain"
4. Click "Management Tools" → "Nameservers"
```

#### Bước 2: Cấu hình DNS

Chọn **"Use custom nameservers"** hoặc **"Management Tools" → "DNS Management"**

**Option A: Dùng Cloudflare (Khuyến nghị)**

```
1. Tạo account Cloudflare: https://cloudflare.com
2. Add domain
3. Copy nameservers từ Cloudflare
4. Paste vào Freenom custom nameservers
5. Trong Cloudflare, add DNS records:

Type: A
Name: @
Content: 185.199.108.153

Type: A
Name: @
Content: 185.199.109.153

Type: A
Name: @
Content: 185.199.110.153

Type: A
Name: @
Content: 185.199.111.153

Type: CNAME
Name: www
Content: yourusername.github.io
```

**Option B: Dùng Freenom DNS trực tiếp**

```
Type: A
Name: (blank)
Target: 185.199.108.153

Type: A
Name: (blank)
Target: 185.199.109.153

Type: A
Name: (blank)
Target: 185.199.110.153

Type: A
Name: (blank)
Target: 185.199.111.153

Type: CNAME
Name: www
Target: yourusername.github.io
```

#### Bước 3: Cấu hình GitHub

```
1. Vào GitHub repo
2. Settings → Pages
3. Custom domain: nhập domain (ví dụ: ducquang.tk)
4. Save
5. Wait 24 hours cho DNS propagate
6. Tick "Enforce HTTPS" (sau khi DNS active)
```

---

## ⚡ SETUP NHANH VỚI CLOUDFLARE (Khuyến nghị)

### Tại sao dùng Cloudflare?
- ✅ HTTPS miễn phí & tự động
- ✅ CDN tốc độ cao
- ✅ DDoS protection
- ✅ Analytics
- ✅ Easy DNS management

### Cách setup:

```
1. Đăng ký domain miễn phí (Freenom)
   → Lấy domain: ducquang.tk

2. Tạo Cloudflare account
   → https://cloudflare.com

3. Add domain vào Cloudflare
   → Follow wizard

4. Copy 2 nameservers từ Cloudflare
   → Ví dụ: 
     ns1.cloudflare.com
     ns2.cloudflare.com

5. Paste vào Freenom
   → Management Tools → Nameservers
   → Use custom nameservers
   → Save

6. Trong Cloudflare add DNS records:
   → 4 A records (GitHub IPs)
   → 1 CNAME record (www)

7. Trong GitHub Pages:
   → Settings → Pages
   → Custom domain: ducquang.tk
   → Save

8. Wait 24 hours
   → DNS propagate
   → HTTPS auto enable

9. Done! 🎉
```

---

## 🎯 DOMAIN ĐỀ XUẤT

### Cho Bio Link cá nhân:

**Freenom options:**
```
yourname.tk      ← Tốt nhất
yourname.ml      ← OK
yourname.ga      ← OK
yourname.cf      ← OK
yourname.gq      ← OK
```

**Professional (Trả phí - Rẻ):**
```
yourname.com     ← $10-15/year (Namecheap)
yourname.me      ← $3-20/year (Porkbun)
yourname.dev     ← $12/year (Google Domains)
yourname.site    ← $3-5/year (Namecheap)
```

---

## 💰 SO SÁNH GIÁ

| Domain | Năm 1 | Gia hạn | Provider |
|--------|-------|---------|----------|
| **.tk** | FREE | FREE | Freenom |
| **.ml** | FREE | FREE | Freenom |
| **.ga** | FREE | FREE | Freenom |
| **.cf** | FREE | FREE | Freenom |
| **.gq** | FREE | FREE | Freenom |
| **.com** | $10 | $15 | Namecheap |
| **.me** | $3 | $20 | Porkbun |
| **.dev** | $12 | $12 | Google |
| **.site** | $3 | $5 | Namecheap |

---

## 📋 CHECKLIST SETUP DOMAIN

```
□ Đăng ký domain miễn phí (Freenom)
□ Tạo Cloudflare account (optional nhưng khuyến nghị)
□ Point nameservers to Cloudflare
□ Add DNS records (4 A + 1 CNAME)
□ Add custom domain trong GitHub Pages
□ Wait 24 hours cho DNS propagate
□ Enable HTTPS trong GitHub Pages
□ Test domain hoạt động
□ Test HTTPS hoạt động
□ Done! ✅
```

---

## 🐛 TROUBLESHOOTING

### Domain không hoạt động sau 24h?

```
1. Check DNS propagation: https://dnschecker.org/
   → Nhập domain
   → Xem đã propagate chưa

2. Check DNS records đúng chưa:
   → 4 A records với GitHub IPs
   → 1 CNAME record với username.github.io

3. Clear browser cache
   → Ctrl + Shift + Delete
   → Clear DNS cache: ipconfig /flushdns (Windows)

4. Check GitHub Pages settings
   → Custom domain đã save chưa
   → CNAME file có trong repo chưa
```

### HTTPS không enable?

```
1. Wait thêm vài giờ
2. Untick và tick lại "Enforce HTTPS"
3. Check DNS đã propagate chưa
4. Dùng Cloudflare cho HTTPS tự động
```

### Freenom không cho đăng ký?

```
1. Thử domain khác
2. Thử TLD khác (.ml thay vì .tk)
3. Dùng browser khác
4. Clear cookies
5. Thử VPN (đổi IP)
```

---

## 🎁 BONUS: Domain Student (Nếu là sinh viên)

### GitHub Student Developer Pack

**Website:** https://education.github.com/pack

**Bao gồm:**
- ✅ 1 năm domain .me FREE (từ Namecheap)
- ✅ $100 DigitalOcean credit
- ✅ GitHub Pro FREE
- ✅ Nhiều tools khác FREE

**Yêu cầu:**
- Là sinh viên
- Có email .edu hoặc thẻ sinh viên

**Cách đăng ký:**
```
1. Vào: https://education.github.com/pack
2. Click "Get student benefits"
3. Upload proof (thẻ SV hoặc email .edu)
4. Wait approve (1-7 ngày)
5. Claim benefits
6. Free domain .me!
```

---

## 📊 DOMAIN ĐỀ XUẤT CHO BẠN

### Option 1: Hoàn toàn miễn phí
```
Domain: yourname.tk (Freenom)
DNS: Cloudflare (Free)
Hosting: GitHub Pages (Free)
HTTPS: Cloudflare (Free)

Total: $0
```

### Option 2: Professional (Khuyến nghị nếu có $)
```
Domain: yourname.com (Namecheap) - $10/year
DNS: Cloudflare (Free)
Hosting: GitHub Pages (Free)
HTTPS: Free

Total: $10/year
```

### Option 3: Student
```
Domain: yourname.me (GitHub Education) - Free 1 year
DNS: Cloudflare (Free)
Hosting: GitHub Pages (Free)
HTTPS: Free

Total: $0 (year 1), $20/year (after)
```

---

## 🚀 QUICK START

### 5 phút setup domain miễn phí:

```bash
# 1. Freenom (2 phút)
https://freenom.com
→ Tìm domain: yourname
→ Chọn .tk
→ Checkout (FREE)

# 2. Cloudflare (2 phút)
https://cloudflare.com
→ Add domain
→ Copy nameservers

# 3. Freenom nameservers (30 giây)
→ Paste Cloudflare nameservers

# 4. Cloudflare DNS (1 phút)
→ Add 4 A records (GitHub IPs)
→ Add 1 CNAME (www → username.github.io)

# 5. GitHub Pages (30 giây)
→ Settings → Pages
→ Custom domain: yourname.tk
→ Save

# Done! Wait 24h ✅
```

---

## 🌟 KẾT QUẢ

Sau khi setup xong, bạn sẽ có:

```
✅ Domain miễn phí: yourname.tk
✅ GitHub Pages hosting: FREE
✅ HTTPS: FREE
✅ CDN: FREE (Cloudflare)
✅ Professional website
✅ No ads, no redirects
✅ Full control

URL: https://yourname.tk 🎉
```

---

## 📞 LINKS QUAN TRỌNG

- **Freenom:** https://www.freenom.com
- **Cloudflare:** https://www.cloudflare.com
- **GitHub Pages:** https://pages.github.com
- **DNS Checker:** https://dnschecker.org
- **Student Pack:** https://education.github.com/pack

---

## 💡 PRO TIP

**Nếu budget cho phép ($10-15/year):**

Mua domain .com từ:
- **Namecheap:** https://www.namecheap.com (Rẻ nhất)
- **Porkbun:** https://porkbun.com (Giá tốt)
- **Cloudflare:** https://www.cloudflare.com (At-cost pricing)

**Tại sao?**
- ✅ Professional
- ✅ SEO tốt hơn
- ✅ Trust & credibility
- ✅ Không lo bị thu hồi
- ✅ Email professional (@yourname.com)

---

**Made with ❤️ in Vietnam 🇻🇳**

Chúc bạn có domain đẹp! 🌐✨

