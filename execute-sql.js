/**
 * Script hiển thị SQL content để copy và chạy trên Supabase
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

const sqlFiles = [
    { file: 'supabase-setup.sql', name: 'Profiles & Authentication', order: 1 },
    { file: 'chat-database.sql', name: 'Chat Support Database', order: 2 }
];

async function main() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     CHẠY SQL SCRIPTS TRÊN SUPABASE                     ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    console.log('📋 CHỌN FILE SQL ĐỂ CHẠY:\n');
    sqlFiles.forEach((sqlFile) => {
        const exists = fs.existsSync(path.join(__dirname, sqlFile.file));
        console.log(`   ${sqlFile.order}. ${sqlFile.file} - ${sqlFile.name} ${exists ? '✅' : '❌'}`);
    });
    console.log('   0. Chạy tất cả\n');

    const answer = await question('Nhập số (1-2 hoặc 0): ');
    const choice = parseInt(answer);

    if (choice === 0) {
        // Chạy tất cả
        console.log('\n🚀 CHẠY TẤT CẢ SQL SCRIPTS:\n');
        for (const sqlFile of sqlFiles) {
            await processFile(sqlFile);
        }
    } else if (choice >= 1 && choice <= sqlFiles.length) {
        await processFile(sqlFiles[choice - 1]);
    } else {
        console.log('\n❌ Lựa chọn không hợp lệ\n');
    }

    rl.close();
}

async function processFile(sqlFile) {
    const filePath = path.join(__dirname, sqlFile.file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`\n❌ Không tìm thấy file: ${sqlFile.file}\n`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const size = (content.length / 1024).toFixed(2);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📄 ${sqlFile.file} - ${sqlFile.name}`);
    console.log(`📊 Kích thước: ${size} KB`);
    console.log(`📝 Số dòng: ${content.split('\n').length}`);
    console.log('='.repeat(60));
    console.log('\n📋 NỘI DUNG SQL:\n');
    console.log(content);
    console.log('\n' + '='.repeat(60));

    console.log('\n📝 HƯỚNG DẪN:\n');
    console.log('   1. Copy toàn bộ SQL ở trên (Ctrl+A, Ctrl+C)');
    console.log('   2. Mở Supabase Dashboard:');
    console.log('      👉 https://supabase.com/dashboard/project/novylftuwqdeamiyxxfp');
    console.log('   3. Vào SQL Editor → New query');
    console.log('   4. Paste SQL (Ctrl+V)');
    console.log('   5. Click "Run" (Ctrl+Enter)');
    console.log('   6. Đợi thông báo "Success"\n');

    const continueAnswer = await question('Đã chạy xong? (yes/no): ');
    if (continueAnswer.toLowerCase() === 'yes' || continueAnswer.toLowerCase() === 'y') {
        console.log('✅ Tiếp tục...\n');
    }
}

main().catch(console.error);

