# 🚀 Supabase Integration - Đã Tự Động Cấu Hình!

Website đã được cấu hình để sử dụng **Supabase** cho authentication và database.

## ⚡ Quick Start (5 phút)

### 1. Tạo Supabase Project
- Vào https://supabase.com → Đăng ký/Đăng nhập
- Click **"New Project"** → Điền thông tin → **"Create"**

### 2. Lấy API Keys
- Vào **Settings** → **API**
- Copy **Project URL** và **anon public key**

### 3. Setup Database
- Vào **SQL Editor** → **New query**
- Copy toàn bộ nội dung file `supabase-setup.sql`
- Paste và click **Run**

### 4. Cấu Hình
- Mở file `auth-supabase.js`
- Tìm dòng 13-16, thay thế:
  ```javascript
  url: 'YOUR_SUPABASE_URL',        // → URL của bạn
  anonKey: 'YOUR_SUPABASE_ANON_KEY' // → Key của bạn
  ```

## ✅ Xong!

Website sẽ tự động:
- ✅ Sử dụng Supabase nếu đã cấu hình
- ✅ Tự động fallback về localStorage nếu chưa cấu hình
- ✅ Không cần thay đổi code khác

## 📁 Files Đã Cập Nhật

- ✅ `index.html` - Sử dụng `auth-supabase.js`
- ✅ `login.html` - Sử dụng `auth-supabase.js`
- ✅ `register.html` - Sử dụng `auth-supabase.js`
- ✅ `auth-supabase.js` - Auth system với Supabase
- ✅ `supabase-setup.sql` - SQL script setup database

## 🔄 Fallback Mode

Nếu chưa cấu hình Supabase, hệ thống sẽ:
- Tự động sử dụng localStorage
- Hiển thị warning trong console
- Vẫn hoạt động bình thường

## 📚 Tài Liệu

- `SUPABASE-SETUP.md` - Hướng dẫn chi tiết
- `QUICK-SUPABASE-SETUP.md` - Hướng dẫn nhanh
- `supabase-setup.sql` - SQL migrations

## 🎯 Tính Năng

- ✅ Authentication (Đăng ký/Đăng nhập)
- ✅ User Profiles
- ✅ Links Management
- ✅ Tasks Management
- ✅ Settings
- ✅ Row Level Security (RLS)
- ✅ Real-time ready

## ⚠️ Lưu Ý

- Không commit credentials lên GitHub
- Sử dụng environment variables trong production
- Free tier: 500MB database, 50K users/tháng

