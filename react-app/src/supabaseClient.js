import { createClient } from '@supabase/supabase-js'

// Use the REACT_APP_ prefixed env var for Create React App to embed at build time.
// Fallback to the explicit URL you provided. For the key, prefer the anon key
// for client-side usage. Do NOT expose a service_role key in client code.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://novylftuwqdeamiyxxfp.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or ANON KEY is not set. Add them to .env.local or set REACT_APP_SUPABASE_ANON_KEY/SUPABASE_KEY as env vars')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
