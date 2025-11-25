export type PaymentStatus = 'pending' | 'held' | 'released' | 'refunded';

export interface Payment {
  id: string;
  job_id: string;
  customer_id: string;
  driver_id?: string;
  amount: number;
  platform_fee: number;
  driver_payout: number;
  status: PaymentStatus;
  stripe_payment_intent_id?: string;
  stripe_transfer_id?: string;
  created_at: string;
  updated_at: string;
  job?: {
    id: string;
    title: string;
    customer_price: number;
  };
  customer?: {
    id: string;
    full_name: string;
  };
  driver?: {
    id: string;
    full_name: string;
  };
}

