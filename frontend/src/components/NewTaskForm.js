import React, { useState } from 'react';
import '../styles/Forms.css';

function NewTaskForm({ onSubmit, onClose, members, labels }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignee: members[0]?.id || '',
    labels: [],
    attachments: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: `t${Date.now()}`,
      ...taskData,
      assignee: members.find(m => m.id === taskData.assignee) || members[0],
      comments: 0,
      attachments: 0
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>عنوان المهمة</label>
        <input
          type="text"
          value={taskData.title}
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>الوصف</label>
        <textarea
          value={taskData.description}
          onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>الأولوية</label>
          <select
            value={taskData.priority}
            onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
          >
            <option value="low">منخفضة</option>
            <option value="medium">متوسطة</option>
            <option value="high">عالية</option>
          </select>
        </div>

        <div className="form-group">
          <label>المسؤول</label>
          <select
            value={taskData.assignee}
            onChange={(e) => setTaskData({ ...taskData, assignee: e.target.value })}
          >
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>تاريخ الاستحقاق</label>
        <input
          type="date"
          value={taskData.dueDate}
          onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>التصنيفات</label>
        <div className="labels-selector">
          {labels.map(label => (
            <label key={label.id} className="label-checkbox">
              <input
                type="checkbox"
                checked={taskData.labels.includes(label.name)}
                onChange={(e) => {
                  const newLabels = e.target.checked
                    ? [...taskData.labels, label.name]
                    : taskData.labels.filter(l => l !== label.name);
                  setTaskData({ ...taskData, labels: newLabels });
                }}
              />
              <span className="label-color" style={{ backgroundColor: label.color }}></span>
              <span>{label.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">إنشاء المهمة</button>
        <button type="button" className="btn-secondary" onClick={onClose}>
          إلغاء
        </button>
      </div>
    </form>
  );
}

export default NewTaskForm; 