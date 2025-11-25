import {z} from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirm_password: z.string(),
  role: z.enum(['customer', 'driver']),
  terms_accepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

export const createJobSchema = z.object({
  type: z.enum(['move', 'recycle', 'gift']),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  item_category: z.string().min(1, 'Item category is required'),
  item_size: z.enum(['small', 'medium', 'large', 'xlarge']),
  item_weight: z.number().positive().optional(),
  requires_help: z.boolean(),
  number_of_helpers: z.number().int().min(0).optional(),
  pickup_address: z.string().min(1, 'Pickup address is required'),
  pickup_latitude: z.number(),
  pickup_longitude: z.number(),
  pickup_contact_name: z.string().optional(),
  pickup_contact_phone: phoneSchema.optional().or(z.literal('')),
  pickup_notes: z.string().optional(),
  delivery_address: z.string().min(1, 'Delivery address is required'),
  delivery_latitude: z.number(),
  delivery_longitude: z.number(),
  delivery_contact_name: z.string().optional(),
  delivery_contact_phone: phoneSchema.optional().or(z.literal('')),
  delivery_notes: z.string().optional(),
  customer_price: z.number().positive('Price must be greater than 0'),
});

