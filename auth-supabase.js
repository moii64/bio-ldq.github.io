/**
 * Authentication System for Bio Link using Supabase
 * Handles user registration, login, logout, and session management
 * 
 * Setup Instructions:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Get your project URL and anon key from Settings > API
 * 3. Update SUPABASE_CONFIG below with your credentials
 * 4. Run the SQL migrations in supabase-setup.sql in your Supabase SQL Editor
 */

// Supabase Configuration
// Try to load from config.js first, fallback to default
let SUPABASE_CONFIG = {
    url: 'https://novylftuwqdeamiyxxfp.supabase.co', // e.g., 'https://xxxxx.supabase.co'
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdnlsZnR1d3FkZWFtaXl4eGZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzI2MjAsImV4cCI6MjA3OTEwODYyMH0._yPS_o4ItaaEnmf6QuUGhnM-MkWBA0J58lQhzdQr9EQ' // Your anon/public key
};

// Load config from config.js if available
if (typeof window !== 'undefined') {
    // Try to get config immediately
    if (window.SUPABASE_CONFIG) {
        SUPABASE_CONFIG = window.SUPABASE_CONFIG;
    }

    // Also listen for config load event
    window.addEventListener('supabaseConfigLoaded', function() {
        if (window.SUPABASE_CONFIG) {
            SUPABASE_CONFIG = window.SUPABASE_CONFIG;
            console.log('Supabase config loaded from config.js');
        }
    });

    // Fallback: check again after a short delay
    setTimeout(function() {
        if (window.SUPABASE_CONFIG && SUPABASE_CONFIG.url === 'YOUR_SUPABASE_URL') {
            SUPABASE_CONFIG = window.SUPABASE_CONFIG;
        }
    }, 100);
}

// Initialize Supabase client
let supabase = null;
let supabaseLoading = false;

