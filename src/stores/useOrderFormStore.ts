import { create } from 'zustand';

export type CargoType = 'small' | 'furniture' | 'documents' | 'household';

export type WeightOption = 'light' | 'medium' | 'heavy';
export type SizeOption = 'small' | 'medium' | 'large' | 'xlarge';

export interface PickupAddress {
  address: string;
  name: string;
  floor?: string;
  phone?: string;
}

export interface DeliveryAddress {
  address: string;
  name: string;
  floor?: string;
  phone?: string;
}

export interface OrderFormData {
  // Step 1
  cargoType: CargoType | null;
  
  // Step 2
  pickupAddress: PickupAddress | null;
  deliveryAddress: DeliveryAddress | null;
  distance?: number;
  timeEstimate?: number;
  
  // Step 3
  photos: string[];
  description: string;
  weight: WeightOption | null;
  size: SizeOption | null;
  fragile: boolean;
  
  // Step 4
  price?: number;
  serviceFee?: number;
  timePreference?: 'flexible' | 'specific';
  specificTime?: string;
}

interface OrderFormState {
  formData: OrderFormData;
  resetForm: () => void;
  updateFormData: (data: Partial<OrderFormData>) => void;
}

const initialFormData: OrderFormData = {
  cargoType: null,
  pickupAddress: null,
  deliveryAddress: null,
  photos: [],
  description: '',
  weight: null,
  size: null,
  fragile: false,
};

export const useOrderFormStore = create<OrderFormState>((set) => ({
  formData: initialFormData,
  
  resetForm: () => {
    set({ formData: initialFormData });
  },
  
  updateFormData: (data: Partial<OrderFormData>) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },
}));

