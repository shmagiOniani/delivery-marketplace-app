/**
 * MapPicker - Interactive map for selecting pickup/delivery locations
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';

interface MapPickerProps {
  label: string;
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  defaultAddress?: string;
  defaultLat?: number;
  defaultLng?: number;
  errorMessage?: string;
}

const TBILISI_COORDS = {
  latitude: 41.7151,
  longitude: 44.8271,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export const MapPicker: React.FC<MapPickerProps> = ({
  label,
  onLocationSelect,
  defaultAddress = '',
  defaultLat,
  defaultLng,
  errorMessage,
}) => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: defaultLat || TBILISI_COORDS.latitude,
    longitude: defaultLng || TBILISI_COORDS.longitude,
    latitudeDelta: TBILISI_COORDS.latitudeDelta,
    longitudeDelta: TBILISI_COORDS.longitudeDelta,
  });
  const [markerPosition, setMarkerPosition] = useState({
    latitude: defaultLat || TBILISI_COORDS.latitude,
    longitude: defaultLng || TBILISI_COORDS.longitude,
  });
  const [address, setAddress] = useState(defaultAddress);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    if (defaultLat && defaultLng) {
      setMarkerPosition({ latitude: defaultLat, longitude: defaultLng });
      setRegion({
        latitude: defaultLat,
        longitude: defaultLng,
        latitudeDelta: TBILISI_COORDS.latitudeDelta,
        longitudeDelta: TBILISI_COORDS.longitudeDelta,
      });
    }
  }, [defaultLat, defaultLng]);

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
    
    // Reverse geocode to get address
    try {
      const geocodedAddress = await reverseGeocode(latitude, longitude);
      setAddress(geocodedAddress);
      onLocationSelect(geocodedAddress, latitude, longitude);
    } catch (error) {
      console.error('Geocoding error:', error);
      setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      onLocationSelect(
        `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        latitude,
        longitude
      );
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using Google Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_GOOGLE_MAPS_API_KEY`
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

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: TBILISI_COORDS.latitudeDelta,
          longitudeDelta: TBILISI_COORDS.longitudeDelta,
        };
        
        setRegion(newRegion);
        setMarkerPosition({ latitude, longitude });
        
        try {
          const geocodedAddress = await reverseGeocode(latitude, longitude);
          setAddress(geocodedAddress);
          onLocationSelect(geocodedAddress, latitude, longitude);
        } catch (error) {
          console.error('Geocoding error:', error);
        }
        
        setIsLoadingLocation(false);
        
        // Animate to user's location
        mapRef.current?.animateToRegion(newRegion, 1000);
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

  const handleAddressChange = (text: string) => {
    setAddress(text);
  };

  const searchAddress = async () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter an address to search');
      return;
    }

    try {
      setIsLoadingLocation(true);
      // Using Google Geocoding API for forward geocoding
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const newRegion = {
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: TBILISI_COORDS.latitudeDelta,
          longitudeDelta: TBILISI_COORDS.longitudeDelta,
        };

        setRegion(newRegion);
        setMarkerPosition({ latitude: location.lat, longitude: location.lng });
        setAddress(data.results[0].formatted_address);
        onLocationSelect(
          data.results[0].formatted_address,
          location.lat,
          location.lng
        );

        mapRef.current?.animateToRegion(newRegion, 1000);
      } else {
        Alert.alert('Not Found', 'Could not find the address. Please try again.');
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search address. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* Address Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.addressInput}
          value={address}
          onChangeText={handleAddressChange}
          placeholder="Enter address or select on map"
          placeholderTextColor={Colors.gray}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchAddress}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onPress={handleMapPress}
          showsUserLocation
          showsMyLocationButton={false}
        >
          <Marker coordinate={markerPosition} draggable onDragEnd={handleMapPress} />
        </MapView>

        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Text style={styles.currentLocationText}>📍</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* Coordinates Display */}
      <Text style={styles.coordsText}>
        Coordinates: {markerPosition.latitude.toFixed(6)},{' '}
        {markerPosition.longitude.toFixed(6)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: Spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  addressInput: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    color: Colors.dark,
  },
  searchButton: {
    marginLeft: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
  currentLocationText: {
    fontSize: 24,
  },
  coordsText: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: Spacing.xs,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});

