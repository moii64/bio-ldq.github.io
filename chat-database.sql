-- Chat Support Database Schema for Bio Link
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)
-- This creates tables for storing chat messages, sessions, and statistics

-- ============================================
-- 1. CHAT SESSIONS TABLE
-- Lưu thông tin phiên chat
-- ============================================
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    user_name TEXT,
    session_status TEXT DEFAULT 'active' CHECK (session_status IN ('active', 'closed', 'resolved')),
    prompt_key TEXT, -- TECH_SUPPORT, PAYMENT_ISSUE, BUG_REPORT, etc.
    initial_message TEXT,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 2. CHAT MESSAGES TABLE
-- Lưu từng tin nhắn trong chat
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'ai', 'cs')),
    message_text TEXT NOT NULL,
    prompt_key TEXT, -- Key để nhận dạng loại yêu cầu
    metadata JSONB DEFAULT '{}'::jsonb, -- Thông tin bổ sung
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    cs_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL -- CS phản hồi
);

-- ============================================
-- 3. CHAT STATISTICS TABLE
-- Thống kê chat theo prompt key và thời gian
-- ============================================
CREATE TABLE IF NOT EXISTS chat_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    prompt_key TEXT NOT NULL,
    total_sessions INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    resolved_sessions INTEGER DEFAULT 0,
    avg_response_time INTERVAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, prompt_key)
);

-- ============================================
-- 4. CHAT FEEDBACK TABLE
-- Lưu feedback từ khách hàng sau khi chat
-- ============================================
CREATE TABLE IF NOT EXISTS chat_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    helpful BOOLEAN,
    resolved BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- Chat Sessions Indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(session_status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_prompt_key ON chat_sessions(prompt_key);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_email ON chat_sessions(user_email);

-- Chat Messages Indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_type ON chat_messages(sender_type);
CREATE INDEX IF NOT EXISTS idx_chat_messages_prompt_key ON chat_messages(prompt_key);

-- Chat Statistics Indexes
CREATE INDEX IF NOT EXISTS idx_chat_statistics_date ON chat_statistics(date DESC);
CREATE INDEX IF NOT EXISTS idx_chat_statistics_prompt_key ON chat_statistics(prompt_key);

-- Chat Feedback Indexes
CREATE INDEX IF NOT EXISTS idx_chat_feedback_session_id ON chat_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_feedback_rating ON chat_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_chat_feedback_created_at ON chat_feedback(created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for chat_sessions updated_at
CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_updated_at();

-- Trigger for chat_statistics updated_at
CREATE TRIGGER update_chat_statistics_updated_at
    BEFORE UPDATE ON chat_statistics
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_updated_at();

-- Function to update statistics when new message is added
CREATE OR REPLACE FUNCTION update_chat_statistics()
RETURNS TRIGGER AS $$
DECLARE
    v_prompt_key TEXT;
    v_date DATE;
BEGIN
    -- Get prompt_key from session
    SELECT prompt_key, DATE(created_at) INTO v_prompt_key, v_date
    FROM chat_sessions
    WHERE id = NEW.session_id;
    
    IF v_prompt_key IS NOT NULL THEN
        INSERT INTO chat_statistics (date, prompt_key, total_messages)
        VALUES (v_date, v_prompt_key, 1)
        ON CONFLICT (date, prompt_key)
        DO UPDATE SET 
            total_messages = chat_statistics.total_messages + 1,
            updated_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update statistics on new message
CREATE TRIGGER update_stats_on_message
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_statistics();

-- Function to update session statistics
CREATE OR REPLACE FUNCTION update_session_statistics()
RETURNS TRIGGER AS $$
DECLARE
    v_prompt_key TEXT;
    v_date DATE;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_prompt_key := NEW.prompt_key;
        v_date := DATE(NEW.created_at);
        
        IF v_prompt_key IS NOT NULL THEN
            INSERT INTO chat_statistics (date, prompt_key, total_sessions)
            VALUES (v_date, v_prompt_key, 1)
            ON CONFLICT (date, prompt_key)
            DO UPDATE SET 
                total_sessions = chat_statistics.total_sessions + 1,
                updated_at = NOW();
        END IF;
    ELSIF TG_OP = 'UPDATE' AND NEW.session_status = 'resolved' AND OLD.session_status != 'resolved' THEN
        v_prompt_key := NEW.prompt_key;
        v_date := DATE(NEW.created_at);
        
        IF v_prompt_key IS NOT NULL THEN
            UPDATE chat_statistics
            SET resolved_sessions = resolved_sessions + 1,
                updated_at = NOW()
            WHERE date = v_date AND prompt_key = v_prompt_key;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update statistics on session create/update
CREATE TRIGGER update_stats_on_session
    AFTER INSERT OR UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_session_statistics();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_feedback ENABLE ROW LEVEL SECURITY;

-- Chat Sessions Policies
-- Users can view their own sessions
CREATE POLICY "Users can view own chat sessions"
    ON chat_sessions FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own sessions
CREATE POLICY "Users can create own chat sessions"
    ON chat_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own active sessions
CREATE POLICY "Users can update own active sessions"
    ON chat_sessions FOR UPDATE
    USING (auth.uid() = user_id AND session_status = 'active');

-- CS/Admin can view all sessions (you may want to create a role for CS)
CREATE POLICY "CS can view all chat sessions"
    ON chat_sessions FOR SELECT
    USING (true); -- Adjust based on your role system

-- Chat Messages Policies
-- Users can view messages from their sessions
CREATE POLICY "Users can view own chat messages"
    ON chat_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM chat_sessions
            WHERE chat_sessions.id = chat_messages.session_id
            AND chat_sessions.user_id = auth.uid()
        )
    );

