/**
 * Script thử chạy SQL qua Supabase Management API
 * Sử dụng service_role key để có quyền execute SQL
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_URL = 'https://novylftuwqdeamiyxxfp.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║     CHẠY SQL QUA SUPABASE API                         ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

if (!SUPABASE_SERVICE_KEY) {
    console.log('⚠️  Cần SERVICE_ROLE key để chạy SQL qua API');
    console.log('\n📝 CÁCH LẤY SERVICE_ROLE KEY:');
    console.log('   1. Vào Supabase Dashboard → Settings → API');
    console.log('   2. Copy "service_role" key (KHÔNG phải anon key)');
    console.log('   3. Đặt biến môi trường:');
    console.log('      export SUPABASE_SERVICE_KEY="your-service-role-key"');
    console.log('   4. Hoặc sửa trong file này\n');
    console.log('💡 HOẶC chạy SQL thủ công qua Dashboard:\n');
    console.log('   👉 https://supabase.com/dashboard/project/novylftuwqdeamiyxxfp/sql/new\n');
    process.exit(0);
}

const sqlFiles = [
    { file: 'supabase-setup.sql', name: 'Profiles & Authentication', order: 1 },
    { file: 'chat-database.sql', name: 'Chat Support Database', order: 2 }
];

// Hàm gọi Supabase Management API để execute SQL
async function executeSQLViaAPI(sqlContent, fileName) {
    return new Promise((resolve, reject) => {
        const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);
        
        // Supabase không có endpoint exec_sql mặc định
        // Cần sử dụng PostgREST hoặc tạo function custom
        // Hoặc sử dụng Supabase CLI
        
        console.log(`\n⚠️  Supabase REST API không hỗ trợ execute raw SQL trực tiếp`);
        console.log(`💡 Cần chạy SQL thủ công qua Dashboard\n`);
        
        resolve(false);
    });
}

// Hàm thử sử dụng Supabase CLI
async function trySupabaseCLI() {
    const { exec } = require('child_process');
    
    return new Promise((resolve) => {
        exec('supabase --version', (error) => {
            if (error) {
                console.log('⚠️  Supabase CLI chưa được cài đặt');
                console.log('📦 Cài đặt: npm install -g supabase\n');
                resolve(false);
            } else {
                console.log('✅ Supabase CLI đã được cài đặt');
                console.log('💡 Có thể sử dụng: supabase db push\n');
                resolve(true);
            }
        });
    });
}

async function main() {
    console.log('📋 DANH SÁCH SQL SCRIPTS:\n');
    
    for (const sqlFile of sqlFiles) {
        const filePath = path.join(__dirname, sqlFile.file);
        
        if (!fs.existsSync(filePath)) {
            console.log(`   ❌ ${sqlFile.file} - Không tìm thấy`);
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const size = (content.length / 1024).toFixed(2);
        
        console.log(`   ${sqlFile.order}. ${sqlFile.file}`);
        console.log(`      📝 ${sqlFile.name}`);
        console.log(`      📊 ${size} KB\n`);
    }

    console.log('🔍 ĐANG KIỂM TRA PHƯƠNG THỨC CHẠY SQL...\n');

    // Thử Supabase CLI
    const hasCLI = await trySupabaseCLI();

    if (!hasCLI) {
        console.log('📝 HƯỚNG DẪN CHẠY SQL THỦ CÔNG:\n');
        console.log('   1. Mở Supabase Dashboard:');
        console.log(`      👉 https://supabase.com/dashboard/project/novylftuwqdeamiyxxfp/sql/new\n`);
        console.log('   2. Vào SQL Editor → New query\n');
        
        sqlFiles.forEach((sqlFile, index) => {
            const filePath = path.join(__dirname, sqlFile.file);
            if (!fs.existsSync(filePath)) return;
            
            console.log(`   ${sqlFile.order}. Chạy ${sqlFile.file}:`);
            console.log(`      - Copy toàn bộ nội dung file`);
            console.log(`      - Paste vào SQL Editor`);
            console.log(`      - Click "Run" (Ctrl+Enter)`);
            console.log(`      - Đợi "Success"\n`);
        });

        console.log('   3. Sau khi chạy xong, kiểm tra:');
        console.log('      npm run check:supabase\n');
    }
}

main().catch(console.error);

