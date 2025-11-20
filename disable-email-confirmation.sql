-- Disable email confirmation in Supabase
-- Run this SQL in your Supabase SQL Editor
-- 
-- Note: This changes the auth configuration. After running this:
-- 1. Users can login immediately after registration without confirming email
-- 2. You can re-enable it later if needed
--
-- IMPORTANT: This is a configuration change, not a database migration.
-- You need to change it in Supabase Dashboard:
-- Dashboard > Authentication > Settings > Email Auth > Confirm email: OFF

-- This SQL file is for reference only
-- Actual change must be done in Supabase Dashboard:
-- 
-- Steps to disable email confirmation:
-- 1. Go to https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to Authentication > Settings
-- 4. Under "Email Auth", toggle "Confirm email" to OFF
-- 5. Save changes
--
-- Alternative: Use Supabase CLI or API to change this setting

-- If you want to manually confirm all existing users (optional):
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;

-- This will mark all existing unconfirmed users as confirmed

