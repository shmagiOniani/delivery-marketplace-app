/**
 * Job Creation Module Exports
 * Centralized exports for the multi-step job creation feature
 */

// Main Screen
export { CreateJobScreen } from './CreateJobScreen';

// Step Components
export { Step1JobType } from './steps/Step1JobType';
export { Step2PickupLocation } from './steps/Step2PickupLocation';
export { Step3DeliveryLocation } from './steps/Step3DeliveryLocation';
export { Step4ItemDetails } from './steps/Step4ItemDetails';

// Shared Components
export { FormStepper } from './components/FormStepper';
export { MapPicker } from './components/MapPicker';
export { ReadOnlyMap } from './components/ReadOnlyMap';
export { PhotoUpload } from './components/PhotoUpload';

// Hooks
export { useJobForm } from './hooks/useJobForm';

// Types
export type {
  JobFormState,
  JobFormErrors,
  LocationData,
  ContactInfo,
  RecyclingCenter,
  StepValidation,
  PricingBreakdown,
} from './types';

export { RECYCLING_CENTERS } from './types';

