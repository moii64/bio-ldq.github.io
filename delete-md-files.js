/**
 * Script xóa các file .md sau khi hỏi xác nhận
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

async function main() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     XÓA CÁC FILE .MD                                    ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    // Danh sách file .md ở root
    const mdFiles = [
        'CHANGELOG.md',
        'CHAT-DATABASE-SETUP.md',
        'GET-ANON-KEY.md',
        'GIT-PUSH.md',
        'IMPROVEMENTS.md',
        'KIEM-TRA-TONG-HOP.md',
        'QUICK-CHAT-DB-SETUP.md',
        'QUICK-SUPABASE-SETUP.md',
        'README-SUPABASE.md',
        'SUPABASE-SETUP.md',
        'SUPABASE-STATUS.md',
        'VERIFICATION-REPORT.md'
        // README.md sẽ được giữ lại
    ];

    console.log('📋 DANH SÁCH FILE .MD SẼ BỊ XÓA:\n');
    mdFiles.forEach((file, index) => {
        const exists = fs.existsSync(path.join(__dirname, file));
        console.log(`   ${index + 1}. ${file} ${exists ? '✅' : '❌ Không tồn tại'}`);
    });
    console.log('\n   📄 README.md sẽ được GIỮ LẠI\n');

    const answer = await question('❓ Bạn có chắc chắn muốn xóa các file này? (yes/no): ');
    
    if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
        console.log('\n❌ Đã hủy. Không có file nào bị xóa.\n');
        rl.close();
        return;
    }

    console.log('\n🗑️  Đang xóa các file...\n');

    let deletedCount = 0;
    let notFoundCount = 0;

    for (const file of mdFiles) {
        const filePath = path.join(__dirname, file);
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`   ✅ Đã xóa: ${file}`);
                deletedCount++;
            } else {
                console.log(`   ⚠️  Không tìm thấy: ${file}`);
                notFoundCount++;
            }
        } catch (error) {
            console.log(`   ❌ Lỗi khi xóa ${file}: ${error.message}`);
        }
    }

    console.log(`\n✅ Hoàn thành!`);
    console.log(`   ✅ Đã xóa: ${deletedCount} file`);
    if (notFoundCount > 0) {
        console.log(`   ⚠️  Không tìm thấy: ${notFoundCount} file`);
    }
    console.log(`   📄 README.md vẫn được giữ lại\n`);

    rl.close();
}

main().catch(console.error);

