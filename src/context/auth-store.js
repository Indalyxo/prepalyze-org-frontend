import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios"; // Add missing import
import apiClient from "../utils/api";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"; // Add missing constant

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitializing: true,

      
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post("/auth/login", {
            email,
            password,
          });
          const { user, accessToken, refreshToken } = response.data.data;

          set({ user, isAuthenticated: true, isLoading: false });
          localStorage.setItem("prepalyze-accessToken", accessToken);

          if (refreshToken) {
            localStorage.setItem("prepalyze-refreshToken", refreshToken);
          }

          return { success: true, user };
        } catch (error) {
          console.error(error);
          set({ isLoading: false }); // Make sure to reset loading state

          // Don't logout on network errors
          if (
            error.code === "NETWORK_ERROR" ||
            error.message === "Network Error"
          ) {
            return {
              success: false,
              message: "Network error. Please check your connection.",
            };
          }

          const message =
            error.response?.data?.message || "An error occurred during login.";
          return { success: false, message };
        }
      },

      refreshToken: async () => {
        try {
          const refreshToken = localStorage.getItem("prepalyze-refreshToken");
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          // Use axios directly to avoid circular interceptor
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {
              refreshToken: refreshToken,
            },
            {
              timeout: 10000, // 10 second timeout for refresh
            }
          );

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;

          localStorage.setItem("prepalyze-accessToken", accessToken);
          if (newRefreshToken) {
            localStorage.setItem("prepalyze-refreshToken", newRefreshToken);
          }

          return { success: true, accessToken };
        } catch (error) {
          // Don't return error for network issues during refresh
          if (
            error.code === "NETWORK_ERROR" ||
            error.message === "Network Error"
          ) {
            return {
              success: false,
              message: "Network error during token refresh",
              networkError: true,
            };
          }

          return {
            success: false,
            message: error.response?.data?.message || "Token refresh failed",
          };
        }
      },

      checkTokenExpiry: () => {
        const token = localStorage.getItem("prepalyze-accessToken");

        if (!token) return false;

        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const currentTime = Date.now() / 1000;
          return payload.exp - currentTime < 300; // 5 minutes buffer
        } catch (error) {
          return true;
        }
      },

      // Logout
      logout: async () => {
        try {
          await apiClient.post("/auth/logout");
        } catch (error) {
          // Don't log error for network issues during logout
          if (
            !(
              error.code === "NETWORK_ERROR" ||
              error.message === "Network Error"
            )
          ) {
            console.error("Logout error:", error);
          }
        } finally {
          localStorage.removeItem("prepalyze-accessToken");
          localStorage.removeItem("prepalyze-refreshToken");
          set({ user: null, isAuthenticated: false });
        }
      },

      // Logout from all devices
      logoutAll: async () => {
        try {
          await apiClient.post("/auth/logout-all");
          localStorage.removeItem("prepalyze-accessToken");
          localStorage.removeItem("prepalyze-refreshToken");
          set({ user: null, isAuthenticated: false });
          return { success: true };
        } catch (error) {
          // Still clear local storage even if API call fails
          localStorage.removeItem("prepalyze-accessToken");
          localStorage.removeItem("prepalyze-refreshToken");
          set({ user: null, isAuthenticated: false });

          if (
            error.code === "NETWORK_ERROR" ||
            error.message === "Network Error"
          ) {
            return {
              success: true,
              message: "Logged out locally (network error)",
            };
          }

          return { success: false, message: error.response?.data?.message };
        }
      },

      changePassword: async (currentPassword, newPassword) => {
        try {
          await apiClient.put("/api/v1/change-password", {
            currentPassword,
            newPassword,
          });
          return { success: true };
        } catch (error) {
          if (
            error.code === "NETWORK_ERROR" ||
            error.message === "Network Error"
          ) {
            return {
              success: false,
              message: "Network error. Please check your connection.",
            };
          }

          return {
            success: false,
            message: error.response?.data?.message || "Password change failed",
          };
        }
      },

      getCurrentUser: async () => {
        try {
          const response = await apiClient.get("/auth/me");
          const { user } = response.data.data;
          set({ user, isAuthenticated: true, isInitializing: false });
          return { success: true };
        } catch (error) {
          // Don't clear tokens on network errors
          if (
            error.code === "NETWORK_ERROR" ||
            error.message === "Network Error"
          ) {
            set({ isInitializing: false });
            return { success: false, networkError: true };
          }

          // Only clear on actual auth errors
          localStorage.removeItem("prepalyze-accessToken");
          localStorage.removeItem("prepalyze-refreshToken");
          console.log(error);
          set({ user: null, isAuthenticated: false, isInitializing: false });
          return { success: false };
        }
      },

      initializeAuth: async () => {
        set({ isInitializing: true });
        const token = localStorage.getItem("prepalyze-accessToken");

        if (token) {
          if (get().checkTokenExpiry()) {
            const refreshResult = await get().refreshToken();
            if (!refreshResult.success && !refreshResult.networkError) {
              // Only clear auth on non-network refresh failures
              set({ isAuthenticated: false, isInitializing: false });
              return;
            }
          }

          const userResult = await get().getCurrentUser();
          if (!userResult.success && !userResult.networkError) {
            // Only clear auth on non-network user fetch failures
            set({ isAuthenticated: false, isInitializing: false });
          }
        } else {
          set({ isAuthenticated: false, isInitializing: false });
        }

        set({ isInitializing: false });
      },
    }),
    {
      name: "user-auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
