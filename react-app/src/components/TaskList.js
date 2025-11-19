import React from 'react';
import './TaskList.css';

const TaskList = ({ 
  tasks, 
  filter, 
  onFilterChange, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onToggleTask 
}) => {
  const getFilteredTasks = () => {
    switch (filter) {
      case 'completed':
        return tasks.filter(t => t.completed);
      case 'pending':
        return tasks.filter(t => !t.completed);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPriorityText = (priority) => {
    const priorities = {
      low: 'Thấp',
      medium: 'Trung bình',
      high: 'Cao'
    };
    return priorities[priority] || 'Trung bình';
  };

  return (
    <div className="task-section">
      <div className="task-header">
        <h2><i className="fas fa-tasks"></i> Danh sách nhiệm vụ</h2>
        <button className="add-task-btn" onClick={onAddTask}>
          <i className="fas fa-plus"></i>
          Thêm nhiệm vụ
        </button>
      </div>

      <div className="task-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          Tất cả
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => onFilterChange('pending')}
        >
          Chưa hoàn thành
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => onFilterChange('completed')}
        >
          Đã hoàn thành
        </button>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-clipboard-list"></i>
            <p>
              {filter === 'all' ? 'Chưa có nhiệm vụ nào' : 
               filter === 'completed' ? 'Chưa có nhiệm vụ hoàn thành' : 
               'Chưa có nhiệm vụ chưa hoàn thành'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`}
            >
              <div className="task-checkbox">
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => onToggleTask(task.id)}
                />
              </div>
              <div className="task-content" onClick={() => {
                if (task.title && task.title.includes('Trò chuyện Agenl AI Support')) {
                  if (window.showChatModal) {
                    window.showChatModal();
                  }
                }
              }} style={{ cursor: task.title && task.title.includes('Trò chuyện Agenl AI Support') ? 'pointer' : 'default' }}>
                <h4 className="task-title">
                  {task.icon && <i className={task.icon}></i>}
                  {task.title}
                </h4>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-meta">
                  <span className={`task-priority priority-${task.priority}`}>
                    <i className="fas fa-flag"></i>
                    {getPriorityText(task.priority)}
                  </span>
                  {task.dueDate && (
                    <span className="task-due-date">
                      <i className="fas fa-calendar"></i>
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                  <span className="task-created">
                    <i className="fas fa-clock"></i>
                    {formatDate(task.createdAt)}
                  </span>
                </div>
              </div>
              <div className="task-actions">
                <button 
                  className="task-action-btn edit-btn" 
                  onClick={() => onEditTask(task)}
                  title="Chỉnh sửa"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button 
                  className="task-action-btn delete-btn" 
                  onClick={() => onDeleteTask(task.id)}
                  title="Xóa"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-number">{total}</span>
          <span className="stat-label">Tổng cộng</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{completed}</span>
          <span className="stat-label">Hoàn thành</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{pending}</span>
          <span className="stat-label">Chưa xong</span>
        </div>
      </div>
    </div>
  );
};

export default TaskList;

