import { Alert } from 'react-native';
import type { ApiError } from '@/types';
import axios from 'axios';

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;
    return apiError?.error || apiError?.message || error.message || 'Network error occurred';
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const apiError = error as ApiError;
    return apiError.error || apiError.message || 'An error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

export const showErrorAlert = (error: unknown, title: string = 'Error'): void => {
  let message = handleApiError(error);
  
  // Handle moderation reasons if present
  if (error && typeof error === 'object' && 'reasons' in error) {
    const apiError = error as ApiError;
    if (apiError.reasons && apiError.reasons.length > 0) {
      message = `${message}\n\nModeration reasons:\n${apiError.reasons.join('\n')}`;
    }
  }

  Alert.alert(title, message);
};

export const showSuccessAlert = (
  message: string,
  title: string = 'Success'
): void => {
  Alert.alert(title, message);
};

