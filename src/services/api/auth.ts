import {apiClient} from './client';
import {User} from '../../types/user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  full_name: string;
  role: 'customer' | 'driver';
}

export const authApi = {
  async login(data: LoginRequest): Promise<{user: User; token: string}> {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  async signup(data: SignupRequest): Promise<{user: User; token: string}> {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};

