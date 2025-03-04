import React, { useState } from 'react';
import './TaskCard.css';

function TaskCard({ task, users, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task._id);
  };

  return (
    <div 
      className="task-card"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-actions">
          <button onClick={() => setIsEditing(true)}>تعديل</button>
          <button onClick={() => onDelete(task._id)}>حذف</button>
        </div>
      </div>
      <p>{task.description}</p>
      <div className="task-footer">
        <div className="assigned-to">
          {task.assignedTo?.map(userId => {
            const user = users.find(u => u._id === userId);
            return user ? (
              <span key={userId} className="user-avatar">
                {user.name.charAt(0)}
              </span>
            ) : null;
          })}
        </div>
        {task.dueDate && (
          <span className="due-date">
            {new Date(task.dueDate).toLocaleDateString('ar-SA')}
          </span>
        )}
      </div>
    </div>
  );
}

export default TaskCard; 