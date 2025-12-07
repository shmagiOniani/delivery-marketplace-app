import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import type { Payment } from '@/types';

export const usePaymentQuery = (jobId: string) => {
  return useQuery({
    queryKey: ['payment', jobId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Payment }>(
        `/api/payments/job/${jobId}`
      );
      return response.data;
    },
    enabled: !!jobId,
    staleTime: 30000,
  });
};

