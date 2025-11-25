import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {jobsApi} from '../services/api/jobs';
import {Job} from '../types/job';

export const useJobs = (params?: {
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsApi.getJobs(params),
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getJobById(id),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsApi.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['jobs']});
    },
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, status}: {id: string; status: any}) =>
      jobsApi.updateJobStatus(id, {status}),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['jobs']});
      queryClient.invalidateQueries({queryKey: ['job', variables.id]});
    },
  });
};

export const useCancelJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsApi.cancelJob,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['jobs']});
    },
  });
};

export const useAvailableJobs = (params?: {
  type?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['availableJobs', params],
    queryFn: () => jobsApi.getAvailableJobs(params),
  });
};

export const useApplyForJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsApi.applyForJob,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['availableJobs']});
    },
  });
};

export const useAcceptJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsApi.acceptJob,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['availableJobs']});
      queryClient.invalidateQueries({queryKey: ['jobs']});
    },
  });
};

