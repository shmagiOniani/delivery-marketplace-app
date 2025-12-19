/**
 * CreateJobScreen - Main multi-step job creation wizard
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { useJobForm } from './hooks/useJobForm';
import { FormStepper } from './components/FormStepper';
import { Step1JobType } from './steps/Step1JobType';
import { Step2PickupLocation } from './steps/Step2PickupLocation';
import { Step3DeliveryLocation } from './steps/Step3DeliveryLocation';
import { Step4ItemDetails } from './steps/Step4ItemDetails';
import { createJob } from '@/lib/api/jobs';
import { showErrorAlert, showSuccessAlert } from '@/lib/utils/errorHandler';
import type { CustomerStackParamList } from '@/types/navigation';

type NavigationProp = NativeStackNavigationProp<CustomerStackParamList>;

export const CreateJobScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
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
  } = useJobForm();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total steps (gift jobs skip delivery)
  const getTotalSteps = () => {
    return formState.jobType === 'gift' ? 3 : 4;
  };

  // Get the actual step number for navigation (accounting for skipped steps)
  const getActualStepNumber = (displayStep: number) => {
    if (formState.jobType === 'gift' && displayStep > 2) {
      return displayStep + 1; // Skip step 3 for gift jobs
    }
    return displayStep;
  };

  // Validate current step
  const validateCurrentStep = () => {
    const actualStep = getActualStepNumber(currentStep);
    let validation;

    switch (actualStep) {
      case 1:
        validation = validateStep1();
        break;
      case 2:
        validation = validateStep2();
        break;
      case 3:
        validation = validateStep3();
        break;
      case 4:
        validation = validateStep4();
        break;
      default:
        return true;
    }

    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }

    return true;
  };

  // Handle next step
  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  // Handle previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    Alert.alert(
      'Cancel Job Creation',
      'Are you sure you want to cancel? All progress will be lost.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            resetForm();
            navigation.goBack();
          },
        },
      ]
    );
  };

  // Prepare form data for submission
  const prepareFormData = (): FormData => {
    const formData = new FormData();
    const pricing = calculatePricing();

    // Step 1: Job type and title
    formData.append('job_type', formState.jobType!);
    formData.append('title', formState.title.trim());

    // Step 2: Pickup location
    formData.append('pickup_address', formState.pickupLocation!.address);
    formData.append('pickup_lat', formState.pickupLocation!.lat.toString());
    formData.append('pickup_lng', formState.pickupLocation!.lng.toString());
    formData.append('pickup_contact_name', formState.pickupContact.name.trim());
    formData.append('pickup_contact_phone', formState.pickupContact.phone.trim());
    
    if (formState.pickupNotes.trim()) {
      formData.append('pickup_notes', formState.pickupNotes.trim());
    }
    if (formState.pickupFloor.trim()) {
      formData.append('pickup_floor', formState.pickupFloor.trim());
    }
    formData.append('pickup_elevator', formState.pickupElevator.toString());

    // Photos
    formState.pickupPhotos.forEach((photoUrl, index) => {
      formData.append('pickup_photos', photoUrl);
    });

    // Step 3: Delivery location (conditional)
    if (formState.jobType === 'gift') {
      // Gift jobs: no delivery location needed
      formData.append('delivery_address', 'N/A - Gift Job');
      formData.append('delivery_lat', '0');
      formData.append('delivery_lng', '0');
    } else if (formState.jobType === 'recycle' && formState.selectedRecyclingCenter) {
      // Recycle jobs: use selected recycling center
      formData.append('delivery_address', formState.selectedRecyclingCenter.address);
      formData.append('delivery_lat', formState.selectedRecyclingCenter.lat.toString());
      formData.append('delivery_lng', formState.selectedRecyclingCenter.lng.toString());
    } else if (formState.deliveryLocation) {
      // Move jobs: full delivery location
      formData.append('delivery_address', formState.deliveryLocation.address);
      formData.append('delivery_lat', formState.deliveryLocation.lat.toString());
      formData.append('delivery_lng', formState.deliveryLocation.lng.toString());
      formData.append('delivery_contact_name', formState.deliveryContact.name.trim());
      formData.append('delivery_contact_phone', formState.deliveryContact.phone.trim());
      
      if (formState.deliveryNotes.trim()) {
        formData.append('delivery_notes', formState.deliveryNotes.trim());
      }
      if (formState.deliveryFloor.trim()) {
        formData.append('delivery_floor', formState.deliveryFloor.trim());
      }
      formData.append('delivery_elevator', formState.deliveryElevator.toString());
    }

    // Step 4: Item details
    formData.append('description', formState.description.trim());
    
    if (formState.itemCategory.trim()) {
      formData.append('item_category', formState.itemCategory.trim());
    }
    if (formState.itemSize.trim()) {
      formData.append('item_size', formState.itemSize.trim());
    }
    if (formState.itemWeight.trim()) {
      formData.append('item_weight', formState.itemWeight.trim());
    }
    
    formData.append('requires_help', formState.requiresHelp.toString());

    // Pricing
    formData.append('customer_price', pricing.customerPrice.toString());
    formData.append('driver_payout', pricing.driverPayout.toString());
    formData.append('platform_fee', pricing.platformFee.toString());
    formData.append('payment_type', formState.paymentType);

    // Schedule
    if (formState.scheduledPickup) {
      formData.append('scheduled_pickup', formState.scheduledPickup.toISOString());
    }

    return formData;
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Final validation of all steps
    if (!validateStep1().isValid) {
      setCurrentStep(1);
      Alert.alert('Validation Error', 'Please fix errors in Step 1');
      return;
    }
    if (!validateStep2().isValid) {
      setCurrentStep(2);
      Alert.alert('Validation Error', 'Please fix errors in Step 2');
      return;
    }
    if (formState.jobType !== 'gift' && !validateStep3().isValid) {
      setCurrentStep(3);
      Alert.alert('Validation Error', 'Please fix errors in Step 3');
      return;
    }
    if (!validateStep4().isValid) {
      const displayStep = formState.jobType === 'gift' ? 3 : 4;
      setCurrentStep(displayStep);
      Alert.alert('Validation Error', 'Please fix errors in final step');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = prepareFormData();
      const result = await createJob(formData);

      // Handle successful creation
      if (result.success) {
        // Check for moderation warnings
        if (result.reasons && result.reasons.length > 0) {
          Alert.alert(
            'Job Created (Pending Review)',
            `Your job has been created but flagged for moderation:\n\n${result.reasons.join('\n')}`,
            [
              {
                text: 'OK',
                onPress: () => {
                  resetForm();
                  navigation.navigate('OrderDetail', { orderId: result.data.id });
                },
              },
            ]
          );
        } else {
          showSuccessAlert('Job created successfully!');
          resetForm();
          navigation.navigate('OrderDetail', { orderId: result.data.id });
        }
      }
    } catch (error: any) {
      console.error('Job creation error:', error);
      
      if (error.reasons && error.reasons.length > 0) {
        Alert.alert(
          'Job Creation Failed',
          `Your job was rejected:\n\n${error.reasons.join('\n')}`,
          [{ text: 'OK' }]
        );
      } else {
        showErrorAlert(error, 'Failed to create job');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render current step
  const renderStep = () => {
    const actualStep = getActualStepNumber(currentStep);
    const stepErrors = getStepErrors(actualStep);

    switch (actualStep) {
      case 1:
        return (
          <Step1JobType
            formState={formState}
            updateField={updateField}
            errors={stepErrors}
          />
        );
      case 2:
        return (
          <Step2PickupLocation
            formState={formState}
            updateField={updateField}
            errors={stepErrors}
          />
        );
      case 3:
        return (
          <Step3DeliveryLocation
            formState={formState}
            updateField={updateField}
            errors={stepErrors}
          />
        );
      case 4:
        return (
          <Step4ItemDetails
            formState={formState}
            updateField={updateField}
            calculatePricing={calculatePricing}
            errors={stepErrors}
          />
        );
      default:
        return null;
    }
  };

  const totalSteps = getTotalSteps();
  const isLastStep = currentStep === totalSteps;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>✕ Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Job</Text>
          <View style={styles.cancelButton} />
        </View>

        {/* Stepper */}
        <FormStepper
          currentStep={getActualStepNumber(currentStep)}
          totalSteps={4}
          jobType={formState.jobType}
        />

        {/* Step Content */}
        <View style={styles.content}>{renderStep()}</View>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleBack}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonSecondaryText}>← Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonPrimary,
              currentStep === 1 && styles.buttonFullWidth,
              isSubmitting && styles.buttonDisabled,
            ]}
            onPress={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonPrimaryText}>
                {isLastStep ? 'Create Job' : 'Next →'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cancelButton: {
    width: 80,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.error,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark,
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFullWidth: {
    flex: 1,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  buttonSecondary: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPrimaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  buttonSecondaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark,
  },
});