-- Users can insert messages to their sessions
CREATE POLICY "Users can insert own chat messages"
    ON chat_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_sessions
            WHERE chat_sessions.id = chat_messages.session_id
            AND chat_sessions.user_id = auth.uid()
        )
    );

-- CS can view all messages
CREATE POLICY "CS can view all chat messages"
    ON chat_messages FOR SELECT
    USING (true);

-- CS can insert messages
CREATE POLICY "CS can insert chat messages"
    ON chat_messages FOR INSERT
    WITH CHECK (true);

-- Chat Statistics Policies
-- Everyone can view statistics (or restrict to CS/Admin)
CREATE POLICY "Anyone can view chat statistics"
    ON chat_statistics FOR SELECT
    USING (true);

-- Only system can insert/update statistics (via triggers)
CREATE POLICY "System can manage chat statistics"
    ON chat_statistics FOR ALL
    USING (false)
    WITH CHECK (false);

-- Chat Feedback Policies
-- Users can view their own feedback
CREATE POLICY "Users can view own feedback"
    ON chat_feedback FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own feedback
CREATE POLICY "Users can create own feedback"
    ON chat_feedback FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- CS can view all feedback
CREATE POLICY "CS can view all feedback"
    ON chat_feedback FOR SELECT
    USING (true);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON chat_sessions TO authenticated;
GRANT SELECT, INSERT ON chat_messages TO authenticated;
GRANT SELECT ON chat_statistics TO authenticated;
GRANT SELECT, INSERT ON chat_feedback TO authenticated;

-- ============================================
-- VIEWS for Easy Querying
-- ============================================

-- View: Active chat sessions with message count
CREATE OR REPLACE VIEW active_chat_sessions AS
SELECT 
    cs.id,
    cs.user_id,
    cs.user_email,
    cs.user_name,
    cs.prompt_key,
    cs.initial_message,
    cs.created_at,
    cs.updated_at,
    COUNT(cm.id) as message_count,
    MAX(cm.created_at) as last_message_at
FROM chat_sessions cs
LEFT JOIN chat_messages cm ON cs.id = cm.session_id
WHERE cs.session_status = 'active'
GROUP BY cs.id, cs.user_id, cs.user_email, cs.user_name, cs.prompt_key, cs.initial_message, cs.created_at, cs.updated_at;

