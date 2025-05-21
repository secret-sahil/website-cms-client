import axios from "axios";
import { useTokenStore } from "@/store";
import Auth from "./auth";

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  withCredentials: true,
});

/**
 * Interceptor for all headers
 */

api.interceptors.request.use(
  (config: any) => {
    const token = useTokenStore.getState().token;

    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error: any) => Promise.reject(error)
);

/**
 * Interceptor for all responses
 */
api.interceptors.response.use(
  (response: any) => response.data,

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await Auth.refresh();
        return api(originalRequest);
      } catch (refreshError) {
        useTokenStore.getState().removeToken();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.data) {
      const apiError = error.response.data;
      return Promise.reject(apiError);
    }

    return Promise.reject(error);
  }
);

export default api;
