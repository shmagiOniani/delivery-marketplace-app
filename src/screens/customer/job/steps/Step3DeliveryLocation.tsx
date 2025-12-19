/**
 * Step 3: Delivery Location (Conditional based on job type)
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
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { MapPicker } from '../components/MapPicker';
import { ReadOnlyMap } from '../components/ReadOnlyMap';
import type { JobFormState, ContactInfo, RecyclingCenter } from '../types';
import { RECYCLING_CENTERS } from '../types';

interface Step3DeliveryLocationProps {
  formState: JobFormState;
  updateField: <K extends keyof JobFormState>(
    field: K,
    value: JobFormState[K]
  ) => void;
  errors?: {
    deliveryLocation?: string;
    deliveryContact?: string;
  };
}

export const Step3DeliveryLocation: React.FC<Step3DeliveryLocationProps> = ({
  formState,
  updateField,
  errors,
}) => {
  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    updateField('deliveryContact', {
      ...formState.deliveryContact,
      [field]: value,
    });
  };

  const handleRecyclingCenterSelect = (center: RecyclingCenter) => {
    updateField('selectedRecyclingCenter', center);
    updateField('deliveryLocation', {
      address: center.address,
      lat: center.lat,
      lng: center.lng,
    });
  };

  // Gift jobs skip this step
  if (formState.jobType === 'gift') {
    return (
      <View style={styles.skipContainer}>
        <Text style={styles.skipIcon}>🎁</Text>
        <Text style={styles.skipTitle}>No Delivery Location Needed</Text>
        <Text style={styles.skipText}>
          Since this is a gift job, the driver will keep the items. No delivery
          location is required.
        </Text>
      </View>
    );
  }

  // Recycle jobs show predefined centers
  if (formState.jobType === 'recycle') {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Recycling Center</Text>
            <Text style={styles.subtitle}>
              Select a recycling center for delivery
            </Text>
          </View>

          {/* Recycling Centers List */}
          <View style={styles.centersContainer}>
            {RECYCLING_CENTERS.map((center) => {
              const isSelected =
                formState.selectedRecyclingCenter?.id === center.id;
              
              return (
                <TouchableOpacity
                  key={center.id}
                  style={[
                    styles.centerCard,
                    isSelected && styles.centerCardSelected,
                  ]}
                  onPress={() => handleRecyclingCenterSelect(center)}
                  activeOpacity={0.7}
                >
                  <View style={styles.centerHeader}>
                    <View style={styles.centerIcon}>
                      <Text style={styles.centerIconText}>♻️</Text>
                    </View>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkIcon}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.centerName}>{center.name}</Text>
                  <Text style={styles.centerAddress}>{center.address}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {errors?.deliveryLocation && (
            <Text style={styles.errorText}>{errors.deliveryLocation}</Text>
          )}

          {/* Selected Center Map */}
          {formState.selectedRecyclingCenter && (
            <View style={styles.mapSection}>
              <ReadOnlyMap
                latitude={formState.selectedRecyclingCenter.lat}
                longitude={formState.selectedRecyclingCenter.lng}
                address={formState.selectedRecyclingCenter.address}
                label="Selected Center Location"
              />
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  // Move jobs show full delivery location picker
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Delivery Location</Text>
          <Text style={styles.subtitle}>
            Where should the driver deliver the item?
          </Text>
        </View>

        {/* Map Picker */}
        <MapPicker
          label="Select Delivery Location"
          onLocationSelect={(address, lat, lng) => {
            updateField('deliveryLocation', { address, lat, lng });
          }}
          defaultAddress={formState.deliveryLocation?.address}
          defaultLat={formState.deliveryLocation?.lat}
          defaultLng={formState.deliveryLocation?.lng}
          errorMessage={errors?.deliveryLocation}
        />

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Contact</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Name *</Text>
            <TextInput
              style={[
                styles.input,
                errors?.deliveryContact && styles.inputError,
              ]}
              value={formState.deliveryContact.name}
              onChangeText={(text) => handleContactChange('name', text)}
              placeholder="Full name"
              placeholderTextColor={Colors.gray}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Phone *</Text>
            <TextInput
              style={[
                styles.input,
                errors?.deliveryContact && styles.inputError,
              ]}
              value={formState.deliveryContact.phone}
              onChangeText={(text) => handleContactChange('phone', text)}
              placeholder="+995 XXX XXX XXX"
              placeholderTextColor={Colors.gray}
              keyboardType="phone-pad"
            />
          </View>

          {errors?.deliveryContact && (
            <Text style={styles.errorText}>{errors.deliveryContact}</Text>
          )}
        </View>

        {/* Additional Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Floor Number (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formState.deliveryFloor}
              onChangeText={(text) => updateField('deliveryFloor', text)}
              placeholder="e.g., 5th floor"
              placeholderTextColor={Colors.gray}
              keyboardType="default"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={styles.switchText}>Elevator Available</Text>
              <Text style={styles.switchHint}>
                Is there an elevator at delivery location?
              </Text>
            </View>
            <Switch
              value={formState.deliveryElevator}
              onValueChange={(value) => updateField('deliveryElevator', value)}
              trackColor={{
                false: Colors.lightGray,
                true: Colors.primary,
              }}
              thumbColor={Colors.white}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Special Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formState.deliveryNotes}
              onChangeText={(text) => updateField('deliveryNotes', text)}
              placeholder="e.g., Leave at door, call upon arrival, etc."
              placeholderTextColor={Colors.gray}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
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
  skipContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  skipIcon: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  skipTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  skipText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 24,
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
  centersContainer: {
    marginBottom: Spacing.md,
  },
  centerCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  centerCardSelected: {
    borderColor: Colors.success,
    backgroundColor: '#F0FDF4',
  },
  centerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  centerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIconText: {
    fontSize: 24,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  centerAddress: {
    fontSize: 14,
    color: Colors.gray,
  },
  mapSection: {
    marginTop: Spacing.lg,
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
    minHeight: 100,
    paddingTop: Spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
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
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});

