import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export interface Application {
  id: string;
  job_id: string;
  driver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string | null;
  driver_price?: number | null;
  proposed_pickup_date?: string | null;
  applied_at: string;
  driver: {
    id: string;
    full_name: string;
    rating: number;
    avatar_url?: string | null;
    phone?: string | null;
    driver_profile?: {
      vehicle_type?: string | null;
      is_verified: boolean;
    } | null;
  };
}

export const useApplicationsQuery = (jobId: string) => {
  return useQuery({
    queryKey: ['applications', jobId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Application[] }>(
        `/api/jobs/${jobId}/applications`
      );
      return response.data || [];
    },
    enabled: !!jobId,
    staleTime: 30000,
  });
};

