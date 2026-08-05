import axios from "axios";

// ==========================================
// AXIOS INSTANCE CONFIGURATION
// ==========================================
/**
 * Pre-configured Axios instance for API requests.
 * Automatically handles attaching auth tokens and intercepting 401 errors.
 */
const api = axios.create({
  baseURL: "http://localhost:8000",
});

// --- Request Interceptor ---
// Attaches the JWT token from local or session storage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// Catches 401 Unauthorized errors to automatically log out the user
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hasToken = localStorage.getItem("token") || sessionStorage.getItem("token");

      // If the user had a token but received a 401, the token is invalid/expired
      if (hasToken) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        
        // Redirect to the home/login page
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;