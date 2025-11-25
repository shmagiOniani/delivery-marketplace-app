import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {messagesApi} from '../services/api/messages';
import {Message} from '../types/message';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagesApi.getConversations(),
  });
};

export const useMessages = (jobId?: string, userId?: string) => {
  return useQuery({
    queryKey: ['messages', jobId, userId],
    queryFn: () => messagesApi.getMessages(jobId, userId),
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['messages']});
      queryClient.invalidateQueries({queryKey: ['conversations']});
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['messages']});
      queryClient.invalidateQueries({queryKey: ['conversations']});
    },
  });
};

