# Hướng Dẫn Setup Supabase cho Bio Link

## Bước 1: Tạo Supabase Project

1. Truy cập [https://supabase.com](https://supabase.com)
2. Đăng ký/Đăng nhập tài khoản
3. Click **"New Project"**
4. Điền thông tin:
   - **Name**: Bio Link (hoặc tên bạn muốn)
   - **Database Password**: Tạo mật khẩu mạnh (lưu lại!)
   - **Region**: Chọn region gần bạn nhất
5. Click **"Create new project"** và đợi project được tạo (2-3 phút)

## Bước 2: Lấy API Credentials

1. Vào **Settings** (biểu tượng bánh răng) ở sidebar
2. Chọn **API**
3. Copy các thông tin sau:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Key dài bắt đầu với `eyJ...`

## Bước 3: Cấu Hình Database

1. Vào **SQL Editor** ở sidebar
2. Click **"New query"**
3. Copy toàn bộ nội dung từ file `supabase-setup.sql`
4. Paste vào SQL Editor
5. Click **"Run"** (hoặc nhấn Ctrl+Enter)
6. Đợi thông báo "Success"

## Bước 4: Cập Nhật Code

1. Mở file `auth-supabase.js`
2. Tìm dòng:
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'YOUR_SUPABASE_URL',
       anonKey: 'YOUR_SUPABASE_ANON_KEY'
   };
   ```
3. Thay thế:
   - `YOUR_SUPABASE_URL` → Project URL bạn đã copy
   - `YOUR_SUPABASE_ANON_KEY` → anon public key bạn đã copy

   Ví dụ:
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'https://abcdefgh.supabase.co',
       anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   };
   ```

## Bước 5: Thay Đổi Auth File

1. Mở file `index.html`
2. Tìm dòng:
   ```html
   <script src="auth.js"></script>
   ```
3. Thay đổi thành:
   ```html
   <script src="auth-supabase.js"></script>
   ```

## Bước 6: Test

1. Mở trang web
2. Thử đăng ký tài khoản mới
3. Kiểm tra email để xác nhận (nếu bật email confirmation)
4. Thử đăng nhập

## Tính Năng

✅ **Authentication**: Đăng ký, đăng nhập, đăng xuất
✅ **User Profiles**: Lưu thông tin profile, links, tasks
✅ **Real-time**: Có thể mở rộng với real-time subscriptions
✅ **Security**: Row Level Security (RLS) bảo vệ dữ liệu
✅ **Fallback**: Tự động chuyển về localStorage nếu Supabase không khả dụng

## Troubleshooting

### Lỗi "Invalid API key"
- Kiểm tra lại anon key đã copy đúng chưa
- Đảm bảo không có khoảng trắng thừa

### Lỗi "relation does not exist"
- Chạy lại SQL script trong SQL Editor
- Kiểm tra table `profiles` đã được tạo chưa

### Email không nhận được
- Vào **Authentication > Settings** trong Supabase
- Kiểm tra **Email Templates** đã được cấu hình
- Trong development, có thể tắt email confirmation tạm thời

### Không đăng nhập được
- Kiểm tra console browser để xem lỗi
- Đảm bảo RLS policies đã được tạo đúng
- Kiểm tra user đã được tạo trong **Authentication > Users**

## Tắt Email Confirmation (Development)

1. Vào **Authentication > Settings**
2. Tìm **"Enable email confirmations"**
3. Tắt tùy chọn này
4. Lưu lại

## Bảo Mật

⚠️ **Quan trọng**: 
- Không bao giờ commit file `auth-supabase.js` với credentials thật lên GitHub
- Sử dụng environment variables trong production
- Anon key có thể public nhưng nên giới hạn với RLS policies

## Free Tier Limits

Supabase Free Tier bao gồm:
- 500MB database
- 2GB bandwidth
- 50,000 monthly active users
- Đủ cho hầu hết các dự án nhỏ

## Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra [Supabase Docs](https://supabase.com/docs)
2. Xem logs trong Supabase Dashboard > Logs
3. Kiểm tra browser console để xem lỗi chi tiết

