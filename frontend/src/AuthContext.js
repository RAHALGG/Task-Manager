import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const login = async (email, password) => {
    try {
        console.log('Attempting login with:', { email });
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        console.log('Login response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
}; 