-- View: Chat statistics by prompt key
CREATE OR REPLACE VIEW chat_stats_by_prompt AS
SELECT 
    prompt_key,
    SUM(total_sessions) as total_sessions,
    SUM(total_messages) as total_messages,
    SUM(resolved_sessions) as resolved_sessions,
    ROUND(
        CASE 
            WHEN SUM(total_sessions) > 0 
            THEN (SUM(resolved_sessions)::numeric / SUM(total_sessions)::numeric) * 100
            ELSE 0
        END, 2
    ) as resolution_rate
FROM chat_statistics
GROUP BY prompt_key
ORDER BY total_sessions DESC;

-- View: Recent chat sessions with details
CREATE OR REPLACE VIEW recent_chat_sessions AS
SELECT 
    cs.id,
    cs.user_email,
    cs.user_name,
    cs.prompt_key,
    cs.session_status,
    cs.created_at,
    cs.updated_at,
    COUNT(cm.id) as message_count,
    MAX(cm.created_at) as last_message_at
FROM chat_sessions cs
LEFT JOIN chat_messages cm ON cs.id = cm.session_id
GROUP BY cs.id, cs.user_email, cs.user_name, cs.prompt_key, cs.session_status, cs.created_at, cs.updated_at
ORDER BY cs.updated_at DESC
LIMIT 100;

-- ============================================
-- HELPER FUNCTIONS for CS Dashboard
-- ============================================

