import api from './api';

export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const taskService = {
  getTasks: () => api.get('/tasks'),
  getStats: () => api.get('/tasks/stats'),
  createTask: (data) => api.post('/tasks', data),
  assignTask: (data) => api.post('/tasks/assign', data),
  updateStatus: (data) => api.put('/tasks/status', data)
};

export const adminService = {
  getAllUsers: () => api.get('/admin/users'),
  approveUser: (data) => api.post('/admin/approve-user', data),
  deactivateUser: (data) => api.post('/admin/deactivate-user', data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getStats: () => api.get('/admin/stats')
};
