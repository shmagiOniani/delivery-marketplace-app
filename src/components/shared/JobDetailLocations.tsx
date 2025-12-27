import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';

interface JobDetailLocationsProps {
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  pickupContactName?: string | null;
  pickupContactPhone?: string | null;
  pickupNotes?: string | null;
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  deliveryContactName?: string | null;
  deliveryContactPhone?: string | null;
  deliveryNotes?: string | null;
}

export const JobDetailLocations: React.FC<JobDetailLocationsProps> = ({
  pickupAddress,
  pickupLat,
  pickupLng,
  pickupContactName,
  pickupContactPhone,
  pickupNotes,
  deliveryAddress,
  deliveryLat,
  deliveryLng,
  deliveryContactName,
  deliveryContactPhone,
  deliveryNotes,
}) => {
  const handlePhonePress = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleOpenInMaps = (lat: number, lng: number, label: string) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url!);
  };

  const pickupCoords = { latitude: pickupLat, longitude: pickupLng };
  const deliveryCoords = { latitude: deliveryLat, longitude: deliveryLng };
  const centerLat = (pickupLat + deliveryLat) / 2;
  const centerLng = (pickupLng + deliveryLng) / 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Locations</Text>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: centerLat,
            longitude: centerLng,
            latitudeDelta: Math.abs(pickupLat - deliveryLat) * 2 || 0.05,
            longitudeDelta: Math.abs(pickupLng - deliveryLng) * 2 || 0.05,
          }}
        >
          {/* Pickup Marker */}
          <Marker coordinate={pickupCoords} title="Pickup Location">
            <View style={styles.pickupMarker}>
              <Icon name="place" size={32} color={Colors.primary} />
            </View>
          </Marker>

          {/* Delivery Marker */}
          <Marker coordinate={deliveryCoords} title="Delivery Location">
            <View style={styles.deliveryMarker}>
              <Icon name="location-on" size={32} color={Colors.success} />
            </View>
          </Marker>

          {/* Route Line */}
          <Polyline
            coordinates={[pickupCoords, deliveryCoords]}
            strokeColor={Colors.primary}
            strokeWidth={3}
            lineDashPattern={[1]}
          />
        </MapView>
      </View>

      {/* Pickup Location Details */}
      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <Icon name="place" size={24} color={Colors.primary} />
          <Text style={styles.locationTitle}>Pickup Location</Text>
        </View>

        <TouchableOpacity
          onPress={() => handleOpenInMaps(pickupLat, pickupLng, 'Pickup')}
          style={styles.addressRow}
        >
          <Text style={styles.address}>{pickupAddress}</Text>
          <Icon name="open-in-new" size={20} color={Colors.primary} />
        </TouchableOpacity>

        {pickupContactName && (
          <View style={styles.infoRow}>
            <Icon name="person" size={20} color={Colors.text.secondary} />
            <Text style={styles.infoText}>{pickupContactName}</Text>
          </View>
        )}

        {pickupContactPhone && (
          <TouchableOpacity
            onPress={() => handlePhonePress(pickupContactPhone)}
            style={styles.infoRow}
          >
            <Icon name="phone" size={20} color={Colors.primary} />
            <Text style={[styles.infoText, styles.phoneText]}>
              {pickupContactPhone}
            </Text>
          </TouchableOpacity>
        )}

        {pickupNotes && (
          <View style={styles.notesContainer}>
            <Icon name="note" size={20} color={Colors.text.secondary} />
            <Text style={styles.notesText}>{pickupNotes}</Text>
          </View>
        )}
      </View>

      {/* Delivery Location Details */}
      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <Icon name="location-on" size={24} color={Colors.success} />
          <Text style={styles.locationTitle}>Delivery Location</Text>
        </View>

        <TouchableOpacity
          onPress={() => handleOpenInMaps(deliveryLat, deliveryLng, 'Delivery')}
          style={styles.addressRow}
        >
          <Text style={styles.address}>{deliveryAddress}</Text>
          <Icon name="open-in-new" size={20} color={Colors.primary} />
        </TouchableOpacity>

        {deliveryContactName && (
          <View style={styles.infoRow}>
            <Icon name="person" size={20} color={Colors.text.secondary} />
            <Text style={styles.infoText}>{deliveryContactName}</Text>
          </View>
        )}

        {deliveryContactPhone && (
          <TouchableOpacity
            onPress={() => handlePhonePress(deliveryContactPhone)}
            style={styles.infoRow}
          >
            <Icon name="phone" size={20} color={Colors.primary} />
            <Text style={[styles.infoText, styles.phoneText]}>
              {deliveryContactPhone}
            </Text>
          </TouchableOpacity>
        )}

        {deliveryNotes && (
          <View style={styles.notesContainer}>
            <Icon name="note" size={20} color={Colors.text.secondary} />
            <Text style={styles.notesText}>{deliveryNotes}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    ...Typography.h3,
    color: Colors.text.primary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  pickupMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationCard: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  locationTitle: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  address: {
    ...Typography.body,
    color: Colors.text.primary,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  phoneText: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  notesText: {
    ...Typography.small,
    color: Colors.text.secondary,
    flex: 1,
    fontStyle: 'italic',
  },
});

