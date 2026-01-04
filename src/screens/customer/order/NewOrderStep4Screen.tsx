import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCreateOrderMutation } from '@/hooks/mutations/useOrderMutations';
import { calculatePrice } from '@/utils/priceCalculator';
import { formatDistance, formatDuration } from '@/utils/distanceCalculator';
import type { CustomerScreenProps } from '@/types/navigation';

export const NewOrderStep4Screen: React.FC<
  CustomerScreenProps<'NewOrderStep4'>
> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    itemType,
    pickupLocation,
    deliveryLocation,
    distance,
    duration,
    images,
    description,
    itemSize,
    floor,
    hasElevator,
  } = route.params as {
    itemType: string;
    pickupLocation: { latitude: number; longitude: number; address: string };
    deliveryLocation: { latitude: number; longitude: number; address: string };
    distance: number;
    duration: number;
    images: string[];
    description: string;
    itemSize: string;
    floor?: number;
    hasElevator?: boolean;
  };

  const createOrderMutation = useCreateOrderMutation();
  const [paymentType, setPaymentType] = useState<'CASH' | 'ONLINE_PAYMENT'>(
    'ONLINE_PAYMENT'
  );

  // Calculate pricing
  const pricing = calculatePrice({
    distanceKm: distance,
    floor: floor || 0,
    hasElevator: hasElevator ?? true,
    itemSize: (itemSize as 'small' | 'medium' | 'large' | 'xlarge') || 'medium',
  });

  const centerLat = (pickupLocation.latitude + deliveryLocation.latitude) / 2;
  const centerLng = (pickupLocation.longitude + deliveryLocation.longitude) / 2;

  const routeCoordinates = [
    pickupLocation,
    { latitude: centerLat, longitude: centerLng },
    deliveryLocation,
  ];

  const handleSubmit = async () => {
    try {
      // Calculate final pricing based on payment type
      // For CASH: platform_fee = 0, customer pays subtotal
      // For ONLINE_PAYMENT: platform_fee = 15%, customer pays total
      const finalPlatformFee = paymentType === 'CASH' ? 0 : pricing.platformFee;
      const finalCustomerPrice = paymentType === 'CASH' ? pricing.subtotal : pricing.total;
      const finalDriverPayout = paymentType === 'CASH' ? pricing.subtotal : pricing.driverPayout;

      // Prepare JSON payload according to API spec
      const jobData = {
        // Required fields
        title: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} delivery`,
        pickup_address: pickupLocation.address,
        pickup_lat: pickupLocation.latitude,
        pickup_lng: pickupLocation.longitude,
        delivery_address: deliveryLocation.address,
        delivery_lat: deliveryLocation.latitude,
        delivery_lng: deliveryLocation.longitude,
        customer_price: finalCustomerPrice,
        driver_payout: finalDriverPayout,
        platform_fee: finalPlatformFee,
        payment_type: paymentType,

        // Optional fields
        description: description,
        job_type: 'move' as const, // Default to move for now
        item_category: itemType,
        item_size: itemSize.charAt(0).toUpperCase() + itemSize.slice(1), // Capitalize first letter
        requires_help: false, // Can be added to form later
        pickup_photos: images.length > 0 ? images : undefined,
      };

      // Add optional fields only if they have values
      if (floor !== undefined && floor > 0) {
        // Note: API doesn't have pickup_floor field, but we can add it to notes
        jobData.pickup_notes = `Floor: ${floor}. ${hasElevator ? 'Elevator available' : 'No elevator'}`;
      } else if (!hasElevator) {
        jobData.pickup_notes = 'No elevator available';
      }

      // Submit order
      const result = await createOrderMutation.mutateAsync(jobData);

      if (result.success) {
        // Check if job was flagged for moderation
        if (result.reasons && result.reasons.length > 0) {
          // Show moderation warning but still navigate
          Alert.alert(
            'Order Created (Under Review)',
            `Your order has been created but is being reviewed for the following reasons:\n\n${result.reasons.join('\n')}\n\nIt may not be visible to drivers until approved.`,
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('Customer', {
                    screen: 'OrderSuccess',
                    params: { jobId: result.data.id },
                  } as any);
                },
              },
            ]
          );
        } else {
          // Success - navigate to success screen
          navigation.navigate('Customer', {
            screen: 'OrderSuccess',
            params: { jobId: result.data.id },
          } as any);
        }
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      
      // Handle moderation errors
      if (error.reasons && error.reasons.length > 0) {
        Alert.alert(
          'Order Creation Failed',
          `Your order was rejected for the following reasons:\n\n${error.reasons.join('\n')}\n\nPlease review your content and try again.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Order Failed',
          error.message || 'Failed to create order. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
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
          <Text style={styles.title}>Confirm Order</Text>
          <Text style={styles.subtitle}>
            Review your order details before submitting
          </Text>
        </View>

        {/* Map Preview */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: centerLat,
              longitude: centerLng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={Colors.primary}
              strokeWidth={3}
              lineDashPattern={[5, 5]}
            />
            <Marker coordinate={pickupLocation}>
              <View style={styles.pickupMarker}>
                <Icon name="radio-button-checked" size={20} color={Colors.primary} />
              </View>
            </Marker>
            <Marker coordinate={deliveryLocation}>
              <View style={styles.deliveryMarker}>
                <Icon name="place" size={20} color={Colors.success} />
              </View>
            </Marker>
          </MapView>
        </View>

        {/* Route Info */}
        <View style={styles.routeInfoCard}>
          <View style={styles.routeInfoItem}>
            <Icon name="straighten" size={20} color={Colors.primary} />
            <Text style={styles.routeInfoText}>
              {formatDistance(distance)}
            </Text>
          </View>
          <View style={styles.routeInfoItem}>
            <Icon name="access-time" size={20} color={Colors.primary} />
            <Text style={styles.routeInfoText}>
              {formatDuration(duration)}
            </Text>
          </View>
        </View>

        {/* Locations */}
        <View style={styles.card}>
          <View style={styles.locationItem}>
            <View style={styles.locationIcon}>
              <Icon name="radio-button-checked" size={20} color={Colors.primary} />
            </View>
            <View style={styles.locationText}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationAddress}>
                {pickupLocation.address}
              </Text>
            </View>
          </View>
          <View style={styles.locationItem}>
            <View style={styles.locationIcon}>
              <Icon name="place" size={20} color={Colors.success} />
            </View>
            <View style={styles.locationText}>
              <Text style={styles.locationLabel}>Delivery</Text>
              <Text style={styles.locationAddress}>
                {deliveryLocation.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Item Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Item Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailValue}>{itemType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Size:</Text>
            <Text style={styles.detailValue}>{itemSize}</Text>
          </View>
          {floor !== undefined && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Floor:</Text>
              <Text style={styles.detailValue}>{floor}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Elevator:</Text>
            <Text style={styles.detailValue}>
              {hasElevator ? 'Yes' : 'No'}
            </Text>
          </View>
          {description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={styles.descriptionText}>{description}</Text>
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentType === 'ONLINE_PAYMENT' && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentType('ONLINE_PAYMENT')}
            >
              <Icon
                name="credit-card"
                size={24}
                color={
                  paymentType === 'ONLINE_PAYMENT' ? Colors.white : Colors.dark
                }
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentType === 'ONLINE_PAYMENT' &&
                    styles.paymentOptionTextSelected,
                ]}
              >
                Online Payment
              </Text>
              {paymentType === 'ONLINE_PAYMENT' && (
                <View style={styles.paymentCheckmark}>
                  <Icon name="check" size={16} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentType === 'CASH' && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentType('CASH')}
            >
              <Icon
                name="money"
                size={24}
                color={paymentType === 'CASH' ? Colors.white : Colors.dark}
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentType === 'CASH' && styles.paymentOptionTextSelected,
                ]}
              >
                Cash on Delivery
              </Text>
              {paymentType === 'CASH' && (
                <View style={styles.paymentCheckmark}>
                  <Icon name="check" size={16} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Pricing Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pricing Breakdown</Text>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Base Price:</Text>
            <Text style={styles.pricingValue}>
              ₾{pricing.basePrice.toFixed(2)}
            </Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Distance ({formatDistance(distance)}):</Text>
            <Text style={styles.pricingValue}>
              ₾{pricing.distancePrice.toFixed(2)}
            </Text>
          </View>
          {pricing.floorPrice > 0 && (
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Floor Fee:</Text>
              <Text style={styles.pricingValue}>
                ₾{pricing.floorPrice.toFixed(2)}
              </Text>
            </View>
          )}
          {paymentType === 'ONLINE_PAYMENT' && pricing.platformFee > 0 && (
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Platform Fee (15%):</Text>
              <Text style={styles.pricingValue}>
                ₾{pricing.platformFee.toFixed(2)}
              </Text>
            </View>
          )}
          {paymentType === 'CASH' && (
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Platform Fee:</Text>
              <Text style={styles.pricingValue}>₾0.00 (Cash payment)</Text>
            </View>
          )}
          <View style={styles.pricingDivider} />
          <View style={styles.pricingDivider} />
          <View style={styles.pricingRow}>
            <Text style={styles.pricingTotalLabel}>Total:</Text>
            <Text style={styles.pricingTotalValue}>
              ₾
              {paymentType === 'CASH'
                ? pricing.subtotal.toFixed(2)
                : pricing.total.toFixed(2)}
            </Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Driver receives:</Text>
            <Text style={styles.pricingValue}>
              ₾
              {paymentType === 'CASH'
                ? pricing.subtotal.toFixed(2)
                : pricing.driverPayout.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            createOrderMutation.isPending && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={createOrderMutation.isPending}
          activeOpacity={0.8}
        >
          {createOrderMutation.isPending ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Create Order</Text>
              <Icon name="check-circle" size={20} color={Colors.white} />
            </>
          )}
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
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
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
  routeInfoCard: {
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  locationIcon: {
    marginRight: Spacing.md,
    marginTop: 2,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs / 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  locationAddress: {
    ...Typography.body,
    color: Colors.dark,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  detailValue: {
    ...Typography.bodyBold,
    color: Colors.dark,
    textTransform: 'capitalize',
  },
  descriptionContainer: {
    marginTop: Spacing.sm,
  },
  descriptionText: {
    ...Typography.body,
    color: Colors.dark,
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  paymentOptions: {
    gap: Spacing.sm,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  paymentOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  paymentOptionText: {
    ...Typography.bodyBold,
    color: Colors.dark,
    flex: 1,
  },
  paymentOptionTextSelected: {
    color: Colors.white,
  },
  paymentCheckmark: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  pricingLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  pricingValue: {
    ...Typography.body,
    color: Colors.dark,
  },
  pricingDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  pricingTotalLabel: {
    ...Typography.h3,
    color: Colors.dark,
  },
  pricingTotalValue: {
    ...Typography.h3,
    color: Colors.primary,
  },
  submitButton: {
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
    fontSize: 18,
  },
});
