/**
 * Step 4: Item Details, Pricing & Schedule
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Switch,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import type { JobFormState, PricingBreakdown } from '../types';
import type { PaymentType } from '@/types';

interface Step4ItemDetailsProps {
  formState: JobFormState;
  updateField: <K extends keyof JobFormState>(
    field: K,
    value: JobFormState[K]
  ) => void;
  calculatePricing: () => PricingBreakdown;
  errors?: {
    description?: string;
    customerPrice?: string;
    scheduledPickup?: string;
  };
}

export const Step4ItemDetails: React.FC<Step4ItemDetailsProps> = ({
  formState,
  updateField,
  calculatePricing,
  errors,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const isGiftJob = formState.jobType === 'gift';
  const pricing = calculatePricing();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      // Preserve existing time if any
      const existingDate = formState.scheduledPickup || new Date();
      selectedDate.setHours(existingDate.getHours());
      selectedDate.setMinutes(existingDate.getMinutes());
      updateField('scheduledPickup', selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      // Preserve existing date
      const existingDate = formState.scheduledPickup || new Date();
      existingDate.setHours(selectedTime.getHours());
      existingDate.setMinutes(selectedTime.getMinutes());
      updateField('scheduledPickup', existingDate);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date | null): string => {
    if (!date) return 'Select time';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Item Details</Text>
          <Text style={styles.subtitle}>
            Provide information about what needs to be delivered
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description *</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              errors?.description && styles.inputError,
            ]}
            value={formState.description}
            onChangeText={(text) => updateField('description', text)}
            placeholder="Describe the item(s) in detail. Include size, weight, fragility, special handling requirements, etc."
            placeholderTextColor={Colors.gray}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <View style={styles.inputFooter}>
            {errors?.description ? (
              <Text style={styles.errorText}>{errors.description}</Text>
            ) : (
              <Text style={styles.hint}>Minimum 10 characters</Text>
            )}
            <Text style={styles.charCount}>
              {formState.description.length}/500
            </Text>
          </View>
        </View>

        {/* Item Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item Specifications (Optional)</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category</Text>
            <TextInput
              style={styles.input}
              value={formState.itemCategory}
              onChangeText={(text) => updateField('itemCategory', text)}
              placeholder="e.g., Furniture, Electronics, Documents"
              placeholderTextColor={Colors.gray}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Size</Text>
              <TextInput
                style={styles.input}
                value={formState.itemSize}
                onChangeText={(text) => updateField('itemSize', text)}
                placeholder="e.g., 2m x 1m"
                placeholderTextColor={Colors.gray}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Weight</Text>
              <TextInput
                style={styles.input}
                value={formState.itemWeight}
                onChangeText={(text) => updateField('itemWeight', text)}
                placeholder="e.g., 50 kg"
                placeholderTextColor={Colors.gray}
              />
            </View>
          </View>
        </View>

        {/* Requires Help */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={styles.switchText}>Requires Help Loading/Unloading</Text>
              <Text style={styles.switchHint}>
                Does the driver need to help carry the items?
              </Text>
            </View>
            <Switch
              value={formState.requiresHelp}
              onValueChange={(value) => updateField('requiresHelp', value)}
              trackColor={{
                false: Colors.lightGray,
                true: Colors.primary,
              }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isGiftJob ? 'Payment (Free Gift)' : 'Pricing & Payment'}
          </Text>

          {isGiftJob ? (
            <View style={styles.giftBanner}>
              <Text style={styles.giftIcon}>🎁</Text>
              <Text style={styles.giftText}>
                This is a gift job - no payment required! The driver will keep
                the items for free.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Your Price (GEL) *</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.priceInput,
                    errors?.customerPrice && styles.inputError,
                  ]}
                  value={formState.customerPrice > 0 ? formState.customerPrice.toString() : ''}
                  onChangeText={(text) => {
                    const price = parseFloat(text) || 0;
                    updateField('customerPrice', price);
                  }}
                  placeholder="0.00"
                  placeholderTextColor={Colors.gray}
                  keyboardType="decimal-pad"
                />
                {errors?.customerPrice && (
                  <Text style={styles.errorText}>{errors.customerPrice}</Text>
                )}
              </View>

              {/* Payment Type */}
              <View style={styles.paymentTypeContainer}>
                <Text style={styles.inputLabel}>Payment Method</Text>
                <View style={styles.paymentOptions}>
                  <TouchableOpacity
                    style={[
                      styles.paymentOption,
                      formState.paymentType === 'CASH' && styles.paymentOptionSelected,
                    ]}
                    onPress={() => updateField('paymentType', 'CASH')}
                  >
                    <Text
                      style={[
                        styles.paymentOptionText,
                        formState.paymentType === 'CASH' && styles.paymentOptionTextSelected,
                      ]}
                    >
                      💵 Cash
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.paymentOption,
                      formState.paymentType === 'ONLINE_PAYMENT' && styles.paymentOptionSelected,
                    ]}
                    onPress={() => updateField('paymentType', 'ONLINE_PAYMENT')}
                  >
                    <Text
                      style={[
                        styles.paymentOptionText,
                        formState.paymentType === 'ONLINE_PAYMENT' && styles.paymentOptionTextSelected,
                      ]}
                    >
                      💳 Online
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Pricing Breakdown */}
              {formState.customerPrice > 0 && (
                <View style={styles.pricingBreakdown}>
                  <Text style={styles.breakdownTitle}>Pricing Breakdown</Text>
                  
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Your Price:</Text>
                    <Text style={styles.breakdownValue}>
                      ₾{pricing.customerPrice.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>
                      Platform Fee ({formState.paymentType === 'ONLINE_PAYMENT' ? '15%' : '0%'}):
                    </Text>
                    <Text style={styles.breakdownValue}>
                      -₾{pricing.platformFee.toFixed(2)}
                    </Text>
                  </View>

                  <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                    <Text style={styles.breakdownTotalLabel}>Driver Payout:</Text>
                    <Text style={styles.breakdownTotalValue}>
                      ₾{pricing.driverPayout.toFixed(2)}
                    </Text>
                  </View>

                  <Text style={styles.breakdownHint}>
                    {formState.paymentType === 'ONLINE_PAYMENT'
                      ? '💡 Online payments include a 15% platform fee'
                      : '💡 No platform fee for cash payments'}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Schedule *</Text>

          <View style={styles.dateTimeRow}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity
                style={[
                  styles.dateTimeButton,
                  errors?.scheduledPickup && styles.inputError,
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeButtonText}>
                  {formatDate(formState.scheduledPickup)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Time</Text>
              <TouchableOpacity
                style={[
                  styles.dateTimeButton,
                  errors?.scheduledPickup && styles.inputError,
                ]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeButtonText}>
                  {formatTime(formState.scheduledPickup)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {errors?.scheduledPickup && (
            <Text style={styles.errorText}>{errors.scheduledPickup}</Text>
          )}
        </View>

        {/* Date/Time Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={formState.scheduledPickup || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={formState.scheduledPickup || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
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
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: Spacing.xs,
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
  textArea: {
    minHeight: 120,
    paddingTop: Spacing.md,
  },
  priceInput: {
    fontSize: 24,
    fontWeight: '700',
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
    marginTop: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: Spacing.md,
  },
  switchLabel: {
    flex: 1,
    marginRight: Spacing.md,
  },
  switchText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  switchHint: {
    fontSize: 12,
    color: Colors.gray,
  },
  giftBanner: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  giftText: {
    flex: 1,
    fontSize: 14,
    color: Colors.dark,
    lineHeight: 20,
  },
  paymentTypeContainer: {
    marginBottom: Spacing.md,
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  paymentOption: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.md,
    alignItems: 'center',
  },
  paymentOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFBEB',
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray,
  },
  paymentOptionTextSelected: {
    color: Colors.dark,
  },
  pricingBreakdown: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  breakdownLabel: {
    fontSize: 14,
    color: Colors.gray,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
  },
  breakdownTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
  },
  breakdownTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },
  breakdownTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  breakdownHint: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.md,
    alignItems: 'center',
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: Colors.dark,
  },
});

