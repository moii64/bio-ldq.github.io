import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './components/Profile';
import TaskList from './components/TaskList';
import LinkCards from './components/LinkCards';
import TaskModal from './components/TaskModal';
import ChatModal from './components/ChatModal';
import PaymentPage from './pages/PaymentPage';
import TasksPage from './pages/TasksPage';
import SpecialLinkPage from './pages/SpecialLinkPage';
import WebsitePage from './pages/WebsitePage';
import ContactPage from './pages/ContactPage';
import CVPage from './pages/CVPage';
import ThemeSelector from './components/ThemeSelector';
import AssistiveTouch from './components/AssistiveTouch';
import supabase from './supabaseClient';
import './App.css';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  icon?: string;
  category?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string | null;
}

function App() {
  const [theme, setTheme] = useState<string>(localStorage.getItem('bioTheme') || 'gradient');
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('bioLinkTasks');
    const parsedTasks = saved ? JSON.parse(saved) : [];
    
    // Thêm task mặc định "trò chuyện agenl ai support" nếu chưa có
    const aiSupportTaskExists = parsedTasks.some(task => 
      task.title && task.title.toLowerCase().includes('trò chuyện agenl ai support')
    );
    
    if (!aiSupportTaskExists) {
      const aiSupportTask: Task = {
        id: 'ai-support-task-' + Date.now(),
        title: 'Trò chuyện Agenl AI Support',
        description: 'Liên hệ và trò chuyện với hệ thống hỗ trợ AI Agenl',
        priority: 'high',
        dueDate: '',
        icon: 'fas fa-headset',
        completed: false,
        createdAt: new Date().toISOString()
      };
      return [aiSupportTask, ...parsedTasks];
    }
    
    return parsedTasks;
  });
  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [user, setUser] = useState<any>(null);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('bioLinkTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Apply theme
  useEffect(() => {
    document.body.className = theme === 'gradient' ? '' : `theme-${theme}`;
    localStorage.setItem('bioTheme', theme);
  }, [theme]);

  // Expose chat modal function globally for TaskList
  useEffect(() => {
    window.showChatModal = () => setShowChatModal(true);
    return () => {
      delete window.showChatModal;
    };
  }, []);

  // Tự động hiển thị pop-up chat hỗ trợ khi trang load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatModal(true);
    }, 1500); // Delay 1.5 giây để trang load hoàn toàn

    return () => clearTimeout(timer);
  }, []); // Chỉ chạy một lần khi component mount

  // Lấy thông tin user từ Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    // Lắng nghe thay đổi auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Hàm đăng xuất
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks([newTask, ...tasks]);
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const updateTask = (taskId: string, taskData: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...taskData } : task
    ));
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const deleteTask = (taskId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, completedAt: task.completed ? null : new Date().toISOString() }
        : task
    ));
  };

  const openTaskModal = (task: Task | null = null) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const getFilteredTasks = (): Task[] => {
    switch (taskFilter) {
      case 'completed':
        return tasks.filter(t => t.completed);
      case 'pending':
        return tasks.filter(t => !t.completed);
      default:
        return tasks;
    }
  };

  return (
    <Router>
      <div className="app">
        <ThemeSelector theme={theme} setTheme={setTheme} />
        
        <Routes>
          <Route path="/" element={
            <div className="container">
              <Profile />
              <LinkCards />
              <TaskList 
                tasks={getFilteredTasks()}
                filter={taskFilter}
                onFilterChange={setTaskFilter}
                onAddTask={() => openTaskModal()}
                onEditTask={openTaskModal}
                onDeleteTask={deleteTask}
                onToggleTask={toggleTask}
              />
            </div>
          } />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/tasks" element={
            <TasksPage 
              tasks={tasks}
              setTasks={setTasks}
            />
          } />
          <Route path="/special-link" element={<SpecialLinkPage />} />
          <Route path="/website" element={<WebsitePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cv" element={<CVPage />} />
        </Routes>

        {showTaskModal && (
          <TaskModal
            task={editingTask}
            onSave={editingTask ? (data) => updateTask(editingTask.id, data) : addTask}
            onClose={closeTaskModal}
          />
        )}

        {showChatModal && (
          <ChatModal onClose={() => setShowChatModal(false)} />
        )}

        {/* AssistiveTouch Component */}
        <AssistiveTouch
          menuItems={[
            {
              label: 'Scroll to Top',
              icon: '⬆️',
              action: () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              },
            },
            {
              label: 'Add Task',
              icon: '➕',
              action: () => {
                openTaskModal();
              },
            },
            {
              label: 'Tasks',
              icon: '📋',
              action: () => {
                window.location.href = '/tasks';
              },
            },
            {
              label: 'Contact',
              icon: '📧',
              action: () => {
                window.location.href = '/contact';
              },
            },
            {
              label: 'Chat Support',
              icon: '💬',
              action: () => {
                setShowChatModal(true);
              },
            },
            {
              label: 'Toggle Theme',
              icon: '🎨',
              action: () => {
                const currentTheme = localStorage.getItem('bioTheme') || 'gradient';
                const newTheme = currentTheme === 'gradient' ? 'glassmorphism' : 'gradient';
                setTheme(newTheme);
              },
            },
          ]}
          user={user}
          onLogout={handleLogout}
          enableHaptic={true}
          enableSound={false}
          snapToEdges={true}
          autoHideOnScroll={false}
        />
      </div>
    </Router>
  );
}

export default App;

