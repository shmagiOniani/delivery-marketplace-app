/**
 * FormStepper - Visual progress indicator for multi-step form
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import type { JobPurpose } from '@/types';

interface FormStepperProps {
  currentStep: number;
  totalSteps: number;
  jobType: JobPurpose | null;
}

const STEP_LABELS = [
  'Job Type',
  'Pickup',
  'Delivery',
  'Details',
];

export const FormStepper: React.FC<FormStepperProps> = ({
  currentStep,
  totalSteps,
  jobType,
}) => {
  // Gift jobs skip delivery step
  const shouldShowStep = (stepIndex: number): boolean => {
    if (stepIndex === 2 && jobType === 'gift') {
      return false;
    }
    return true;
  };

  const getVisibleSteps = () => {
    return STEP_LABELS.filter((_, index) => shouldShowStep(index));
  };

  const visibleSteps = getVisibleSteps();

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${(currentStep / totalSteps) * 100}%`,
            },
          ]}
        />
      </View>

      {/* Step Indicators */}
      <View style={styles.stepsContainer}>
        {visibleSteps.map((label, index) => {
          const actualStepNumber = STEP_LABELS.indexOf(label) + 1;
          const isActive = actualStepNumber === currentStep;
          const isCompleted = actualStepNumber < currentStep;

          return (
            <View key={label} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  isActive && styles.stepCircleActive,
                  isCompleted && styles.stepCircleCompleted,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    (isActive || isCompleted) && styles.stepNumberActive,
                  ]}
                >
                  {actualStepNumber}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  isActive && styles.stepLabelActive,
                ]}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.lightGray,
    marginHorizontal: Spacing.md,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  stepCircleActive: {
    backgroundColor: Colors.primary,
  },
  stepCircleCompleted: {
    backgroundColor: Colors.success,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray,
  },
  stepNumberActive: {
    color: Colors.white,
  },
  stepLabel: {
    fontSize: 11,
    color: Colors.gray,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: Colors.dark,
    fontWeight: '600',
  },
});

