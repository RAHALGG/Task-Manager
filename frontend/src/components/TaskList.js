import React from 'react';
import './TaskBoard.css';

function TaskList({ title, tasks, onTaskUpdate, onTaskDelete, users }) {
    const handleStatusChange = (taskId, newStatus) => {
        onTaskUpdate(taskId, { status: newStatus });
    };

    const getAssignedUserName = (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : 'غير معين';
    };

    return (
        <div className="task-list">
            <h3>{title}</h3>
            {tasks.map(task => (
                <div 
                    key={task._id} 
                    className={`task-card ${task.color}`}
                >
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <div className="task-footer">
                        <span>المسؤول: {getAssignedUserName(task.assignedTo)}</span>
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        >
                            <option value="todo">قيد الانتظار</option>
                            <option value="in-progress">قيد التنفيذ</option>
                            <option value="done">مكتمل</option>
                        </select>
                        <button 
                            onClick={() => onTaskDelete(task._id)}
                            className="delete-btn"
                        >
                            حذف
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TaskList; 