import React from 'react';
import TaskColumn from './TaskColumn';
import './BoardView.css';

function BoardView({ tasks, users, onTaskUpdate, onTaskCreate, onTaskDelete }) {
  const columns = [
    { id: 'todo', title: 'المهام الجديدة' },
    { id: 'inProgress', title: 'قيد التنفيذ' },
    { id: 'review', title: 'قيد المراجعة' },
    { id: 'done', title: 'مكتملة' }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="board-container">
      {columns.map(column => (
        <TaskColumn
          key={column.id}
          title={column.title}
          tasks={getTasksByStatus(column.id)}
          users={users}
          onTaskUpdate={onTaskUpdate}
          onTaskCreate={onTaskCreate}
          onTaskDelete={onTaskDelete}
          status={column.id}
        />
      ))}
    </div>
  );
}

export default BoardView; 