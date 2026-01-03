// admin/src/api.js
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'https://tedxsmec-website-production.up.railway.app/api'
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('admin_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
