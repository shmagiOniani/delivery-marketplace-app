import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { CustomerScreenProps } from '@/types/navigation';
import {
  calculateDistance,
  estimateDuration,
  formatDistance,
  formatDuration,
} from '@/utils/distanceCalculator';

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
  const { itemType } = route.params as { itemType: string };

  const pickupMapRef = useRef<MapView>(null);
  const deliveryMapRef = useRef<MapView>(null);

  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [activeMap, setActiveMap] = useState<'pickup' | 'delivery'>('pickup');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  // Calculate distance when both locations are set
  React.useEffect(() => {
    if (pickupLocation && deliveryLocation) {
      const dist = calculateDistance(
        pickupLocation.latitude,
        pickupLocation.longitude,
        deliveryLocation.latitude,
        deliveryLocation.longitude
      );
      const dur = estimateDuration(dist);
      setDistance(dist);
      setDuration(dur);
    }
  }, [pickupLocation, deliveryLocation]);

  const getCurrentLocation = (type: 'pickup' | 'delivery') => {
    setIsLoadingLocation(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        const location: Location = { latitude, longitude, address };

        if (type === 'pickup') {
          setPickupLocation(location);
          setPickupAddress(address);
          pickupMapRef.current?.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: TBILISI_COORDS.latitudeDelta,
              longitudeDelta: TBILISI_COORDS.longitudeDelta,
            },
            1000
          );
        } else {
          setDeliveryLocation(location);
          setDeliveryAddress(address);
          deliveryMapRef.current?.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: TBILISI_COORDS.latitudeDelta,
              longitudeDelta: TBILISI_COORDS.longitudeDelta,
            },
            1000
          );
        }
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Location error:', error);
        Alert.alert(
          'Location Error',
          'Unable to get your current location. Please select manually on the map.'
        );
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using Google Geocoding API (you'll need to add your API key)
      // For now, return coordinates as address if API key is not configured
      const apiKey = process.env.GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';
      if (apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
        // Fallback: return formatted coordinates
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
      // Fallback to coordinates if geocoding fails
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleMapPress = async (
    event: any,
    type: 'pickup' | 'delivery'
  ) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const address = await reverseGeocode(latitude, longitude);
    const location: Location = { latitude, longitude, address };

    if (type === 'pickup') {
      setPickupLocation(location);
      setPickupAddress(address);
    } else {
      setDeliveryLocation(location);
      setDeliveryAddress(address);
    }
  };

  const handleNext = () => {
    if (!pickupLocation || !deliveryLocation) {
      Alert.alert('Error', 'Please select both pickup and delivery locations');
      return;
    }

    if (!distance || !duration) {
      Alert.alert('Error', 'Unable to calculate route. Please try again.');
      return;
    }

    navigation.navigate('Customer', {
      screen: 'NewOrderStep3',
      params: {
        itemType,
        pickupLocation,
        deliveryLocation,
        distance,
        duration,
      },
    } as any);
  };

  const renderMap = (type: 'pickup' | 'delivery') => {
    const location = type === 'pickup' ? pickupLocation : deliveryLocation;
    const mapRef = type === 'pickup' ? pickupMapRef : deliveryMapRef;
    const isActive = activeMap === type;

    return (
      <View style={[styles.mapContainer, !isActive && styles.mapHidden]}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location?.latitude || TBILISI_COORDS.latitude,
            longitude: location?.longitude || TBILISI_COORDS.longitude,
            latitudeDelta: TBILISI_COORDS.latitudeDelta,
            longitudeDelta: TBILISI_COORDS.longitudeDelta,
          }}
          onPress={(e) => handleMapPress(e, type)}
          showsUserLocation
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              draggable
              onDragEnd={(e) => handleMapPress(e, type)}
            >
              <View
                style={[
                  styles.marker,
                  { backgroundColor: type === 'pickup' ? Colors.primary : Colors.success },
                ]}
              >
                <Icon
                  name={type === 'pickup' ? 'radio-button-checked' : 'place'}
                  size={24}
                  color={Colors.white}
                />
              </View>
            </Marker>
          )}
        </MapView>

        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={() => getCurrentLocation(type)}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Icon name="my-location" size={24} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>
    );
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
          <Text style={styles.title}>Select Locations</Text>
          <Text style={styles.subtitle}>
            Choose pickup and delivery locations on the map
          </Text>
        </View>

        {/* Map Toggle */}
        <View style={styles.mapToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeMap === 'pickup' && styles.toggleButtonActive,
            ]}
            onPress={() => setActiveMap('pickup')}
          >
            <Icon
              name="radio-button-checked"
              size={20}
              color={activeMap === 'pickup' ? Colors.white : Colors.primary}
            />
            <Text
              style={[
                styles.toggleText,
                activeMap === 'pickup' && styles.toggleTextActive,
              ]}
            >
              Pickup
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeMap === 'delivery' && styles.toggleButtonActive,
            ]}
            onPress={() => setActiveMap('delivery')}
          >
            <Icon
              name="place"
              size={20}
              color={activeMap === 'delivery' ? Colors.white : Colors.success}
            />
            <Text
              style={[
                styles.toggleText,
                activeMap === 'delivery' && styles.toggleTextActive,
              ]}
            >
              Delivery
            </Text>
          </TouchableOpacity>
        </View>

        {/* Maps */}
        <View style={styles.mapsContainer}>
          {renderMap('pickup')}
          {renderMap('delivery')}
        </View>

        {/* Address Inputs */}
        <View style={styles.addressSection}>
          <View style={styles.addressInputContainer}>
            <Icon name="radio-button-checked" size={20} color={Colors.primary} />
            <TextInput
              style={styles.addressInput}
              placeholder="Pickup address"
              value={pickupAddress}
              onChangeText={setPickupAddress}
              placeholderTextColor={Colors.text.secondary}
            />
          </View>
          <View style={styles.addressInputContainer}>
            <Icon name="place" size={20} color={Colors.success} />
            <TextInput
              style={styles.addressInput}
              placeholder="Delivery address"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              placeholderTextColor={Colors.text.secondary}
            />
          </View>
        </View>

        {/* Route Info */}
        {distance && duration && (
          <View style={styles.routeInfo}>
            <View style={styles.routeInfoItem}>
              <Icon name="straighten" size={20} color={Colors.primary} />
              <Text style={styles.routeInfoText}>
                Distance: {formatDistance(distance)}
              </Text>
            </View>
            <View style={styles.routeInfoItem}>
              <Icon name="access-time" size={20} color={Colors.primary} />
              <Text style={styles.routeInfoText}>
                Est. Time: {formatDuration(duration)}
              </Text>
            </View>
          </View>
        )}

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            (!pickupLocation || !deliveryLocation) && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!pickupLocation || !deliveryLocation}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
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
    marginBottom: Spacing.lg,
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
  mapToggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleText: {
    ...Typography.bodyBold,
    color: Colors.dark,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  mapsContainer: {
    height: 400,
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  mapHidden: {
    opacity: 0,
    zIndex: 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addressSection: {
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addressInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.dark,
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  routeInfoText: {
    ...Typography.bodyBold,
    color: Colors.dark,
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
