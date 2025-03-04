import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './TaskForm.css';

function TaskForm({ onSubmit, onClose }) {
    const [task, setTask] = useState({
        title: '',
        description: '',
        color: 'blue',
        assignedTo: '',
        status: 'todo'
    });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(task);
    };

    const COLORS = [
        { id: 'blue', name: 'أزرق', hex: '#0052cc' },
        { id: 'green', name: 'أخضر', hex: '#36B37E' },
        { id: 'yellow', name: 'أصفر', hex: '#FF991F' },
        { id: 'red', name: 'أحمر', hex: '#FF5630' },
        { id: 'purple', name: 'بنفسجي', hex: '#6554C0' },
        { id: 'orange', name: 'برتقالي', hex: '#FF8B00' }
    ];

    return (
        <div className="task-form-overlay">
            <div className="task-form">
                <h3>مهمة جديدة</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>العنوان</label>
                        <input
                            type="text"
                            value={task.title}
                            onChange={(e) => setTask({...task, title: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>الوصف</label>
                        <textarea
                            value={task.description}
                            onChange={(e) => setTask({...task, description: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label>اللون</label>
                        <div className="color-picker">
                            {COLORS.map(color => (
                                <div
                                    key={color.id}
                                    className={`color-option ${task.color === color.id ? 'selected' : ''}`}
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => setTask({...task, color: color.id})}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>تعيين إلى</label>
                        <select
                            value={task.assignedTo}
                            onChange={(e) => setTask({...task, assignedTo: e.target.value})}
                        >
                            <option value="">اختر عضواً</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-buttons">
                        <button type="submit" className="submit-btn">إضافة</button>
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskForm; 