import {JobStatus, JobType} from '../types/job';

export const getStatusColor = (status: JobStatus): string => {
  const statusColors: Record<JobStatus, string> = {
    pending: '#F59E0B',
    accepted: '#3B82F6',
    in_transit: '#8B5CF6',
    delivered: '#10B981',
    cancelled: '#EF4444',
  };
  return statusColors[status];
};

export const getStatusLabel = (status: JobStatus): string => {
  const statusLabels: Record<JobStatus, string> = {
    pending: 'Pending',
    accepted: 'Accepted',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return statusLabels[status];
};

export const getJobTypeLabel = (type: JobType): string => {
  const typeLabels: Record<JobType, string> = {
    move: 'Move',
    recycle: 'Recycle',
    gift: 'Gift',
  };
  return typeLabels[type];
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

