/**
 * Script tự động setup database trên Supabase
 * Sử dụng Supabase Management API để tạo các bảng
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://novylftuwqdeamiyxxfp.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║     TỰ ĐỘNG SETUP DATABASE TRÊN SUPABASE                ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

if (!SUPABASE_SERVICE_KEY) {
    console.log('⚠️  Cần SERVICE_ROLE key để tự động setup database');
    console.log('   Đặt biến môi trường: export SUPABASE_SERVICE_KEY="your-key"\n');
    console.log('💡 Hoặc chạy SQL thủ công qua Dashboard:\n');
    console.log('   1. Mở: https://supabase.com/dashboard/project/novylftuwqdeamiyxxfp');
    console.log('   2. Vào SQL Editor → New query');
    console.log('   3. Copy nội dung file supabase-setup.sql → Run');
    console.log('   4. Copy nội dung file chat-database.sql → Run\n');
    process.exit(0);
}

// Đọc SQL files
const sqlFiles = [
    { file: 'supabase-setup.sql', name: 'Profiles & Authentication' },
    { file: 'chat-database.sql', name: 'Chat Support Database' }
];

async function setupDatabase() {
    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

        console.log('📋 Đang đọc các file SQL...\n');

        for (const sqlFile of sqlFiles) {
            const filePath = path.join(__dirname, sqlFile.file);
            
            if (!fs.existsSync(filePath)) {
                console.log(`⚠️  Không tìm thấy: ${sqlFile.file}`);
                continue;
            }

            const sqlContent = fs.readFileSync(filePath, 'utf8');
            console.log(`📄 ${sqlFile.file} (${sqlFile.name})`);
            console.log(`   Kích thước: ${(sqlContent.length / 1024).toFixed(2)} KB`);

            // Tách SQL thành các câu lệnh
            const statements = sqlContent
                .split(';')
                .map(s => s.trim())
                .filter(s => {
                    const trimmed = s.trim();
                    return trimmed.length > 0 && 
                           !trimmed.startsWith('--') && 
                           !trimmed.startsWith('/*') &&
                           trimmed !== '';
                });

            console.log(`   Tìm thấy ${statements.length} câu lệnh SQL\n`);

            // Supabase không có API trực tiếp để execute raw SQL
            // Cần sử dụng PostgREST hoặc Management API
            // Tốt nhất là hướng dẫn chạy thủ công
            
            console.log('⚠️  Supabase không hỗ trợ execute raw SQL qua REST API');
            console.log('💡 Vui lòng chạy SQL thủ công qua Dashboard\n');
        }

        console.log('📝 HƯỚNG DẪN CHẠY SQL:\n');
        console.log('   1. Mở: https://supabase.com/dashboard/project/novylftuwqdeamiyxxfp');
        console.log('   2. Vào SQL Editor → New query\n');
        
        sqlFiles.forEach((sqlFile, index) => {
            if (fs.existsSync(path.join(__dirname, sqlFile.file))) {
                console.log(`   ${index + 1}. Chạy ${sqlFile.file}:`);
                console.log(`      - Copy toàn bộ nội dung file`);
                console.log(`      - Paste vào SQL Editor`);
                console.log(`      - Click "Run" (Ctrl+Enter)\n`);
            }
        });

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    }
}

setupDatabase();

