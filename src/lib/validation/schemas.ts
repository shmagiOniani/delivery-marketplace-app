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
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const orderStep1Schema = z.object({
  itemType: z.enum(['food', 'package', 'furniture', 'other'], {
    required_error: 'Please select an item type',
  }),
});

export const orderStep2Schema = z.object({
  pickupAddress: z.string().min(1, 'Pickup address is required'),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  pickupLatitude: z.number(),
  pickupLongitude: z.number(),
  deliveryLatitude: z.number(),
  deliveryLongitude: z.number(),
});

export const orderStep3Schema = z.object({
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  itemSize: z.enum(['small', 'medium', 'large', 'xlarge'], {
    required_error: 'Please select item size',
  }),
  floor: z.number().min(0).optional(),
  hasElevator: z.boolean().optional(),
});

export const orderStep4Schema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  scheduledAt: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type OrderStep1FormData = z.infer<typeof orderStep1Schema>;
export type OrderStep2FormData = z.infer<typeof orderStep2Schema>;
export type OrderStep3FormData = z.infer<typeof orderStep3Schema>;
export type OrderStep4FormData = z.infer<typeof orderStep4Schema>;

