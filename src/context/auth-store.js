import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../utils/api";

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
          const response = await axios.post(`${API_BASE_URL}/api/v1/refresh`, {
            refreshToken: refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;

          localStorage.setItem("prepalyze-accessToken", accessToken);
          if (newRefreshToken) {
            localStorage.setItem("prepalyze-refreshToken", newRefreshToken);
          }

          return { success: true, accessToken };
        } catch (error) {
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
          return payload.exp - currentTime < 300;
        } catch (error) {
          return true;
        }
      },

      // Logout
      logout: async () => {
        try {
          await apiClient.post("/auth/logout");
        } catch (error) {
          console.error("Logout error:", error);
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
            if (!refreshResult.success) {
              set({ isAuthenticated: false, isInitializing: false });
              return;
            }
          }
          await get().getCurrentUser();
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
