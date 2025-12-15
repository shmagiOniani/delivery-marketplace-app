import { create } from 'zustand';

export type JobType = 'move' | 'recycle' | 'gift';
export type PaymentType = 'CASH' | 'ONLINE_PAYMENT';
export type WeightOption = 'light' | 'medium' | 'heavy';
export type SizeOption = 'small' | 'medium' | 'large' | 'xlarge';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface OrderFormData {
  // Step 1: Job Type & Title
  jobType: JobType | null;
  title: string;
  
  // Step 2: Pickup Location
  pickupLocation: Location | null;
  pickupContactName: string;
  pickupContactPhone: string;
  pickupNotes: string;
  pickupFloor: string;
  pickupElevator: boolean;
  pickupPhotos: string[];
  
  // Step 3: Delivery Location
  deliveryLocation: Location | null;
  selectedRecyclingLocation: string;
  deliveryContactName: string;
  deliveryContactPhone: string;
  deliveryNotes: string;
  deliveryFloor: string;
  deliveryElevator: boolean;
  
  // Step 4: Item Details
  description: string;
  item_category?: string;
  item_size?: SizeOption | null;
  item_weight?: WeightOption | null;
  requires_help: boolean;
  customer_price: string;
  scheduled_pickup?: string;
  
  // Step 5: Payment & Review
  paymentType: PaymentType;
  
  // Calculated fields
  distance?: number;
  timeEstimate?: number;
  platform_fee?: number;
  driver_payout?: number;
}

interface OrderFormState {
  formData: OrderFormData;
  currentStep: number;
  resetForm: () => void;
  updateFormData: (data: Partial<OrderFormData>) => void;
  setCurrentStep: (step: number) => void;
}

const initialFormData: OrderFormData = {
  jobType: null,
  title: '',
  pickupLocation: null,
  pickupContactName: '',
  pickupContactPhone: '',
  pickupNotes: '',
  pickupFloor: '',
  pickupElevator: false,
  pickupPhotos: [],
  deliveryLocation: null,
  selectedRecyclingLocation: '',
  deliveryContactName: '',
  deliveryContactPhone: '',
  deliveryNotes: '',
  deliveryFloor: '',
  deliveryElevator: false,
  description: '',
  item_size: null,
  item_weight: null,
  requires_help: false,
  customer_price: '',
  paymentType: 'ONLINE_PAYMENT',
};

export const useOrderFormStore = create<OrderFormState>((set) => ({
  formData: initialFormData,
  currentStep: 1,
  
  resetForm: () => {
    set({ formData: initialFormData, currentStep: 1 });
  },
  
  updateFormData: (data: Partial<OrderFormData>) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },
  
  setCurrentStep: (step: number) => {
    set({ currentStep: step });
  },
}));
