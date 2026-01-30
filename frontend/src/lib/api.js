import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5008/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * (kept minimal on purpose)
 */
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * ❌ DO NOT redirect here
 * ✅ Let pages / auth guards decide navigation
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Just pass the error through
    // Pages or context will handle 401s
    return Promise.reject(error);
  }
);

export default api;
