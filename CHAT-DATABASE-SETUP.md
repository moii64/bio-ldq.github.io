# Hướng Dẫn Setup Chat Database trên Supabase

## Cách 1: Upload qua Supabase Dashboard (Khuyến nghị)

### Bước 1: Mở Supabase Dashboard
1. Truy cập [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **SQL Editor** ở sidebar bên trái

### Bước 2: Tạo Query Mới
1. Click nút **"New query"** hoặc **"+"**
2. Mở file `chat-database.sql` trong editor của bạn
3. Copy toàn bộ nội dung file
4. Paste vào SQL Editor của Supabase

### Bước 3: Chạy SQL
1. Click nút **"Run"** (hoặc nhấn `Ctrl+Enter` / `Cmd+Enter`)
2. Đợi thông báo "Success" hoặc kiểm tra kết quả

### Bước 4: Kiểm Tra
1. Vào **Table Editor** để xem các bảng đã được tạo:
   - `chat_sessions`
   - `chat_messages`
   - `chat_statistics`
   - `chat_feedback`
2. Vào **Database** → **Functions** để xem các functions đã tạo
3. Vào **Database** → **Views** để xem các views đã tạo

## Cách 2: Sử dụng Supabase CLI (Nâng cao)

### Cài đặt Supabase CLI
```bash
npm install -g supabase
```

### Login
```bash
supabase login
```

### Link Project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### Chạy Migration
```bash
supabase db push
```

## Cách 3: Sử dụng Script Helper (Tự động)

Chạy script Node.js để upload tự động:

```bash
node upload-chat-db.js
```

## Cấu Trúc Database

### Bảng chính:

1. **chat_sessions** - Lưu thông tin phiên chat
   - `id`, `user_id`, `user_email`, `user_name`
   - `session_status` (active, closed, resolved)
   - `prompt_key` (TECH_SUPPORT, PAYMENT_ISSUE, etc.)
   - `created_at`, `updated_at`

2. **chat_messages** - Lưu từng tin nhắn
   - `id`, `session_id`, `sender_type` (user, ai, cs)
   - `message_text`, `prompt_key`
   - `created_at`

3. **chat_statistics** - Thống kê chat
   - `date`, `prompt_key`
   - `total_sessions`, `total_messages`, `resolved_sessions`

4. **chat_feedback** - Feedback từ khách hàng
   - `id`, `session_id`, `user_id`
   - `rating` (1-5), `feedback_text`, `helpful`, `resolved`

### Views hữu ích:

- `active_chat_sessions` - Danh sách chat đang active
- `chat_stats_by_prompt` - Thống kê theo prompt key
- `recent_chat_sessions` - 100 chat gần nhất

### Functions:

- `get_chat_history(session_uuid)` - Lấy lịch sử chat theo session
- `get_sessions_by_prompt(prompt_key, limit)` - Lấy sessions theo prompt
- `get_daily_statistics(start_date, end_date)` - Thống kê theo ngày

## Lưu Ý

- ✅ Tất cả bảng đã có RLS (Row Level Security) policies
- ✅ Users chỉ có thể xem/sửa chat của chính họ
- ✅ CS có thể xem tất cả (cần điều chỉnh policy nếu có role system)
- ✅ Có indexes để tối ưu performance
- ✅ Có triggers tự động update statistics

## Kiểm Tra Sau Khi Setup

```sql
-- Kiểm tra các bảng đã tạo
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'chat%';

-- Kiểm tra các views
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name LIKE '%chat%';

-- Kiểm tra các functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%chat%';
```

