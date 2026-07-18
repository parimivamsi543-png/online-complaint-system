import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/api/users/register', data),
  login: (data) => api.post('/api/users/login', data),
  getProfile: () => api.get('/api/users/profile'),
  getAllUsers: () => api.get('/api/users'),
  getAgents: () => api.get('/api/users/agents'),
  updateUserRole: (id, role) => api.put(`/api/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
};

export const complaintAPI = {
  create: (data) => api.post('/api/complaints', data),
  getAll: (params) => api.get('/api/complaints', { params }),
  getById: (id) => api.get(`/api/complaints/${id}`),
  update: (id, data) => api.put(`/api/complaints/${id}`, data),
  delete: (id) => api.delete(`/api/complaints/${id}`),
  getStats: () => api.get('/api/complaints/stats'),
  getNotifications: () => api.get('/api/complaints/notifications'),
  markNotificationRead: (id) => api.put(`/api/complaints/notifications/${id}/read`),
};

export default api;
