import React from 'react';
import TaskCard from './TaskCard';
import './TaskColumn.css';

function TaskColumn({ title, tasks, users, status, onTaskUpdate, onTaskCreate, onTaskDelete }) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    const taskId = e.dataTransfer.getData('taskId');
    onTaskUpdate(taskId, { status });
  };

  return (
    <div 
      className="task-column"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <h2>{title}</h2>
        <button onClick={() => onTaskCreate(status)}>+</button>
      </div>
      <div className="tasks-container">
        {tasks.map(task => (
          <TaskCard
            key={task._id}
            task={task}
            users={users}
            onUpdate={onTaskUpdate}
            onDelete={onTaskDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskColumn; 