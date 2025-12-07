import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import type { Job } from '@/types';
import type { PaginatedResponse } from '@/types';

interface UseJobsQueryParams {
  status?: string;
  limit?: number;
  offset?: number;
}

export const useJobsQuery = (params?: UseJobsQueryParams) => {
  return useQuery({
    queryKey: ['jobs', params?.status, params?.limit, params?.offset],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Job>>('/api/jobs', {
        params: {
          status: params?.status,
          limit: params?.limit || 20,
          offset: params?.offset || 0,
        },
      });
      return response.data;
    },
    staleTime: 30000,
  });
};

export const useJobQuery = (jobId: string) => {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Job }>(`/api/jobs/${jobId}`);
      return response.data;
    },
    enabled: !!jobId,
    staleTime: 30000,
  });
};

