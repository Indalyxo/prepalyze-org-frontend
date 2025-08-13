import axios from "axios";

import useAuthStore from "../context/auth-store";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("prepalyze-accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors and avoid infinite retries
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Clear the queue if this is the first 401
      if (!isRefreshing) {
        failedQueue = [];
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken: refresh } = useAuthStore.getState();
        const refreshResult = await refresh();

        if (refreshResult.success) {
          // Update the original request header
          originalRequest.headers.Authorization = `Bearer ${localStorage.getItem(
            "accessToken"
          )}`;

          // Retry the original request
          return apiClient(originalRequest);
        } else {
          // Refresh failed - logout
          const { logout } = useAuthStore.getState();
          await logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh failed - logout
        const { logout } = useAuthStore.getState();
        await logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // If we have a 401 and it's already been retried, or it's another error
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      await logout();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
