import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { showErrorAlert, showSuccessAlert } from '@/lib/utils/errorHandler';
import type { Job } from '@/types';

interface CreateJobRequest {
  title: string;
  description?: string;
  job_type?: 'move' | 'recycle' | 'gift';
  pickup_address: string;
  pickup_lat: number | string;
  pickup_lng: number | string;
  pickup_contact_name?: string;
  pickup_contact_phone?: string;
  pickup_notes?: string;
  pickup_photos?: string[];
  delivery_address: string;
  delivery_lat: number | string;
  delivery_lng: number | string;
  delivery_contact_name?: string;
  delivery_contact_phone?: string;
  delivery_notes?: string;
  item_category?: string;
  item_size?: string;
  item_weight?: string;
  requires_help?: boolean | string;
  customer_price: number | string;
  driver_payout: number | string;
  platform_fee: number | string;
  payment_type: 'CASH' | 'ONLINE_PAYMENT';
  scheduled_pickup?: string;
}

interface CreateJobResponse {
  success: boolean;
  data: Job;
  error?: string;
  reasons?: string[];
}

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobData: CreateJobRequest): Promise<CreateJobResponse> => {
      // Ensure platform_fee is 0 for CASH payments (API will also enforce this)
      const finalJobData = {
        ...jobData,
        platform_fee: jobData.payment_type === 'CASH' ? 0 : jobData.platform_fee,
      };

      const response = await apiClient.post<CreateJobResponse>(
        '/jobs',
        finalJobData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      // Don't show error alert for moderation - let the screen handle it
      // The job is still created, just flagged
      if (!response.reasons || response.reasons.length === 0) {
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
        `/jobs/${jobId}`,
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
      const response = await apiClient.delete<{ success: boolean }>(`/jobs/${jobId}`);
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

export const useOrderMutations = () => {
  return {
    createOrder: useCreateOrderMutation(),
    updateOrderStatus: useUpdateOrderStatusMutation(),
    cancelOrder: useCancelOrderMutation(),
  };
};

