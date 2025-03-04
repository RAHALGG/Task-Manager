const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },
  TEAMS: {
    CREATE: `${API_BASE_URL}/teams`,
    JOIN: `${API_BASE_URL}/teams/join`,
    DETAILS: (id) => `${API_BASE_URL}/teams/${id}`,
    MEMBERS: (id) => `${API_BASE_URL}/teams/${id}/members`,
    INVITE: (id) => `${API_BASE_URL}/teams/${id}/invite`,
  },
  PROJECTS: {
    LIST: `${API_BASE_URL}/projects`,
    CREATE: `${API_BASE_URL}/projects`,
    DETAILS: (id) => `${API_BASE_URL}/projects/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/projects/${id}`,
    DELETE: (id) => `${API_BASE_URL}/projects/${id}`,
  },
  TASKS: {
    LIST: (projectId) => `${API_BASE_URL}/projects/${projectId}/tasks`,
    CREATE: (projectId) => `${API_BASE_URL}/projects/${projectId}/tasks`,
    UPDATE: (projectId, taskId) => `${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`,
    DELETE: (projectId, taskId) => `${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`,
  }
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 