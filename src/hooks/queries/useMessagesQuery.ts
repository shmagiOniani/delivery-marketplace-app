import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import type { Message } from '@/types';

interface UseMessagesQueryParams {
  jobId?: string;
  chatId?: string;
}

export const useMessagesQuery = ({ jobId, chatId }: UseMessagesQueryParams) => {
  return useQuery({
    queryKey: ['messages', jobId, chatId],
    queryFn: async () => {
      if (jobId) {
        const response = await apiClient.get<{ data: Message[] }>(
          `/api/messages?jobId=${jobId}`
        );
        return response.data || [];
      } else if (chatId) {
        const response = await apiClient.get<{ data: Message[] }>(
          `/api/chats/${chatId}/messages`
        );
        return response.data || [];
      }
      return [];
    },
    enabled: !!(jobId || chatId),
    staleTime: 0, // Always fetch fresh data
    refetchInterval: false, // Don't auto-refetch, we'll handle it with WebSocket/polling
  });
};

