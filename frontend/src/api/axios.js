import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ── Request Interceptor: Attach JWT from localStorage ─────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("finance_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor: Handle 401 globally ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("finance_token");
      localStorage.removeItem("finance_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
