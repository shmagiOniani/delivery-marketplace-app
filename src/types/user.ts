export type UserRole = 'customer' | 'driver' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DriverProfile extends User {
  role: 'driver';
  vehicle_type?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  license_plate?: string;
  drivers_license?: string;
  stripe_account_id?: string;
  stripe_account_status?: 'pending' | 'complete';
  availability_status: 'available' | 'unavailable';
  rating?: number;
  total_ratings?: number;
  total_completed_jobs?: number;
}

export interface CustomerProfile extends User {
  role: 'customer';
  rating?: number;
  total_ratings?: number;
}

