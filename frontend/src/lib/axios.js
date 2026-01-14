import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import toast from 'react-hot-toast';

// Log API base URL for debugging
if (import.meta.env.DEV) {
  console.log('[API Config] Base URL:', API_BASE_URL);
  console.log('[API Config] Frontend URL:', window.location.origin);
  console.log('[API Config] Backend should allow CORS for:', window.location.origin);
}

/**
 * Axios instance with interceptors for authentication and error handling
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Backend returns { ok: true, payload/data: ... }
    return response;
  },
  (error) => {
    const { response, request, code, message } = error;

    // Network error (no response received)
    if (!response) {
      // Check for specific error types
      if (code === 'ECONNREFUSED' || code === 'ERR_NETWORK') {
        // Connection refused or network error
        const isCorsError = message?.includes('CORS') || 
                           (request && !request.responseURL);
        
        if (isCorsError) {
          toast.error(`CORS error: Backend may not be configured to allow this origin (${window.location.origin}). Check backend CORS settings.`);
        } else if (code === 'ECONNREFUSED') {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          toast.error(`Cannot connect to server at ${apiUrl}. Is the backend running?`);
        } else {
          toast.error('Network error. Please check your connection and ensure the backend is running.');
        }
      } else if (code === 'ETIMEDOUT' || code === 'ECONNABORTED') {
        toast.error('Request timeout. The server is taking too long to respond.');
      } else {
        // Generic network error with more context
        const errorMsg = message || 'Network error';
        toast.error(`Connection failed: ${errorMsg}. Check backend URL: ${API_BASE_URL}`);
      }
      return Promise.reject(error);
    }

    // Server responded with error status
    const { status, data } = response;
    
    // Extract error message from backend response
    // Backend returns { ok: false, message: "..." }
    const errorMessage = data?.message || 'An error occurred';

    // Handle 401 - Unauthorized (token expired/invalid)
    // Only show toast for 401 if it's not a login/signup request
    // Also don't show for /auth/user during initial load (handled by AuthContext)
    if (status === 401) {
      const requestUrl = request?.responseURL || request?.config?.url || '';
      const isAuthRequest = requestUrl.includes('/auth/login') || 
                           requestUrl.includes('/auth/signup');
      const isGetUserRequest = requestUrl.includes('/auth/user') && 
                              request?.config?.method === 'get';
      
      // Only show toast and clear token for non-auth endpoints
      // /auth/user 401 is handled silently by AuthContext (token will be cleared there)
      if (!isAuthRequest && !isGetUserRequest) {
        localStorage.removeItem('auth_token');
        toast.error('Session expired. Please login again.');
      }
      // For login/signup 401, let the component handle the error message
      // For /auth/user 401, let AuthContext handle it silently
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (status >= 400) {
      // For 400 errors, show the backend message
      // Note: Components may also show toasts, but this ensures user sees backend errors
      // The component-level error handling will prevent duplicate toasts for auth flows
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

