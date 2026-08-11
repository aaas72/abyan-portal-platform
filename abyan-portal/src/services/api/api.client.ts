import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Unified response format expected from the backend
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

// Create the Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Enable sending cookies with every request
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // If the backend returns our unified ApiResponse wrapper,
    // we can either return the whole wrapper or just the data.
    // For now, we return the entire response data to let the caller handle success/data.
    return response;
  },
  (error) => {
    // Centralized error handling
    if (error.response) {
      const status = error.response.status;
      
      // Handle Unauthorized
      if (status === 401) {
        console.warn('Unauthorized access. Token might be expired.');
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin-login')) {
          // Clear token and user session, then redirect to login
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          window.location.href = '/admin-login';
        }
      }
      
      // Handle Forbidden
      if (status === 403) {
        console.error('Forbidden access. You do not have permission.');
      }
      
      // Log detailed error from backend to help with debugging
      console.error(
        `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} failed with status ${status}:`,
        error.response.data
      );
    } else if (error.request) {
      console.error('Network Error: No response received from server.');
    } else {
      console.error('Error in request setup:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
