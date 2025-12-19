/**
 * Step 2: Pickup Location & Details
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { MapPicker } from '../components/MapPicker';
import { PhotoUpload } from '../components/PhotoUpload';
import type { JobFormState, ContactInfo } from '../types';

interface Step2PickupLocationProps {
  formState: JobFormState;
  updateField: <K extends keyof JobFormState>(
    field: K,
    value: JobFormState[K]
  ) => void;
  errors?: {
    pickupLocation?: string;
    pickupContact?: string;
    pickupPhotos?: string;
  };
}

export const Step2PickupLocation: React.FC<Step2PickupLocationProps> = ({
  formState,
  updateField,
  errors,
}) => {
  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    updateField('pickupContact', {
      ...formState.pickupContact,
      [field]: value,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Pickup Location</Text>
          <Text style={styles.subtitle}>
            Where should the driver pick up the item?
          </Text>
        </View>

        {/* Map Picker */}
        <MapPicker
          label="Select Pickup Location"
          onLocationSelect={(address, lat, lng) => {
            updateField('pickupLocation', { address, lat, lng });
          }}
          defaultAddress={formState.pickupLocation?.address}
          defaultLat={formState.pickupLocation?.lat}
          defaultLng={formState.pickupLocation?.lng}
          errorMessage={errors?.pickupLocation}
        />

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Contact</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Name *</Text>
            <TextInput
              style={[
                styles.input,
                errors?.pickupContact && styles.inputError,
              ]}
              value={formState.pickupContact.name}
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
                errors?.pickupContact && styles.inputError,
              ]}
              value={formState.pickupContact.phone}
              onChangeText={(text) => handleContactChange('phone', text)}
              placeholder="+995 XXX XXX XXX"
              placeholderTextColor={Colors.gray}
              keyboardType="phone-pad"
            />
          </View>

          {errors?.pickupContact && (
            <Text style={styles.errorText}>{errors.pickupContact}</Text>
          )}
        </View>

        {/* Additional Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Floor Number (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formState.pickupFloor}
              onChangeText={(text) => updateField('pickupFloor', text)}
              placeholder="e.g., 3rd floor"
              placeholderTextColor={Colors.gray}
              keyboardType="default"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={styles.switchText}>Elevator Available</Text>
              <Text style={styles.switchHint}>
                Is there an elevator at pickup location?
              </Text>
            </View>
            <Switch
              value={formState.pickupElevator}
              onValueChange={(value) => updateField('pickupElevator', value)}
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
              value={formState.pickupNotes}
              onChangeText={(text) => updateField('pickupNotes', text)}
              placeholder="e.g., Ring doorbell, parking instructions, etc."
              placeholderTextColor={Colors.gray}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Photo Upload */}
        <View style={styles.section}>
          <PhotoUpload
            label="Item Photos"
            maxPhotos={5}
            photos={formState.pickupPhotos}
            onPhotosChange={(urls) => updateField('pickupPhotos', urls)}
            errorMessage={errors?.pickupPhotos}
          />
          <Text style={styles.photoHint}>
            📸 Add photos to help drivers understand what they're picking up
          </Text>
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
  photoHint: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
});

