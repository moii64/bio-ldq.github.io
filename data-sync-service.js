/**
 * Data Sync Service
 * Đồng bộ dữ liệu giữa localStorage và Supabase
 * - Lưu vào Supabase khi có thay đổi
 * - Load từ Supabase khi user đăng nhập
 * - Fallback localStorage nếu Supabase lỗi
 * - Auto-sync khi có kết nối lại
 */

class DataSyncService {
    constructor() {
        this.syncQueue = [];
        this.isSyncing = false;
        this.retryDelay = 5000; // 5 seconds
        this.maxRetries = 3;
        this.init();
    }

    init() {
        // Expose supabase client từ auth-supabase.js
        this.getSupabase = () => {
            // Try to get from window if available
            if (window.supabase && window.supabase.createClient) {
                // Supabase library is loaded, but we need the instance
                // Check if Auth has initialized it
                if (typeof Auth !== 'undefined' && Auth.isSupabaseAvailable && Auth.isSupabaseAvailable()) {
                    // Access the supabase instance from auth-supabase.js scope
                    // We'll need to expose it via window or Auth object
                    return window.supabaseClient || null;
                }
            }
            return null;
        };

        // Listen for auth ready event
        if (typeof window !== 'undefined') {
            window.addEventListener('authReady', () => {
                this.initializeSupabase();
            });

            // Also check if auth is already ready
            if (typeof Auth !== 'undefined' && Auth.isSupabaseAvailable && Auth.isSupabaseAvailable()) {
                this.initializeSupabase();
            }
        }

        // Start auto-sync interval
        this.startAutoSync();
    }

    initializeSupabase() {
        // Get supabase instance from auth-supabase.js
        if (window.getSupabaseClient) {
            this.supabase = window.getSupabaseClient();
        } else if (window.supabaseClient) {
            this.supabase = window.supabaseClient;
        }
    }

    /**
     * Get current user ID
     */
    async getCurrentUserId() {
        if (typeof Auth === 'undefined') return null;
        
        try {
            const session = await Auth.getSession();
            return session ? session.userId : null;
        } catch (error) {
            console.error('Error getting user ID:', error);
            return null;
        }
    }

    /**
     * Get Supabase client
     */
    getSupabase() {
        if (window.getSupabaseClient) {
            return window.getSupabaseClient();
        } else if (window.supabaseClient) {
            return window.supabaseClient;
        }
        return null;
    }

    /**
     * Check if Supabase is available
     */
    isSupabaseAvailable() {
        if (typeof Auth === 'undefined') return false;
        return Auth.isSupabaseAvailable && Auth.isSupabaseAvailable();
    }

