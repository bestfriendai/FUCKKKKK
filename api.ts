/**
 * API service for making HTTP requests
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { STORAGE_KEYS } from '../utils/storage';

// API configuration
const API_CONFIG = {
  BASE_URL: 'https://api.whattodoai.com/v1',
  TIMEOUT: 30000, // 30 seconds
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Implement token refresh logic here if needed
        // For now, just reject and let the auth service handle logout
        return Promise.reject(error);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Generic GET request
 * @param url - API endpoint
 * @param params - Query parameters
 * @param config - Additional axios config
 * @returns Promise with response data
 */
export const get = async <T>(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.get<T>(url, { ...config, params });
  return response.data;
};

/**
 * Generic POST request
 * @param url - API endpoint
 * @param data - Request body
 * @param config - Additional axios config
 * @returns Promise with response data
 */
export const post = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
};

/**
 * Generic PUT request
 * @param url - API endpoint
 * @param data - Request body
 * @param config - Additional axios config
 * @returns Promise with response data
 */
export const put = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
};

/**
 * Generic PATCH request
 * @param url - API endpoint
 * @param data - Request body
 * @param config - Additional axios config
 * @returns Promise with response data
 */
export const patch = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
};

/**
 * Generic DELETE request
 * @param url - API endpoint
 * @param config - Additional axios config
 * @returns Promise with response data
 */
export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
};

/**
 * Upload a file
 * @param url - API endpoint
 * @param file - File to upload
 * @param fieldName - Form field name (default: 'file')
 * @param additionalData - Additional form data
 * @returns Promise with response data
 */
export const uploadFile = async <T>(
  url: string,
  file: File,
  fieldName: string = 'file',
  additionalData?: Record<string, any>
): Promise<T> => {
  const formData = new FormData();
  formData.append(fieldName, file);
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }
  
  const response = await apiClient.post<T>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export default {
  get,
  post,
  put,
  patch,
  del,
  uploadFile,
  apiClient,
};