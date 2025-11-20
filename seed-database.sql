-- Seed Data for Bio Link Database
-- Run this SQL in your Supabase SQL Editor after running supabase-setup.sql and chat-database.sql
-- This adds sample data for testing and demonstration

-- ============================================
-- 1. SAMPLE PROFILES
-- ============================================
-- Note: These profiles reference auth.users, so you need to have actual users first
-- For testing, you can create test users via Supabase Auth or use existing user IDs

-- Example: Insert sample profile (replace UUID with actual user ID from auth.users)
-- Uncomment and modify the UUID below with a real user ID
/*
INSERT INTO profiles (id, username, email, profile, links, tasks, settings)
VALUES 
    (
        '00000000-0000-0000-0000-000000000001'::uuid, -- Replace with actual user ID
        'demo_user',
        'demo@example.com',
        '{
            "name": "Demo User",
            "bio": "This is a demo profile for testing",
            "image": "https://via.placeholder.com/150",
            "socialLinks": {
                "twitter": "https://twitter.com/demo",
                "github": "https://github.com/demo",
                "linkedin": "https://linkedin.com/in/demo"
            }
        }'::jsonb,
        '[
            {
                "id": "link1",
                "title": "My Website",
                "url": "https://example.com",
                "icon": "fas fa-globe",
                "position": 0
            },
            {
                "id": "link2",
                "title": "GitHub",
                "url": "https://github.com/demo",
                "icon": "fab fa-github",
                "position": 1
            }
        ]'::jsonb,
        '[
            {
                "id": "task1",
                "title": "Trò chuyện Agenl AI Support",
                "completed": false,
                "icon": "fas fa-headset",
                "createdAt": "2024-01-01T00:00:00Z"
            }
        ]'::jsonb,
        '{
            "theme": "gradient",
            "seasonalEffects": true
        }'::jsonb
    )
ON CONFLICT (id) DO NOTHING;
*/

-- ============================================
-- 2. SAMPLE CHAT SESSIONS
-- ============================================
-- Insert sample chat sessions (you can modify user_id or leave NULL for anonymous sessions)

INSERT INTO chat_sessions (
    id,
    user_id,
    user_email,
    user_name,
    session_status,
    prompt_key,
    initial_message,
    ip_address,
    user_agent,
    device_info,
    created_at
) VALUES 
    (
        gen_random_uuid(),
        NULL, -- Anonymous user
        'user1@example.com',
        'Nguyễn Văn A',
        'active',
        'TECH_SUPPORT',
        'Tôi gặp vấn đề khi đăng nhập vào hệ thống',
        '192.168.1.100'::inet,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        '{"device": "desktop", "browser": "Chrome", "os": "Windows"}'::jsonb,
        NOW() - INTERVAL '2 hours'
    ),
    (
        gen_random_uuid(),
        NULL,
        'user2@example.com',
        'Trần Thị B',
        'resolved',
        'PAYMENT_ISSUE',
        'Tôi muốn hỏi về cách thanh toán',
        '192.168.1.101'::inet,
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
        '{"device": "mobile", "browser": "Safari", "os": "iOS"}'::jsonb,
        NOW() - INTERVAL '1 day'
    ),
    (
        gen_random_uuid(),
        NULL,
        'user3@example.com',
        'Lê Văn C',
        'closed',
        'BUG_REPORT',
        'Tôi phát hiện một lỗi trong tính năng chat',
        '192.168.1.102'::inet,
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        '{"device": "desktop", "browser": "Firefox", "os": "macOS"}'::jsonb,
        NOW() - INTERVAL '3 days'
    ),
    (
        gen_random_uuid(),
        NULL,
        'user4@example.com',
        'Phạm Thị D',
        'active',
        'FEATURE_REQUEST',
        'Tôi muốn đề xuất thêm tính năng mới',
        '192.168.1.103'::inet,
        'Mozilla/5.0 (Android 11)',
        '{"device": "mobile", "browser": "Chrome", "os": "Android"}'::jsonb,
        NOW() - INTERVAL '30 minutes'
    ),
    (
        gen_random_uuid(),
        NULL,
        'user5@example.com',
        'Hoàng Văn E',
        'resolved',
        'ACCOUNT_HELP',
        'Tôi quên mật khẩu, làm sao để lấy lại?',
        '192.168.1.104'::inet,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        '{"device": "desktop", "browser": "Edge", "os": "Windows"}'::jsonb,
        NOW() - INTERVAL '5 hours'
    )
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. SAMPLE CHAT MESSAGES
-- ============================================
-- Insert sample messages for the chat sessions above
-- Note: You need to get the session IDs from chat_sessions table first

