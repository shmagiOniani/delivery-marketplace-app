/**
 * Step 3: Delivery Location (Conditional based on job type)
 */

import React from 'react';
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
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
          <View style={styles.card}>
            <ReadOnlyMap
              latitude={formState.selectedRecyclingCenter.lat}
              longitude={formState.selectedRecyclingCenter.lng}
              address={formState.selectedRecyclingCenter.address}
              label="Selected Center Location"
            />
          </View>
        )}
      </ScrollView>
    );
  }

  // Move jobs show full delivery location picker
  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Delivery Location</Text>
        <Text style={styles.subtitle}>
          Where should the driver deliver the item?
        </Text>
      </View>

      {/* Map Picker Card */}
      <View style={styles.card}>
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
      </View>

      {/* Contact Information Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>👤</Text>
          <Text style={styles.cardTitle}>Delivery Contact</Text>
        </View>
        
        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, styles.inputHalf]}>
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

          <View style={[styles.inputGroup, styles.inputHalf]}>
            <Text style={styles.inputLabel}>Contact Phone *</Text>
            <TextInput
              style={[
                styles.input,
                errors?.deliveryContact && styles.inputError,
              ]}
              value={formState.deliveryContact.phone}
              onChangeText={(text) => handleContactChange('phone', text)}
              placeholder="+995 XXX XXX"
              placeholderTextColor={Colors.gray}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {errors?.deliveryContact && (
          <Text style={styles.errorText}>{errors.deliveryContact}</Text>
        )}
      </View>

      {/* Delivery Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>📍</Text>
          <Text style={styles.cardTitle}>Delivery Details</Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={[styles.inputGroup, styles.inputHalf]}>
            <Text style={styles.inputLabel}>Floor Number</Text>
            <TextInput
              style={styles.input}
              value={formState.deliveryFloor}
              onChangeText={(text) => updateField('deliveryFloor', text)}
              placeholder="e.g., 5th"
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
                value={formState.deliveryElevator}
                onValueChange={(value) => updateField('deliveryElevator', value)}
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
            value={formState.deliveryNotes}
            onChangeText={(text) => updateField('deliveryNotes', text)}
            placeholder="e.g., Leave at door, call upon arrival, etc."
            placeholderTextColor={Colors.gray}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
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
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
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
  centersContainer: {
    marginBottom: Spacing.md,
  },
  centerCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  centerCardSelected: {
    borderColor: Colors.success,
    backgroundColor: '#F0FDF4',
    shadowOpacity: 0.15,
  },
  centerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  centerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIconText: {
    fontSize: 28,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    color: Colors.white,
    fontSize: 18,
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
    lineHeight: 20,
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

