export type UserRole = 'customer' | 'driver';

export type JobStatus =
  | 'pending'
  | 'active'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type ItemType = 'food' | 'package' | 'furniture' | 'other';

export type ItemSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

export interface Job {
  id: string;
  customer_id: string;
  driver_id?: string;
  item_type: ItemType;
  item_size: ItemSize;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  description?: string;
  images?: string[];
  price: number;
  platform_fee: number;
  driver_payout: number;
  status: JobStatus;
  distance_km?: number;
  estimated_duration_minutes?: number;
  floor?: number;
  has_elevator?: boolean;
  contact_name?: string;
  contact_phone?: string;
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
  customer?: User;
  driver?: User;
}

export interface Message {
  id: string;
  job_id: string;
  sender_id: string;
  content: string;
  image_url?: string;
  read: boolean;
  created_at: string;
  sender?: User;
}

export interface Payment {
  id: string;
  job_id: string;
  amount: number;
  platform_fee: number;
  driver_payout: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  driver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  driver?: User;
}

export interface RouteDistance {
  distance: number;
  duration: number;
  distance_km: number;
  duration_minutes: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  limit?: number;
  offset?: number;
}

