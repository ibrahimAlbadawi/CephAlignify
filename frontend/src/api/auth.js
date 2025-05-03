import api from './axios';

export const login = (credentials) => api.post('/auth/login/', credentials);
export const logout = () => api.post('/auth/logout/');
export const register = (userData) => api.post('/auth/register/', userData);
// Add token refresh etc. if needed