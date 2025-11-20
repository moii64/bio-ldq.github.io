/**
 * Script tự động seed dữ liệu mẫu vào Supabase Database
 * Chạy script này sau khi đã tạo các bảng (supabase-setup.sql và chat-database.sql)
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

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║     SEED DATABASE - THÊM DỮ LIỆU MẪU                   ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

const seedFile = path.join(__dirname, 'seed-database.sql');

if (!fs.existsSync(seedFile)) {
    console.log('❌ Không tìm thấy file seed-database.sql\n');
    process.exit(1);
}

const content = fs.readFileSync(seedFile, 'utf8');
const size = (content.length / 1024).toFixed(2);

console.log('📋 THÔNG TIN FILE SEED:\n');
console.log(`   📄 File: seed-database.sql`);
console.log(`   📊 Kích thước: ${size} KB`);
console.log(`   📝 Số dòng: ${content.split('\n').length}\n`);

console.log('📋 DỮ LIỆU SẼ ĐƯỢC THÊM:\n');
console.log('   ✅ 5 chat sessions mẫu');
console.log('   ✅ Nhiều chat messages mẫu');
console.log('   ✅ Chat statistics mẫu');
console.log('   ✅ Chat feedback mẫu');
console.log('   ✅ Jobs mẫu (pending, processing, completed, failed)');
console.log('   ✅ Các views và functions sẽ được test\n');

console.log('⚠️  LƯU Ý:\n');
console.log('   - Script này sẽ thêm dữ liệu mẫu vào database');
console.log('   - Dữ liệu sẽ được insert với ON CONFLICT DO NOTHING');
console.log('   - Có thể chạy nhiều lần mà không bị duplicate\n');

async function main() {
    const answer = await question('Bạn có muốn xem nội dung SQL trước khi chạy? (yes/no): ');
    
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        console.log('\n' + '='.repeat(60));
        console.log('📋 NỘI DUNG SQL:\n');
        console.log(content);
        console.log('\n' + '='.repeat(60));
    }

    console.log('\n📝 HƯỚNG DẪN CHẠY:\n');
    console.log('   1. Copy toàn bộ SQL ở trên (Ctrl+A, Ctrl+C)');
    console.log('   2. Mở Supabase Dashboard:');
    console.log('      👉 https://supabase.com/dashboard/project/novylftuwqdeamiyxxfp/sql/new');
    console.log('   3. Vào SQL Editor → New query');
    console.log('   4. Paste SQL (Ctrl+V)');
    console.log('   5. Click "Run" (Ctrl+Enter)');
    console.log('   6. Đợi thông báo "Success"\n');

    const continueAnswer = await question('Đã chạy xong? (yes/no): ');
    
    if (continueAnswer.toLowerCase() === 'yes' || continueAnswer.toLowerCase() === 'y') {
        console.log('\n✅ Hoàn thành!');
        console.log('\n📊 KIỂM TRA DỮ LIỆU:\n');
        console.log('   Chạy các query sau trong Supabase SQL Editor:\n');
        console.log('   -- Xem số lượng records');
        console.log('   SELECT \'chat_sessions\' as table_name, COUNT(*) as count FROM chat_sessions');
        console.log('   UNION ALL');
        console.log('   SELECT \'chat_messages\', COUNT(*) FROM chat_messages;\n');
        console.log('   -- Xem active sessions');
        console.log('   SELECT * FROM active_chat_sessions LIMIT 10;\n');
        console.log('   -- Xem statistics');
        console.log('   SELECT * FROM chat_stats_by_prompt;\n');
    }

    rl.close();
}

main().catch(console.error);

