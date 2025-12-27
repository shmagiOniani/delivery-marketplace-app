import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

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
      const { data, error } = await supabase
        .from('job_applications')
        .select(
          `
          id,
          job_id,
          driver_id,
          status,
          message,
          driver_price,
          proposed_pickup_date,
          applied_at,
          driver:profiles!driver_id (
            id,
            full_name,
            rating,
            avatar_url,
            phone,
            driver_profile:driver_profiles (
              vehicle_type,
              is_verified
            )
          )
        `
        )
        .eq('job_id', jobId)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Application[];
    },
    enabled: !!jobId,
  });
};

