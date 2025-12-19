/**
 * ReadOnlyMap - Static map view for displaying selected location
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';

interface ReadOnlyMapProps {
  latitude: number;
  longitude: number;
  address: string;
  label?: string;
}

export const ReadOnlyMap: React.FC<ReadOnlyMapProps> = ({
  latitude,
  longitude,
  address,
  label,
}) => {
  const region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>
      </View>

      <Text style={styles.address}>{address}</Text>
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
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  address: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: Spacing.sm,
  },
});

