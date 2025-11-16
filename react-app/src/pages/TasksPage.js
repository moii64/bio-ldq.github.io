import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import './TasksPage.css';

const TasksPage = ({ tasks, setTasks }) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFilter, setTaskFilter] = useState('all');

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
    <div className="container">
      <div className="task-page-header">
        <div className="header-content">
          <Link to="/" className="back-link">
            <i className="fas fa-arrow-left"></i>
            <span>Về trang chủ</span>
          </Link>
          <h1><i className="fas fa-tasks"></i> Quản lý nhiệm vụ</h1>
          <p className="header-subtitle">Theo dõi và quản lý tất cả nhiệm vụ của bạn</p>
        </div>
      </div>

      <TaskList 
        tasks={getFilteredTasks()}
        filter={taskFilter}
        onFilterChange={setTaskFilter}
        onAddTask={() => openTaskModal()}
        onEditTask={openTaskModal}
        onDeleteTask={deleteTask}
        onToggleTask={toggleTask}
      />

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onSave={editingTask ? (data) => updateTask(editingTask.id, data) : addTask}
          onClose={closeTaskModal}
        />
      )}
    </div>
  );
};

export default TasksPage;

