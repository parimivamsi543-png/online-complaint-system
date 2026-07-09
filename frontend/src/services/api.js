import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error('VITE_API_URL is not set. Add it to frontend/.env');
}

const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message =
        'Cannot connect to server. Make sure the backend is running on port 5000.';
    }
    return Promise.reject(error);
  }
);

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/api/users/register', data);
export const loginUser = (data) => API.post('/api/users/login', data);
export const getUsers = () => API.get('/api/users');
export const getAgents = () => API.get('/api/users/agents');
export const deleteUser = (id) => API.delete(`/api/users/${id}`);

export const createComplaint = (data) => API.post('/api/complaints', data);
export const getComplaints = (params) => API.get('/api/complaints', { params });
export const getComplaintById = (id) => API.get(`/api/complaints/${id}`);
export const updateComplaint = (id, data) => API.put(`/api/complaints/${id}`, data);
export const deleteComplaint = (id) => API.delete(`/api/complaints/${id}`);
export const getAnalytics = () => API.get('/api/complaints/analytics');

export default API;
