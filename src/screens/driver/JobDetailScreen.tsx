import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
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
import { useJobQuery } from '@/hooks/queries/useJobsQuery';
import { useUpdateOrderStatusMutation } from '@/hooks/mutations/useOrderMutations';
import type { DriverScreenProps } from '@/types/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export const JobDetailScreen: React.FC<DriverScreenProps<'JobDetail'>> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { jobId } = route.params as { jobId: string };
  const user = useAuthStore((state) => state.user);
  const { data: job, isLoading } = useJobQuery(jobId);
  const updateStatusMutation = useUpdateOrderStatusMutation();

  const [isAccepting, setIsAccepting] = useState(false);

  if (isLoading || !job) {
    return <LoadingSpinner fullScreen />;
  }

  const pickupCoordinates = {
    latitude: job.pickup_lat,
    longitude: job.pickup_lng,
  };

  const deliveryCoordinates = {
    latitude: job.delivery_lat,
    longitude: job.delivery_lng,
  };

  const centerLat = (pickupCoordinates.latitude + deliveryCoordinates.latitude) / 2;
  const centerLng = (pickupCoordinates.longitude + deliveryCoordinates.longitude) / 2;

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

  const handleAcceptJob = () => {
    Alert.alert(
      'Accept Job',
      'Are you sure you want to accept this job?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            setIsAccepting(true);
            try {
              await updateStatusMutation.mutateAsync({
                jobId: job.id,
                status: 'accepted',
              });
              navigation.goBack();
            } catch (error) {
              // Error handled by mutation
            } finally {
              setIsAccepting(false);
            }
          },
        },
      ]
    );
  };

  const handleStartDelivery = () => {
    Alert.alert(
      'Start Delivery',
      'Mark this job as in transit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: async () => {
            try {
              await updateStatusMutation.mutateAsync({
                jobId: job.id,
                status: 'in_transit',
              });
              navigation.goBack();
            } catch (error) {
              // Error handled by mutation
            }
          },
        },
      ]
    );
  };

  const handleCompleteDelivery = () => {
    Alert.alert(
      'Complete Delivery',
      'Mark this job as delivered?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              await updateStatusMutation.mutateAsync({
                jobId: job.id,
                status: 'delivered',
              });
              navigation.goBack();
            } catch (error) {
              // Error handled by mutation
            }
          },
        },
      ]
    );
  };

  const isMyJob = job.driver_id === user?.id;
  const canAccept = job.status === 'pending' && !isMyJob;
  const canStart = job.status === 'accepted' && isMyJob;
  const canComplete = job.status === 'in_transit' && isMyJob;

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
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={Colors.primary}
              strokeWidth={3}
              lineDashPattern={[5, 5]}
            />
            <Marker coordinate={pickupCoordinates}>
              <View style={styles.pickupMarker}>
                <Icon name="radio-button-checked" size={24} color={Colors.primary} />
              </View>
            </Marker>
            <Marker coordinate={deliveryCoordinates}>
              <View style={styles.deliveryMarker}>
                <Icon name="place" size={24} color={Colors.error} />
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

        {/* Job Header Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobId}>#{job.id.slice(-4).toUpperCase()}</Text>
            </View>
            <StatusBadge status={job.status} />
          </View>

          {/* Payout */}
          <View style={styles.payoutContainer}>
            <View>
              <Text style={styles.payoutLabel}>Your Payout</Text>
              <Text style={styles.payoutAmount}>${job.driver_payout.toFixed(2)}</Text>
            </View>
            <View style={styles.paymentTypeBadge}>
              <Icon
                name={job.payment_type === 'CASH' ? 'money' : 'credit-card'}
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.paymentTypeText}>{job.payment_type}</Text>
            </View>
          </View>
        </View>

        {/* Route Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Route Details</Text>
          <View style={styles.routeDetail}>
            <View style={styles.routeDetailHeader}>
              <Icon name="radio-button-checked" size={20} color={Colors.success} />
              <Text style={styles.routeDetailLabel}>Pickup Location</Text>
            </View>
            <Text style={styles.routeDetailAddress}>{job.pickup_address}</Text>
            {job.pickup_contact_name && (
              <Text style={styles.routeDetailContact}>
                Contact: {job.pickup_contact_name}
                {job.pickup_contact_phone && ` · ${job.pickup_contact_phone}`}
              </Text>
            )}
            {job.pickup_notes && (
              <Text style={styles.routeDetailNotes}>{job.pickup_notes}</Text>
            )}
          </View>

          <View style={styles.routeDetail}>
            <View style={styles.routeDetailHeader}>
              <Icon name="place" size={20} color={Colors.error} />
              <Text style={styles.routeDetailLabel}>Delivery Location</Text>
            </View>
            <Text style={styles.routeDetailAddress}>{job.delivery_address}</Text>
            {job.delivery_contact_name && (
              <Text style={styles.routeDetailContact}>
                Contact: {job.delivery_contact_name}
                {job.delivery_contact_phone && ` · ${job.delivery_contact_phone}`}
              </Text>
            )}
            {job.delivery_notes && (
              <Text style={styles.routeDetailNotes}>{job.delivery_notes}</Text>
            )}
          </View>
        </View>

        {/* Item Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Item Details</Text>
          <View style={styles.itemDetailsGrid}>
            <View style={styles.itemDetailItem}>
              <Icon name="category" size={20} color={Colors.text.secondary} />
              <Text style={styles.itemDetailLabel}>Category</Text>
              <Text style={styles.itemDetailValue}>
                {job.item_category || 'N/A'}
              </Text>
            </View>
            <View style={styles.itemDetailItem}>
              <Icon name="straighten" size={20} color={Colors.text.secondary} />
              <Text style={styles.itemDetailLabel}>Size</Text>
              <Text style={styles.itemDetailValue}>
                {job.item_size || 'N/A'}
              </Text>
            </View>
            <View style={styles.itemDetailItem}>
              <Icon name="scale" size={20} color={Colors.text.secondary} />
              <Text style={styles.itemDetailLabel}>Weight</Text>
              <Text style={styles.itemDetailValue}>
                {job.item_weight || 'N/A'}
              </Text>
            </View>
            {job.requires_help && (
              <View style={styles.itemDetailItem}>
                <Icon name="help-outline" size={20} color={Colors.primary} />
                <Text style={styles.itemDetailLabel}>Help Needed</Text>
                <Text style={styles.itemDetailValue}>Yes</Text>
              </View>
            )}
          </View>

          {job.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>Description</Text>
              <Text style={styles.descriptionText}>{job.description}</Text>
            </View>
          )}

          {/* Photos */}
          {job.pickup_photos && job.pickup_photos.length > 0 && (
            <View style={styles.photosContainer}>
              <Text style={styles.photosLabel}>Pickup Photos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {job.pickup_photos.map((photo, index) => (
                  <Image
                    key={index}
                    source={{ uri: photo }}
                    style={styles.photo}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Customer Info */}
        {job.customer && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Customer</Text>
            <View style={styles.customerInfo}>
              <View style={styles.customerAvatar}>
                {job.customer.avatar_url ? (
                  <Image
                    source={{ uri: job.customer.avatar_url }}
                    style={styles.customerAvatarImage}
                  />
                ) : (
                  <Icon name="person" size={24} color={Colors.white} />
                )}
              </View>
              <View style={styles.customerDetails}>
                <Text style={styles.customerName}>{job.customer.full_name}</Text>
                {job.customer.rating && (
                  <View style={styles.ratingContainer}>
                    <Icon name="star" size={16} color={Colors.primary} />
                    <Text style={styles.rating}>{job.customer.rating.toFixed(1)}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => {
                  navigation.navigate('Driver', {
                    screen: 'Chat',
                    params: { jobId: job.id },
                  } as any);
                }}
              >
                <Icon name="message" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {canAccept && (
          <Button
            title="Accept Job"
            onPress={handleAcceptJob}
            style={styles.acceptButton}
            disabled={isAccepting}
          />
        )}
        {canStart && (
          <Button
            title="Start Delivery"
            onPress={handleStartDelivery}
            style={styles.startButton}
          />
        )}
        {canComplete && (
          <Button
            title="Complete Delivery"
            onPress={handleCompleteDelivery}
            style={styles.completeButton}
          />
        )}
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
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  jobTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  jobId: {
    ...Typography.tiny,
    color: Colors.text.light,
  },
  payoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  payoutLabel: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  payoutAmount: {
    ...Typography.h2,
    color: Colors.primary,
    fontWeight: '700',
  },
  paymentTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  paymentTypeText: {
    ...Typography.small,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  cardTitle: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  routeDetail: {
    marginBottom: Spacing.lg,
  },
  routeDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  routeDetailLabel: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
  },
  routeDetailAddress: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  routeDetailContact: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  routeDetailNotes: {
    ...Typography.small,
    color: Colors.text.light,
    fontStyle: 'italic',
  },
  itemDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  itemDetailItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  itemDetailLabel: {
    ...Typography.tiny,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    marginBottom: 4,
  },
  itemDetailValue: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
  },
  descriptionContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  descriptionLabel: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  descriptionText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  photosContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  photosLabel: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: Spacing.sm,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  customerAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  rating: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  contactButton: {
    padding: Spacing.sm,
  },
  buttonContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
  },
  startButton: {
    backgroundColor: Colors.success,
  },
  completeButton: {
    backgroundColor: Colors.success,
  },
});
