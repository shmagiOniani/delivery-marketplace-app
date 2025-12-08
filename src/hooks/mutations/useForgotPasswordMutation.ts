import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { showErrorAlert, showSuccessAlert } from '@/lib/utils/errorHandler';

interface ForgotPasswordResponse {
  message: string;
}

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => {
        console.log("ema", email)
      const response = await apiClient.post<ForgotPasswordResponse>(
        '/auth/forgot-password',
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
        console.log(error)
      showErrorAlert(error, 'Failed to send reset email');
    },
  });
};

