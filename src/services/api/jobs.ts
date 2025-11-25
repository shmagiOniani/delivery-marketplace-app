import {apiClient} from './client';
import {Job} from '../../types/job';

export interface CreateJobRequest {
  type: 'move' | 'recycle' | 'gift';
  title: string;
  description?: string;
  item_category: string;
  item_size: 'small' | 'medium' | 'large' | 'xlarge';
  item_weight?: number;
  requires_help: boolean;
  number_of_helpers?: number;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  pickup_contact_name?: string;
  pickup_contact_phone?: string;
  pickup_notes?: string;
  pickup_photos?: string[];
  scheduled_pickup_time?: string;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  delivery_contact_name?: string;
  delivery_contact_phone?: string;
  delivery_notes?: string;
  delivery_photos?: string[];
  customer_price: number;
}

export interface UpdateJobStatusRequest {
  status: 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
}

export const jobsApi = {
  async getJobs(params?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{jobs: Job[]; total: number}> {
    const response = await apiClient.get('/jobs', {params});
    return response.data;
  },

  async getJobById(id: string): Promise<Job> {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data;
  },

  async createJob(data: CreateJobRequest): Promise<Job> {
    const response = await apiClient.post('/jobs', data);
    return response.data;
  },

  async updateJobStatus(
    id: string,
    data: UpdateJobStatusRequest,
  ): Promise<Job> {
    const response = await apiClient.put(`/jobs/${id}/status`, data);
    return response.data;
  },

  async cancelJob(id: string): Promise<Job> {
    const response = await apiClient.delete(`/jobs/${id}`);
    return response.data;
  },

  async getAvailableJobs(params?: {
    type?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    page?: number;
    limit?: number;
  }): Promise<{jobs: Job[]; total: number}> {
    const response = await apiClient.get('/driver/jobs', {params});
    return response.data;
  },

  async applyForJob(id: string): Promise<void> {
    await apiClient.post(`/driver/jobs/${id}/apply`);
  },

  async acceptJob(id: string): Promise<Job> {
    const response = await apiClient.post(`/driver/jobs/${id}/accept`);
    return response.data;
  },
};

