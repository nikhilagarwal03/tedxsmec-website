// frontend/src/api.js
import axios from 'axios';
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'https://tedxsmec-website-production.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' }
});
