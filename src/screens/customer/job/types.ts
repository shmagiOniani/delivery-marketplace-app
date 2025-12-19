/**
 * Type definitions for the multi-step job creation form
 */

import type { JobPurpose, PaymentType } from '@/types';

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

export interface ContactInfo {
  name: string;
  phone: string;
}

export interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface JobFormState {
  // Step 1: Job Type & Title
  jobType: JobPurpose | null;
  title: string;

  // Step 2: Pickup Location
  pickupLocation: LocationData | null;
  pickupContact: ContactInfo;
  pickupNotes: string;
  pickupFloor: string;
  pickupElevator: boolean;
  pickupPhotos: string[];

  // Step 3: Delivery Location
  deliveryLocation: LocationData | null;
  deliveryContact: ContactInfo;
  deliveryNotes: string;
  deliveryFloor: string;
  deliveryElevator: boolean;
  selectedRecyclingCenter: RecyclingCenter | null;

  // Step 4: Item Details
  description: string;
  itemCategory: string;
  itemSize: string;
  itemWeight: string;
  requiresHelp: boolean;
  customerPrice: number;
  paymentType: PaymentType;
  scheduledPickup: Date | null;
}

export interface JobFormErrors {
  jobType?: string;
  title?: string;
  pickupLocation?: string;
  pickupContact?: string;
  pickupPhotos?: string;
  deliveryLocation?: string;
  deliveryContact?: string;
  description?: string;
  customerPrice?: string;
  scheduledPickup?: string;
}

export interface StepValidation {
  isValid: boolean;
  errors: Partial<JobFormErrors>;
}

export interface PricingBreakdown {
  customerPrice: number;
  platformFee: number;
  driverPayout: number;
}

export const RECYCLING_CENTERS: RecyclingCenter[] = [
  {
    id: '1',
    name: 'Central Recycling Center',
    address: 'Tbilisi, Vazha-Pshavela Ave 71',
    lat: 41.7225,
    lng: 44.7755,
  },
  {
    id: '2',
    name: 'Saburtalo Recycling Point',
    address: 'Tbilisi, Pekini Ave 34',
    lat: 41.7194,
    lng: 44.7514,
  },
  {
    id: '3',
    name: 'Gldani Waste Management',
    address: 'Tbilisi, Gldani District',
    lat: 41.7525,
    lng: 44.7941,
  },
  {
    id: '4',
    name: 'Isani Recycling Facility',
    address: 'Tbilisi, Kakheti Highway',
    lat: 41.6938,
    lng: 44.8433,
  },
];

