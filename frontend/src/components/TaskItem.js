import React, { useState } from 'react';
import './TaskItem.css';

function TaskItem({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleUpdate = () => {
    onUpdate(task._id, {
      title: editedTitle,
      description: editedDescription
    });
    setIsEditing(false);
  };

  return (
    <div className="task-item">
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <button onClick={handleUpdate}>حفظ</button>
          <button onClick={() => setIsEditing(false)}>إلغاء</button>
        </div>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <div className="task-actions">
            <button onClick={() => setIsEditing(true)}>تعديل</button>
            <button onClick={() => onDelete(task._id)}>حذف</button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem; 