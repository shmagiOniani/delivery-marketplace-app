export type UserRole = 'customer' | 'driver' | 'admin';

export type JobStatus =
  | 'pending'
  | 'accepted'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'banned'
  | 'ready_for_verification'
  | 'done';

export type JobPurpose = 'move' | 'recycle' | 'gift';

export type PaymentType = 'CASH' | 'ONLINE_PAYMENT';

export type PaymentStatus = 'pending' | 'held' | 'released' | 'refunded';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  rating?: number;
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
  driver_id: string | null;
  title: string;
  description: string | null;
  status: JobStatus;
  job_type: JobPurpose;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  pickup_contact_name: string | null;
  pickup_contact_phone: string | null;
  pickup_notes: string | null;
  pickup_photos: string[] | null;
  delivery_address: string;
  delivery_lat: number;
  delivery_lng: number;
  delivery_contact_name: string | null;
  delivery_contact_phone: string | null;
  delivery_notes: string | null;
  delivery_photos: string[] | null;
  item_category: string | null;
  item_size: string | null;
  item_weight: string | null;
  requires_help: boolean;
  customer_price: number;
  driver_payout: number;
  platform_fee: number;
  payment_type: PaymentType;
  pickup_time: string | null;
  delivery_time: string | null;
  scheduled_pickup: string | null;
  created_at: string;
  updated_at: string;
  customer?: {
    id: string;
    full_name: string;
    rating: number;
    avatar_url: string | null;
    phone: string | null;
  } | null;
  driver?: {
    id: string;
    full_name: string;
    rating: number;
    avatar_url: string | null;
  } | null;
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
  customer_id: string;
  driver_id: string | null;
  amount: number;
  status: PaymentStatus;
  stripe_payment_intent_id: string | null;
  stripe_transfer_id: string | null;
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
  error?: string;
  reasons?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  limit?: number;
  offset?: number;
}

