import {apiClient} from './client';
import {Message, Conversation} from '../../types/message';

export interface SendMessageRequest {
  job_id?: string;
  receiver_id: string;
  content: string;
}

export const messagesApi = {
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get('/messages/conversations');
    return response.data;
  },

  async getMessages(jobId?: string, userId?: string): Promise<Message[]> {
    const params: any = {};
    if (jobId) params.job_id = jobId;
    if (userId) params.user_id = userId;
    const response = await apiClient.get('/messages', {params});
    return response.data;
  },

  async sendMessage(data: SendMessageRequest): Promise<Message> {
    const response = await apiClient.post('/messages', data);
    return response.data;
  },

  async markAsRead(messageId: string): Promise<void> {
    await apiClient.put(`/messages/${messageId}/read`);
  },

  async markConversationAsRead(userId: string, jobId?: string): Promise<void> {
    await apiClient.put('/messages/conversations/read', {
      user_id: userId,
      job_id: jobId,
    });
  },
};

