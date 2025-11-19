/**
 * Script để chạy SQL scripts lên Supabase
 * Cần service_role key để có quyền execute SQL
 */

const fs = require('fs');
const path = require('path');

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║     CHẠY SQL SCRIPTS LÊN SUPABASE                        ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

// Đọc credentials từ config
let SUPABASE_URL = 'https://novylftuwqdeamiyxxfp.supabase.co';
let SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_SERVICE_KEY) {
    console.log('⚠️  CẦN SERVICE_ROLE KEY để chạy SQL scripts!');
    console.log('\n📝 CÁCH LẤY SERVICE_ROLE KEY:');
    console.log('   1. Vào Supabase Dashboard → Settings → API');
    console.log('   2. Copy "service_role" key (KHÔNG phải anon key)');
    console.log('   3. Đặt biến môi trường:');
    console.log('      export SUPABASE_SERVICE_KEY="your-service-role-key"');
    console.log('   4. Hoặc sửa trong file này\n');
    console.log('💡 HOẶC chạy SQL thủ công qua Supabase Dashboard:');
    console.log('   1. Vào https://supabase.com/dashboard');
    console.log('   2. Chọn project → SQL Editor');
    console.log('   3. Copy nội dung file supabase-setup.sql → Paste → Run');
    console.log('   4. Copy nội dung file chat-database.sql → Paste → Run\n');
    process.exit(0);
}

// Đọc SQL files
const sqlFiles = [
    { name: 'supabase-setup.sql', description: 'Setup profiles và authentication' },
    { name: 'chat-database.sql', description: 'Setup chat support database' }
];

console.log('📋 CÁC FILE SQL SẼ ĐƯỢC CHẠY:\n');
sqlFiles.forEach((file, index) => {
    const exists = fs.existsSync(path.join(__dirname, file.name));
    console.log(`   ${index + 1}. ${file.name} - ${file.description}`);
    console.log(`      ${exists ? '✅ Tồn tại' : '❌ Không tìm thấy'}\n`);
});

// Kiểm tra xem có thể chạy không
let createClient;
try {
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
    createClient = createSupabaseClient;
} catch (error) {
    console.error('❌ Chưa cài đặt @supabase/supabase-js');
    console.log('📦 Chạy: npm install @supabase/supabase-js\n');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Hàm execute SQL
async function executeSQL(sqlContent, fileName) {
    console.log(`\n🔄 Đang chạy ${fileName}...`);
    
    // Tách SQL thành các câu lệnh
    const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

    console.log(`   📝 Tìm thấy ${statements.length} câu lệnh SQL`);

    // Supabase không có API trực tiếp để execute raw SQL
    // Cần sử dụng PostgREST hoặc Management API
    // Tốt nhất là chạy qua Dashboard
    
    console.log('\n⚠️  Supabase không hỗ trợ execute raw SQL qua API');
    console.log('💡 Vui lòng chạy SQL thủ công qua Supabase Dashboard:\n');
    console.log('   1. Mở: https://supabase.com/dashboard');
    console.log(`   2. Chọn project: ${SUPABASE_URL}`);
    console.log('   3. Vào SQL Editor → New query');
    console.log(`   4. Copy toàn bộ nội dung file: ${fileName}`);
    console.log('   5. Paste và click Run\n');
    
    return false;
}

// Main
(async () => {
    for (const file of sqlFiles) {
        const filePath = path.join(__dirname, file.name);
        
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  Bỏ qua ${file.name} - Không tìm thấy file`);
            continue;
        }

        const sqlContent = fs.readFileSync(filePath, 'utf8');
        await executeSQL(sqlContent, file.name);
    }

    console.log('\n✅ Hoàn thành!');
    console.log('📝 Sau khi chạy SQL, kiểm tra lại bằng:');
    console.log('   npm run check:supabase\n');
})();

