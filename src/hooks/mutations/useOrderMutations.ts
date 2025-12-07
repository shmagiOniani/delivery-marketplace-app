import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { showErrorAlert, showSuccessAlert } from '@/lib/utils/errorHandler';
import type { Job } from '@/types';

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post<{
        success: boolean;
        data: Job;
        error?: string;
        reasons?: string[];
      }>('/api/jobs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      if (response.reasons && response.reasons.length > 0) {
        showErrorAlert(
          {
            message: 'Order created but flagged for moderation',
            reasons: response.reasons,
          },
          'Content Moderation Alert'
        );
      } else {
        showSuccessAlert('Order created successfully!');
      }
    },
    onError: (error: any) => {
      if (error.reasons && error.reasons.length > 0) {
        showErrorAlert(
          {
            message: error.message || 'Failed to create order',
            reasons: error.reasons,
          },
          'Order Creation Failed'
        );
      } else {
        showErrorAlert(error, 'Failed to create order');
      }
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
      const response = await apiClient.delete<{ success: boolean }>(`/api/jobs/${jobId}`);
      return response;
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

