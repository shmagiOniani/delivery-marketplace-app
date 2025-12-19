/**
 * Custom hook for managing job creation form state and validation
 */

import { useState } from 'react';
import type {
  JobFormState,
  JobFormErrors,
  StepValidation,
  LocationData,
  ContactInfo,
  RecyclingCenter,
  PricingBreakdown,
} from '../types';
import type { JobPurpose, PaymentType } from '@/types';

const INITIAL_STATE: JobFormState = {
  jobType: null,
  title: '',
  pickupLocation: null,
  pickupContact: { name: '', phone: '' },
  pickupNotes: '',
  pickupFloor: '',
  pickupElevator: false,
  pickupPhotos: [],
  deliveryLocation: null,
  deliveryContact: { name: '', phone: '' },
  deliveryNotes: '',
  deliveryFloor: '',
  deliveryElevator: false,
  selectedRecyclingCenter: null,
  description: '',
  itemCategory: '',
  itemSize: '',
  itemWeight: '',
  requiresHelp: false,
  customerPrice: 0,
  paymentType: 'CASH',
  scheduledPickup: null,
};

export const useJobForm = () => {
  const [formState, setFormState] = useState<JobFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<JobFormErrors>({});

  // Update individual fields
  const updateField = <K extends keyof JobFormState>(
    field: K,
    value: JobFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof JobFormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof JobFormErrors];
        return newErrors;
      });
    }
  };

  // Validation functions
  const validateStep1 = (): StepValidation => {
    const stepErrors: Partial<JobFormErrors> = {};

    if (!formState.jobType) {
      stepErrors.jobType = 'Please select a job type';
    }

    if (!formState.title.trim()) {
      stepErrors.title = 'Title is required';
    } else if (formState.title.trim().length < 3) {
      stepErrors.title = 'Title must be at least 3 characters';
    } else if (formState.title.trim().length > 100) {
      stepErrors.title = 'Title must be less than 100 characters';
    }

    return {
      isValid: Object.keys(stepErrors).length === 0,
      errors: stepErrors,
    };
  };

  const validateStep2 = (): StepValidation => {
    const stepErrors: Partial<JobFormErrors> = {};

    if (!formState.pickupLocation) {
      stepErrors.pickupLocation = 'Pickup location is required';
    }

    // Validate pickup contact
    if (!formState.pickupContact.name.trim()) {
      stepErrors.pickupContact = 'Contact name is required';
    }

    if (!formState.pickupContact.phone.trim()) {
      stepErrors.pickupContact = 'Contact phone is required';
    } else if (!/^\+?[0-9\s\-()]{9,}$/.test(formState.pickupContact.phone)) {
      stepErrors.pickupContact = 'Invalid phone number';
    }

    // Photos are recommended but not required
    if (formState.pickupPhotos.length === 0) {
      stepErrors.pickupPhotos = 'At least one photo is recommended';
    }

    return {
      isValid: Object.keys(stepErrors).length === 0,
      errors: stepErrors,
    };
  };

  const validateStep3 = (): StepValidation => {
    const stepErrors: Partial<JobFormErrors> = {};

    // Gift jobs skip delivery location
    if (formState.jobType === 'gift') {
      return { isValid: true, errors: {} };
    }

    // Recycle jobs require selecting a recycling center
    if (formState.jobType === 'recycle') {
      if (!formState.selectedRecyclingCenter) {
        stepErrors.deliveryLocation = 'Please select a recycling center';
      }
    } else {
      // Move jobs require full delivery location
      if (!formState.deliveryLocation) {
        stepErrors.deliveryLocation = 'Delivery location is required';
      }

      if (!formState.deliveryContact.name.trim()) {
        stepErrors.deliveryContact = 'Delivery contact name is required';
      }

      if (!formState.deliveryContact.phone.trim()) {
        stepErrors.deliveryContact = 'Delivery contact phone is required';
      } else if (!/^\+?[0-9\s\-()]{9,}$/.test(formState.deliveryContact.phone)) {
        stepErrors.deliveryContact = 'Invalid phone number';
      }
    }

    return {
      isValid: Object.keys(stepErrors).length === 0,
      errors: stepErrors,
    };
  };

  const validateStep4 = (): StepValidation => {
    const stepErrors: Partial<JobFormErrors> = {};

    if (!formState.description.trim()) {
      stepErrors.description = 'Item description is required';
    } else if (formState.description.trim().length < 10) {
      stepErrors.description = 'Description must be at least 10 characters';
    }

    // Gift jobs have no price
    if (formState.jobType !== 'gift') {
      if (formState.customerPrice <= 0) {
        stepErrors.customerPrice = 'Price must be greater than 0';
      } else if (formState.customerPrice < 5) {
        stepErrors.customerPrice = 'Minimum price is 5 GEL';
      } else if (formState.customerPrice > 10000) {
        stepErrors.customerPrice = 'Maximum price is 10,000 GEL';
      }
    }

    if (!formState.scheduledPickup) {
      stepErrors.scheduledPickup = 'Please select a pickup time';
    } else if (formState.scheduledPickup < new Date()) {
      stepErrors.scheduledPickup = 'Pickup time must be in the future';
    }

    return {
      isValid: Object.keys(stepErrors).length === 0,
      errors: stepErrors,
    };
  };

  // Calculate pricing breakdown
  const calculatePricing = (): PricingBreakdown => {
    // Gift jobs have no price
    if (formState.jobType === 'gift') {
      return {
        customerPrice: 0,
        platformFee: 0,
        driverPayout: 0,
      };
    }

    const customerPrice = formState.customerPrice;

    // Online payments: 15% platform fee
    // Cash payments: 0% platform fee
    const platformFeeRate = formState.paymentType === 'ONLINE_PAYMENT' ? 0.15 : 0;
    const platformFee = Math.round(customerPrice * platformFeeRate * 100) / 100;
    const driverPayout = Math.round((customerPrice - platformFee) * 100) / 100;

    return {
      customerPrice,
      platformFee,
      driverPayout,
    };
  };

  // Reset form
  const resetForm = () => {
    setFormState(INITIAL_STATE);
    setErrors({});
  };

  // Get step-specific errors
  const getStepErrors = (step: number): Partial<JobFormErrors> => {
    switch (step) {
      case 1:
        return validateStep1().errors;
      case 2:
        return validateStep2().errors;
      case 3:
        return validateStep3().errors;
      case 4:
        return validateStep4().errors;
      default:
        return {};
    }
  };

  return {
    formState,
    errors,
    updateField,
    validateStep1,
    validateStep2,
    validateStep3,
    validateStep4,
    calculatePricing,
    resetForm,
    getStepErrors,
    setErrors,
  };
};

