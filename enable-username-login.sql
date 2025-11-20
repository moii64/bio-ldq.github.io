-- Enable username login for Supabase
-- This allows users to login with username instead of email
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- OPTION 1: Allow anonymous SELECT on username and email only
-- ============================================

-- Grant SELECT permission on username and email columns
GRANT SELECT (username, email) ON profiles TO anon;

-- Create a view that only exposes username and email (more secure)
CREATE OR REPLACE VIEW public.username_email_lookup AS
SELECT username, email
FROM profiles;

-- Allow anonymous access to the view
GRANT SELECT ON public.username_email_lookup TO anon;

-- Create RLS policy for the view
ALTER VIEW public.username_email_lookup OWNER TO postgres;

-- ============================================
-- OPTION 2: Create a function to lookup email (more secure)
-- ============================================

-- Function to get email from username (returns null if not found)
CREATE OR REPLACE FUNCTION public.get_email_from_username(p_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_email TEXT;
BEGIN
    SELECT email INTO v_email
    FROM profiles
    WHERE username = LOWER(p_username)
    LIMIT 1;
    
    RETURN v_email;
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.get_email_from_username(TEXT) TO anon;

-- Add comment
COMMENT ON FUNCTION public.get_email_from_username IS 'Lookup email from username for login purposes. Public access allowed.';

