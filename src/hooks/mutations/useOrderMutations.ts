import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { showErrorAlert, showSuccessAlert } from '@/lib/utils/errorHandler';
import type { Job } from '@/types';

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post<{ data: Job }>('/api/jobs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      showSuccessAlert('Order created successfully!');
    },
    onError: (error) => {
      showErrorAlert(error, 'Failed to create order');
    },
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobId,
      status,
    }: {
      jobId: string;
      status: string;
    }) => {
      const response = await apiClient.put<{ data: Job }>(
        `/api/jobs/${jobId}`,
        { status }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', variables.jobId] });
      showSuccessAlert('Order status updated');
    },
    onError: (error) => {
      showErrorAlert(error, 'Failed to update order');
    },
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      await apiClient.delete(`/api/jobs/${jobId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      showSuccessAlert('Order cancelled');
    },
    onError: (error) => {
      showErrorAlert(error, 'Failed to cancel order');
    },
  });
};

