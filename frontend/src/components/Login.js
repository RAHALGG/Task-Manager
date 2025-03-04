import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            // إعادة التوجيه أو تحديث الحالة بعد تسجيل الدخول الناجح
        } catch (error) {
            console.error('خطأ في تسجيل الدخول:', error);
            setError('فشل تسجيل الدخول. تحقق من بيانات الاعتماد الخاصة بك.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>تسجيل الدخول</h1>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="البريد الإلكتروني"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="كلمة المرور"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login; 