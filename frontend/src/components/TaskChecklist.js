import React, { useState } from 'react';
import '../styles/TaskChecklist.css';

function TaskChecklist({ checklist, onUpdate }) {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const newChecklistItem = {
      id: Date.now(),
      text: newItem,
      completed: false
    };

    onUpdate([...checklist, newChecklistItem]);
    setNewItem('');
  };

  const toggleItem = (itemId) => {
    const updatedChecklist = checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdate(updatedChecklist);
  };

  const progress = checklist.length
    ? Math.round((checklist.filter(item => item.completed).length / checklist.length) * 100)
    : 0;

  return (
    <div className="checklist-container">
      <div className="checklist-header">
        <div className="checklist-title">
          <i className="fas fa-check-square"></i>
          <h3>قائمة المهام</h3>
        </div>
        <span className="checklist-progress">{progress}%</span>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="checklist-items">
        {checklist.map(item => (
          <div key={item.id} className="checklist-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
              />
              <span className="custom-checkbox"></span>
              <span className={item.completed ? 'completed' : ''}>
                {item.text}
              </span>
            </label>
            <button 
              className="delete-item-btn"
              onClick={() => onUpdate(checklist.filter(i => i.id !== item.id))}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddItem} className="add-item-form">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="أضف مهمة جديدة..."
        />
        <button type="submit" className="btn-primary">
          إضافة
        </button>
      </form>
    </div>
  );
}

export default TaskChecklist; 