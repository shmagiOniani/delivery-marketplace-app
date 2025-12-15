import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import { Stepper } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useOrderFormStore } from '@/stores/useOrderFormStore';
import { useAuthStore } from '@/stores/useAuthStore';
import type { CustomerScreenProps } from '@/types/navigation';

export const NewOrderStep2Screen: React.FC<
  CustomerScreenProps<'NewOrderStep2'>
> = ({ navigation }) => {
  const { formData, updateFormData } = useOrderFormStore();
  const { user } = useAuthStore();
  
  const [pickupAddress, setPickupAddress] = useState(
    formData.pickupLocation?.address || '',
  );
  const [pickupLat, setPickupLat] = useState(
    formData.pickupLocation?.lat?.toString() || '',
  );
  const [pickupLng, setPickupLng] = useState(
    formData.pickupLocation?.lng?.toString() || '',
  );
  const [pickupContactName, setPickupContactName] = useState(
    formData.pickupContactName || user?.full_name || '',
  );
  const [pickupContactPhone, setPickupContactPhone] = useState(
    formData.pickupContactPhone || user?.phone || '',
  );
  const [pickupNotes, setPickupNotes] = useState(formData.pickupNotes || '');
  const [pickupFloor, setPickupFloor] = useState(formData.pickupFloor || '');
  const [pickupElevator, setPickupElevator] = useState(
    formData.pickupElevator || false,
  );

  const handleContinue = () => {
    if (pickupAddress && pickupLat && pickupLng) {
      updateFormData({
        pickupLocation: {
          address: pickupAddress,
          lat: parseFloat(pickupLat),
          lng: parseFloat(pickupLng),
        },
        pickupContactName,
        pickupContactPhone,
        pickupNotes,
        pickupFloor,
        pickupElevator,
      });
      navigation.navigate('NewOrderStep3');
    }
  };

  const handleCurrentLocation = () => {
    // TODO: Implement GPS location fetching
    // For now, use mock coordinates
    setPickupLat('41.7151');
    setPickupLng('44.8271');
    setPickupAddress('Current Location (Mock)');
  };

  const isValid =
    pickupAddress.trim().length > 0 &&
    pickupLat &&
    pickupLng &&
    !isNaN(parseFloat(pickupLat)) &&
    !isNaN(parseFloat(pickupLng));

  return (
    <View style={styles.container}>
      <Stepper currentStep={2} totalSteps={4} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Pickup Location</Text>
        <Text style={styles.headerKa}>აღების ლოკაცია</Text>

        {/* Map Picker Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Icon name="map" size={48} color={Colors.text.light} />
            <Text style={styles.mapPlaceholderText}>Map View</Text>
            <Text style={styles.mapPlaceholderSubtext}>
              (react-native-maps integration needed)
            </Text>
            {pickupLat && pickupLng && (
              <View style={styles.marker}>
                <Icon name="place" size={24} color={Colors.primary} />
              </View>
            )}
          </View>
        </View>

        {/* Address Input */}
        <View style={styles.section}>
          <Input
            label="Pickup Address *"
            icon="place"
            placeholder="Enter pickup address"
            value={pickupAddress}
            onChangeText={setPickupAddress}
            containerStyle={styles.input}
          />
          <View style={styles.coordinatesRow}>
            <View style={styles.coordinateInput}>
              <Input
                label="Latitude"
                placeholder="41.7151"
                value={pickupLat}
                onChangeText={setPickupLat}
                keyboardType="numeric"
                containerStyle={styles.input}
              />
            </View>
            <View style={styles.coordinateInput}>
              <Input
                label="Longitude"
                placeholder="44.8271"
                value={pickupLng}
                onChangeText={setPickupLng}
                keyboardType="numeric"
                containerStyle={styles.input}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={handleCurrentLocation}>
            <Icon name="my-location" size={20} color={Colors.primary} />
            <Text style={styles.currentLocationText}>Use Current Location</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.twoColumnGrid}>
            <View style={styles.gridItem}>
              <Input
                label="Contact Name"
                placeholder="John Doe"
                value={pickupContactName}
                onChangeText={setPickupContactName}
                containerStyle={styles.input}
              />
            </View>
            <View style={styles.gridItem}>
              <Input
                label="Contact Phone"
                placeholder="+995 555 123 456"
                value={pickupContactPhone}
                onChangeText={setPickupContactPhone}
                keyboardType="phone-pad"
                containerStyle={styles.input}
              />
            </View>
          </View>
        </View>

        {/* Pickup Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Notes</Text>
          <Text style={styles.sectionTitleKa}>აღების შენიშვნები</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Special instructions for pickup"
            placeholderTextColor={Colors.text.light}
            value={pickupNotes}
            onChangeText={setPickupNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Floor & Elevator */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Floor & Elevator</Text>
          <View style={styles.twoColumnGrid}>
            <View style={styles.gridItem}>
              <Input
                label="Floor"
                placeholder="0"
                value={pickupFloor}
                onChangeText={setPickupFloor}
                keyboardType="numeric"
                containerStyle={styles.input}
              />
            </View>
            <View style={[styles.gridItem, styles.elevatorContainer]}>
              <Text style={styles.elevatorLabel}>Has Elevator</Text>
              <Text style={styles.elevatorLabelKa}>ლიფტი აქვს</Text>
              <Switch
                value={pickupElevator}
                onValueChange={setPickupElevator}
                trackColor={{ false: Colors.lightGray, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
          </View>
        </View>

        {/* Photo Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos of Item</Text>
          <Text style={styles.sectionTitleKa}>ნივთის ფოტოები</Text>
          <View style={styles.photoGrid}>
            {[0, 1, 2, 3, 4].map((index) => (
              <TouchableOpacity
                key={index}
                style={styles.photoPlaceholder}
                activeOpacity={0.7}>
                {index === 0 ? (
                  <Icon name="add-a-photo" size={32} color={Colors.text.light} />
                ) : (
                  <Icon name="add" size={32} color={Colors.text.light} />
                )}
                <Text style={styles.photoPlaceholderText}>
                  {index === 0 ? 'Add Photo' : '+'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.photoHint}>
            Max 5 photos. Camera and gallery options available.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Next →"
          onPress={handleContinue}
          disabled={!isValid}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  header: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  headerKa: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  mapContainer: {
    height: 300,
    marginBottom: Spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapPlaceholderText: {
    ...Typography.body,
    color: Colors.text.light,
    marginTop: Spacing.sm,
  },
  mapPlaceholderSubtext: {
    ...Typography.tiny,
    color: Colors.text.light,
    marginTop: Spacing.xs,
  },
  marker: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -12,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  sectionTitleKa: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  input: {
    marginBottom: Spacing.md,
  },
  coordinatesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  coordinateInput: {
    flex: 1,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginTop: Spacing.sm,
  },
  currentLocationText: {
    ...Typography.body,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  gridItem: {
    flex: 1,
  },
  elevatorContainer: {
    justifyContent: 'flex-end',
    paddingBottom: Spacing.sm,
  },
  elevatorLabel: {
    ...Typography.small,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  elevatorLabelKa: {
    ...Typography.tiny,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  notesInput: {
    ...Typography.body,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text.primary,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  photoPlaceholder: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  photoPlaceholderText: {
    ...Typography.tiny,
    color: Colors.text.light,
    marginTop: Spacing.xs,
  },
  photoHint: {
    ...Typography.tiny,
    color: Colors.text.light,
    fontStyle: 'italic',
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
