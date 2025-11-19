/**
 * Script hướng dẫn setup database trên Supabase
 * Vì Supabase không hỗ trợ execute raw SQL qua API,
 * script này sẽ hướng dẫn bạn chạy SQL thủ công
 */

const fs = require('fs');
const path = require('path');

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║     SETUP DATABASE TRÊN SUPABASE                       ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

const SUPABASE_URL = 'https://novylftuwqdeamiyxxfp.supabase.co';

console.log('📋 HƯỚNG DẪN CHẠY SQL SCRIPTS:\n');

const sqlFiles = [
    { 
        file: 'supabase-setup.sql', 
        description: 'Setup bảng profiles và authentication',
        required: true
    },
    { 
        file: 'chat-database.sql', 
        description: 'Setup bảng chat support (chat_sessions, chat_messages, etc.)',
        required: false
    }
];

sqlFiles.forEach((item, index) => {
    const filePath = path.join(__dirname, item.file);
    const exists = fs.existsSync(filePath);
    
    console.log(`${index + 1}. ${item.file}`);
    console.log(`   📝 ${item.description}`);
    console.log(`   ${exists ? '✅ File tồn tại' : '❌ File không tồn tại'}`);
    
    if (exists) {
        const content = fs.readFileSync(filePath, 'utf8');
        const size = (content.length / 1024).toFixed(2);
        console.log(`   📊 Kích thước: ${size} KB`);
    }
    console.log('');
});

console.log('🚀 CÁCH CHẠY SQL:\n');
console.log('   1. Mở Supabase Dashboard:');
console.log(`      👉 https://supabase.com/dashboard/project/novylftuwqdeamiyxxfp\n`);
console.log('   2. Vào SQL Editor (sidebar bên trái)\n');
console.log('   3. Click "New query"\n');

sqlFiles.forEach((item, index) => {
    if (!fs.existsSync(path.join(__dirname, item.file))) return;
    
    console.log(`   ${index + 1}. Chạy ${item.file}:`);
    console.log(`      - Copy toàn bộ nội dung file: ${item.file}`);
    console.log(`      - Paste vào SQL Editor`);
    console.log(`      - Click "Run" (hoặc Ctrl+Enter)`);
    console.log(`      - Đợi thông báo "Success"\n`);
});

console.log('   4. Kiểm tra lại:');
console.log('      npm run check:supabase\n');

console.log('✅ SAU KHI CHẠY SQL:\n');
console.log('   - Bảng "profiles" sẽ được tạo (cho authentication)');
console.log('   - Bảng "chat_sessions", "chat_messages", etc. sẽ được tạo');
console.log('   - Các views và functions sẽ được tạo tự động');
console.log('   - RLS policies sẽ được kích hoạt\n');

console.log('💡 LƯU Ý:\n');
console.log('   - Supabase không hỗ trợ execute raw SQL qua API');
console.log('   - Phải chạy SQL thủ công qua Dashboard');
console.log('   - Hoặc sử dụng Supabase CLI (nếu đã cài đặt)\n');

