import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  full_name: z.string().min(1, 'Full name is required').optional(),
  role: z.enum(['customer', 'driver'], {
    required_error: 'Please select a role',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const orderStep1Schema = z.object({
  job_type: z.enum(['move', 'recycle', 'gift'], {
    required_error: 'Please select a job type',
  }),
  title: z.string().min(1, 'Title is required'),
});

export const orderStep2Schema = z.object({
  pickup_address: z.string().min(1, 'Pickup address is required'),
  pickup_lat: z.number(),
  pickup_lng: z.number(),
  pickup_contact_name: z.string().optional(),
  pickup_contact_phone: z.string().optional(),
  pickup_notes: z.string().optional(),
  delivery_address: z.string().min(1, 'Delivery address is required'),
  delivery_lat: z.number(),
  delivery_lng: z.number(),
  delivery_contact_name: z.string().optional(),
  delivery_contact_phone: z.string().optional(),
  delivery_notes: z.string().optional(),
});

export const orderStep3Schema = z.object({
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  item_category: z.string().optional(),
  item_size: z.string().optional(),
  item_weight: z.string().optional(),
  requires_help: z.boolean().default(false),
});

export const orderStep4Schema = z.object({
  customer_price: z.number().min(0, 'Price must be positive'),
  driver_payout: z.number().min(0, 'Payout must be positive'),
  platform_fee: z.number().min(0, 'Platform fee must be positive'),
  payment_type: z.enum(['CASH', 'ONLINE_PAYMENT'], {
    required_error: 'Please select payment type',
  }),
  scheduled_pickup: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type OrderStep1FormData = z.infer<typeof orderStep1Schema>;
export type OrderStep2FormData = z.infer<typeof orderStep2Schema>;
export type OrderStep3FormData = z.infer<typeof orderStep3Schema>;
export type OrderStep4FormData = z.infer<typeof orderStep4Schema>;

