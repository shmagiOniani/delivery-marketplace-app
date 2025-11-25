import {apiClient} from './client';
import {User} from '../../types/user';
import {Job} from '../../types/job';
import {Payment} from '../../types/payment';

export const adminApi = {
  async getUsers(params?: {
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<{users: User[]; total: number}> {
    const response = await apiClient.get('/admin/users', {params});
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },

  async getJobs(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{jobs: Job[]; total: number}> {
    const response = await apiClient.get('/admin/jobs', {params});
    return response.data;
  },

  async getPayments(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{payments: Payment[]; total: number}> {
    const response = await apiClient.get('/admin/payments', {params});
    return response.data;
  },

  async transferPayment(paymentId: string): Promise<Payment> {
    const response = await apiClient.post('/admin/transfer-payment', {
      payment_id: paymentId,
    });
    return response.data;
  },
};

