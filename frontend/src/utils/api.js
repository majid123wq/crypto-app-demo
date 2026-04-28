import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL || "https://crypto-app-demo.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // cookie-based auth; nothing to clear locally here
    }
    return Promise.reject(error);
  },
);

export default api;
