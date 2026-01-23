import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

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
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
    }
    return Promise.reject(error);
  },
);

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
