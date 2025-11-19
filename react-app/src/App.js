import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Profile from './components/Profile';
import TaskList from './components/TaskList';
import LinkCards from './components/LinkCards';
import TaskModal from './components/TaskModal';
import ChatModal from './components/ChatModal';
import PaymentPage from './pages/PaymentPage';
import TasksPage from './pages/TasksPage';
import ThemeSelector from './components/ThemeSelector';
import './App.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('bioTheme') || 'gradient');
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('bioLinkTasks');
    const parsedTasks = saved ? JSON.parse(saved) : [];
    
    // Thêm task mặc định "trò chuyện agenl ai support" nếu chưa có
    const aiSupportTaskExists = parsedTasks.some(task => 
      task.title && task.title.toLowerCase().includes('trò chuyện agenl ai support')
    );
    
    if (!aiSupportTaskExists) {
      const aiSupportTask = {
        id: 'ai-support-task-' + Date.now(),
        title: 'Trò chuyện Agenl AI Support',
        description: 'Liên hệ và trò chuyện với hệ thống hỗ trợ AI Agenl',
        priority: 'high',
        dueDate: '',
        category: 'Hỗ trợ',
        icon: 'fas fa-headset',
        completed: false,
        createdAt: new Date().toISOString()
      };
      return [aiSupportTask, ...parsedTasks];
    }
    
    return parsedTasks;
  });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFilter, setTaskFilter] = useState('all');

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

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks([newTask, ...tasks]);
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const updateTask = (taskId, taskData) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...taskData } : task
    ));
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const deleteTask = (taskId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, completedAt: task.completed ? null : new Date().toISOString() }
        : task
    ));
  };

  const openTaskModal = (task = null) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const getFilteredTasks = () => {
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
      </div>
    </Router>
  );
}

export default App;