// Load Supabase from CDN
async function loadSupabase() {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.supabase) {
            supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            resolve(true);
            return;
        }

        // Check if already loading - chờ tối đa 1 giây rồi tiếp tục
        if (supabaseLoading) {
            console.log('🔄 Supabase đang được load, đang chờ 1 giây...');
            let found = false;
            const quickCheck = setInterval(() => {
                if (window.supabase) {
                    clearInterval(quickCheck);
                    found = true;
                    supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
                        auth: {
                            persistSession: true,
                            autoRefreshToken: true,
                            detectSessionInUrl: true
                        },
                        global: {
                            headers: {
                                'apikey': SUPABASE_CONFIG.anonKey,
                                'Content-Type': 'application/json'
                            }
                        }
                    });
                    console.log('✅ Supabase loaded (was loading)');
                    resolve(true);
                }
            }, 100);
            setTimeout(() => {
                clearInterval(quickCheck);
                if (!found) {
                    console.warn('⚠️ Chưa load được sau 1 giây, đang thử load lại...');
                    supabaseLoading = false; // Reset để load lại
                }
            }, 1000);
            // Nếu tìm thấy trong 1 giây, đã resolve ở trên
            // Nếu không, tiếp tục load script mới
            if (found) return;
        }

        // Load Supabase from CDN
        const existingScript = document.querySelector('script[src*="supabase"]');

        // Nếu script đã tồn tại và window.supabase đã có, dùng luôn
        if (existingScript && window.supabase) {
            supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                },
                global: {
                    headers: {
                        'apikey': SUPABASE_CONFIG.anonKey,
                        'Content-Type': 'application/json'
                    }
                }
            });
            console.log('✅ Supabase already loaded from existing script');
            resolve(true);
            return;
        }

        // Nếu script đã tồn tại nhưng window.supabase chưa có, xóa script cũ và load lại
        if (existingScript && !window.supabase) {
            console.warn('⚠️ Script tag tồn tại nhưng Supabase chưa load, đang xóa và load lại...');
            existingScript.remove();
        }

        // Load script mới (luôn load nếu không có script hoặc script đã bị xóa)
        supabaseLoading = true;
        const script = document.createElement('script');
        // Try multiple CDN sources for better reliability
        const cdnSources = [
            'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
            'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.min.js',
            'https://cdn.skypack.dev/@supabase/supabase-js@2'
        ];

        let currentSourceIndex = 0;
        let scriptCreated = false;

        const tryLoadSource = (index) => {
            if (index >= cdnSources.length) {
                supabaseLoading = false;
                console.error('❌ Tất cả CDN sources đều fail');
                reject(new Error('All Supabase CDN sources failed'));
                return;
            }

            // Tạo script mới cho mỗi source
            // Xóa tất cả script cũ trước khi tạo mới
            if (scriptCreated) {
                const oldScripts = document.querySelectorAll('script[src*="supabase"]');
                oldScripts.forEach(s => s.remove());
            }
            const newScript = document.createElement('script');
            newScript.src = cdnSources[index];
            console.log(`🔄 Đang thử load Supabase từ: ${cdnSources[index]}`);

            // Timeout cho mỗi CDN source (10 giây)
            const sourceTimeout = setTimeout(() => {
                console.warn(`⚠️ Timeout loading from ${cdnSources[index]} (10s), trying next source...`);
                newScript.remove();
                tryLoadSource(index + 1);
            }, 10000);

            newScript.onload = () => {
                clearTimeout(sourceTimeout);
                if (window.supabase) {
                    // Verify config before creating client
                    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
                        console.error('❌ SUPABASE_CONFIG chưa được cấu hình đúng:', SUPABASE_CONFIG);
                        tryLoadSource(index + 1);
                        return;
                    }

                    console.log('✅ Tạo Supabase client với:', {
                        url: SUPABASE_CONFIG.url,
                        anonKey: SUPABASE_CONFIG.anonKey ? `${SUPABASE_CONFIG.anonKey.substring(0, 20)}...` : 'MISSING'
                    });

                    // Create Supabase client with proper options
                    supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
                        auth: {
                            persistSession: true,
                            autoRefreshToken: true,
                            detectSessionInUrl: true
                        },
                        global: {
                            headers: {
                                'apikey': SUPABASE_CONFIG.anonKey,
                                'Content-Type': 'application/json'
                            }
                        }
                    });
                    supabaseLoading = false;
                    console.log('✅ Supabase loaded successfully from:', cdnSources[index]);
                    resolve(true);
                } else {
                    supabaseLoading = false;
                    console.warn(`⚠️ Supabase script loaded but window.supabase not available, trying next source...`);
                    newScript.remove();
                    setTimeout(() => tryLoadSource(index + 1), 500);
                }
            };

            newScript.onerror = () => {
                clearTimeout(sourceTimeout);
                console.warn(`⚠️ Failed to load from ${cdnSources[index]}, trying next source...`);
                newScript.remove();
                setTimeout(() => tryLoadSource(index + 1), 500);
            };

            document.head.appendChild(newScript);
            scriptCreated = true;
        };

        tryLoadSource(0);
    });
}

