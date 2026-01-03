// admin/src/api.js
import axios from "axios";

/**
 * API base URL resolution:
 * - Development  → localhost
 * - Production   → VITE_API_BASE_URL (Railway / Render)
 */
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000/api"
    : import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL is not defined for production environment"
  );
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