    /**
     * Load profile data from Supabase
     */
    async loadProfileFromSupabase() {
        if (!this.isSupabaseAvailable()) {
            console.log('Supabase not available, using localStorage');
            return null;
        }

        try {
            const userId = await this.getCurrentUserId();
            if (!userId) return null;

            const supabase = this.getSupabase();
            if (!supabase) {
                return null;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('profile, links, tasks, settings')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error loading profile from Supabase:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error loading profile:', error);
            return null;
        }
    }

    /**
     * Save profile data to Supabase
     */
    async saveProfileToSupabase(profileData) {
        if (!this.isSupabaseAvailable()) {
            console.log('Supabase not available, saving to localStorage only');
            return false;
        }

        try {
            const userId = await this.getCurrentUserId();
            if (!userId) {
                console.warn('No user ID, cannot save to Supabase');
                return false;
            }

            const supabase = this.getSupabase();
            if (!supabase) {
                console.warn('Supabase client not available');
                console.log('   Đang thử khởi tạo lại...');
                this.initializeSupabase();
                const retrySupabase = this.getSupabase();
                if (!retrySupabase) {
                    console.error('❌ Không thể lấy Supabase client sau khi retry');
                    return false;
                }
            }

            console.log('🔄 Đang lưu profile vào Supabase...', {
                userId,
                profileData: profileData.profile
            });

            const { data, error } = await supabase
                .from('profiles')
                .update({
                    profile: profileData.profile || {},
                    links: profileData.links || [],
                    tasks: profileData.tasks || [],
                    settings: profileData.settings || {},
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select();

            if (error) {
                console.error('❌ Error saving profile to Supabase:', error);
                console.error('   Error code:', error.code);
                console.error('   Error message:', error.message);
                console.error('   Error details:', error.details);
                console.error('   Error hint:', error.hint);
                // Add to sync queue for retry
                this.addToSyncQueue('profile', profileData);
                return false;
            }

            console.log('✅ Profile saved to Supabase successfully', data);
            return true;
        } catch (error) {
            console.error('❌ Error saving profile:', error);
            this.addToSyncQueue('profile', profileData);
            return false;
        }
    }

    /**
     * Save links to Supabase
     */
    async saveLinksToSupabase(links) {
        if (!this.isSupabaseAvailable()) {
            return false;
        }

        try {
            const userId = await this.getCurrentUserId();
            if (!userId) {
                console.warn('No user ID, cannot save links to Supabase');
                return false;
            }

            const supabase = this.getSupabase();
            if (!supabase) {
                console.warn('Supabase client not available');
                this.initializeSupabase();
                const retrySupabase = this.getSupabase();
                if (!retrySupabase) return false;
            }

            console.log('🔄 Đang lưu links vào Supabase...', { userId, linksCount: links.length });

            const { data, error } = await supabase
                .from('profiles')
                .update({
                    links: links,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select();

            if (error) {
                console.error('❌ Error saving links to Supabase:', error);
                console.error('   Error code:', error.code);
                console.error('   Error message:', error.message);
                this.addToSyncQueue('links', links);
                return false;
            }

            console.log('✅ Links saved to Supabase successfully', data);
            return true;
        } catch (error) {
            console.error('❌ Error saving links:', error);
            this.addToSyncQueue('links', links);
            return false;
        }
    }

    /**
     * Save tasks to Supabase
     */
    async saveTasksToSupabase(tasks) {
        if (!this.isSupabaseAvailable()) {
            return false;
        }

        try {
            const userId = await this.getCurrentUserId();
            if (!userId) {
                console.warn('No user ID, cannot save tasks to Supabase');
                return false;
            }

            const supabase = this.getSupabase();
            if (!supabase) {
                console.warn('Supabase client not available');
                this.initializeSupabase();
                const retrySupabase = this.getSupabase();
                if (!retrySupabase) return false;
            }

            console.log('🔄 Đang lưu tasks vào Supabase...', { userId, tasksCount: tasks.length });

            const { data, error } = await supabase
                .from('profiles')
                .update({
                    tasks: tasks,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select();

            if (error) {
                console.error('❌ Error saving tasks to Supabase:', error);
                console.error('   Error code:', error.code);
                console.error('   Error message:', error.message);
                this.addToSyncQueue('tasks', tasks);
                return false;
            }

            console.log('✅ Tasks saved to Supabase successfully', data);
            return true;
        } catch (error) {
            console.error('❌ Error saving tasks:', error);
            this.addToSyncQueue('tasks', tasks);
            return false;
        }
    }

    /**
     * Add to sync queue for retry
     */
    addToSyncQueue(type, data) {
        this.syncQueue.push({
            type,
            data,
            retries: 0,
            timestamp: Date.now()
        });

        // Try to sync immediately
        this.processSyncQueue();
    }

    /**
     * Process sync queue
     */
    async processSyncQueue() {
        if (this.isSyncing || this.syncQueue.length === 0) return;

        this.isSyncing = true;

        while (this.syncQueue.length > 0) {
            const item = this.syncQueue[0];
            
            // Skip if too many retries
            if (item.retries >= this.maxRetries) {
                console.warn(`Max retries reached for ${item.type}, removing from queue`);
                this.syncQueue.shift();
                continue;
            }

            // Skip if too old (older than 1 hour)
            if (Date.now() - item.timestamp > 3600000) {
                console.warn(`Item too old, removing from queue: ${item.type}`);
                this.syncQueue.shift();
                continue;
            }

            let success = false;
            try {
                switch (item.type) {
                    case 'profile':
                        success = await this.saveProfileToSupabase(item.data);
                        break;
                    case 'links':
                        success = await this.saveLinksToSupabase(item.data);
                        break;
                    case 'tasks':
                        success = await this.saveTasksToSupabase(item.data);
                        break;
                }

                if (success) {
                    // Remove from queue
                    this.syncQueue.shift();
                } else {
                    // Increment retry count
                    item.retries++;
                    // Wait before retry
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                }
            } catch (error) {
                console.error('Error processing sync queue:', error);
                item.retries++;
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            }
        }

        this.isSyncing = false;
    }

    /**
     * Start auto-sync interval
     */
    startAutoSync() {
        // Sync every 30 seconds if there are items in queue
        setInterval(() => {
            if (this.syncQueue.length > 0 && this.isSupabaseAvailable()) {
                this.processSyncQueue();
            }
        }, 30000);
    }

    /**
     * Sync all data from localStorage to Supabase
     */
    async syncAllFromLocalStorage() {
        if (!this.isSupabaseAvailable()) {
            console.log('Supabase not available, skipping sync');
            return;
        }

        try {
            const profileData = {
                profile: JSON.parse(localStorage.getItem('bioLinkProfile') || '{}'),
                links: JSON.parse(localStorage.getItem('bioLinkCards') || '[]'),
                tasks: JSON.parse(localStorage.getItem('bioLinkTasks') || '[]'),
                settings: JSON.parse(localStorage.getItem('bioLinkSettings') || '{}')
            };

            // Only sync if there's actual data
            if (Object.keys(profileData.profile).length > 0 || 
                profileData.links.length > 0 || 
                profileData.tasks.length > 0) {
                await this.saveProfileToSupabase(profileData);
            }
        } catch (error) {
            console.error('Error syncing from localStorage:', error);
        }
    }

    /**
     * Load all data from Supabase and merge with localStorage
     */
    async loadAllFromSupabase() {
        if (!this.isSupabaseAvailable()) {
            console.log('Supabase not available, using localStorage');
            return;
        }

        try {
            const data = await this.loadProfileFromSupabase();
            if (!data) return;

            // Merge with localStorage (Supabase takes priority)
            if (data.profile && Object.keys(data.profile).length > 0) {
                localStorage.setItem('bioLinkProfile', JSON.stringify(data.profile));
            }

            if (data.links && data.links.length > 0) {
                localStorage.setItem('bioLinkCards', JSON.stringify(data.links));
            }

            if (data.tasks && data.tasks.length > 0) {
                localStorage.setItem('bioLinkTasks', JSON.stringify(data.tasks));
            }

            if (data.settings && Object.keys(data.settings).length > 0) {
                localStorage.setItem('bioLinkSettings', JSON.stringify(data.settings));
            }

            console.log('✅ Data loaded from Supabase');
            
            // Dispatch event to notify managers
            window.dispatchEvent(new CustomEvent('dataLoadedFromSupabase', { detail: data }));
        } catch (error) {
            console.error('Error loading from Supabase:', error);
        }
    }
}

// Initialize DataSyncService
let dataSyncService;
if (typeof window !== 'undefined') {
    // Wait for DOM and Auth to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Wait for Auth to initialize
            setTimeout(() => {
                dataSyncService = new DataSyncService();
                window.DataSyncService = dataSyncService;
            }, 1000);
        });
    } else {
        setTimeout(() => {
            dataSyncService = new DataSyncService();
            window.DataSyncService = dataSyncService;
        }, 1000);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataSyncService;
}