DO $$
DECLARE
    session1_id UUID;
    session2_id UUID;
    session3_id UUID;
    session4_id UUID;
    session5_id UUID;
BEGIN
    -- Get session IDs
    SELECT id INTO session1_id FROM chat_sessions WHERE user_email = 'user1@example.com' AND prompt_key = 'TECH_SUPPORT' LIMIT 1;
    SELECT id INTO session2_id FROM chat_sessions WHERE user_email = 'user2@example.com' AND prompt_key = 'PAYMENT_ISSUE' LIMIT 1;
    SELECT id INTO session3_id FROM chat_sessions WHERE user_email = 'user3@example.com' AND prompt_key = 'BUG_REPORT' LIMIT 1;
    SELECT id INTO session4_id FROM chat_sessions WHERE user_email = 'user4@example.com' AND prompt_key = 'FEATURE_REQUEST' LIMIT 1;
    SELECT id INTO session5_id FROM chat_sessions WHERE user_email = 'user5@example.com' AND prompt_key = 'ACCOUNT_HELP' LIMIT 1;

    -- Session 1: Tech Support
    IF session1_id IS NOT NULL THEN
        INSERT INTO chat_messages (session_id, sender_type, message_text, prompt_key, created_at) VALUES
            (session1_id, 'user', 'Tôi gặp vấn đề khi đăng nhập vào hệ thống', 'TECH_SUPPORT', NOW() - INTERVAL '2 hours'),
            (session1_id, 'ai', 'Xin chào! Tôi có thể giúp bạn giải quyết vấn đề đăng nhập. Bạn có thể mô tả chi tiết lỗi bạn gặp phải không?', 'TECH_SUPPORT', NOW() - INTERVAL '2 hours' + INTERVAL '10 seconds'),
            (session1_id, 'user', 'Khi tôi nhập email và mật khẩu, hệ thống báo lỗi "Invalid credentials"', 'TECH_SUPPORT', NOW() - INTERVAL '2 hours' + INTERVAL '1 minute'),
            (session1_id, 'ai', 'Cảm ơn bạn đã cung cấp thông tin. Vui lòng thử các bước sau: 1) Kiểm tra lại email và mật khẩu, 2) Thử reset mật khẩu, 3) Xóa cache trình duyệt. Bạn đã thử các bước này chưa?', 'TECH_SUPPORT', NOW() - INTERVAL '2 hours' + INTERVAL '2 minutes');
    END IF;

    -- Session 2: Payment Issue
    IF session2_id IS NOT NULL THEN
        INSERT INTO chat_messages (session_id, sender_type, message_text, prompt_key, created_at) VALUES
            (session2_id, 'user', 'Tôi muốn hỏi về cách thanh toán', 'PAYMENT_ISSUE', NOW() - INTERVAL '1 day'),
            (session2_id, 'ai', 'Chào bạn! Chúng tôi hỗ trợ nhiều phương thức thanh toán: thẻ tín dụng, chuyển khoản ngân hàng, và ví điện tử. Bạn muốn sử dụng phương thức nào?', 'PAYMENT_ISSUE', NOW() - INTERVAL '1 day' + INTERVAL '15 seconds'),
            (session2_id, 'user', 'Tôi muốn thanh toán bằng thẻ tín dụng', 'PAYMENT_ISSUE', NOW() - INTERVAL '1 day' + INTERVAL '1 minute'),
            (session2_id, 'ai', 'Tuyệt vời! Bạn có thể thanh toán bằng thẻ Visa, Mastercard, hoặc American Express. Quá trình thanh toán được bảo mật bởi SSL. Bạn có cần hỗ trợ thêm gì không?', 'PAYMENT_ISSUE', NOW() - INTERVAL '1 day' + INTERVAL '2 minutes'),
            (session2_id, 'cs', 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', 'PAYMENT_ISSUE', NOW() - INTERVAL '1 day' + INTERVAL '3 minutes');
    END IF;

    -- Session 3: Bug Report
    IF session3_id IS NOT NULL THEN
        INSERT INTO chat_messages (session_id, sender_type, message_text, prompt_key, created_at) VALUES
            (session3_id, 'user', 'Tôi phát hiện một lỗi trong tính năng chat', 'BUG_REPORT', NOW() - INTERVAL '3 days'),
            (session3_id, 'ai', 'Cảm ơn bạn đã báo lỗi! Bạn có thể mô tả chi tiết lỗi bạn gặp phải không?', 'BUG_REPORT', NOW() - INTERVAL '3 days' + INTERVAL '20 seconds'),
            (session3_id, 'user', 'Khi tôi gửi tin nhắn dài, hệ thống không hiển thị đầy đủ', 'BUG_REPORT', NOW() - INTERVAL '3 days' + INTERVAL '1 minute'),
            (session3_id, 'ai', 'Chúng tôi đã ghi nhận lỗi này. Đội kỹ thuật sẽ kiểm tra và khắc phục sớm nhất. Cảm ơn bạn!', 'BUG_REPORT', NOW() - INTERVAL '3 days' + INTERVAL '2 minutes');
    END IF;

    -- Session 4: Feature Request
    IF session4_id IS NOT NULL THEN
        INSERT INTO chat_messages (session_id, sender_type, message_text, prompt_key, created_at) VALUES
            (session4_id, 'user', 'Tôi muốn đề xuất thêm tính năng mới', 'FEATURE_REQUEST', NOW() - INTERVAL '30 minutes'),
            (session4_id, 'ai', 'Rất vui được lắng nghe ý kiến của bạn! Bạn muốn đề xuất tính năng gì?', 'FEATURE_REQUEST', NOW() - INTERVAL '30 minutes' + INTERVAL '10 seconds'),
            (session4_id, 'user', 'Tôi muốn có tính năng tìm kiếm trong chat history', 'FEATURE_REQUEST', NOW() - INTERVAL '30 minutes' + INTERVAL '1 minute'),
            (session4_id, 'ai', 'Đây là một ý tưởng tuyệt vời! Chúng tôi sẽ xem xét và có thể triển khai trong phiên bản tới. Cảm ơn bạn đã đóng góp!', 'FEATURE_REQUEST', NOW() - INTERVAL '30 minutes' + INTERVAL '2 minutes');
    END IF;

    -- Session 5: Account Help
    IF session5_id IS NOT NULL THEN
        INSERT INTO chat_messages (session_id, sender_type, message_text, prompt_key, created_at) VALUES
            (session5_id, 'user', 'Tôi quên mật khẩu, làm sao để lấy lại?', 'ACCOUNT_HELP', NOW() - INTERVAL '5 hours'),
            (session5_id, 'ai', 'Bạn có thể reset mật khẩu bằng cách: 1) Vào trang đăng nhập, 2) Click "Quên mật khẩu", 3) Nhập email của bạn, 4) Kiểm tra email và làm theo hướng dẫn. Bạn cần hỗ trợ thêm không?', 'ACCOUNT_HELP', NOW() - INTERVAL '5 hours' + INTERVAL '15 seconds'),
            (session5_id, 'user', 'Tôi đã làm theo nhưng không nhận được email', 'ACCOUNT_HELP', NOW() - INTERVAL '5 hours' + INTERVAL '2 minutes'),
            (session5_id, 'ai', 'Vui lòng kiểm tra thư mục Spam/Junk. Nếu vẫn không có, vui lòng đợi vài phút hoặc thử lại. Nếu vẫn không được, chúng tôi sẽ chuyển bạn đến bộ phận hỗ trợ.', 'ACCOUNT_HELP', NOW() - INTERVAL '5 hours' + INTERVAL '3 minutes'),
            (session5_id, 'cs', 'Xin chào! Tôi là nhân viên hỗ trợ. Tôi sẽ giúp bạn kiểm tra lại vấn đề này.', 'ACCOUNT_HELP', NOW() - INTERVAL '5 hours' + INTERVAL '5 minutes');
    END IF;
END $$;

-- ============================================
-- 4. SAMPLE CHAT STATISTICS
-- ============================================
-- Insert sample statistics (these are usually auto-generated by triggers, but we can add sample data)

INSERT INTO chat_statistics (date, prompt_key, total_sessions, total_messages, resolved_sessions, created_at, updated_at)
VALUES 
    (CURRENT_DATE, 'TECH_SUPPORT', 10, 45, 8, NOW(), NOW()),
    (CURRENT_DATE, 'PAYMENT_ISSUE', 5, 20, 5, NOW(), NOW()),
    (CURRENT_DATE, 'BUG_REPORT', 3, 12, 2, NOW(), NOW()),
    (CURRENT_DATE, 'FEATURE_REQUEST', 7, 25, 4, NOW(), NOW()),
    (CURRENT_DATE, 'ACCOUNT_HELP', 8, 30, 7, NOW(), NOW()),
    (CURRENT_DATE - INTERVAL '1 day', 'TECH_SUPPORT', 15, 60, 12, NOW(), NOW()),
    (CURRENT_DATE - INTERVAL '1 day', 'PAYMENT_ISSUE', 8, 32, 7, NOW(), NOW()),
    (CURRENT_DATE - INTERVAL '2 days', 'TECH_SUPPORT', 12, 48, 10, NOW(), NOW()),
    (CURRENT_DATE - INTERVAL '2 days', 'BUG_REPORT', 5, 18, 3, NOW(), NOW())
ON CONFLICT (date, prompt_key) 
DO UPDATE SET
    total_sessions = chat_statistics.total_sessions + EXCLUDED.total_sessions,
    total_messages = chat_statistics.total_messages + EXCLUDED.total_messages,
    resolved_sessions = chat_statistics.resolved_sessions + EXCLUDED.resolved_sessions,
    updated_at = NOW();

-- ============================================
-- 5. SAMPLE CHAT FEEDBACK
-- ============================================
-- Insert sample feedback for resolved sessions

DO $$
DECLARE
    resolved_session_id UUID;
BEGIN
    -- Get a resolved session
    SELECT id INTO resolved_session_id 
    FROM chat_sessions 
    WHERE session_status = 'resolved' 
    LIMIT 1;

    IF resolved_session_id IS NOT NULL THEN
        INSERT INTO chat_feedback (session_id, user_id, rating, feedback_text, helpful, resolved, created_at)
        VALUES 
            (resolved_session_id, NULL, 5, 'Rất hài lòng với dịch vụ hỗ trợ!', true, true, NOW() - INTERVAL '1 day'),
            (resolved_session_id, NULL, 4, 'Hỗ trợ tốt, nhưng cần cải thiện thời gian phản hồi', true, true, NOW() - INTERVAL '2 days'),
            (resolved_session_id, NULL, 5, 'Tuyệt vời! Vấn đề được giải quyết nhanh chóng', true, true, NOW() - INTERVAL '3 days')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================
-- 6. SAMPLE JOBS
-- ============================================
-- Insert sample jobs for testing job queue

INSERT INTO jobs (job_type, status, payload, priority, attempts, max_attempts, created_at, scheduled_at)
VALUES 
    (
        'chat_notification',
        'pending',
        '{"session_id": "00000000-0000-0000-0000-000000000001", "message": "New chat message"}'::jsonb,
        5,
        0,
        3,
        NOW(),
        NOW()
    ),
    (
        'email_send',
        'pending',
        '{"to": "user@example.com", "subject": "Welcome", "template": "welcome"}'::jsonb,
        3,
        0,
        3,
        NOW(),
        NOW() + INTERVAL '1 hour'
    ),
    (
        'data_export',
        'processing',
        '{"user_id": "00000000-0000-0000-0000-000000000001", "format": "csv"}'::jsonb,
        1,
        1,
        3,
        NOW() - INTERVAL '10 minutes',
        NOW() - INTERVAL '10 minutes'
    ),
    (
        'chat_notification',
        'completed',
        '{"session_id": "00000000-0000-0000-0000-000000000002", "message": "Chat resolved"}'::jsonb,
        5,
        1,
        3,
        NOW() - INTERVAL '1 hour',
        NOW() - INTERVAL '1 hour'
    ),
    (
        'email_send',
        'failed',
        '{"to": "invalid@example.com", "subject": "Test"}'::jsonb,
        2,
        3,
        3,
        NOW() - INTERVAL '2 hours',
        NOW() - INTERVAL '2 hours'
    )
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. UPDATE SESSION STATUS
-- ============================================
-- Update some sessions to resolved/closed status

UPDATE chat_sessions
SET 
    session_status = 'resolved',
    resolved_at = NOW() - INTERVAL '1 day'
WHERE user_email = 'user2@example.com' AND prompt_key = 'PAYMENT_ISSUE';

UPDATE chat_sessions
SET 
    session_status = 'closed',
    closed_at = NOW() - INTERVAL '3 days'
WHERE user_email = 'user3@example.com' AND prompt_key = 'BUG_REPORT';

UPDATE chat_sessions
SET 
    session_status = 'resolved',
    resolved_at = NOW() - INTERVAL '5 hours'
WHERE user_email = 'user5@example.com' AND prompt_key = 'ACCOUNT_HELP';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these queries to verify the seed data

-- Count records in each table
SELECT 'chat_sessions' as table_name, COUNT(*) as count FROM chat_sessions
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM chat_messages
UNION ALL
SELECT 'chat_statistics', COUNT(*) FROM chat_statistics
UNION ALL
SELECT 'chat_feedback', COUNT(*) FROM chat_feedback
UNION ALL
SELECT 'jobs', COUNT(*) FROM jobs;

-- View active chat sessions
SELECT * FROM active_chat_sessions LIMIT 10;

-- View chat statistics by prompt
SELECT * FROM chat_stats_by_prompt;

-- View recent chat sessions
SELECT * FROM recent_chat_sessions LIMIT 10;

-- View pending jobs
SELECT * FROM pending_jobs_by_type;

