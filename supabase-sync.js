/**
 * Supabase Data Sync Service
 * Tự động đồng bộ dữ liệu từ localStorage lên Supabase
 */

class SupabaseSync {
    constructor() {
        this.syncInterval = null;
        this.isSyncing = false;
        this.pendingChanges = [];
        this.init();
    }

    init() {
        // Wait for Auth to be ready
        if (typeof Auth !== 'undefined') {
            this.setupAutoSync();
            this.setupEventListeners();
        } else {
            // Retry after a delay
            setTimeout(() => this.init(), 1000);
        }
    }

    setupAutoSync() {
        // Sync every 30 seconds if user is logged in
        this.syncInterval = setInterval(() => {
            if (Auth.isLoggedIn() && Auth.isSupabaseAvailable()) {
                this.syncUserData();
            }
        }, 30000); // 30 seconds

        // Sync immediately when page loads
        if (Auth.isLoggedIn() && Auth.isSupabaseAvailable()) {
            setTimeout(() => this.syncUserData(), 2000);
        }
    }

    setupEventListeners() {
        // Listen for storage changes (when data is updated)
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.includes('bioLink')) {
                this.queueSync();
            }
        });

        // Sync before page unload
        window.addEventListener('beforeunload', () => {
            if (Auth.isLoggedIn() && Auth.isSupabaseAvailable()) {
                this.syncUserData(true); // Force sync
            }
        });

        // Sync when user data changes
        document.addEventListener('userDataChanged', () => {
            this.queueSync();
        });
    }

    queueSync() {
        if (!this.isSyncing) {
            // Debounce sync requests
            clearTimeout(this.syncTimeout);
            this.syncTimeout = setTimeout(() => {
                this.syncUserData();
            }, 2000); // Wait 2 seconds after last change
        }
    }

    async syncUserData(force = false) {
        if (this.isSyncing && !force) return;
        if (!Auth.isLoggedIn() || !Auth.isSupabaseAvailable()) return;

        try {
            this.isSyncing = true;
            const user = Auth.getCurrentUser();
            if (!user) return;

            const session = Auth.getSession();
            if (!session || !session.userId) return;

            // Get Supabase client
            const supabase = window.supabase?.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey
            );
            if (!supabase) return;

            // Sync profile data
            await this.syncProfile(user, supabase);

            // Sync links
            await this.syncLinks(user, supabase);

            // Sync tasks
            await this.syncTasks(user, supabase);

            // Sync settings
            await this.syncSettings(user, supabase);

            console.log('[SupabaseSync] Data synced successfully');
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('supabaseSyncComplete', {
                detail: { timestamp: new Date().toISOString() }
            }));

        } catch (error) {
            console.error('[SupabaseSync] Sync error:', error);
        } finally {
            this.isSyncing = false;
        }
    }

    async syncProfile(user, supabase) {
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    profile_data: user.profile || {},
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'id'
                });

            if (error) throw error;
        } catch (error) {
            console.error('[SupabaseSync] Profile sync error:', error);
        }
    }

    async syncLinks(user, supabase) {
        try {
            if (!user.links || user.links.length === 0) return;

            // Delete existing links
            await supabase
                .from('user_links')
                .delete()
                .eq('user_id', user.id);

            // Insert new links
            const linksToInsert = user.links.map(link => ({
                user_id: user.id,
                title: link.title || '',
                url: link.url || '',
                icon: link.icon || '',
                order: link.order || 0,
                metadata: link.metadata || {}
            }));

            if (linksToInsert.length > 0) {
                const { error } = await supabase
                    .from('user_links')
                    .insert(linksToInsert);

                if (error) throw error;
            }
        } catch (error) {
            console.error('[SupabaseSync] Links sync error:', error);
        }
    }

    async syncTasks(user, supabase) {
        try {
            if (!user.tasks || user.tasks.length === 0) return;

            // Delete existing tasks
            await supabase
                .from('user_tasks')
                .delete()
                .eq('user_id', user.id);

            // Insert new tasks
            const tasksToInsert = user.tasks.map(task => ({
                user_id: user.id,
                title: task.title || '',
                description: task.description || '',
                completed: task.completed || false,
                priority: task.priority || 'medium',
                due_date: task.dueDate || null,
                metadata: task.metadata || {}
            }));

            if (tasksToInsert.length > 0) {
                const { error } = await supabase
                    .from('user_tasks')
                    .insert(tasksToInsert);

                if (error) throw error;
            }
        } catch (error) {
            console.error('[SupabaseSync] Tasks sync error:', error);
        }
    }

    async syncSettings(user, supabase) {
        try {
            const { error } = await supabase
                .from('user_settings')
                .upsert({
                    user_id: user.id,
                    settings_data: user.settings || {},
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                });

            if (error) throw error;
        } catch (error) {
            console.error('[SupabaseSync] Settings sync error:', error);
        }
    }

    // Manual sync trigger
    async manualSync() {
        if (typeof Utils !== 'undefined' && Utils.Toast) {
            Utils.Toast.info('Đang đồng bộ dữ liệu...', 'Đồng bộ');
        }
        await this.syncUserData(true);
        if (typeof Utils !== 'undefined' && Utils.Toast) {
            Utils.Toast.success('Đã đồng bộ dữ liệu lên Supabase!');
        }
    }

    // Load data from Supabase
    async loadFromSupabase() {
        if (!Auth.isLoggedIn() || !Auth.isSupabaseAvailable()) return null;

        try {
            const session = Auth.getSession();
            if (!session || !session.userId) return null;

            const supabase = window.supabase?.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey
            );
            if (!supabase) return null;

            const userId = session.userId;

            // Load profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            // Load links
            const { data: links } = await supabase
                .from('user_links')
                .select('*')
                .eq('user_id', userId)
                .order('order');

            // Load tasks
            const { data: tasks } = await supabase
                .from('user_tasks')
                .select('*')
                .eq('user_id', userId);

            // Load settings
            const { data: settings } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', userId)
                .single();

            return {
                profile: profile?.profile_data || {},
                links: (links || []).map(link => ({
                    title: link.title,
                    url: link.url,
                    icon: link.icon,
                    order: link.order,
                    metadata: link.metadata
                })),
                tasks: (tasks || []).map(task => ({
                    title: task.title,
                    description: task.description,
                    completed: task.completed,
                    priority: task.priority,
                    dueDate: task.due_date,
                    metadata: task.metadata
                })),
                settings: settings?.settings_data || {}
            };
        } catch (error) {
            console.error('[SupabaseSync] Load error:', error);
            return null;
        }
    }

    destroy() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        if (this.syncTimeout) {
            clearTimeout(this.syncTimeout);
        }
    }
}

// Initialize Supabase Sync
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for Auth to be ready
        setTimeout(() => {
            window.SupabaseSync = new SupabaseSync();
        }, 2000);
    });
} else {
    setTimeout(() => {
        window.SupabaseSync = new SupabaseSync();
    }, 2000);
}

// Expose manual sync function
window.syncToSupabase = function() {
    if (window.SupabaseSync) {
        window.SupabaseSync.manualSync();
    }
};

