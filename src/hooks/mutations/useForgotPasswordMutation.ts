import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { showErrorAlert, showSuccessAlert } from '@/lib/utils/errorHandler';

interface ForgotPasswordResponse {
  message: string;
}

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post<ForgotPasswordResponse>(
        '/api/auth/forgot-password',
        { email }
      );
      return response;
    },
    onSuccess: () => {
      showSuccessAlert(
        'Password reset instructions have been sent to your email'
      );
    },
    onError: (error) => {
      showErrorAlert(error, 'Failed to send reset email');
    },
  });
};

