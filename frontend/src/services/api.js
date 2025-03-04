import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// إضافة التوكن لكل الطلبات
api.interceptors.request.use(
    (config) => {
        console.log('Sending request to:', config.url);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// اعتراض الأخطاء للتشخيص
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.status);
        return response;
    },
    (error) => {
        console.error('Response error:', error.message);
        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.'));
        }
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const taskService = {
    getAllTasks: () => api.get('/tasks'),
    createTask: (task) => api.post('/tasks', task),
    updateTask: (id, task) => api.put(`/tasks/${id}`, task),
    deleteTask: (id) => api.delete(`/tasks/${id}`)
};

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData)
};

export const testConnection = async () => {
    try {
        const response = await api.get('/test');
        console.log('اختبار الاتصال:', response.data);
        return true;
    } catch (error) {
        console.error('خطأ في الاتصال بالخادم:', error);
        return false;
    }
};

export default api; 