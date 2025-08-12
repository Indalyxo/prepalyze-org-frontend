import axios from "axios";

import useAuthStore from "../context/auth-store";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("prepalyze-refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post("/auth/refresh-token", {
          refreshToken: refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        localStorage.setItem("prepalyze-accessToken", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("prepalyze-refreshToken", newRefreshToken);
        }

        processQueue(null, accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Refresh failed, logout user
        const { logout } = useAuthStore.getState();
        logout();
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


// Group API functions
export const groupAPI = {
  // Get all groups for an organization
  getGroups: (organizationId) => apiClient.get(`/api/group/${organizationId}`),
  
  // Get a specific group
  getGroup: (organizationId, groupId) => apiClient.get(`/api/group/${organizationId}/${groupId}`),
  
  // Create a new group
  createGroup: (organizationId, groupData) => apiClient.post(`/api/group/${organizationId}`, groupData),
  
  // Update a group
  updateGroup: (organizationId, groupId, groupData) => apiClient.put(`/api/group/${organizationId}/${groupId}`, groupData),
  
  // Delete a group
  deleteGroup: (organizationId, groupId) => apiClient.delete(`/api/group/${organizationId}/${groupId}`),
  
  // Add student to group
  addStudentToGroup: (organizationId, groupId, studentId) => apiClient.post(`/api/group/${organizationId}/${groupId}/students`, { studentId }),
  
  // Remove student from group
  removeStudentFromGroup: (organizationId, groupId, studentId) => apiClient.delete(`/api/group/${organizationId}/${groupId}/students/${studentId}`)
};

// User API functions
export const userAPI = {
  // Get all students for an organization
  getStudents: (organizationId) => apiClient.get(`/api/user/${organizationId}/students`),
  
  // Get all users for an organization
  getUsers: (organizationId) => apiClient.get(`/api/user/${organizationId}`)
};

export default apiClient;