import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '@/stores/useAuthStore';
import { MapPicker } from '@/screens/customer/job/components/MapPicker';
import type { CustomerScreenProps } from '@/types/navigation';
import type { JobPurpose } from '@/types';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

const TBILISI_COORDS = {
  latitude: 41.7151,
  longitude: 44.8271,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export const NewOrderStep2Screen: React.FC<
  CustomerScreenProps<'NewOrderStep2'>
> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { jobType, title } = route.params as {
    jobType: JobPurpose;
    title: string;
  };

  const mapRef = useRef<MapView>(null);

  // Auto-fill from user profile
  useEffect(() => {
    if (user?.full_name) {
      setPickupContactName(user.full_name);
    }
    if (user?.phone) {
      setPickupContactPhone(user.phone);
    }
  }, [user]);

  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [pickupContactName, setPickupContactName] = useState('');
  const [pickupContactPhone, setPickupContactPhone] = useState('');
  const [pickupNotes, setPickupNotes] = useState('');
  const [pickupFloor, setPickupFloor] = useState('');
  const [pickupElevator, setPickupElevator] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [errors, setErrors] = useState<{
    pickupLocation?: string;
  }>({});

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';
      if (apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleLocationSelect = async (
    address: string,
    lat: number,
    lng: number
  ) => {
    const location: Location = { latitude: lat, longitude: lng, address };
    setPickupLocation(location);
    if (errors.pickupLocation) {
      setErrors({ ...errors, pickupLocation: undefined });
    }
  };

  const handleNext = () => {
    if (!pickupLocation) {
      setErrors({ pickupLocation: 'Please select a pickup location' });
      Alert.alert('Error', 'Please select a pickup location');
      return;
    }

    // For gift jobs, skip Step 3 and go directly to Step 4
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
          pickupFloor: pickupFloor ? parseInt(pickupFloor, 10) : undefined,
          pickupElevator,
          // For gift jobs, use pickup location as delivery location
          deliveryLocation: pickupLocation,
          deliveryContactName: '',
          deliveryContactPhone: '',
          deliveryNotes: '',
          deliveryFloor: undefined,
          deliveryElevator: false,
        },
      } as any);
      return;
    }

    // Navigate to Step 3 (delivery location) for move and recycle jobs
    navigation.navigate('Customer', {
      screen: 'NewOrderStep3',
      params: {
        jobType,
        title,
        pickupLocation,
        pickupContactName,
        pickupContactPhone,
        pickupNotes,
        pickupFloor: pickupFloor ? parseInt(pickupFloor, 10) : undefined,
        pickupElevator,
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
          <Text style={styles.title}>Pickup Location</Text>
          <Text style={styles.subtitle}>
            Select pickup address and provide contact details
          </Text>
        </View>

        {/* Map Picker */}
        <View style={styles.section}>
          <MapPicker
            label="Pickup Address *"
            onLocationSelect={handleLocationSelect}
            defaultAddress={pickupLocation?.address}
            defaultLat={pickupLocation?.latitude}
            defaultLng={pickupLocation?.longitude}
            errorMessage={errors.pickupLocation}
          />
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.label}>Contact Name</Text>
              <TextInput
                style={styles.input}
                value={pickupContactName}
                onChangeText={setPickupContactName}
                placeholder="John Doe"
                placeholderTextColor={Colors.text.secondary}
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Contact Phone</Text>
              <TextInput
                style={styles.input}
                value={pickupContactPhone}
                onChangeText={setPickupContactPhone}
                placeholder="+995 555 123 456"
                placeholderTextColor={Colors.text.secondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Pickup Notes */}
        <View style={styles.section}>
          <Text style={styles.label}>Pickup Notes</Text>
          <TextInput
            style={styles.textArea}
            value={pickupNotes}
            onChangeText={setPickupNotes}
            placeholder="e.g., Ring doorbell, apartment 5B"
            placeholderTextColor={Colors.text.secondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Floor and Elevator */}
        <View style={styles.section}>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.label}>Pickup Floor</Text>
              <TextInput
                style={styles.input}
                value={pickupFloor}
                onChangeText={(text) => {
                  if (text === '' || /^\d+$/.test(text)) {
                    setPickupFloor(text);
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
                <Icon name="elevator" size={24} color={Colors.dark} />
                <View style={styles.elevatorTextContainer}>
                  <Text style={styles.elevatorLabel}>Pickup Elevator</Text>
                </View>
                <Switch
                  value={pickupElevator}
                  onValueChange={setPickupElevator}
                  trackColor={{ false: Colors.lightGray, true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            !pickupLocation && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!pickupLocation}
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
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
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
