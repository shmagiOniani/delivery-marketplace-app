import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { showErrorAlert, showSuccessAlert } from '@/lib/utils/errorHandler';

interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

interface ConfirmPaymentResponse {
  success: boolean;
}

interface CapturePaymentResponse {
  success: boolean;
}

interface RefundPaymentResponse {
  success: boolean;
}

export const useCreatePaymentIntentMutation = () => {
  return useMutation({
    mutationFn: async ({
      job_id,
      amount,
    }: {
      job_id: string;
      amount: number;
    }) => {
      const response = await apiClient.post<CreatePaymentIntentResponse>(
        '/api/create-payment-intent',
        { job_id, amount }
      );
      return response;
    },
    onError: (error) => {
      showErrorAlert(error, 'Failed to create payment intent');
    },
  });
};

export const useConfirmPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payment_intent_id,
      job_id,
    }: {
      payment_intent_id: string;
      job_id: string;
    }) => {
      const response = await apiClient.post<ConfirmPaymentResponse>(
        '/api/confirm-payment',
        {
          payment_intent_id,
          job_id,
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      showSuccessAlert('Payment confirmed successfully');
    },
    onError: (error) => {
      showErrorAlert(error, 'Failed to confirm payment');
    },
  });
};

export const useCapturePaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (job_id: string) => {
      const response = await apiClient.post<CapturePaymentResponse>(
        '/api/capture-payment',
        { job_id }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      showSuccessAlert('Payment captured successfully');
    },
    onError: (error) => {
      showErrorAlert(error, 'Failed to capture payment');
    },
  });
};

export const useRefundPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobId,
      reason,
    }: {
      jobId: string;
      reason?: string;
    }) => {
      const response = await apiClient.post<RefundPaymentResponse>(
        '/api/refund-payment',
        { jobId, reason }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      showSuccessAlert('Payment refunded successfully');
    },
    onError: (error) => {
      showErrorAlert(error, 'Failed to refund payment');
    },
  });
};

