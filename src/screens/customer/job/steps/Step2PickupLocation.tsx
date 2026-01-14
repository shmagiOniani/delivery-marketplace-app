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
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pickup Location</Text>
        <Text style={styles.subtitle}>
          Where should the driver pick up the item?
        </Text>
      </View>

      {/* Map Picker Card */}
      <View style={styles.card}>
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
      </View>

      {/* Contact Information Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>👤</Text>
          <Text style={styles.cardTitle}>Pickup Contact</Text>
        </View>
        
        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, styles.inputHalf]}>
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

          <View style={[styles.inputGroup, styles.inputHalf]}>
            <Text style={styles.inputLabel}>Contact Phone *</Text>
            <TextInput
              style={[
                styles.input,
                errors?.pickupContact && styles.inputError,
              ]}
              value={formState.pickupContact.phone}
              onChangeText={(text) => handleContactChange('phone', text)}
              placeholder="+995 XXX XXX"
              placeholderTextColor={Colors.gray}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {errors?.pickupContact && (
          <Text style={styles.errorText}>{errors.pickupContact}</Text>
        )}
      </View>

      {/* Pickup Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>📍</Text>
          <Text style={styles.cardTitle}>Pickup Details</Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={[styles.inputGroup, styles.inputHalf]}>
            <Text style={styles.inputLabel}>Floor Number</Text>
            <TextInput
              style={styles.input}
              value={formState.pickupFloor}
              onChangeText={(text) => updateField('pickupFloor', text)}
              placeholder="e.g., 3rd"
              placeholderTextColor={Colors.gray}
              keyboardType="default"
            />
          </View>

          <View style={[styles.inputGroup, styles.inputHalf]}>
            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <Text style={styles.switchText}>Elevator Available</Text>
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
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Special Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formState.pickupNotes}
            onChangeText={(text) => updateField('pickupNotes', text)}
            placeholder="e.g., Ring doorbell, parking instructions, etc."
            placeholderTextColor={Colors.gray}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Photo Upload Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>📸</Text>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>Item Photos</Text>
            <Text style={styles.cardSubtitle}>
              Help drivers identify what to pick up
            </Text>
          </View>
        </View>
        <PhotoUpload
          label=""
          maxPhotos={5}
          photos={formState.pickupPhotos}
          onPhotosChange={(urls) => updateField('pickupPhotos', urls)}
          errorMessage={errors?.pickupPhotos}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: Spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.gray,
    lineHeight: 22,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark,
    flex: 1,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
    flex: 1,
  },
  inputHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.dark,
    minHeight: 48,
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: '#FEF2F2',
  },
  textArea: {
    minHeight: 90,
    paddingTop: Spacing.md,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  switchLabel: {
    flex: 1,
  },
  switchText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.dark,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: Spacing.xs,
    fontWeight: '500',
  },
});

