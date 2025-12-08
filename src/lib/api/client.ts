import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@env';
import { secureStorage } from '../storage/secureStorage';
import type { ApiError } from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL || 'https://carryo.ge/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const tokens = await secureStorage.getTokens();
        if (tokens.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const tokens = await secureStorage.getTokens();
            if (tokens.refreshToken) {
              const response = await axios.post(
                `${API_BASE_URL || 'https://your-domain.com/api'}/auth/refresh`,
                {
                  refresh_token: tokens.refreshToken,
                }
              );

              const { access_token, refresh_token } = response.data;
              await secureStorage.setTokens(access_token, refresh_token);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
              }

              return this.client(originalRequest);
            }
          } catch (refreshError) {
            await secureStorage.clearTokens();
            return Promise.reject(refreshError);
          }
        }

        const errorData = error.response?.data as
          | { error?: string; message?: string; reasons?: string[] }
          | undefined;

        const apiError: ApiError = {
          message:
            errorData?.error ||
            errorData?.message ||
            error.message ||
            'An error occurred',
          code: error.code,
          status: error.response?.status,
          error: errorData?.error,
          reasons: errorData?.reasons,
        };

        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config);
      console.log(url, ": ", response)
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
      console.log(url, ": ", response)
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
      console.log(url, ": ", response)
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
      console.log(url, ": ", response)
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
      console.log(url, ": ", response)
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;

