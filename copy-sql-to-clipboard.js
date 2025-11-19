/**
 * Script copy SQL content vào clipboard để paste vào Supabase
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const sqlFiles = [
    { file: 'supabase-setup.sql', name: 'Profiles & Authentication' },
    { file: 'chat-database.sql', name: 'Chat Support Database' }
];

function copyToClipboard(text, platform) {
    return new Promise((resolve, reject) => {
        let command;
        
        if (platform === 'win32') {
            // Windows: sử dụng PowerShell Set-Clipboard
            const escapedText = text.replace(/"/g, '`"').replace(/\$/g, '`$');
            command = `powershell -Command "Set-Clipboard -Value @'\n${text}\n'@"`;
        } else if (platform === 'darwin') {
            // macOS: sử dụng pbcopy
            const escapedText = text.replace(/'/g, "'\\''");
            command = `echo '${escapedText}' | pbcopy`;
        } else {
            // Linux: sử dụng xclip hoặc xsel
            const escapedText = text.replace(/'/g, "'\\''");
            command = `echo '${escapedText}' | xclip -selection clipboard 2>/dev/null || echo '${escapedText}' | xsel --clipboard --input`;
        }

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function main() {
    const args = process.argv.slice(2);
    const fileIndex = args[0] ? parseInt(args[0]) - 1 : 0;

    if (fileIndex < 0 || fileIndex >= sqlFiles.length) {
        console.log('╔══════════════════════════════════════════════════════════╗');
        console.log('║     COPY SQL TO CLIPBOARD                               ║');
        console.log('╚══════════════════════════════════════════════════════════╝\n');
        console.log('📋 CÁC FILE SQL CÓ SẴN:\n');
        sqlFiles.forEach((sqlFile, index) => {
            console.log(`   ${index + 1}. ${sqlFile.file} - ${sqlFile.name}`);
        });
        console.log('\n💡 CÁCH SỬ DỤNG:');
        console.log('   npm run copy:sql 1  → Copy supabase-setup.sql');
        console.log('   npm run copy:sql 2  → Copy chat-database.sql\n');
        return;
    }

    const sqlFile = sqlFiles[fileIndex];
    const filePath = path.join(__dirname, sqlFile.file);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ Không tìm thấy file: ${sqlFile.file}`);
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf8');

    try {
        await copyToClipboard(content, process.platform);
        console.log(`✅ Đã copy ${sqlFile.file} vào clipboard!`);
        console.log(`\n📝 BƯỚC TIẾP THEO:`);
        console.log(`   1. Mở Supabase Dashboard:`);
        console.log(`      👉 https://supabase.com/dashboard/project/novylftuwqdeamiyxxfp`);
        console.log(`   2. Vào SQL Editor → New query`);
        console.log(`   3. Paste (Ctrl+V)`);
        console.log(`   4. Click "Run" (Ctrl+Enter)\n`);
    } catch (error) {
        console.error('❌ Không thể copy vào clipboard:', error.message);
        console.log('\n📄 NỘI DUNG SQL:\n');
        console.log('─'.repeat(60));
        console.log(content);
        console.log('─'.repeat(60));
        console.log('\n💡 Vui lòng copy thủ công từ trên\n');
    }
}

main();

