import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from '@/lib/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create Axios Instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies (refresh token)
  timeout: 30000, // 30 seconds for sluggish local compilation
});

// Flag to prevent infinite refresh loops
let isRefreshing = false;
// Queue for failed requests while token is refreshing
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach Request ID for tracing
    config.headers['X-Request-ID'] = uuidv4();

    const { accessToken } = useAuthStore.getState();
    const token = accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Always send cookies — Payload can authenticate via cookie when no Bearer token
    config.withCredentials = true;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized (Token Expiry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint directly to avoid circular dependency
        // We use a separate axios instance or fetch to avoid interceptors
        const { data } = await axios.post(
          '/api/auth/refresh-token',
          {},
          { withCredentials: true, timeout: 15000 }
        );

        if (data.success && data.data.accessToken) {
          const newAccessToken = data.data.accessToken;
          
          // Update store
          useAuthStore.getState().setAccessToken(newAccessToken);
          
          // Process queued requests
          processQueue(null, newAccessToken);
          
          // Retry original
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        } else {
          throw new Error('Refresh failed');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear auth state and redirect
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize Error Response
    if (error.response?.data) {
      const errorData = error.response.data as any;
      return Promise.reject({
        success: false,
        status: error.response.status,
        message: errorData.message || 'An unexpected error occurred',
        errors: errorData.errors || [],
      });
    }

    // Network Errors
    return Promise.reject({
      success: false,
      status: 0,
      message: error.message || 'Network Error',
    });
  }
);
