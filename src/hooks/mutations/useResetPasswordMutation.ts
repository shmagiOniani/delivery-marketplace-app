import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import apiClient from '@/lib/api/client';
import { showErrorAlert, showSuccessAlert } from '@/lib/utils/errorHandler';

interface ResetPasswordResponse {
  message: string;
}

interface ResetPasswordParams {
  password: string;
  token?: string; // Optional - required for email reset, not needed if authenticated
}

export const useResetPasswordMutation = () => {
  const navigation = useNavigation();

  return useMutation({
    mutationFn: async ({ password, token }: ResetPasswordParams) => {
      const body: { password: string; token?: string } = { password };
      if (token) {
        body.token = token;
      }

      const response = await apiClient.post<ResetPasswordResponse>(
        '/api/auth/reset-password',
        body
      );
      return response;
    },
    onSuccess: () => {
      showSuccessAlert('Password has been reset successfully');
      // Navigate to login after successful reset
      setTimeout(() => {
        navigation.navigate('Auth', { screen: 'Login' } as any);
      }, 1500);
    },
    onError: (error) => {
      showErrorAlert(error, 'Failed to reset password');
    },
  });
};

