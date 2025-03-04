import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import './UserManagement.css';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'member'
    });

    useEffect(() => {
        fetchCurrentUser();
        fetchUsers();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await api.get('/users/me');
            setCurrentUser(response.data);
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (userId === currentUser?._id) {
            setMessage({
                type: 'error',
                text: 'لا يمكنك حذف حسابك الخاص'
            });
            return;
        }

        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            try {
                await api.delete(`/users/${userId}`);
                fetchUsers();
                setMessage({
                    type: 'success',
                    text: 'تم حذف المستخدم بنجاح'
                });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } catch (error) {
                setMessage({
                    type: 'error',
                    text: error.response?.data?.message || 'حدث خطأ في حذف المستخدم'
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', newUser);
            setNewUser({ name: '', email: '', password: '', role: 'member' });
            setIsFormOpen(false);
            fetchUsers();
            setMessage({
                type: 'success',
                text: 'تم إنشاء المستخدم بنجاح'
            });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'حدث خطأ في إنشاء المستخدم'
            });
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>جاري التحميل...</p>
            </div>
        );
    }

    return (
        <motion.div 
            className="user-management"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="user-management-header">
                <h2>إدارة المستخدمين</h2>
                <motion.button 
                    className="add-user-btn"
                    onClick={() => setIsFormOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="fas fa-plus"></i>
                    إضافة مستخدم جديد
                </motion.button>
            </div>

            <AnimatePresence>
                {message.text && (
                    <motion.div 
                        className={`message ${message.type}`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isFormOpen && (
                    <motion.div 
                        className="form-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="user-form"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <h3>إضافة مستخدم جديد</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>الاسم</label>
                                    <input
                                        type="text"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>كلمة المرور</label>
                                    <input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>الدور</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                    >
                                        <option value="member">عضو</option>
                                        <option value="admin">مشرف</option>
                                    </select>
                                </div>
                                <div className="form-buttons">
                                    <button type="submit">إضافة</button>
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={() => setIsFormOpen(false)}
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                className="users-list"
                layout
            >
                {users.map(user => (
                    <motion.div 
                        key={user._id}
                        className="user-card"
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="user-avatar">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <h3>{user.name}</h3>
                            <p>{user.email}</p>
                            <span className={`role-badge ${user.role}`}>
                                {user.role === 'admin' ? 'مشرف' : 'عضو'}
                            </span>
                        </div>
                        {currentUser?._id !== user._id && (
                            <motion.button 
                                className="delete-btn"
                                onClick={() => handleDelete(user._id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <i className="fas fa-trash"></i>
                            </motion.button>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

export default UserManagement; 