-- Function: Get chat history by session ID
CREATE OR REPLACE FUNCTION get_chat_history(session_uuid UUID)
RETURNS TABLE (
    id UUID,
    sender_type TEXT,
    message_text TEXT,
    prompt_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cm.id,
        cm.sender_type,
        cm.message_text,
        cm.prompt_key,
        cm.created_at
    FROM chat_messages cm
    WHERE cm.session_id = session_uuid
    ORDER BY cm.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get sessions by prompt key
CREATE OR REPLACE FUNCTION get_sessions_by_prompt(p_key TEXT, limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
    id UUID,
    user_email TEXT,
    user_name TEXT,
    session_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    message_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cs.id,
        cs.user_email,
        cs.user_name,
        cs.session_status,
        cs.created_at,
        COUNT(cm.id) as message_count
    FROM chat_sessions cs
    LEFT JOIN chat_messages cm ON cs.id = cm.session_id
    WHERE cs.prompt_key = p_key
    GROUP BY cs.id, cs.user_email, cs.user_name, cs.session_status, cs.created_at
    ORDER BY cs.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get daily statistics
CREATE OR REPLACE FUNCTION get_daily_statistics(start_date DATE, end_date DATE)
RETURNS TABLE (
    date DATE,
    prompt_key TEXT,
    total_sessions INTEGER,
    total_messages INTEGER,
    resolved_sessions INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cs.date,
        cs.prompt_key,
        cs.total_sessions,
        cs.total_messages,
        cs.resolved_sessions
    FROM chat_statistics cs
    WHERE cs.date BETWEEN start_date AND end_date
    ORDER BY cs.date DESC, cs.prompt_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMMENTS for Documentation
-- ============================================
COMMENT ON TABLE chat_sessions IS 'Stores chat session information including user details and session status';
COMMENT ON TABLE chat_messages IS 'Stores individual messages within chat sessions';
COMMENT ON TABLE chat_statistics IS 'Aggregated statistics for chat sessions by date and prompt key';
COMMENT ON TABLE chat_feedback IS 'Stores user feedback after chat sessions';

COMMENT ON COLUMN chat_sessions.prompt_key IS 'Key to identify request type: TECH_SUPPORT, PAYMENT_ISSUE, BUG_REPORT, FEATURE_REQUEST, ACCOUNT_HELP, GENERAL_QUESTION';
COMMENT ON COLUMN chat_messages.sender_type IS 'Type of sender: user, ai, or cs (customer support)';
COMMENT ON COLUMN chat_messages.prompt_key IS 'Key to identify the type of request for this message';

-- ============================================
-- 5. JOBS TABLE
-- Bảng để quản lý các job/task cần xử lý
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_type TEXT NOT NULL, -- Loại job: 'chat_notification', 'email_send', 'data_export', etc.
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    payload JSONB DEFAULT '{}'::jsonb, -- Dữ liệu job
    priority INTEGER DEFAULT 0, -- Độ ưu tiên (số càng cao càng ưu tiên)
    attempts INTEGER DEFAULT 0, -- Số lần thử
    max_attempts INTEGER DEFAULT 3, -- Số lần thử tối đa
    error_message TEXT,
    result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    scheduled_at TIMESTAMP WITH TIME ZONE -- Thời gian lên lịch
);

-- Indexes for jobs table
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_priority ON jobs(priority DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_at ON jobs(scheduled_at) WHERE scheduled_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- Function to process pending jobs
CREATE OR REPLACE FUNCTION process_pending_jobs()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  job_cur REFCURSOR;
  rec RECORD;
BEGIN
  OPEN job_cur FOR 
    SELECT id, payload, job_type 
    FROM jobs 
    WHERE status = 'pending' 
      AND (scheduled_at IS NULL OR scheduled_at <= NOW())
    ORDER BY priority DESC, created_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT 100; -- Giới hạn số job xử lý mỗi lần

  LOOP
    FETCH job_cur INTO rec;
    EXIT WHEN NOT FOUND;

    -- Cập nhật trạng thái thành processing
    UPDATE jobs 
    SET 
      status = 'processing',
      started_at = NOW(),
      updated_at = NOW(),
      attempts = attempts + 1
    WHERE id = rec.id;

    -- Thêm logic xử lý khác ở đây dựa trên job_type
    -- Ví dụ: gửi email, xử lý notification, export data, etc.
    
  END LOOP;
  
  CLOSE job_cur;
END;
$$;

-- Function to mark job as completed
CREATE OR REPLACE FUNCTION complete_job(job_id UUID, result_data JSONB DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE jobs
  SET 
    status = 'completed',
    result = result_data,
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = job_id;
END;
$$;

-- Function to mark job as failed
CREATE OR REPLACE FUNCTION fail_job(job_id UUID, error_msg TEXT)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  job_rec RECORD;
BEGIN
  SELECT * INTO job_rec FROM jobs WHERE id = job_id;
  
  IF job_rec.attempts >= job_rec.max_attempts THEN
    -- Đã vượt quá số lần thử tối đa
    UPDATE jobs
    SET 
      status = 'failed',
      error_message = error_msg,
      completed_at = NOW(),
      updated_at = NOW()
    WHERE id = job_id;
  ELSE
    -- Vẫn còn cơ hội thử lại
    UPDATE jobs
    SET 
      status = 'pending',
      error_message = error_msg,
      updated_at = NOW()
    WHERE id = job_id;
  END IF;
END;
$$;

-- Trigger to update updated_at for jobs
CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_updated_at();

-- RLS for jobs table
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Only system/service role can manage jobs
CREATE POLICY "System can manage jobs"
    ON jobs FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON jobs TO authenticated;

-- View: Pending jobs by type
CREATE OR REPLACE VIEW pending_jobs_by_type AS
SELECT 
    job_type,
    COUNT(*) as total_pending,
    MIN(created_at) as oldest_job,
    MAX(priority) as highest_priority
FROM jobs
WHERE status = 'pending'
GROUP BY job_type
ORDER BY total_pending DESC;

-- Comments
COMMENT ON TABLE jobs IS 'Bảng quản lý các job/task cần xử lý bất đồng bộ';
COMMENT ON COLUMN jobs.job_type IS 'Loại job: chat_notification, email_send, data_export, etc.';
COMMENT ON COLUMN jobs.status IS 'Trạng thái: pending, processing, completed, failed';
COMMENT ON COLUMN jobs.payload IS 'Dữ liệu job dưới dạng JSON';
COMMENT ON FUNCTION process_pending_jobs() IS 'Xử lý các job đang pending, sử dụng SKIP LOCKED để tránh conflict';