const Auth = {
    // Storage keys for fallback
    SESSION_KEY: 'bioLinkSession',
    CURRENT_USER_KEY: 'bioLinkCurrentUser',
    USE_SUPABASE: true, // Set to false to use localStorage fallback

    /**
     * Initialize authentication system
     */
    async init() {
        if (this.USE_SUPABASE && SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL') {
            try {
                console.log('🔄 Đang khởi tạo Supabase...');
                await loadSupabase();
                console.log('✅ Supabase initialized successfully');
            } catch (error) {
                console.warn('⚠️ Failed to load Supabase, falling back to localStorage:', error);
                console.warn('   Bạn vẫn có thể sử dụng ứng dụng, nhưng dữ liệu chỉ lưu local');
                console.warn('   Để sử dụng Supabase:');
                console.warn('   1. Kiểm tra kết nối internet');
                console.warn('   2. Thử tắt VPN/Proxy nếu có');
                console.warn('   3. Refresh trang (F5)');
                console.warn('   4. Hoặc chạy: debugSupabaseConnection() trong Console');
                this.USE_SUPABASE = false;
            }
        } else if (SUPABASE_CONFIG.url === 'YOUR_SUPABASE_URL') {
            console.warn('⚠️ Supabase not configured, using localStorage fallback');
            this.USE_SUPABASE = false;
        }
    },

    /**
     * Check if Supabase is available
     */
    isSupabaseAvailable() {
        return this.USE_SUPABASE && supabase !== null;
    },

    /**
     * Get Supabase client - ensures it's properly initialized with API key
     */
    getSupabaseClient() {
        if (!this.isSupabaseAvailable()) {
            console.warn('⚠️ Supabase không khả dụng');
            return null;
        }

        // Verify config
        if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
            console.error('❌ SUPABASE_CONFIG chưa được cấu hình:', SUPABASE_CONFIG);
            return null;
        }

        // Verify client is initialized
        if (!supabase) {
            console.error('❌ Supabase client chưa được khởi tạo');
            return null;
        }

        // Recreate client if needed (in case config changed)
        try {
            // Test if client works by checking if it has the auth property
            if (!supabase.auth) {
                console.warn('⚠️ Supabase client không hợp lệ, đang tạo lại...');
                supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            }
        } catch (error) {
            console.error('❌ Lỗi khi kiểm tra Supabase client:', error);
            try {
                supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            } catch (createError) {
                console.error('❌ Không thể tạo Supabase client:', createError);
                return null;
            }
        }

        return supabase;
    },

    /**
     * Register a new user
     * @param {string} username - Username
     * @param {string} email - Email address
     * @param {string} password - Password
     * @returns {Promise<Object>} Result object with success status and message
     */
    async register(username, email, password) {
        try {
            if (this.isSupabaseAvailable()) {
                // Use Supabase Auth
                console.log('🔄 Đang đăng ký với Supabase...', {
                    email: email.trim().toLowerCase()
                });

                // Get Supabase client
                const supabaseClient = this.getSupabaseClient();
                if (!supabaseClient) {
                    console.error('❌ Không thể lấy Supabase client để đăng ký');
                    return {
                        success: false,
                        message: 'Không thể kết nối đến Supabase. Vui lòng refresh trang và thử lại.'
                    };
                }

                const {
                    data: authData,
                    error: authError
                } = await supabaseClient.auth.signUp({
                    email: email.trim().toLowerCase(),
                    password: password,
                    options: {
                        data: {
                            username: username.trim()
                        },
                        emailRedirectTo: window.location.origin + '/index.html'
                    }
                });

                if (authError) {
                    console.error('❌ Lỗi đăng ký:', authError);
                } else {
                    const emailConfirmed = authData.user && authData.user.email_confirmed_at;
                    if (emailConfirmed) {
                        console.log('✅ Đăng ký thành công! Bạn có thể đăng nhập ngay.');
                    } else {
                        console.log('✅ Đăng ký thành công! (Email confirmation đã được tắt)');
                    }
                }

                if (authError) {
                    return {
                        success: false,
                        message: this.getErrorMessage(authError.message)
                    };
                }

                // Profile should be auto-created by trigger (handle_new_user function)
                // We don't need to manually create it to avoid RLS issues
                // The trigger runs with SECURITY DEFINER and bypasses RLS
                if (authData.user) {
                    console.log('✅ User đã được tạo:', authData.user.id);
                    console.log('ℹ️ Profile sẽ được tạo tự động bởi trigger');

                    // Check if email confirmation is required
                    const requiresConfirmation = authData.user && !authData.user.email_confirmed_at;
                    if (requiresConfirmation) {
                        console.log('ℹ️ User cần xác nhận email trước khi đăng nhập (nếu email confirmation được bật)');
                    } else {
                        console.log('ℹ️ Email confirmation đã được tắt, user có thể đăng nhập ngay');
                    }

                    return {
                        success: true,
                        message: requiresConfirmation ?
                            'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.' : 'Đăng ký thành công! Bạn có thể đăng nhập ngay.',
                        user: {
                            id: authData.user.id,
                            username: username.trim(),
                            email: email.trim().toLowerCase(),
                            emailConfirmed: !!authData.user.email_confirmed_at
                        }
                    };
                }
            } else {
                // Fallback to localStorage
                return this.registerLocalStorage(username, email, password);
            }
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.'
            };
        }
    },

    /**
     * Login user
     * @param {string} identifier - Username or email
     * @param {string} password - Password
     * @param {boolean} rememberMe - Remember login session
     * @returns {Promise<Object>} Result object with success status and message
     */
    async login(identifier, password, rememberMe = false) {
        try {
            if (this.isSupabaseAvailable()) {
                // First, try to find user by email (Supabase uses email for auth)
                let email = identifier;

                // If identifier might be username (no @), try to lookup email
                if (!identifier.includes('@')) {
                    console.log('🔍 Identifier không có @, có thể là username:', identifier);
                    console.log('🔄 Đang tìm email từ username...');

                    // Try to get email from username using the lookup function or view
                    const supabaseClientForLookup = this.getSupabaseClient();
                    if (supabaseClientForLookup) {
                        try {
                            // Try using the RPC function first (more secure)
                            const {
                                data: emailFromFunc,
                                error: funcError
                            } = await supabaseClientForLookup
                                .rpc('get_email_from_username', {
                                    p_username: identifier.toLowerCase()
                                });

                            if (funcError) {
                                console.log('ℹ️ Function lookup error:', funcError.message);
                                console.log('   Will try fallback methods...');
                            } else if (emailFromFunc) {
                                // Function returns TEXT directly (string) or could be wrapped
                                if (typeof emailFromFunc === 'string' && emailFromFunc.length > 0) {
                                    email = emailFromFunc;
                                    console.log('✅ Tìm thấy email từ username (qua function):', email);
                                } else {
                                    // Handle if returned in different format
                                    console.log('ℹ️ Function returned unexpected format:', typeof emailFromFunc, emailFromFunc);
                                    // Continue to fallback
                                }
                            }

                            // Only try fallback if function didn't return a valid email
                            if (!email || !email.includes('@')) {
                                // Fallback: try using the view (if exists)
                                const {
                                    data: lookupData,
                                    error: viewError
                                } = await supabaseClientForLookup
                                    .from('username_email_lookup')
                                    .select('email')
                                    .eq('username', identifier.toLowerCase())
                                    .single();

                                if (!viewError && lookupData && lookupData.email) {
                                    email = lookupData.email;
                                    console.log('✅ Tìm thấy email từ username (qua view):', email);
                                } else {
                                    // Last fallback: try direct query (might work if RLS allows)
                                    const {
                                        data: profileData,
                                        error: profileError
                                    } = await supabaseClientForLookup
                                        .from('profiles')
                                        .select('email')
                                        .eq('username', identifier.toLowerCase())
                                        .single();

                                    if (!profileError && profileData && profileData.email) {
                                        email = profileData.email;
                                        console.log('✅ Tìm thấy email từ username (qua direct query):', email);
                                    } else {
                                        console.warn('⚠️ Không tìm thấy email từ username:', identifier);
                                        console.warn('   Có thể username không tồn tại hoặc chưa setup lookup function');
                                        console.warn('   Sẽ thử đăng nhập với identifier như email (sẽ fail nếu không phải email hợp lệ)');
                                    }
                                }
                            }
                        } catch (error) {
                            console.warn('⚠️ Lỗi khi tìm email từ username:', error);
                            console.warn('   Sẽ thử đăng nhập với identifier như email');
                        }
                    }
                }

                // Sign in with Supabase
                console.log('🔄 Đang đăng nhập với Supabase...', {
                    email: email.toLowerCase()
                });

                // Get Supabase client
                const supabaseClient = this.getSupabaseClient();
                if (!supabaseClient) {
                    console.error('❌ Không thể lấy Supabase client');
                    return {
                        success: false,
                        message: 'Không thể kết nối đến Supabase. Vui lòng refresh trang và thử lại.'
                    };
                }

                let authData, authError;
                try {
                    const result = await supabaseClient.auth.signInWithPassword({
                        email: email.toLowerCase(),
                        password: password
                    });
                    authData = result.data;
                    authError = result.error;
                } catch (error) {
                    console.error('❌ Exception khi đăng nhập:', error);
                    authError = {
                        message: error.message || 'Có lỗi xảy ra khi đăng nhập',
                        status: error.status || 500,
                        name: error.name || 'Error'
                    };
                }

                if (authError) {
                    console.error('❌ Lỗi đăng nhập:', authError);
                    console.error('   Error code:', authError.status || authError.code);
                    console.error('   Error message:', authError.message);
                    console.error('   Error name:', authError.name);
                    console.error('   Full error object:', JSON.stringify(authError, null, 2));

                    // Check for specific error messages
                    const errorMsg = authError.message || '';
                    let userMessage = 'Có lỗi xảy ra khi đăng nhập';

                    if (authError.status === 400) {
                        if (errorMsg.includes('Invalid login credentials') || errorMsg.includes('invalid_credentials')) {
                            // Check if identifier was a username (no @)
                            if (!identifier.includes('@')) {
                                console.error('   💡 Bạn đang đăng nhập bằng username, nhưng Supabase yêu cầu EMAIL');
                                console.error('   💡 Vui lòng sử dụng email để đăng nhập, không phải username');
                                console.error('   💡 Nếu bạn không nhớ email, hãy đăng ký lại với email mới');
                                userMessage = 'Vui lòng sử dụng EMAIL để đăng nhập, không phải username. Nếu bạn không nhớ email, vui lòng đăng ký lại.';
                            } else {
                                console.error('   💡 Email hoặc mật khẩu không đúng');
                                console.error('   💡 Kiểm tra:');
                                console.error('      - Email có đúng không? (phân biệt hoa thường)');
                                console.error('      - Mật khẩu có đúng không?');
                                console.error('      - Đã xác nhận email chưa? (kiểm tra inbox/spam)');
                                userMessage = 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại hoặc xác nhận email.';
                            }
                        } else if (errorMsg.includes('Email not confirmed') || errorMsg.includes('email_not_confirmed')) {
                            console.error('   💡 Email chưa được xác nhận');
                            console.error('   💡 Kiểm tra inbox/spam để xác nhận email');
                            userMessage = 'Email chưa được xác nhận. Vui lòng kiểm tra inbox/spam và click link xác nhận.';
                        } else {
                            console.error('   💡 Có thể email/password không đúng hoặc user chưa xác nhận email');
                            console.error('   💡 Kiểm tra email, password và email confirmation');
                            userMessage = 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.';
                        }
                    } else if (authError.status === 429) {
                        console.error('   💡 Quá nhiều request, vui lòng đợi vài phút');
                        userMessage = 'Quá nhiều yêu cầu đăng nhập. Vui lòng đợi vài phút rồi thử lại.';
                    } else if (authError.status >= 500) {
                        console.error('   💡 Lỗi server, vui lòng thử lại sau');
                        userMessage = 'Lỗi server. Vui lòng thử lại sau.';
                    } else if (!authError.status) {
                        console.error('   💡 Có thể là lỗi network hoặc Supabase connection');
                        console.error('   💡 Kiểm tra kết nối internet và thử lại');
                        userMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra internet và thử lại.';
                    }

                    return {
                        success: false,
                        message: userMessage
                    };
                }

                console.log('✅ Đăng nhập thành công với Supabase');

                if (authData.user) {
                    console.log('✅ User authenticated:', authData.user.id);

                    // Get Supabase client
                    const supabaseClient = this.getSupabaseClient();
                    if (!supabaseClient) {
                        console.error('❌ Không thể lấy Supabase client để load profile');
                        // Still return success if auth worked
                        return {
                            success: true,
                            message: 'Đăng nhập thành công!',
                            user: {
                                userId: authData.user.id,
                                username: authData.user.user_metadata ? authData.user.user_metadata.username : email.split('@')[0],
                                email: email.toLowerCase()
                            }
                        };
                    }

                    // Get user profile (ignore errors - profile might not exist yet or RLS issue)
                    let profile = null;
                    try {
                        const {
                            data: profileData,
                            error: profileError
                        } = await supabaseClient
                            .from('profiles')
                            .select('*')
                            .eq('id', authData.user.id)
                            .single();

                        if (profileError) {
                            // Ignore 406 or other RLS errors
                            if (profileError.code === 'PGRST116' || profileError.status === 406) {
                                console.log('ℹ️ Không thể load profile (có thể RLS issue), sẽ dùng thông tin từ auth');
                            } else {
                                console.warn('⚠️ Profile fetch error:', profileError);
                                console.warn('   Profile có thể chưa được tạo');
                            }
                        } else {
                            profile = profileData;
                            console.log('✅ Profile loaded:', profile ? profile.username : 'N/A');
                        }
                    } catch (error) {
                        console.warn('⚠️ Lỗi khi load profile:', error);
                        console.warn('   Sẽ dùng thông tin từ auth user metadata');
                    }

                    // Save session locally
                    const session = {
                        userId: authData.user.id,
                        username: profile ? profile.username : authData.user.user_metadata ? authData.user.user_metadata.username : email.split('@')[0],
                        email: authData.user.email,
                        loginTime: new Date().toISOString(),
                        rememberMe: rememberMe
                    };

                    if (rememberMe) {
                        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
                    } else {
                        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
                    }

                    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify({
                        id: authData.user.id,
                        username: session.username,
                        email: authData.user.email
                    }));

                    return {
                        success: true,
                        message: 'Đăng nhập thành công!',
                        user: {
                            id: authData.user.id,
                            username: session.username,
                            email: authData.user.email
                        }
                    };
                }
            } else {
                // Fallback to localStorage
                return this.loginLocalStorage(identifier, password, rememberMe);
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.'
            };
        }
    },

    /**
     * Logout user
     */
    async logout() {
        if (this.isSupabaseAvailable()) {
            const supabaseClient = this.getSupabaseClient();
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            }
        }
        localStorage.removeItem(this.SESSION_KEY);
        sessionStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem(this.CURRENT_USER_KEY);
    },

    /**
     * Check if user is logged in
     * @returns {Promise<boolean>} True if user is logged in
     */
    async isLoggedIn() {
        if (this.isSupabaseAvailable()) {
            const {
                data: {
                    session
                }
            } = await supabase.auth.getSession();
            return !!session;
        }
        const session = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY);
        return !!session;
    },

    /**
     * Get current user session
     * @returns {Promise<Object|null>} Session object or null
     */
    async getSession() {
        if (this.isSupabaseAvailable()) {
            const {
                data: {
                    session
                }
            } = await supabase.auth.getSession();
            if (session) {
                const {
                    data: profile
                } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', session.user.id)
                    .single();

                return {
                    userId: session.user.id,
                    username: profile ? profile.username : session.user.user_metadata ? session.user.user_metadata.username : session.user.email.split('@')[0],
                    email: session.user.email,
                    loginTime: session.user.created_at,
                    rememberMe: true
                };
            }
            return null;
        }
        const session = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY);
        if (session) {
            return JSON.parse(session);
        }
        return null;
    },

    /**
     * Get current user data
     * @returns {Promise<Object|null>} User object or null
     */
    async getCurrentUser() {
        if (this.isSupabaseAvailable()) {
            const {
                data: {
                    session
                }
            } = await supabase.auth.getSession();
            if (!session) return null;

            const {
                data: profile,
                error
            } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('Get user error:', error);
                return null;
            }

            return {
                id: profile.id,
                username: profile.username,
                email: profile.email,
                profile: profile.profile || {},
                links: profile.links || [],
                tasks: profile.tasks || [],
                settings: profile.settings || {}
            };
        }

        // Fallback to localStorage
        const session = this.getSessionSync();
        if (!session) return null;

        const users = JSON.parse(localStorage.getItem('bioLinkUsers')) || [];
        return users.find(u => u.id === session.userId) || null;
    },

    /**
     * Update user data
     * @param {string} userId - User ID
     * @param {Object} updates - Updates to apply
     * @returns {Promise<boolean>} Success status
     */
    async updateUser(userId, updates) {
        try {
            if (this.isSupabaseAvailable()) {
                const {
                    error
                } = await supabase
                    .from('profiles')
                    .update(updates)
                    .eq('id', userId);

                if (error) {
                    console.error('Update user error:', error);
                    return false;
                }
                return true;
            } else {
                // Fallback to localStorage
                return this.updateUserLocalStorage(userId, updates);
            }
        } catch (error) {
            console.error('Update user error:', error);
            return false;
        }
    },

    /**
     * Change user password
     * @param {string} userId - User ID
     * @param {string} oldPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<Object>} Result object
     */
    async changePassword(userId, oldPassword, newPassword) {
        try {
            if (this.isSupabaseAvailable()) {
                // Get current user email
                const {
                    data: {
                        session
                    }
                } = await supabase.auth.getSession();
                if (!session || session.user.id !== userId) {
                    return {
                        success: false,
                        message: 'Phiên đăng nhập không hợp lệ!'
                    };
                }

                // Update password in Supabase
                const {
                    error
                } = await supabase.auth.updateUser({
                    password: newPassword
                });

                if (error) {
                    return {
                        success: false,
                        message: this.getErrorMessage(error.message)
                    };
                }

                return {
                    success: true,
                    message: 'Đổi mật khẩu thành công!'
                };
            } else {
                // Fallback to localStorage
                return this.changePasswordLocalStorage(userId, oldPassword, newPassword);
            }
        } catch (error) {
            console.error('Change password error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra!'
            };
        }
    },

    /**
     * Get error message in Vietnamese
     */
    getErrorMessage(errorMessage) {
        if (!errorMessage) return 'Có lỗi xảy ra. Vui lòng thử lại!';

        const errorMap = {
            'Invalid login credentials': 'Email hoặc mật khẩu không đúng!',
            'Email not confirmed': 'Vui lòng kiểm tra email và xác nhận tài khoản trước khi đăng nhập!',
            'User already registered': 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác!',
            'User already exists': 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác!',
            'Password should be at least 6 characters': 'Mật khẩu phải có ít nhất 6 ký tự!',
            'Password is too weak': 'Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn!',
            'Invalid email': 'Email không hợp lệ. Vui lòng kiểm tra lại!',
            'Email rate limit exceeded': 'Quá nhiều yêu cầu. Vui lòng thử lại sau vài phút!',
            'Signup is disabled': 'Đăng ký tạm thời bị tắt. Vui lòng liên hệ quản trị viên!',
            'Database error': 'Lỗi hệ thống. Vui lòng thử lại sau!',
            'Network error': 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại!'
        };

        // Check exact matches first
        for (const [key, value] of Object.entries(errorMap)) {
            if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
                return value;
            }
        }

        // Check for common patterns
        if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
            return 'Thông tin này đã được sử dụng. Vui lòng thử giá trị khác!';
        }

        if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
            return 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại!';
        }

        // Return original message if no match, but make it more user-friendly
        return `Lỗi: ${errorMessage}. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề tiếp tục!`;
    },

    // ========== LocalStorage Fallback Methods ==========

    registerLocalStorage(username, email, password) {
        try {
            const users = JSON.parse(localStorage.getItem('bioLinkUsers')) || [];

            if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
                return {
                    success: false,
                    message: 'Tên đăng nhập đã tồn tại!'
                };
            }

            if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                return {
                    success: false,
                    message: 'Email đã được sử dụng!'
                };
            }

            const newUser = {
                id: Date.now().toString(),
                username: username.trim(),
                email: email.trim().toLowerCase(),
                password: this.hashPassword(password),
                createdAt: new Date().toISOString(),
                profile: {
                    name: username,
                    bio: '',
                    image: '',
                    socialLinks: {}
                },
                links: [],
                tasks: [],
                settings: {
                    theme: 'gradient',
                    seasonalEffects: true
                }
            };

            users.push(newUser);
            localStorage.setItem('bioLinkUsers', JSON.stringify(users));

            return {
                success: true,
                message: 'Đăng ký thành công!',
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
                }
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.'
            };
        }
    },

    loginLocalStorage(identifier, password, rememberMe = false) {
        try {
            const users = JSON.parse(localStorage.getItem('bioLinkUsers')) || [];
            const hashedPassword = this.hashPassword(password);

            const user = users.find(u =>
                (u.username.toLowerCase() === identifier.toLowerCase() ||
                    u.email.toLowerCase() === identifier.toLowerCase()) &&
                u.password === hashedPassword
            );

            if (!user) {
                return {
                    success: false,
                    message: 'Tên đăng nhập/Email hoặc mật khẩu không đúng!'
                };
            }

            const session = {
                userId: user.id,
                username: user.username,
                email: user.email,
                loginTime: new Date().toISOString(),
                rememberMe: rememberMe
            };

            if (rememberMe) {
                localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            } else {
                sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            }

            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify({
                id: user.id,
                username: user.username,
                email: user.email
            }));

            return {
                success: true,
                message: 'Đăng nhập thành công!',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.'
            };
        }
    },

    getSessionSync() {
        const session = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY);
        if (session) {
            return JSON.parse(session);
        }
        return null;
    },

    updateUserLocalStorage(userId, updates) {
        try {
            const users = JSON.parse(localStorage.getItem('bioLinkUsers')) || [];
            const userIndex = users.findIndex(u => u.id === userId);

            if (userIndex === -1) return false;

            users[userIndex] = {
                ...users[userIndex],
                ...updates
            };
            localStorage.setItem('bioLinkUsers', JSON.stringify(users));
            return true;
        } catch (error) {
            console.error('Update user error:', error);
            return false;
        }
    },

    changePasswordLocalStorage(userId, oldPassword, newPassword) {
        try {
            const users = JSON.parse(localStorage.getItem('bioLinkUsers')) || [];
            const user = users.find(u => u.id === userId);

            if (!user) {
                return {
                    success: false,
                    message: 'Người dùng không tồn tại!'
                };
            }

            if (user.password !== this.hashPassword(oldPassword)) {
                return {
                    success: false,
                    message: 'Mật khẩu cũ không đúng!'
                };
            }

            user.password = this.hashPassword(newPassword);
            localStorage.setItem('bioLinkUsers', JSON.stringify(users));

            return {
                success: true,
                message: 'Đổi mật khẩu thành công!'
            };
        } catch (error) {
            console.error('Change password error:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra!'
            };
        }
    },

    hashPassword(password) {
        // Simple hash for demo - NOT SECURE for production
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }
};

