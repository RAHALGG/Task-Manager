import React, { useState } from 'react';
import '../styles/TaskDetails.css';
import TaskChecklist from './TaskChecklist';
import ActivityLog from './ActivityLog';

function TaskDetails({ task, onClose, onUpdate, members, labels }) {
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      user: { name: 'أحمد محمد', avatar: '/avatar1.png' },
      text: 'يجب أن ننتهي من هذه المهمة قبل نهاية الأسبوع',
      date: '2024-03-10T10:30:00'
    }
  ]);
  const [checklist, setChecklist] = useState([
    {
      id: 1,
      text: 'تحليل المتطلبات',
      completed: true
    },
    {
      id: 2,
      text: 'تصميم واجهة المستخدم',
      completed: false
    }
  ]);

  const handleUpdate = () => {
    onUpdate(editedTask);
    setEditMode(false);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(),
      text: comment,
      user: members[0], // يمكن تحديثه لاستخدام المستخدم الحالي
      createdAt: new Date().toISOString()
    };

    setEditedTask({
      ...editedTask,
      comments: [...(editedTask.comments || []), newComment]
    });
    setComment('');
  };

  return (
    <div className="task-details">
      <div className="task-details-header">
        {editMode ? (
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="title-input"
          />
        ) : (
          <h2>{task.title}</h2>
        )}
        <div className="header-actions">
          <button 
            className="btn-icon"
            onClick={() => setEditMode(!editMode)}
          >
            <i className={`fas fa-${editMode ? 'check' : 'edit'}`}></i>
          </button>
        </div>
      </div>

      <div className="task-details-content">
        <div className="task-main">
          <div className="description-section">
            <h3>الوصف</h3>
            {editMode ? (
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="description-input"
                rows="4"
              />
            ) : (
              <p className="description-text">{task.description}</p>
            )}
          </div>

          <div className="checklist-section">
            <TaskChecklist
              checklist={editedTask.checklist || []}
              onUpdate={(newChecklist) => 
                setEditedTask({ ...editedTask, checklist: newChecklist })
              }
              readOnly={!editMode}
            />
          </div>

          <div className="comments-section">
            <h3>التعليقات</h3>
            <form onSubmit={handleAddComment} className="comment-form">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="أضف تعليقاً..."
                className="comment-input"
              />
              <button type="submit" className="btn-primary">إضافة</button>
            </form>
            <div className="comments-list">
              {editedTask.comments?.map(comment => (
                <div key={comment.id} className="comment">
                  <img 
                    src={comment.user.avatar} 
                    alt={comment.user.name} 
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{comment.user.name}</span>
                      <span className="comment-time">
                        {new Date(comment.createdAt).toLocaleString('ar-SA')}
                      </span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="task-sidebar">
          <div className="sidebar-section">
            <h4>الحالة</h4>
            <select
              value={editedTask.status}
              onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
              disabled={!editMode}
              className="status-select"
            >
              <option value="todo">قيد الانتظار</option>
              <option value="inProgress">قيد التنفيذ</option>
              <option value="review">قيد المراجعة</option>
              <option value="done">مكتمل</option>
            </select>
          </div>

          <div className="sidebar-section">
            <h4>المسؤول</h4>
            <select
              value={editedTask.assignee.id}
              onChange={(e) => {
                const member = members.find(m => m.id === e.target.value);
                setEditedTask({ ...editedTask, assignee: member });
              }}
              disabled={!editMode}
              className="assignee-select"
            >
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sidebar-section">
            <h4>التصنيفات</h4>
            <div className="labels-list">
              {editMode ? (
                labels.map(label => (
                  <label key={label.id} className="label-checkbox">
                    <input
                      type="checkbox"
                      checked={editedTask.labels.includes(label.name)}
                      onChange={(e) => {
                        const newLabels = e.target.checked
                          ? [...editedTask.labels, label.name]
                          : editedTask.labels.filter(l => l !== label.name);
                        setEditedTask({ ...editedTask, labels: newLabels });
                      }}
                    />
                    <span className="label-name">{label.name}</span>
                  </label>
                ))
              ) : (
                editedTask.labels.map((label, index) => (
                  <span key={index} className="task-label">{label}</span>
                ))
              )}
            </div>
          </div>

          <div className="sidebar-section">
            <h4>تاريخ الاستحقاق</h4>
            <input
              type="date"
              value={editedTask.dueDate}
              onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
              disabled={!editMode}
              className="due-date-input"
            />
          </div>

          {editMode && (
            <div className="sidebar-actions">
              <button onClick={handleUpdate} className="btn-primary">
                حفظ التغييرات
              </button>
              <button onClick={() => setEditMode(false)} className="btn-secondary">
                إلغاء
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetails; 