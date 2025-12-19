/**
 * Job/Order API Service
 * Handles all job-related API calls
 */

import apiClient from './client';
import type { Job } from '@/types';

export interface CreateJobResult {
  success: boolean;
  data: Job;
  error?: string;
  reasons?: string[]; // Moderation/ban reasons if flagged
}

export interface UpdateJobStatusPayload {
  status: Job['status'];
}

export interface JobListParams {
  status?: string;
  limit?: number;
  offset?: number;
  job_type?: string;
}

/**
 * Create a new job
 * Uses FormData for multipart/form-data submission (supports file uploads)
 */
export const createJob = async (formData: FormData): Promise<CreateJobResult> => {
  try {
    const response = await apiClient.post<CreateJobResult>(
      '/api/jobs',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response;
  } catch (error: any) {
    // Re-throw with structured error info
    throw {
      message: error.message || 'Failed to create job',
      error: error.error,
      reasons: error.reasons,
      status: error.status,
    };
  }
};

/**
 * Get a single job by ID
 */
export const getJob = async (jobId: string): Promise<Job> => {
  try {
    const response = await apiClient.get<{ data: Job }>(`/api/jobs/${jobId}`);
    return response.data;
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to fetch job',
      status: error.status,
    };
  }
};

/**
 * Get list of jobs with optional filters
 */
export const getJobs = async (params?: JobListParams): Promise<{
  data: Job[];
  total?: number;
  limit?: number;
  offset?: number;
}> => {
  try {
    const response = await apiClient.get<{
      data: Job[];
      total?: number;
      limit?: number;
      offset?: number;
    }>('/api/jobs', {
      params: {
        status: params?.status,
        limit: params?.limit || 20,
        offset: params?.offset || 0,
        job_type: params?.job_type,
      },
    });
    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to fetch jobs',
      status: error.status,
    };
  }
};

/**
 * Update job status
 */
export const updateJobStatus = async (
  jobId: string,
  payload: UpdateJobStatusPayload
): Promise<Job> => {
  try {
    const response = await apiClient.put<{ data: Job }>(
      `/api/jobs/${jobId}`,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to update job status',
      status: error.status,
    };
  }
};

/**
 * Delete/cancel a job
 */
export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    await apiClient.delete<{ success: boolean }>(`/api/jobs/${jobId}`);
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to delete job',
      status: error.status,
    };
  }
};

/**
 * Apply to a job (for drivers)
 */
export const applyToJob = async (jobId: string): Promise<void> => {
  try {
    await apiClient.post<{ success: boolean; message: string }>(
      `/api/jobs/${jobId}/apply`,
      {}
    );
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to apply to job',
      status: error.status,
    };
  }
};

/**
 * Accept a driver application (for customers)
 */
export const acceptApplication = async (
  jobId: string,
  driverId: string
): Promise<Job> => {
  try {
    const response = await apiClient.post<{ data: Job }>(
      `/api/jobs/${jobId}/accept`,
      { driver_id: driverId }
    );
    return response.data;
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to accept application',
      status: error.status,
    };
  }
};

