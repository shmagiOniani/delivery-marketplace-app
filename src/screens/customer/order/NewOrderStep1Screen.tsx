import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '@/stores/useAuthStore';
import type { CustomerScreenProps } from '@/types/navigation';
import type { JobPurpose } from '@/types';

interface JobTypeOption {
  type: JobPurpose;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const JOB_TYPES: JobTypeOption[] = [
  {
    type: 'move',
    name: 'Move',
    description: 'From one place to another',
    icon: 'local-shipping',
    color: Colors.primary,
  },
  {
    type: 'recycle',
    name: 'Recycle',
    description: 'Take to recycle/trash',
    icon: 'recycling',
    color: Colors.success,
  },
  {
    type: 'gift',
    name: 'Gift',
    description: 'Free pickup, no charges',
    icon: 'card-giftcard',
    color: Colors.orange,
  },
];

export const NewOrderStep1Screen: React.FC<
  CustomerScreenProps<'NewOrderStep1'>
> = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [jobType, setJobType] = useState<JobPurpose>('move');
  const [title, setTitle] = useState('');
  const [errors, setErrors] = useState<{
    jobType?: string;
    title?: string;
  }>({});

  const handleNext = () => {
    const newErrors: typeof errors = {};

    if (!jobType) {
      newErrors.jobType = 'Please select a job type';
    }

    if (!title.trim()) {
      newErrors.title = 'Please enter a job title';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigation.navigate('Customer', {
      screen: 'NewOrderStep2',
      params: {
        jobType,
        title: title.trim(),
      },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Delivery Type</Text>
          <Text style={styles.subtitle}>
            Select the type of delivery and enter a title
          </Text>
        </View>

        {/* Job Title Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) {
                setErrors({ ...errors, title: undefined });
              }
            }}
            placeholder="e.g., Move furniture from apartment to house"
            placeholderTextColor={Colors.text.secondary}
            maxLength={100}
          />
          {errors.title && (
            <Text style={styles.errorText}>{errors.title}</Text>
          )}
        </View>

        {/* Job Type Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Job Type *</Text>
          <View style={styles.jobTypesContainer}>
            {JOB_TYPES.map((type) => {
              const isSelected = jobType === type.type;
              return (
                <TouchableOpacity
                  key={type.type}
                  style={[
                    styles.jobTypeCard,
                    isSelected && [
                      styles.jobTypeCardSelected,
                      { borderColor: type.color },
                    ],
                  ]}
                  onPress={() => {
                    setJobType(type.type);
                    if (errors.jobType) {
                      setErrors({ ...errors, jobType: undefined });
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${type.color}15` },
                    ]}
                  >
                    <Icon name={type.icon} size={32} color={type.color} />
                  </View>
                  <Text style={styles.jobTypeName}>{type.name}</Text>
                  <Text style={styles.jobTypeDescription}>
                    {type.description}
                  </Text>
                  {isSelected && (
                    <View
                      style={[
                        styles.checkmark,
                        { backgroundColor: type.color },
                      ]}
                    >
                      <Icon name="check" size={16} color={Colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.jobType && (
            <Text style={styles.errorText}>{errors.jobType}</Text>
          )}
        </View>

        {/* Info Box for Gift Type */}
        {jobType === 'gift' && (
          <View style={styles.infoBox}>
            <Icon name="info" size={20} color={Colors.orange} />
            <Text style={styles.infoText}>
              Gift jobs are free. The driver can keep the items at no charge.
              Delivery location step will be skipped.
            </Text>
          </View>
        )}

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            (!jobType || !title.trim()) && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!jobType || !title.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Icon name="arrow-forward" size={20} color={Colors.white} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.bodyBold,
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    ...Typography.body,
    color: Colors.dark,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    ...Typography.small,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  jobTypesContainer: {
    gap: Spacing.md,
  },
  jobTypeCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  jobTypeCardSelected: {
    borderWidth: 2,
    backgroundColor: '#F3E8FF',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  jobTypeName: {
    ...Typography.h3,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  jobTypeDescription: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    ...Typography.small,
    color: Colors.dark,
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.lightGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
    fontSize: 18,
  },
});
