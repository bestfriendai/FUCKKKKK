import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_TIMEOUT } from '../config';
import { handleApiError } from '../utils/errorHandling';

/**
 * Configurable API client for making HTTP requests
 */
class ApiService {
  private instance: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configure request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      async (config) => {
        // Add auth token if available
        if (!this.authToken) {
          this.authToken = await AsyncStorage.getItem('auth_token');
        }

        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle token expiration
        if (error.response?.status === 401) {
          this.authToken = null;
          await AsyncStorage.removeItem('auth_token');
          // TODO: Redirect to login or refresh token
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set the authentication token for API requests
   */
  public setAuthToken(token: string | null): void {
    this.authToken = token;
    if (token) {
      AsyncStorage.setItem('auth_token', token);
    } else {
      AsyncStorage.removeItem('auth_token');
    }
  }

  /**
   * Make a GET request
   */
  public async get<T>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.get(url, {
        ...config,
        params,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, `GET request failed: ${url}`);
    }
  }

  /**
   * Make a POST request
   */
  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `POST request failed: ${url}`);
    }
  }

  /**
   * Make a PUT request
   */
  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.put(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `PUT request failed: ${url}`);
    }
  }

  /**
   * Make a PATCH request
   */
  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `PATCH request failed: ${url}`);
    }
  }

  /**
   * Make a DELETE request
   */
  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.delete(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `DELETE request failed: ${url}`);
    }
  }

  /**
   * Upload a file
   */
  public async uploadFile<T>(
    url: string,
    file: Blob | File,
    fieldName: string = 'file',
    additionalData?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      const response: AxiosResponse<T> = await this.instance.post(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error, `File upload failed: ${url}`);
    }
  }
}

export const apiService = new ApiService();
