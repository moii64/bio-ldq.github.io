/**
 * Script để upload chat-database.sql lên Supabase
 * 
 * Cách sử dụng:
 * 1. Cài đặt: npm install @supabase/supabase-js
 * 2. Cấu hình SUPABASE_URL và SUPABASE_SERVICE_KEY trong file này
 * 3. Chạy: node upload-chat-db.js
 */

const fs = require('fs');
const path = require('path');

// ============================================
// CẤU HÌNH - Thay đổi các giá trị này
// ============================================
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_KEY';

// Lưu ý: Service Key có quyền cao hơn anon key
// Lấy từ: Supabase Dashboard → Settings → API → service_role key

// ============================================
// Hàm upload SQL
// ============================================
async function uploadSQL() {
    try {
        // Đọc file SQL
        const sqlFile = path.join(__dirname, 'chat-database.sql');
        
        if (!fs.existsSync(sqlFile)) {
            console.error('❌ Không tìm thấy file chat-database.sql');
            console.log('📁 Đảm bảo file chat-database.sql ở cùng thư mục với script này');
            process.exit(1);
        }

        const sqlContent = fs.readFileSync(sqlFile, 'utf8');

        console.log('📄 Đã đọc file SQL thành công');
        console.log(`📊 Kích thước: ${(sqlContent.length / 1024).toFixed(2)} KB`);

        // Kiểm tra cấu hình
        if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_SERVICE_KEY === 'YOUR_SERVICE_KEY') {
            console.error('\n❌ Vui lòng cấu hình SUPABASE_URL và SUPABASE_SERVICE_KEY');
            console.log('\nCách 1: Sửa trực tiếp trong file upload-chat-db.js');
            console.log('Cách 2: Đặt biến môi trường:');
            console.log('  export SUPABASE_URL="your-url"');
            console.log('  export SUPABASE_SERVICE_KEY="your-key"');
            console.log('\nHoặc sử dụng cách upload thủ công qua Supabase Dashboard (xem CHAT-DATABASE-SETUP.md)');
            process.exit(1);
        }

        // Import Supabase client (cần cài đặt: npm install @supabase/supabase-js)
        let createClient;
        try {
            const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
            createClient = createSupabaseClient;
        } catch (error) {
            console.error('\n❌ Chưa cài đặt @supabase/supabase-js');
            console.log('📦 Chạy lệnh: npm install @supabase/supabase-js');
            console.log('\nHoặc sử dụng cách upload thủ công qua Supabase Dashboard');
            process.exit(1);
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

        console.log('\n🔄 Đang upload SQL lên Supabase...');

        // Tách SQL thành các câu lệnh (tách theo dấu ;)
        // Lưu ý: Cách này đơn giản, có thể cần xử lý phức tạp hơn cho stored procedures
        const statements = sqlContent
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`📝 Tìm thấy ${statements.length} câu lệnh SQL`);

        // Thực thi từng câu lệnh
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            
            // Bỏ qua các câu lệnh comment hoặc rỗng
            if (!statement || statement.startsWith('--')) {
                continue;
            }

            try {
                // Sử dụng RPC để execute SQL (nếu có function)
                // Hoặc sử dụng query trực tiếp
                const { data, error } = await supabase.rpc('exec_sql', { 
                    sql_query: statement 
                });

                if (error) {
                    // Nếu không có function exec_sql, thử cách khác
                    // Supabase không có API trực tiếp để execute raw SQL
                    // Nên cách tốt nhất vẫn là upload qua Dashboard
                    console.warn(`⚠️  Không thể execute SQL trực tiếp qua API`);
                    console.log('\n💡 Khuyến nghị: Upload thủ công qua Supabase Dashboard');
                    console.log('   Xem hướng dẫn trong file CHAT-DATABASE-SETUP.md');
                    process.exit(0);
                }

                successCount++;
                if ((i + 1) % 10 === 0) {
                    console.log(`   ✅ Đã xử lý ${i + 1}/${statements.length} câu lệnh...`);
                }
            } catch (err) {
                errorCount++;
                console.error(`❌ Lỗi ở câu lệnh ${i + 1}:`, err.message);
            }
        }

        console.log('\n✅ Hoàn thành!');
        console.log(`   ✅ Thành công: ${successCount}`);
        console.log(`   ❌ Lỗi: ${errorCount}`);

    } catch (error) {
        console.error('\n❌ Lỗi:', error.message);
        console.log('\n💡 Khuyến nghị: Upload thủ công qua Supabase Dashboard');
        console.log('   Xem hướng dẫn trong file CHAT-DATABASE-SETUP.md');
        process.exit(1);
    }
}

// ============================================
// Hàm hiển thị hướng dẫn
// ============================================
function showInstructions() {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║     HƯỚNG DẪN UPLOAD CHAT DATABASE LÊN SUPABASE         ║
╚══════════════════════════════════════════════════════════╝

📋 CÁCH 1: Upload qua Supabase Dashboard (Khuyến nghị)
   
   1. Mở https://supabase.com/dashboard
   2. Chọn project của bạn
   3. Vào SQL Editor → New query
   4. Copy toàn bộ nội dung file chat-database.sql
   5. Paste và click Run

📋 CÁCH 2: Sử dụng Supabase CLI
   
   supabase db push

📋 CÁCH 3: Sử dụng script này (cần cấu hình)
   
   1. Cài đặt: npm install @supabase/supabase-js
   2. Cấu hình SUPABASE_URL và SUPABASE_SERVICE_KEY
   3. Chạy: node upload-chat-db.js

📄 Xem chi tiết trong file: CHAT-DATABASE-SETUP.md

`);
}

// ============================================
// Main
// ============================================
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        showInstructions();
    } else {
        uploadSQL();
    }
}

module.exports = { uploadSQL, showInstructions };

