/**
 * Script kiểm tra kết nối Supabase
 * Chạy: node check-supabase-connection.js
 */

const fs = require('fs');
const path = require('path');

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║     KIỂM TRA KẾT NỐI SUPABASE                          ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

// Đọc file auth-supabase.js
const authFile = path.join(__dirname, 'auth-supabase.js');
let authContent = '';

try {
    authContent = fs.readFileSync(authFile, 'utf8');
} catch (error) {
    console.error('❌ Không thể đọc file auth-supabase.js');
    process.exit(1);
}

// Kiểm tra cấu hình
console.log('📋 1. KIỂM TRA CẤU HÌNH TRONG CODE\n');

const urlMatch = authContent.match(/url:\s*['"]([^'"]+)['"]/);
const keyMatch = authContent.match(/anonKey:\s*['"]([^'"]+)['"]/);

const configuredUrl = urlMatch ? urlMatch[1] : null;
const configuredKey = keyMatch ? keyMatch[1] : null;

console.log(`   URL: ${configuredUrl || '❌ Không tìm thấy'}`);
console.log(`   Key: ${configuredKey ? (configuredKey.substring(0, 20) + '...') : '❌ Không tìm thấy'}`);

if (configuredUrl === 'YOUR_SUPABASE_URL' || !configuredUrl) {
    console.log('\n⚠️  CHƯA CẤU HÌNH SUPABASE!');
    console.log('   → File auth-supabase.js vẫn dùng giá trị mặc định');
    console.log('   → Hệ thống đang sử dụng localStorage fallback\n');
    
    console.log('📝 CÁCH CẤU HÌNH:');
    console.log('   1. Mở file auth-supabase.js');
    console.log('   2. Tìm dòng 14-17');
    console.log('   3. Thay thế:');
    console.log('      url: \'YOUR_SUPABASE_URL\' → URL của bạn');
    console.log('      anonKey: \'YOUR_SUPABASE_ANON_KEY\' → Key của bạn\n');
    
    process.exit(0);
}

if (configuredKey === 'YOUR_SUPABASE_ANON_KEY' || !configuredKey) {
    console.log('\n⚠️  CHƯA CẤU HÌNH SUPABASE KEY!');
    console.log('   → Cần cập nhật anonKey trong auth-supabase.js\n');
    process.exit(0);
}

console.log('\n✅ Đã cấu hình trong code\n');

// Kiểm tra kết nối thực tế
console.log('📡 2. KIỂM TRA KẾT NỐI THỰC TẾ\n');

// Thử import @supabase/supabase-js
let createClient;
try {
    const supabase = require('@supabase/supabase-js');
    createClient = supabase.createClient;
    console.log('   ✅ Đã cài đặt @supabase/supabase-js');
} catch (error) {
    console.log('   ⚠️  Chưa cài đặt @supabase/supabase-js');
    console.log('   → Chạy: npm install @supabase/supabase-js\n');
    console.log('💡 Hoặc kiểm tra qua trình duyệt:');
    console.log('   1. Mở trang web');
    console.log('   2. Mở Console (F12)');
    console.log('   3. Kiểm tra log: "Supabase initialized successfully" hoặc "Supabase not configured"\n');
    process.exit(0);
}

// Tạo client và test kết nối
try {
    const supabaseClient = createClient(configuredUrl, configuredKey);
    
    console.log('   🔄 Đang kiểm tra kết nối...');
    
    // Test query đơn giản
    supabaseClient
        .from('profiles')
        .select('count')
        .limit(1)
        .then(({ data, error }) => {
            if (error) {
                if (error.code === 'PGRST116') {
                    console.log('   ⚠️  Kết nối thành công nhưng bảng "profiles" chưa tồn tại');
                    console.log('   → Cần chạy SQL script: supabase-setup.sql\n');
                } else if (error.code === '42P01') {
                    console.log('   ⚠️  Kết nối thành công nhưng schema chưa được setup');
                    console.log('   → Cần chạy SQL script: supabase-setup.sql\n');
                } else {
                    console.log(`   ❌ Lỗi kết nối: ${error.message}`);
                    console.log(`   → Code: ${error.code}\n`);
                }
            } else {
                console.log('   ✅ KẾT NỐI THÀNH CÔNG!');
                console.log('   → Supabase đang hoạt động bình thường\n');
            }
            
            // Kiểm tra các bảng chat
            console.log('📊 3. KIỂM TRA CÁC BẢNG CHAT\n');
            
            const chatTables = ['chat_sessions', 'chat_messages', 'chat_statistics', 'chat_feedback'];
            let checkedTables = 0;
            
            chatTables.forEach(tableName => {
                supabaseClient
                    .from(tableName)
                    .select('count')
                    .limit(1)
                    .then(({ error }) => {
                        checkedTables++;
                        if (error) {
                            if (error.code === 'PGRST116' || error.code === '42P01') {
                                console.log(`   ⚠️  Bảng "${tableName}" chưa tồn tại`);
                            } else {
                                console.log(`   ❌ Lỗi kiểm tra "${tableName}": ${error.message}`);
                            }
                        } else {
                            console.log(`   ✅ Bảng "${tableName}" đã tồn tại`);
                        }
                        
                        if (checkedTables === chatTables.length) {
                            console.log('\n📝 KẾT LUẬN:\n');
                            
                            if (checkedTables === chatTables.length) {
                                console.log('   ✅ Tất cả bảng chat đã được tạo');
                                console.log('   → Database đã sẵn sàng cho chat support\n');
                            } else {
                                console.log('   ⚠️  Một số bảng chat chưa được tạo');
                                console.log('   → Cần chạy SQL script: chat-database.sql');
                                console.log('   → Xem hướng dẫn: QUICK-CHAT-DB-SETUP.md\n');
                            }
                            
                            process.exit(0);
                        }
                    })
                    .catch(err => {
                        checkedTables++;
                        console.log(`   ❌ Lỗi kiểm tra "${tableName}": ${err.message}`);
                        
                        if (checkedTables === chatTables.length) {
                            process.exit(1);
                        }
                    });
            });
        })
        .catch(err => {
            console.log(`   ❌ Lỗi kết nối: ${err.message}\n`);
            console.log('💡 KIỂM TRA:');
            console.log('   1. URL và Key đã đúng chưa?');
            console.log('   2. Project Supabase đã active chưa?');
            console.log('   3. Kiểm tra internet connection\n');
            process.exit(1);
        });
        
} catch (error) {
    console.log(`   ❌ Lỗi tạo client: ${error.message}\n`);
    process.exit(1);
}

