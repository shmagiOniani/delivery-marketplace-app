export const API_BASE_URL = process.env.API_BASE_URL || 'https://your-domain.com/api';

export const JOB_TYPES = {
  move: {
    label: 'Move',
    icon: 'truck',
  },
  recycle: {
    label: 'Recycle',
    icon: 'recycle',
  },
  gift: {
    label: 'Gift',
    icon: 'gift',
  },
} as const;

export const JOB_STATUSES = {
  pending: {
    label: 'Pending',
    color: '#F59E0B',
  },
  accepted: {
    label: 'Accepted',
    color: '#3B82F6',
  },
  in_transit: {
    label: 'In Transit',
    color: '#8B5CF6',
  },
  delivered: {
    label: 'Delivered',
    color: '#10B981',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#EF4444',
  },
} as const;

export const ITEM_SIZES = ['small', 'medium', 'large', 'xlarge'] as const;

export const VEHICLE_TYPES = ['car', 'van', 'truck', 'bike', 'other'] as const;

export const PLATFORM_FEE_PERCENTAGE = 0.1; // 10%

