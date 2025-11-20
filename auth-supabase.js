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

        // Check if already loading
        if (supabaseLoading) {
            const checkInterval = setInterval(() => {
                if (window.supabase) {
                    clearInterval(checkInterval);
                    supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
                    resolve(true);
                }
            }, 100);
            setTimeout(() => {
                clearInterval(checkInterval);
                reject(new Error('Timeout loading Supabase'));
            }, 10000);
            return;
        }

        // Load Supabase from CDN
        if (!document.querySelector('script[src*="supabase"]')) {
            supabaseLoading = true;
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
            script.onload = () => {
                if (window.supabase) {
                    supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
                    supabaseLoading = false;
                    resolve(true);
                } else {
                    supabaseLoading = false;
                    reject(new Error('Supabase failed to load'));
                }
            };
            script.onerror = () => {
                supabaseLoading = false;
                reject(new Error('Failed to load Supabase script'));
            };
            document.head.appendChild(script);
        } else {
            // Script already exists, wait for it
            const checkInterval = setInterval(() => {
                if (window.supabase) {
                    clearInterval(checkInterval);
                    supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
                    resolve(true);
                }
            }, 100);
            setTimeout(() => {
                clearInterval(checkInterval);
                reject(new Error('Timeout waiting for Supabase'));
            }, 10000);
        }
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
                await loadSupabase();
                console.log('Supabase initialized successfully');
            } catch (error) {
                console.warn('Failed to load Supabase, falling back to localStorage:', error);
                this.USE_SUPABASE = false;
            }
        } else if (SUPABASE_CONFIG.url === 'YOUR_SUPABASE_URL') {
            console.warn('Supabase not configured, using localStorage fallback');
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
     * Register a new user
     * @param {string} username - Username
     * @param {string} email - Email address
     * @param {string} password - Password
     * @returns {Promise<Object>} Result object with success status and message
     */
    async register(username, email, password) {
        try {
            // Validate and sanitize input
            username = (username || '').trim().replace(/[^a-zA-Z0-9_-]/g, '');
            email = (email || '').trim().toLowerCase().replace(/[<>]/g, '');
            
            // Validate username format
            if (!username || username.length < 3 || username.length > 20) {
                return {
                    success: false,
                    message: 'Tên đăng nhập phải từ 3-20 ký tự và chỉ chứa chữ cái, số, dấu gạch dưới và dấu gạch ngang!'
                };
            }
            
            if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
                return {
                    success: false,
                    message: 'Tên đăng nhập chỉ được chứa chữ cái, số, dấu gạch dưới và dấu gạch ngang!'
                };
            }
            
            // Validate email format
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return {
                    success: false,
                    message: 'Email không hợp lệ!'
                };
            }
            
            // Validate password
            if (!password || password.length < 8) {
                return {
                    success: false,
                    message: 'Mật khẩu phải có ít nhất 8 ký tự!'
                };
            }
            
            if (this.isSupabaseAvailable()) {
                // Use Supabase Auth
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            username: username
                        }
                    }
                });

                if (authError) {
                    return {
                        success: false,
                        message: this.getErrorMessage(authError.message)
                    };
                }

                // Create user profile in profiles table
                if (authData.user) {
                    // Try to create profile, but don't fail if it already exists
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .upsert({
                            id: authData.user.id,
                            username: username.trim(),
                            email: email.trim().toLowerCase(),
                            profile_data: {
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
                            },
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }, {
                            onConflict: 'id'
                        });

                    if (profileError) {
                        console.error('Profile creation error:', profileError);
                        // Try to continue anyway - profile might exist or be created later
                    }

                    // Auto-login after registration if session is available
                    // Supabase might require email confirmation, so we check session
                    const { data: { session } } = await supabase.auth.getSession();
                    
                    if (session && session.user) {
                        // User is automatically logged in, save session
                        const sessionData = {
                            userId: session.user.id,
                            username: username.trim(),
                            email: email.trim().toLowerCase(),
                            loginTime: new Date().toISOString(),
                            rememberMe: true
                        };
                        
                        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
                        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify({
                            id: session.user.id,
                            username: username.trim(),
                            email: email.trim().toLowerCase()
                        }));

                        return {
                            success: true,
                            message: 'Đăng ký thành công! Đã tự động đăng nhập.',
                            user: {
                                id: session.user.id,
                                username: username.trim(),
                                email: email.trim().toLowerCase()
                            },
                            autoLogin: true
                        };
                    } else {
                        // Email confirmation might be required
                        return {
                            success: true,
                            message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản (nếu cần).',
                            user: {
                                id: authData.user.id,
                                username: username.trim(),
                                email: email.trim().toLowerCase()
                            },
                            requiresConfirmation: true
                        };
                    }
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
            // Sanitize input
            identifier = (identifier || '').trim();
            identifier = identifier.replace(/[<>]/g, ''); // Basic HTML escaping
            
            // Validate input
            if (!identifier || !password) {
                return {
                    success: false,
                    message: 'Vui lòng điền đầy đủ thông tin!'
                };
            }
            
            if (this.isSupabaseAvailable()) {
                // First, try to find user by email (Supabase uses email for auth)
                let email = identifier;
                
                // If identifier might be username, try to find email
                if (!identifier.includes('@')) {
                    try {
                        const { data: profile, error: profileError } = await supabase
                            .from('profiles')
                            .select('email')
                            .eq('username', identifier.toLowerCase())
                            .maybeSingle();
                        
                        if (profile && profile.email) {
                            email = profile.email;
                        } else if (profileError) {
                            console.warn('Profile lookup error:', profileError);
                            // Continue with identifier as email - might work if username matches email
                        }
                    } catch (error) {
                        console.warn('Error looking up username:', error);
                        // Continue with identifier as email
                    }
                }

                // Sign in with Supabase
                const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                    email: email.toLowerCase(),
                    password: password
                });

                if (authError) {
                    return {
                        success: false,
                        message: this.getErrorMessage(authError.message)
                    };
                }

                if (authData.user) {
                    // Get user profile
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', authData.user.id)
                        .single();

                    if (profileError) {
                        console.error('Profile fetch error:', profileError);
                    }

                    // Save session locally
                    const session = {
                        userId: authData.user.id,
                        username: profile?.username || authData.user.user_metadata?.username || email,
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
            await supabase.auth.signOut();
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
            const { data: { session } } = await supabase.auth.getSession();
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
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // Try to get username from profile, but don't fail if profile doesn't exist
                let username = session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'user';
                
                try {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('username')
                        .eq('id', session.user.id)
                        .maybeSingle();
                    
                    if (profile && profile.username) {
                        username = profile.username;
                    }
                } catch (error) {
                    // Ignore error, use fallback username
                    console.warn('Could not fetch username from profile:', error);
                }

                return {
                    userId: session.user.id,
                    username: username,
                    email: session.user.email,
                    loginTime: session.user.created_at || new Date().toISOString(),
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
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return null;

            // Try to get profile from Supabase
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('Get user error:', error);
            }

            // If profile exists, use it
            if (profile) {
                return {
                    id: profile.id,
                    username: profile.username || session.user.user_metadata?.username || session.user.email,
                    email: profile.email || session.user.email,
                    profile: profile.profile_data || profile.profile || {},
                    links: profile.links || [],
                    tasks: profile.tasks || [],
                    settings: profile.settings || {}
                };
            }

            // If no profile exists, create a basic user object from session
            return {
                id: session.user.id,
                username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'user',
                email: session.user.email,
                profile: {
                    name: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
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
                const { error } = await supabase
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
                const { data: { session } } = await supabase.auth.getSession();
                if (!session || session.user.id !== userId) {
                    return { success: false, message: 'Phiên đăng nhập không hợp lệ!' };
                }

                // Update password in Supabase
                const { error } = await supabase.auth.updateUser({
                    password: newPassword
                });

                if (error) {
                    return {
                        success: false,
                        message: this.getErrorMessage(error.message)
                    };
                }

                return { success: true, message: 'Đổi mật khẩu thành công!' };
            } else {
                // Fallback to localStorage
                return this.changePasswordLocalStorage(userId, oldPassword, newPassword);
            }
        } catch (error) {
            console.error('Change password error:', error);
            return { success: false, message: 'Có lỗi xảy ra!' };
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

            users[userIndex] = { ...users[userIndex], ...updates };
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
                return { success: false, message: 'Người dùng không tồn tại!' };
            }

            if (user.password !== this.hashPassword(oldPassword)) {
                return { success: false, message: 'Mật khẩu cũ không đúng!' };
            }

            user.password = this.hashPassword(newPassword);
            localStorage.setItem('bioLinkUsers', JSON.stringify(users));

            return { success: true, message: 'Đổi mật khẩu thành công!' };
        } catch (error) {
            console.error('Change password error:', error);
            return { success: false, message: 'Có lỗi xảy ra!' };
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

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}

