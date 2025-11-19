# Quick Setup Supabase - 5 Phút

## Bước 1: Tạo Supabase Project (2 phút)
1. Vào https://supabase.com → Sign up/Login
2. Click **"New Project"**
3. Điền tên project và password → **"Create"**

## Bước 2: Lấy API Keys (1 phút)
1. Vào **Settings** → **API**
2. Copy:
   - **Project URL** (ví dụ: `https://abc123.supabase.co`)
   - **anon public key** (key dài bắt đầu `eyJ...`)

## Bước 3: Setup Database (1 phút)
1. Vào **SQL Editor** → **New query**
2. Copy toàn bộ file `supabase-setup.sql`
3. Paste và click **Run**

## Bước 4: Cấu Hình Code (1 phút)
1. Mở `auth-supabase.js`
2. Tìm dòng 13-16, thay:
   ```javascript
   url: 'YOUR_SUPABASE_URL',        // → URL bạn copy
   anonKey: 'YOUR_SUPABASE_ANON_KEY' // → Key bạn copy
   ```

## Bước 5: Đổi File Auth
Trong `index.html`, tìm dòng:
```html
<script src="auth.js"></script>
```
Đổi thành:
```html
<script src="auth-supabase.js"></script>
```

## Xong! 🎉
Refresh trang và thử đăng ký!

## Nếu gặp lỗi:
- Kiểm tra console browser (F12)
- Đảm bảo đã chạy SQL script
- Kiểm tra credentials đã đúng chưa

