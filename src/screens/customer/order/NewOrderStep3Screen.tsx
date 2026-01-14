import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MapPicker } from '@/screens/customer/job/components/MapPicker';
import { ReadOnlyMap } from '@/screens/customer/job/components/ReadOnlyMap';
import { RECYCLING_CENTERS } from '@/screens/customer/job/types';
import type { CustomerScreenProps } from '@/types/navigation';
import type { JobPurpose } from '@/types';
import type { RecyclingCenter } from '@/screens/customer/job/types';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export const NewOrderStep3Screen: React.FC<
  CustomerScreenProps<'NewOrderStep3'>
> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const {
    jobType,
    title,
    pickupLocation,
    pickupContactName,
    pickupContactPhone,
    pickupNotes,
    pickupFloor,
    pickupElevator,
  } = route.params as {
    jobType: JobPurpose;
    title: string;
    pickupLocation: Location;
    pickupContactName: string;
    pickupContactPhone: string;
    pickupNotes: string;
    pickupFloor?: number;
    pickupElevator: boolean;
  };

  // Auto-fill delivery contact from user profile
  useEffect(() => {
    if (user?.full_name) {
      setDeliveryContactName(user.full_name);
    }
    if (user?.phone) {
      setDeliveryContactPhone(user.phone);
    }
  }, [user]);

  // Skip this step for gift jobs
  useEffect(() => {
    if (jobType === 'gift') {
      // Navigate directly to Step 4
      handleNext();
    }
  }, []);

  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);
  const [selectedRecyclingCenter, setSelectedRecyclingCenter] =
    useState<RecyclingCenter | null>(null);
  const [deliveryContactName, setDeliveryContactName] = useState('');
  const [deliveryContactPhone, setDeliveryContactPhone] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliveryFloor, setDeliveryFloor] = useState('');
  const [deliveryElevator, setDeliveryElevator] = useState(false);
  const [errors, setErrors] = useState<{
    deliveryLocation?: string;
  }>({});

  const handleRecyclingCenterSelect = (center: RecyclingCenter) => {
    setSelectedRecyclingCenter(center);
    const location: Location = {
      latitude: center.lat,
      longitude: center.lng,
      address: center.address,
    };
    setDeliveryLocation(location);
    if (errors.deliveryLocation) {
      setErrors({ ...errors, deliveryLocation: undefined });
    }
  };

  const handleLocationSelect = async (
    address: string,
    lat: number,
    lng: number
  ) => {
    const location: Location = { latitude: lat, longitude: lng, address };
    setDeliveryLocation(location);
    if (errors.deliveryLocation) {
      setErrors({ ...errors, deliveryLocation: undefined });
    }
  };

  const handleNext = () => {
    // For gift jobs, use pickup location as delivery location
    if (jobType === 'gift') {
      navigation.navigate('Customer', {
        screen: 'NewOrderStep4',
        params: {
          jobType,
          title,
          pickupLocation,
          pickupContactName,
          pickupContactPhone,
          pickupNotes,
          pickupFloor,
          pickupElevator,
          deliveryLocation: pickupLocation, // Use pickup for gift
          deliveryContactName: '',
          deliveryContactPhone: '',
          deliveryNotes: '',
          deliveryFloor: undefined,
          deliveryElevator: false,
        },
      } as any);
      return;
    }

    // Validate delivery location
    if (!deliveryLocation) {
      setErrors({ deliveryLocation: 'Please select a delivery location' });
      Alert.alert('Error', 'Please select a delivery location');
      return;
    }

    navigation.navigate('Customer', {
      screen: 'NewOrderStep4',
      params: {
        jobType,
        title,
        pickupLocation,
        pickupContactName,
        pickupContactPhone,
        pickupNotes,
        pickupFloor,
        pickupElevator,
        deliveryLocation,
        deliveryContactName,
        deliveryContactPhone,
        deliveryNotes,
        deliveryFloor: deliveryFloor ? parseInt(deliveryFloor, 10) : undefined,
        deliveryElevator,
      },
    } as any);
  };

  // Don't render for gift jobs (will auto-navigate)
  if (jobType === 'gift') {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Delivery Location</Text>
          <Text style={styles.subtitle}>
            {jobType === 'recycle'
              ? 'Select a recycling center'
              : 'Select delivery address and provide contact details'}
          </Text>
        </View>

        {/* Recycle: Show Recycling Centers */}
        {jobType === 'recycle' && (
          <View style={styles.section}>
            <Text style={styles.label}>Recycling Location *</Text>
            <View style={styles.centersContainer}>
              {RECYCLING_CENTERS.map((center) => {
                const isSelected = selectedRecyclingCenter?.id === center.id;
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
                          <Icon name="check" size={16} color={Colors.white} />
                        </View>
                      )}
                    </View>
                    <Text style={styles.centerName}>{center.name}</Text>
                    <Text style={styles.centerAddress}>{center.address}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.deliveryLocation && (
              <Text style={styles.errorText}>{errors.deliveryLocation}</Text>
            )}

            {/* Selected Center Map */}
            {selectedRecyclingCenter && (
              <View style={styles.mapSection}>
                <ReadOnlyMap
                  latitude={selectedRecyclingCenter.lat}
                  longitude={selectedRecyclingCenter.lng}
                  address={selectedRecyclingCenter.address}
                  label="Selected Center Location"
                />
              </View>
            )}
          </View>
        )}

        {/* Move: Show Map Picker */}
        {jobType === 'move' && (
          <View style={styles.section}>
            <MapPicker
              label="Delivery Address *"
              onLocationSelect={handleLocationSelect}
              defaultAddress={deliveryLocation?.address}
              defaultLat={deliveryLocation?.latitude}
              defaultLng={deliveryLocation?.longitude}
              errorMessage={errors.deliveryLocation}
            />
          </View>
        )}

        {/* Contact Information (only for move jobs) */}
        {jobType === 'move' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              <View style={styles.twoColumn}>
                <View style={styles.column}>
                  <Text style={styles.label}>Contact Name</Text>
                  <TextInput
                    style={styles.input}
                    value={deliveryContactName}
                    onChangeText={setDeliveryContactName}
                    placeholder="Jane Smith"
                    placeholderTextColor={Colors.text.secondary}
                  />
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>Contact Phone</Text>
                  <TextInput
                    style={styles.input}
                    value={deliveryContactPhone}
                    onChangeText={setDeliveryContactPhone}
                    placeholder="+995 555 987 654"
                    placeholderTextColor={Colors.text.secondary}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            {/* Delivery Notes */}
            <View style={styles.section}>
              <Text style={styles.label}>Delivery Notes</Text>
              <TextInput
                style={styles.textArea}
                value={deliveryNotes}
                onChangeText={setDeliveryNotes}
                placeholder="e.g., Leave at door if no answer"
                placeholderTextColor={Colors.text.secondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Floor and Elevator */}
            <View style={styles.section}>
                <View style={styles.column}>
                  <Text style={styles.label}>Delivery Floor</Text>
                  <TextInput
                    style={styles.input}
                    value={deliveryFloor}
                    onChangeText={(text) => {
                      if (text === '' || /^\d+$/.test(text)) {
                        setDeliveryFloor(text);
                      }
                    }}
                    placeholder="0"
                    placeholderTextColor={Colors.text.secondary}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
                <View style={[styles.column, styles.elevatorColumn]}>
                  <View style={styles.elevatorContainer}>
                  <TouchableOpacity
                      style={[
                        styles.checkbox,
                        deliveryElevator && styles.checkboxChecked,
                      ]}
                      onPress={() => setDeliveryElevator(!deliveryElevator)}
                      activeOpacity={0.7}
                    >
                      {deliveryElevator && (
                        <Icon name="check" size={18} color={Colors.white} />
                      )}
                    </TouchableOpacity>
                    <Icon name="elevator" size={24} color={Colors.dark} />
                    <View style={styles.elevatorTextContainer}>
                      <Text style={styles.elevatorLabel}>Delivery Elevator</Text>
                    </View>
                  
                  </View>
                </View>
              </View>
          </>
        )}

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            !deliveryLocation && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!deliveryLocation}
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
  sectionTitle: {
    ...Typography.bodyBold,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.body,
    color: Colors.dark,
    marginBottom: Spacing.xs,
    fontWeight: '600',
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
  textArea: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    ...Typography.body,
    color: Colors.dark,
    minHeight: 80,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  column: {
    flex: 1,
  },
  elevatorColumn: {
    justifyContent: 'flex-end',
  },
  elevatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    // backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    // borderWidth: 1,
    borderColor: Colors.border,
  },
  elevatorTextContainer: {
    flex: 1,
  },
  elevatorLabel: {
    ...Typography.body,
    color: Colors.dark,
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  centersContainer: {
    gap: Spacing.md,
  },
  centerCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
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
    backgroundColor: '#ECFDF5',
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
  centerName: {
    ...Typography.bodyBold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  centerAddress: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  mapSection: {
    marginTop: Spacing.md,
  },
  errorText: {
    ...Typography.small,
    color: Colors.error,
    marginTop: Spacing.xs,
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
