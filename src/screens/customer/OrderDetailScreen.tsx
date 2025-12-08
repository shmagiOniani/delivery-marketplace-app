import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { CustomerScreenProps } from '@/types/navigation';
import { useJobsQuery } from '@/hooks/queries/useJobsQuery';

export const OrderDetailScreen: React.FC<
  CustomerScreenProps<'OrderDetail'>
> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { jobId } = route.params as { jobId: string };
  const { data: jobsData, isLoading } = useJobsQuery({});
  const order = jobsData?.data?.find((job) => job.id === jobId);

  const [pickupName, setPickupName] = useState(order?.pickup_contact_name || '');
  const [pickupFloor, setPickupFloor] = useState('');
  const [deliveryName, setDeliveryName] = useState(
    order?.delivery_contact_name || ''
  );
  const [deliveryFloor, setDeliveryFloor] = useState('');

  if (isLoading || !order) {
    return <LoadingSpinner fullScreen />;
  }

  const pickupCoordinates = {
    latitude: order.pickup_lat,
    longitude: order.pickup_lng,
  };

  const deliveryCoordinates = {
    latitude: order.delivery_lat,
    longitude: order.delivery_lng,
  };

  // Calculate center point for map
  const centerLat = (pickupCoordinates.latitude + deliveryCoordinates.latitude) / 2;
  const centerLng = (pickupCoordinates.longitude + deliveryCoordinates.longitude) / 2;

  // Mock route coordinates (in production, use Google Directions API)
  const routeCoordinates = [
    pickupCoordinates,
    {
      latitude: centerLat,
      longitude: centerLng,
    },
    deliveryCoordinates,
  ];

  // Mock distance and time (in production, calculate from route)
  const distance = 5.2; // km
  const estimatedTime = 15; // minutes

  const handleContinue = () => {
    // Handle continue action
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Map View */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: centerLat,
              longitude: centerLng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {/* Route Polyline */}
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={Colors.primary}
              strokeWidth={3}
              lineDashPattern={[5, 5]}
            />

            {/* Pickup Marker */}
            <Marker coordinate={pickupCoordinates} pinColor={Colors.primary}>
              <View style={styles.pickupMarker}>
                <Icon name="radio-button-checked" size={24} color={Colors.primary} />
              </View>
            </Marker>

            {/* Delivery Marker */}
            <Marker coordinate={deliveryCoordinates} pinColor={Colors.warning}>
              <View style={styles.deliveryMarker}>
                <Icon name="place" size={24} color={Colors.warning} />
              </View>
            </Marker>

            {/* Car Icon (moving along route) */}
            <Marker
              coordinate={{
                latitude: centerLat,
                longitude: centerLng,
              }}
            >
              <View style={styles.carMarker}>
                <Icon name="directions-car" size={24} color={Colors.primary} />
              </View>
            </Marker>
          </MapView>

          {/* Route Information Overlay */}
          <View style={styles.routeInfo}>
            <View style={styles.routeInfoItem}>
              <Icon name="straighten" size={16} color={Colors.text.secondary} />
              <Text style={styles.routeInfoText}>Distance: {distance} km</Text>
            </View>
            <View style={styles.routeInfoItem}>
              <Icon name="access-time" size={16} color={Colors.text.secondary} />
              <Text style={styles.routeInfoText}>Est. Time: {estimatedTime} min</Text>
            </View>
          </View>
        </View>

        {/* Order Status Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.orderId}>Order #{order.id.slice(-4).toUpperCase()}</Text>
            <StatusBadge status={order.status} />
          </View>

          <View style={styles.iconsRow}>
            <View style={styles.iconItem}>
              <Icon name="inventory-2" size={20} color={Colors.primary} />
            </View>
            <View style={styles.iconItem}>
              <Icon name="description" size={20} color={Colors.text.secondary} />
            </View>
            <View style={styles.iconItem}>
              <Icon name="warning" size={20} color={Colors.error} />
            </View>
          </View>

          <Text style={styles.itemDetails}>
            Weight: {order.item_weight || 'N/A'}, Size: {order.item_size || 'N/A'}
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pickup contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={pickupName}
            onChangeText={setPickupName}
            placeholderTextColor={Colors.text.light}
          />
          <TextInput
            style={styles.input}
            placeholder="Floor"
            value={pickupFloor}
            onChangeText={setPickupFloor}
            keyboardType="numeric"
            placeholderTextColor={Colors.text.light}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={deliveryName}
            onChangeText={setDeliveryName}
            placeholderTextColor={Colors.text.light}
          />
          <TextInput
            style={styles.input}
            placeholder="Floor"
            value={deliveryFloor}
            onChangeText={setDeliveryFloor}
            keyboardType="numeric"
            placeholderTextColor={Colors.text.light}
          />
        </View>

        {/* Price Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Item price:</Text>
            <Text style={styles.priceValue}>
              ${(order.customer_price * 0.6).toFixed(2)}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery fee:</Text>
            <Text style={styles.priceValue}>
              ${(order.customer_price * 0.4).toFixed(2)}
            </Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${order.customer_price.toFixed(2)}</Text>
          </View>
        </View>

        {/* Time Picker */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Time picker</Text>
          <TouchableOpacity style={styles.timePicker}>
            <Text style={styles.timePickerText}>Flexible/Specific</Text>
            <Icon name="keyboard-arrow-down" size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </View>
    </View>
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
  mapContainer: {
    height: 300,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  routeInfo: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  routeInfoText: {
    ...Typography.small,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  pickupMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  carMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  orderId: {
    ...Typography.h3,
    color: Colors.text.primary,
    fontWeight: '700',
  },
  iconsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  iconItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  cardTitle: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    ...Typography.body,
    color: Colors.text.primary,
    backgroundColor: Colors.white,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  priceLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  priceValue: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
  },
  totalValue: {
    ...Typography.h3,
    color: Colors.primary,
    fontWeight: '700',
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  timePickerText: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  buttonContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  continueButton: {
    backgroundColor: Colors.primary,
  },
});
