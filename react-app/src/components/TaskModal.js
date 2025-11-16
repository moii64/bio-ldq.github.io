import React, { useState, useEffect } from 'react';
import './TaskModal.css';

const TaskModal = ({ task, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        category: task.category || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        category: ''
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề nhiệm vụ!');
      return;
    }
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="task-modal show" onClick={onClose}>
      <div className="task-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <h3>{task ? 'Chỉnh sửa nhiệm vụ' : 'Thêm nhiệm vụ mới'}</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="task-modal-body">
          <form id="taskForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="taskTitle">
                <i className="fas fa-heading"></i>
                Tiêu đề nhiệm vụ *
              </label>
              <input
                type="text"
                id="taskTitle"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Nhập tiêu đề nhiệm vụ..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="taskDescription">
                <i className="fas fa-align-left"></i>
                Mô tả
              </label>
              <textarea
                id="taskDescription"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Mô tả chi tiết nhiệm vụ..."
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="taskPriority">
                  <i className="fas fa-flag"></i>
                  Độ ưu tiên
                </label>
                <select
                  id="taskPriority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="taskDueDate">
                  <i className="fas fa-calendar"></i>
                  Hạn hoàn thành
                </label>
                <input
                  type="date"
                  id="taskDueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="taskCategory">
                <i className="fas fa-tag"></i>
                Danh mục
              </label>
              <input
                type="text"
                id="taskCategory"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ví dụ: Công việc, Cá nhân, Học tập..."
              />
            </div>
          </form>
        </div>
        <div className="task-modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            <i className="fas fa-save"></i>
            Lưu nhiệm vụ
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

