/**
 * Script hỗ trợ chạy SQL scripts trên Supabase
 * Mở Dashboard và hiển thị SQL content để copy
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const SUPABASE_DASHBOARD = 'https://supabase.com/dashboard/project/novylftuwqdeamiyxxfp/sql/new';

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║     CHẠY SQL SCRIPTS TRÊN SUPABASE                     ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

const sqlFiles = [
    {
        file: 'supabase-setup.sql',
        name: 'Profiles & Authentication',
        order: 1
    },
    {
        file: 'chat-database.sql',
        name: 'Chat Support Database',
        order: 2
    }
];

async function runSQL() {
    console.log('📋 DANH SÁCH SQL SCRIPTS:\n');
    
    for (const sqlFile of sqlFiles) {
        const filePath = path.join(__dirname, sqlFile.file);
        
        if (!fs.existsSync(filePath)) {
            console.log(`   ❌ ${sqlFile.file} - Không tìm thấy file\n`);
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const size = (content.length / 1024).toFixed(2);
        
        console.log(`${sqlFile.order}. ${sqlFile.name}`);
        console.log(`   📄 File: ${sqlFile.file}`);
        console.log(`   📊 Kích thước: ${size} KB`);
        console.log(`   📝 Số dòng: ${content.split('\n').length}\n`);
    }

    console.log('🚀 BẮT ĐẦU CHẠY SQL:\n');
    console.log('   1. Đang mở Supabase Dashboard...\n');

    // Mở browser (Windows)
    const platform = process.platform;
    let command;
    
    if (platform === 'win32') {
        command = `start ${SUPABASE_DASHBOARD}`;
    } else if (platform === 'darwin') {
        command = `open ${SUPABASE_DASHBOARD}`;
    } else {
        command = `xdg-open ${SUPABASE_DASHBOARD}`;
    }

    exec(command, (error) => {
        if (error) {
            console.log('   ⚠️  Không thể mở browser tự động');
            console.log(`   👉 Vui lòng mở thủ công: ${SUPABASE_DASHBOARD}\n`);
        } else {
            console.log('   ✅ Đã mở Supabase Dashboard\n');
        }

        console.log('📝 HƯỚNG DẪN CHẠY TỪNG FILE:\n');

        sqlFiles.forEach((sqlFile, index) => {
            const filePath = path.join(__dirname, sqlFile.file);
            
            if (!fs.existsSync(filePath)) return;

            console.log(`   ${sqlFile.order}. Chạy ${sqlFile.file}:`);
            console.log(`      📋 ${sqlFile.name}`);
            console.log(`      📝 Các bước:`);
            console.log(`         1. Trong SQL Editor, click "New query"`);
            console.log(`         2. Copy toàn bộ nội dung file: ${sqlFile.file}`);
            console.log(`         3. Paste vào SQL Editor`);
            console.log(`         4. Click "Run" (hoặc Ctrl+Enter)`);
            console.log(`         5. Đợi thông báo "Success"`);
            
            // Hiển thị preview SQL (10 dòng đầu)
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n').slice(0, 10);
            console.log(`\n      📄 Preview (10 dòng đầu):`);
            console.log(`         ${lines.join('\n         ')}`);
            if (content.split('\n').length > 10) {
                console.log(`         ... (còn ${content.split('\n').length - 10} dòng)`);
            }
            console.log('');
        });

        console.log('✅ SAU KHI CHẠY XONG:\n');
        console.log('   Chạy lệnh để kiểm tra:');
        console.log('   npm run check:supabase\n');
    });
}

runSQL();

