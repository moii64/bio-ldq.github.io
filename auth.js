/**
 * Authentication System for Bio Link
 * Handles user registration, login, logout, and session management
 */

const Auth = {
    // Storage keys
    STORAGE_KEY: 'bioLinkUsers',
    SESSION_KEY: 'bioLinkSession',
    CURRENT_USER_KEY: 'bioLinkCurrentUser',

    /**
     * Initialize authentication system
     */
    init() {
        // Check if users storage exists, if not create it
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
        }
    },

    /**
     * Register a new user
     * @param {string} username - Username
     * @param {string} email - Email address
     * @param {string} password - Password
     * @returns {Object} Result object with success status and message
     */
    register(username, email, password) {
        try {
            // Get existing users
            const users = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];

            // Check if username already exists
            if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
                return {
                    success: false,
                    message: 'Tên đăng nhập đã tồn tại!'
                };
            }

            // Check if email already exists
            if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                return {
                    success: false,
                    message: 'Email đã được sử dụng!'
                };
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                username: username.trim(),
                email: email.trim().toLowerCase(),
                password: this.hashPassword(password), // In production, use proper hashing
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

            // Add user to storage
            users.push(newUser);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

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

    /**
     * Login user
     * @param {string} identifier - Username or email
     * @param {string} password - Password
     * @param {boolean} rememberMe - Remember login session
     * @returns {Object} Result object with success status and message
     */
    login(identifier, password, rememberMe = false) {
        try {
            const users = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
            const hashedPassword = this.hashPassword(password);

            // Find user by username or email
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

            // Create session
            const session = {
                userId: user.id,
                username: user.username,
                email: user.email,
                loginTime: new Date().toISOString(),
                rememberMe: rememberMe
            };

            // Save session
            if (rememberMe) {
                localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            } else {
                sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            }

            // Save current user info
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

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        sessionStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem(this.CURRENT_USER_KEY);
    },

    /**
     * Check if user is logged in
     * @returns {boolean} True if user is logged in
     */
    isLoggedIn() {
        const session = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY);
        return !!session;
    },

    /**
     * Get current user session
     * @returns {Object|null} Session object or null
     */
    getSession() {
        const session = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY);
        if (session) {
            return JSON.parse(session);
        }
        return null;
    },

    /**
     * Get current user data
     * @returns {Object|null} User object or null
     */
    getCurrentUser() {
        const session = this.getSession();
        if (!session) return null;

        const users = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
        return users.find(u => u.id === session.userId) || null;
    },

    /**
     * Update user data
     * @param {string} userId - User ID
     * @param {Object} updates - Updates to apply
     * @returns {boolean} Success status
     */
    updateUser(userId, updates) {
        try {
            const users = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
            const userIndex = users.findIndex(u => u.id === userId);

            if (userIndex === -1) return false;

            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
            return true;
        } catch (error) {
            console.error('Update user error:', error);
            return false;
        }
    },

    /**
     * Simple password hashing (for demo purposes)
     * In production, use proper hashing like bcrypt
     * @param {string} password - Plain password
     * @returns {string} Hashed password
     */
    hashPassword(password) {
        // Simple hash for demo - NOT SECURE for production
        // In production, use: bcrypt, argon2, or similar
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    },

    /**
     * Change user password
     * @param {string} userId - User ID
     * @param {string} oldPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Object} Result object
     */
    changePassword(userId, oldPassword, newPassword) {
        try {
            const users = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
            const user = users.find(u => u.id === userId);

            if (!user) {
                return { success: false, message: 'Người dùng không tồn tại!' };
            }

            if (user.password !== this.hashPassword(oldPassword)) {
                return { success: false, message: 'Mật khẩu cũ không đúng!' };
            }

            user.password = this.hashPassword(newPassword);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

            return { success: true, message: 'Đổi mật khẩu thành công!' };
        } catch (error) {
            console.error('Change password error:', error);
            return { success: false, message: 'Có lỗi xảy ra!' };
        }
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    Auth.init();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}


