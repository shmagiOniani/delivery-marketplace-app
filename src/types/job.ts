export type JobType = 'move' | 'recycle' | 'gift';
export type JobStatus = 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
export type ItemSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface Job {
  id: string;
  customer_id: string;
  driver_id?: string;
  type: JobType;
  title: string;
  description?: string;
  item_category?: string;
  item_size: ItemSize;
  item_weight?: number;
  requires_help: boolean;
  number_of_helpers?: number;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  pickup_contact_name?: string;
  pickup_contact_phone?: string;
  pickup_notes?: string;
  pickup_photos?: string[];
  scheduled_pickup_time?: string;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  delivery_contact_name?: string;
  delivery_contact_phone?: string;
  delivery_notes?: string;
  delivery_photos?: string[];
  customer_price: number;
  driver_payout: number;
  platform_fee: number;
  status: JobStatus;
  distance_km?: number;
  estimated_duration_minutes?: number;
  created_at: string;
  updated_at: string;
  customer?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    rating?: number;
  };
  driver?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    rating?: number;
    vehicle_type?: string;
  };
  payment_status?: 'pending' | 'held' | 'released' | 'refunded';
  rating?: {
    id: string;
    rating: number;
    comment?: string;
    created_at: string;
  };
}

