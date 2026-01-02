// frontend/src/api.js
import axios from 'axios';
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' }
});
