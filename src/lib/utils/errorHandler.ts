import { Alert } from 'react-native';
import type { ApiError } from '@/types';
import axios from 'axios';

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;
    return apiError?.message || error.message || 'Network error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

export const showErrorAlert = (error: unknown, title: string = 'Error'): void => {
  const message = handleApiError(error);
  Alert.alert(title, message);
};

export const showSuccessAlert = (
  message: string,
  title: string = 'Success'
): void => {
  Alert.alert(title, message);
};

