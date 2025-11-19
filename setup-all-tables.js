/**
 * Script tổng hợp để setup tất cả các bảng cần thiết
 * Hướng dẫn chạy SQL scripts trên Supabase
 */

const fs = require('fs');
const path = require('path');

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║     SETUP TẤT CẢ CÁC BẢNG CẦN THIẾT                    ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

const SUPABASE_URL = 'https://novylftuwqdeamiyxxfp.supabase.co';
const SUPABASE_DASHBOARD = `https://supabase.com/dashboard/project/novylftuwqdeamiyxxfp`;

const sqlFiles = [
    {
        file: 'supabase-setup.sql',
        name: 'Profiles & Authentication',
        description: 'Tạo bảng profiles cho user authentication và quản lý dữ liệu',
        tables: ['profiles']
    },
    {
        file: 'chat-database.sql',
        name: 'Chat Support Database',
        description: 'Tạo các bảng cho hệ thống chat support',
        tables: ['chat_sessions', 'chat_messages', 'chat_statistics', 'chat_feedback']
    }
];

console.log('📋 DANH SÁCH CÁC BẢNG SẼ ĐƯỢC TẠO:\n');

let totalTables = 0;
sqlFiles.forEach((sqlFile, index) => {
    const filePath = path.join(__dirname, sqlFile.file);
    const exists = fs.existsSync(filePath);
    
    console.log(`${index + 1}. ${sqlFile.name}`);
    console.log(`   📝 ${sqlFile.description}`);
    console.log(`   📄 File: ${sqlFile.file}`);
    console.log(`   ${exists ? '✅ Tồn tại' : '❌ Không tìm thấy'}`);
    
    if (exists) {
        const content = fs.readFileSync(filePath, 'utf8');
        const size = (content.length / 1024).toFixed(2);
        console.log(`   📊 Kích thước: ${size} KB`);
    }
    
    console.log(`   📊 Bảng: ${sqlFile.tables.join(', ')}`);
    totalTables += sqlFile.tables.length;
    console.log('');
});

console.log(`📊 Tổng cộng: ${totalTables} bảng sẽ được tạo\n`);

console.log('🚀 HƯỚNG DẪN CHẠY SQL:\n');
console.log(`   1. Mở Supabase Dashboard:`);
console.log(`      👉 ${SUPABASE_DASHBOARD}\n`);
console.log('   2. Vào SQL Editor (sidebar bên trái)\n');
console.log('   3. Click "New query"\n');

sqlFiles.forEach((sqlFile, index) => {
    if (!fs.existsSync(path.join(__dirname, sqlFile.file))) {
        console.log(`   ⚠️  ${index + 1}. ${sqlFile.file} - Không tìm thấy file\n`);
        return;
    }
    
    console.log(`   ${index + 1}. Chạy ${sqlFile.file}:`);
    console.log(`      📋 Mô tả: ${sqlFile.description}`);
    console.log(`      📊 Sẽ tạo: ${sqlFile.tables.join(', ')}`);
    console.log(`      📝 Các bước:`);
    console.log(`         - Copy toàn bộ nội dung file: ${sqlFile.file}`);
    console.log(`         - Paste vào SQL Editor`);
    console.log(`         - Click "Run" (hoặc Ctrl+Enter)`);
    console.log(`         - Đợi thông báo "Success"`);
    console.log('');
});

console.log('   4. Sau khi chạy xong, kiểm tra lại:');
console.log('      npm run check:supabase\n');

console.log('✅ SAU KHI SETUP XONG:\n');
console.log('   - Bảng "profiles" → Quản lý user và authentication');
console.log('   - Bảng "chat_sessions" → Lưu phiên chat');
console.log('   - Bảng "chat_messages" → Lưu từng tin nhắn');
console.log('   - Bảng "chat_statistics" → Thống kê tự động');
console.log('   - Bảng "chat_feedback" → Feedback từ khách hàng');
console.log('   - Các views và functions → Hỗ trợ truy xuất dữ liệu');
console.log('   - RLS policies → Bảo mật dữ liệu\n');

console.log('💡 LƯU Ý:\n');
console.log('   - Supabase không hỗ trợ execute raw SQL qua REST API');
console.log('   - Phải chạy SQL thủ công qua Dashboard');
console.log('   - Hoặc sử dụng Supabase CLI (nếu đã cài đặt)');
console.log('   - Đảm bảo chạy theo thứ tự: supabase-setup.sql trước, chat-database.sql sau\n');

