// Copy this file to config.js and fill in your Supabase credentials
// This file is gitignored for security

const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL', // e.g., 'https://xxxxx.supabase.co'
    anonKey: 'YOUR_SUPABASE_ANON_KEY' // Your anon/public key from Supabase
};

// Export for use in auth-supabase.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
}