// Initialize on load with robust error handling
let authInitialized = false;
let authInitPromise = null;
let authInitError = null;

if (typeof window !== 'undefined') {
    // Initialize Auth immediately
    (async function() {
        try {
            authInitPromise = Auth.init();
            await authInitPromise;
            authInitialized = true;
            console.log('✓ Auth system initialized successfully');

            // Dispatch custom event to notify that Auth is ready
            if (typeof window.dispatchEvent !== 'undefined') {
                window.dispatchEvent(new CustomEvent('authReady'));
            }
        } catch (error) {
            authInitError = error;
            console.error('Auth initialization error:', error);
            authInitialized = true; // Still mark as initialized to allow fallback
            console.log('✓ Auth system initialized with fallback mode');

            // Dispatch event even on error (fallback mode)
            if (typeof window.dispatchEvent !== 'undefined') {
                window.dispatchEvent(new CustomEvent('authReady'));
            }
        }
    })();

    // Expose a method to check if Auth is ready
    Auth.isReady = async function(timeout = 5000) {
        if (authInitialized) return true;

        // Wait for initialization promise
        if (authInitPromise) {
            try {
                const startTime = Date.now();
                while (!authInitialized && (Date.now() - startTime) < timeout) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            } catch (error) {
                console.warn('Error waiting for Auth init:', error);
            }
        }

        return authInitialized;
    };

    // Expose initialization status
    Auth.getInitStatus = function() {
        return {
            initialized: authInitialized,
            error: authInitError,
            promise: authInitPromise
        };
    };
}

// Expose supabase client globally for use in other scripts
if (typeof window !== 'undefined') {
    // Create a getter function to access supabase client
    Object.defineProperty(window, 'getSupabaseClient', {
        value: function() {
            return supabase;
        },
        writable: false,
        configurable: false
    });

    // Also expose directly for convenience
    Object.defineProperty(window, 'supabaseClient', {
        get: function() {
            return supabase;
        },
        configurable: true
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}