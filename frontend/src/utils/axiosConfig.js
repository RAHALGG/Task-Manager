import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// إعداد الـ interceptor للتعامل مع الأخطاء وتجديد التوكن
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.get(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });

        localStorage.setItem('accessToken', response.data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        
        return axios(originalRequest);
      } catch (err) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axios; 