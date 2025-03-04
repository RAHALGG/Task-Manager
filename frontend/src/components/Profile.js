import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import './Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/users/me');
            setUser(response.data);
            setFormData({
                name: response.data.name,
                email: response.data.email,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
                setMessage({ type: 'error', text: 'كلمات المرور غير متطابقة' });
                return;
            }

            const updateData = {
                name: formData.name,
                email: formData.email
            };

            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            await api.patch('/users/me', updateData);
            setMessage({ type: 'success', text: 'تم تحديث الملف الشخصي بنجاح' });
            setIsEditing(false);
            fetchUserProfile();
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'حدث خطأ في تحديث الملف الشخصي'
            });
        }
    };

    if (!user) return null;

    return (
        <motion.div 
            className="profile-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="profile-header">
                <div className="profile-avatar">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? 'مشرف' : 'عضو'}
                    </span>
                </div>
            </div>

            {message.text && (
                <motion.div 
                    className={`message ${message.type}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {message.text}
                </motion.div>
            )}

            {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>الاسم</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>البريد الإلكتروني</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="password-section">
                        <h3>تغيير كلمة المرور</h3>
                        <div className="form-group">
                            <label>كلمة المرور الحالية</label>
                            <input
                                type="password"
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>تأكيد كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="form-buttons">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            حفظ التغييرات
                        </motion.button>
                        <motion.button
                            type="button"
                            className="cancel-btn"
                            onClick={() => setIsEditing(false)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            إلغاء
                        </motion.button>
                    </div>
                </form>
            ) : (
                <motion.button
                    className="edit-profile-btn"
                    onClick={() => setIsEditing(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="fas fa-edit"></i>
                    تعديل الملف الشخصي
                </motion.button>
            )}
        </motion.div>
    );
}

export default Profile; 