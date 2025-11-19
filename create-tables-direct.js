/**
 * Script tạo các bảng trực tiếp qua Supabase client
 * Sử dụng khi không thể chạy SQL trực tiếp
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://novylftuwqdeamiyxxfp.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_SERVICE_KEY) {
    console.log('⚠️  Cần SERVICE_ROLE key');
    console.log('   Lấy từ: Supabase Dashboard → Settings → API → service_role key\n');
    process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createTables() {
    console.log('🔄 Đang tạo các bảng...\n');

    // Tạo bảng profiles
    try {
        console.log('1. Tạo bảng profiles...');
        // Không thể tạo bảng trực tiếp qua Supabase JS client
        // Cần sử dụng SQL hoặc Management API
        console.log('   ⚠️  Không thể tạo bảng qua JS client');
        console.log('   → Cần chạy SQL script: supabase-setup.sql\n');
    } catch (error) {
        console.error('   ❌ Lỗi:', error.message);
    }

    console.log('💡 Supabase JS client không hỗ trợ DDL (CREATE TABLE)');
    console.log('📝 Cần chạy SQL scripts thủ công qua Dashboard\n');
}

createTables();

