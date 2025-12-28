import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { showErrorAlert } from '@/lib/utils/errorHandler';
import type { Message } from '@/types';

interface SendMessageParams {
  jobId?: string;
  chatId?: string;
  content: string;
}

interface MarkAsReadParams {
  jobId?: string;
  chatId?: string;
}

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, chatId, content }: SendMessageParams) => {
      if (jobId) {
        const response = await apiClient.post<{ success: boolean; data: Message }>(
          '/messages',
          { jobId, content }
        );
        return response;
      } else if (chatId) {
        const response = await apiClient.post<{ success: boolean; data: Message }>(
          `/chats/${chatId}/messages`,
          { content }
        );
        return response;
      }
      throw new Error('Either jobId or chatId is required');
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['messages', variables.jobId, variables.chatId],
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      showErrorAlert(error, 'Failed to send message');
    },
  });
};

export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, chatId }: MarkAsReadParams) => {
      const response = await apiClient.put<{ success: boolean }>(
        '/messages/read',
        { jobId, chatId }
      );
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['messages', variables.jobId, variables.chatId],
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      console.log(error)
      // Silent fail for mark as read
      console.error('Failed to mark messages as read');
    },
  });
};

export const useMessageMutations = () => {
  return {
    sendMessage: useSendMessageMutation(),
    markAsRead: useMarkAsReadMutation(),
  };
};

