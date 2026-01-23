import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

// Helper function to set auth token in both localStorage and cookies
const setAuthToken = (token: string) => {
  localStorage.setItem("auth_token", token);
  // Also set as cookie for middleware access
  if (typeof window !== "undefined") {
    document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
  }
};

// Helper function to remove auth token
const removeAuthToken = () => {
  localStorage.removeItem("auth_token");
  if (typeof window !== "undefined") {
    document.cookie = "auth_token=; path=/; max-age=0"; // Delete cookie
  }
};

// Create axios instance with base URL from environment
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add token if available (for authenticated requests)
    // Check if we're in the browser before accessing localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Return only the data, stripping any debug info
    return response.data;
  },
  (error: AxiosError) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Handle unauthorized - could redirect to login
      removeAuthToken();
    }
    return Promise.reject(error);
  },
);

// Export helper functions for use in the app
export const authTokenUtils = {
  setToken: setAuthToken,
  removeToken: removeAuthToken,
};

// Generic API methods
export const api = {
  get: <T = Array<string>>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config),

  post: <T = Array<string>>(url: string, data?: Array<string | number>, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config),

  put: <T = Array<string>>(url: string, data?: Array<string | number>, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config),

  patch: <T = Array<string>>(url: string, data?: Array<string | number>, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config),

  delete: <T = Array<string>>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config),
};

export default apiClient;
