/**
 * Step 1: Job Type & Title Selection
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import type { JobPurpose } from '@/types';
import type { JobFormState } from '../types';

interface Step1JobTypeProps {
  formState: JobFormState;
  updateField: <K extends keyof JobFormState>(
    field: K,
    value: JobFormState[K]
  ) => void;
  errors?: {
    jobType?: string;
    title?: string;
  };
}

interface JobTypeOption {
  type: JobPurpose;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const JOB_TYPES: JobTypeOption[] = [
  {
    type: 'move',
    icon: '📦',
    title: 'Move',
    description: 'Transport items from one place to another',
    color: Colors.primary,
  },
  {
    type: 'recycle',
    icon: '♻️',
    title: 'Recycle',
    description: 'Deliver items to a recycling center',
    color: Colors.success,
  },
  {
    type: 'gift',
    icon: '🎁',
    title: 'Gift',
    description: 'Donate items for free (driver keeps them)',
    color: Colors.orange,
  },
];

export const Step1JobType: React.FC<Step1JobTypeProps> = ({
  formState,
  updateField,
  errors,
}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What type of job is this?</Text>
          <Text style={styles.subtitle}>
            Select the type that best describes your delivery needs
          </Text>
        </View>

        {/* Job Type Cards */}
        <View style={styles.cardsContainer}>
          {JOB_TYPES.map((jobType) => {
            const isSelected = formState.jobType === jobType.type;
            return (
              <TouchableOpacity
                key={jobType.type}
                style={[
                  styles.card,
                  isSelected && [
                    styles.cardSelected,
                    { borderColor: jobType.color },
                  ],
                ]}
                onPress={() => updateField('jobType', jobType.type)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardIcon}>{jobType.icon}</Text>
                  {isSelected && (
                    <View
                      style={[
                        styles.checkmark,
                        { backgroundColor: jobType.color },
                      ]}
                    >
                      <Text style={styles.checkmarkIcon}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardTitle}>{jobType.title}</Text>
                <Text style={styles.cardDescription}>{jobType.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {errors?.jobType && (
          <Text style={styles.errorText}>{errors.jobType}</Text>
        )}

        {/* Job Title Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Job Title</Text>
          <TextInput
            style={[
              styles.input,
              errors?.title && styles.inputError,
            ]}
            value={formState.title}
            onChangeText={(text) => updateField('title', text)}
            placeholder="e.g., Move furniture to new apartment"
            placeholderTextColor={Colors.gray}
            maxLength={100}
          />
          <View style={styles.inputFooter}>
            {errors?.title ? (
              <Text style={styles.errorText}>{errors.title}</Text>
            ) : (
              <Text style={styles.hint}>
                Choose a clear, descriptive title (3-100 characters)
              </Text>
            )}
            <Text style={styles.charCount}>
              {formState.title.length}/100
            </Text>
          </View>
        </View>

        {/* Job Type Info */}
        {formState.jobType && (
          <View style={styles.infoBox}>
            {formState.jobType === 'gift' && (
              <>
                <Text style={styles.infoIcon}>💡</Text>
                <Text style={styles.infoText}>
                  Gift jobs are <Text style={styles.infoBold}>free for you</Text>.
                  The driver can keep the items at no charge. Perfect for
                  donations!
                </Text>
              </>
            )}
            {formState.jobType === 'recycle' && (
              <>
                <Text style={styles.infoIcon}>♻️</Text>
                <Text style={styles.infoText}>
                  We'll help you deliver items to an approved recycling center.
                  You'll choose the center in the next step.
                </Text>
              </>
            )}
            {formState.jobType === 'move' && (
              <>
                <Text style={styles.infoIcon}>📦</Text>
                <Text style={styles.infoText}>
                  Standard delivery from pickup to drop-off location. You'll set
                  both locations and the price.
                </Text>
              </>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    lineHeight: 22,
  },
  cardsContainer: {
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  cardSelected: {
    borderWidth: 2,
    backgroundColor: '#FFFBEB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  cardIcon: {
    fontSize: 40,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
  },
  inputSection: {
    marginTop: Spacing.md,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.dark,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  hint: {
    flex: 1,
    fontSize: 12,
    color: Colors.gray,
  },
  charCount: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: Spacing.sm,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: Spacing.md,
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.dark,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '700',
  },
});

