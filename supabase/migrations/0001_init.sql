-- Initial migration: links and clicks tables
-- Enables gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  title text,
  url text NOT NULL,
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clicks (
  id bigserial PRIMARY KEY,
  link_id uuid REFERENCES public.links(id) ON DELETE CASCADE,
  referrer text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);
CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON public.clicks(link_id);
