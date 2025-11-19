# Hướng Dẫn Push Lên GitHub

## Đã Commit Thành Công! ✅

Các thay đổi đã được commit với message:
```
feat: Tích hợp Supabase authentication với auto-retry mechanism
```

## Files Đã Được Commit

✅ `.gitignore` - Bảo vệ config.js
✅ `auth-supabase.js` - Auth system với Supabase
✅ `config.example.js` - Template config
✅ `setup-dev.js` - Setup script
✅ `supabase-setup.sql` - SQL migrations
✅ `package.json` - NPM scripts
✅ `index.html` - Trang chủ với modal đăng ký
✅ `login.html` - Trang đăng nhập
✅ `register.html` - Trang đăng ký
✅ Documentation files

## Push Lên GitHub

### Cách 1: Push Trực Tiếp
```bash
git push origin main
```

### Cách 2: Nếu Có Conflict
```bash
git pull origin main
git push origin main
```

### Cách 3: Force Push (Cẩn Thận!)
```bash
git push origin main --force
```

## Lưu Ý

⚠️ **QUAN TRỌNG**: 
- File `config.js` KHÔNG được commit (đã trong .gitignore)
- Chỉ commit `config.example.js` (template mẫu)
- Không bao giờ commit credentials lên GitHub

## Remote Repository

Repository hiện tại:
- **URL**: https://github.com/moii64/bio-ldq.github.io.git
- **Branch**: main

## Sau Khi Push

1. Kiểm tra trên GitHub: https://github.com/moii64/bio-ldq.github.io
2. Files mới sẽ xuất hiện trong repository
3. Có thể xem commit history và changes

