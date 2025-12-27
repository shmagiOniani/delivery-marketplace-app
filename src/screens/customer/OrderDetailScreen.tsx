import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { JobStatusTracker } from '@/components/shared/JobStatusTracker';
import { JobDetailLocations } from '@/components/shared/JobDetailLocations';
import { CustomerDeliveryApproval } from '@/components/shared/CustomerDeliveryApproval';
import { JobDetailRatingPrompt } from '@/components/shared/JobDetailRatingPrompt';
import { ApplicationCard } from '@/components/shared/ApplicationCard';
import type { CustomerScreenProps } from '@/types/navigation';
import { useJobsQuery } from '@/hooks/queries/useJobsQuery';
import { usePaymentQuery } from '@/hooks/queries/usePaymentQuery';
import { useApplicationsQuery } from '@/hooks/queries/useApplicationsQuery';
import { useInitiatePaymentMutation } from '@/hooks/mutations/usePaymentMutations';
import { useOrderMutations } from '@/hooks/mutations/useOrderMutations';

export const OrderDetailScreen: React.FC<
  CustomerScreenProps<'OrderDetail'>
> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { jobId } = route.params as { jobId: string };
  
  const { data: jobsData, isLoading: isLoadingJob } = useJobsQuery({});
  const order = jobsData?.find((job) => job.id === jobId);
  
  const { data: payment, isLoading: isLoadingPayment } = usePaymentQuery(jobId);
  const { data: applications = [], isLoading: isLoadingApplications } = useApplicationsQuery(jobId);
  
  const initiatePayment = useInitiatePaymentMutation();
  const { cancelOrder } = useOrderMutations();
  
  const [currentPage, setCurrentPage] = useState(0);
  const [hasRated, setHasRated] = useState(false); // TODO: Check from API
  const [selectingAppId, setSelectingAppId] = useState<string | null>(null);

  if (isLoadingJob || !order) {
    return <LoadingSpinner fullScreen />;
  }

  const screenWidth = Dimensions.get('window').width;
  const pickupPhotos = order.pickup_photos || [];
  const hasPhotos = pickupPhotos.length > 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePayNow = async () => {
    try {
      const response = await initiatePayment.mutateAsync(jobId);
      // Open payment URL in browser or webview
      if (response.url) {
        Linking.openURL(response.url);
      }
    } catch (error) {
      Alert.alert('Payment Error', 'Failed to initiate payment. Please try again.');
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? This action cannot be undone.',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelOrder.mutateAsync(jobId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel order. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSelectApplication = async (applicationId: string) => {
    setSelectingAppId(applicationId);
    try {
      // TODO: Implement select application API call
      // await selectApplication.mutateAsync({ jobId, applicationId });
      Alert.alert('Success', 'Driver selected successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to select driver. Please try again.');
    } finally {
      setSelectingAppId(null);
    }
  };

  const handleMessageDriver = () => {
    if (order.driver_id) {
      // @ts-ignore
      navigation.navigate('Chat', { jobId, driverId: order.driver_id });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Photos */}
        {hasPhotos && (
          <View style={styles.swipeableContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScrollView}
              onMomentumScrollEnd={(event) => {
                const pageIndex = Math.round(
                  event.nativeEvent.contentOffset.x / screenWidth
                );
                setCurrentPage(pageIndex);
              }}
            >
              {pickupPhotos.map((photo, index) => (
                <View key={index} style={[styles.photoContainer, { width: screenWidth }]}>
                  <Image
                    source={{ uri: photo }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                  <View style={styles.photoOverlay}>
                    <Text style={styles.photoLabel}>Pickup Photo {index + 1}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {hasPhotos && (
              <View style={styles.pageIndicator}>
                {pickupPhotos.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.pageIndicatorDot,
                      currentPage === index && styles.pageIndicatorDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.jobTitle}>{order.title || 'Delivery Order'}</Text>
              <Text style={styles.orderId}>Order #{order.id.slice(-8).toUpperCase()}</Text>
              <Text style={styles.createdDate}>Created: {formatDate(order.created_at)}</Text>
              {order.scheduled_pickup && (
                <Text style={styles.scheduledDate}>
                  Scheduled: {formatDateTime(order.scheduled_pickup)}
                </Text>
              )}
            </View>
            <StatusBadge status={order.status} />
          </View>

          {order.description && (
            <Text style={styles.description}>{order.description}</Text>
          )}

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total Price:</Text>
            <Text style={styles.priceValue}>₾{order.customer_price.toFixed(2)}</Text>
          </View>
        </View>

        {/* Banned Order Alert */}
        {order.status === 'banned' && (
          <View style={styles.bannedAlert}>
            <Icon name="warning" size={32} color="#92400E" />
            <View style={styles.bannedContent}>
              <Text style={styles.bannedTitle}>Banned Order</Text>
              <Text style={styles.bannedMessage}>
                This order has been flagged and is under review. Please contact support
                for more information.
              </Text>
            </View>
          </View>
        )}

        {/* Delivery Approval Section */}
        {order.status === 'delivered' && (
          <CustomerDeliveryApproval jobId={jobId} deliveryTime={order.delivery_time} />
        )}

        {/* Rating Prompt */}
        {order.status === 'done' && !hasRated && (
          <JobDetailRatingPrompt
            jobId={jobId}
            driverName={order.driver?.full_name}
          />
        )}

        {/* Status Tracker */}
        <JobStatusTracker
          status={order.status}
          pickupTime={order.pickup_time}
          deliveryTime={order.delivery_time}
          createdAt={order.created_at}
        />

        {/* Locations */}
        <JobDetailLocations
          pickupAddress={order.pickup_address}
          pickupLat={order.pickup_lat}
          pickupLng={order.pickup_lng}
          pickupContactName={order.pickup_contact_name}
          pickupContactPhone={order.pickup_contact_phone}
          pickupNotes={order.pickup_notes}
          deliveryAddress={order.delivery_address}
          deliveryLat={order.delivery_lat}
          deliveryLng={order.delivery_lng}
          deliveryContactName={order.delivery_contact_name}
          deliveryContactPhone={order.delivery_contact_phone}
          deliveryNotes={order.delivery_notes}
        />

        {/* Item Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Item Details</Text>
          <View style={styles.itemGrid}>
            {order.item_category && (
              <View style={styles.itemDetail}>
                <Icon name="category" size={20} color={Colors.text.secondary} />
                <View>
                  <Text style={styles.itemLabel}>Category</Text>
                  <Text style={styles.itemValue}>{order.item_category}</Text>
                </View>
              </View>
            )}
            {order.item_size && (
              <View style={styles.itemDetail}>
                <Icon name="straighten" size={20} color={Colors.text.secondary} />
                <View>
                  <Text style={styles.itemLabel}>Size</Text>
                  <Text style={styles.itemValue}>{order.item_size}</Text>
                </View>
              </View>
            )}
            {order.item_weight && (
              <View style={styles.itemDetail}>
                <Icon name="fitness-center" size={20} color={Colors.text.secondary} />
                <View>
                  <Text style={styles.itemLabel}>Weight</Text>
                  <Text style={styles.itemValue}>{order.item_weight}</Text>
                </View>
              </View>
            )}
            <View style={styles.itemDetail}>
              <Icon name="accessible" size={20} color={Colors.text.secondary} />
              <View>
                <Text style={styles.itemLabel}>Help Required</Text>
                <Text style={styles.itemValue}>
                  {order.requires_help ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Applications Section - Only for Pending Orders */}
        {order.status === 'pending' && (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="people" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Applications</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{applications.length}</Text>
              </View>
            </View>

            {isLoadingApplications ? (
              <LoadingSpinner />
            ) : applications.length > 0 ? (
              applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onSelect={handleSelectApplication}
                  isSelecting={selectingAppId === app.id}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="people-outline" size={48} color={Colors.text.light} />
                <Text style={styles.emptyStateText}>No applications yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Drivers will apply to your order soon
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Payment Section - Only for In Transit Orders */}
        {order.status === 'in_transit' && (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="payment" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Payment</Text>
            </View>

            {isLoadingPayment ? (
              <LoadingSpinner />
            ) : payment && (payment.status === 'held' || payment.status === 'released') ? (
              <View style={styles.paymentSuccess}>
                <Icon name="check-circle" size={32} color={Colors.success} />
                <View style={styles.paymentContent}>
                  <Text style={styles.paymentStatus}>
                    Payment {payment.status === 'held' ? 'Held' : 'Released'}
                  </Text>
                  <Text style={styles.paymentMessage}>
                    Your payment is secure and will be released after delivery
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.paymentWarning}>
                <Icon name="warning" size={32} color="#92400E" />
                <View style={styles.paymentContent}>
                  <Text style={styles.paymentTitle}>Payment Required</Text>
                  <Text style={styles.paymentMessage}>
                    Please complete payment to continue with the delivery
                  </Text>
                  <Button
                    title={initiatePayment.isPending ? 'Processing...' : `Pay ₾${order.customer_price.toFixed(2)}`}
                    onPress={handlePayNow}
                    disabled={initiatePayment.isPending}
                    style={styles.payButton}
                  />
                </View>
              </View>
            )}
          </View>
        )}

        {/* Driver Info - When driver is assigned */}
        {order.driver && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Driver Information</Text>
            <View style={styles.driverInfo}>
              {order.driver.avatar_url ? (
                <Image
                  source={{ uri: order.driver.avatar_url }}
                  style={styles.driverAvatar}
                />
              ) : (
                <View style={[styles.driverAvatar, styles.driverAvatarPlaceholder]}>
                  <Icon name="person" size={32} color={Colors.text.light} />
                </View>
              )}
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{order.driver.full_name}</Text>
                <View style={styles.driverRating}>
                  <Icon name="star" size={16} color="#FCD34D" />
                  <Text style={styles.ratingText}>{order.driver.rating.toFixed(1)}</Text>
                </View>
              </View>
              <Button
                title="Message"
                onPress={handleMessageDriver}
                style={styles.messageButton}
              />
            </View>
          </View>
        )}

        {/* Cancel Action - Only for Pending Orders */}
        {order.status === 'pending' && (
          <View style={styles.card}>
            <Button
              title={cancelOrder.isPending ? 'Cancelling...' : 'Cancel Order'}
              onPress={handleCancelOrder}
              disabled={cancelOrder.isPending}
              style={styles.cancelButton}
            />
          </View>
        )}
      </ScrollView>
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
  swipeableContainer: {
    height: 300,
    position: 'relative',
  },
  horizontalScrollView: {
    height: 300,
  },
  photoContainer: {
    height: 300,
    position: 'relative',
    backgroundColor: Colors.background,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: Spacing.md,
  },
  photoLabel: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
  pageIndicator: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  pageIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    opacity: 0.5,
  },
  pageIndicatorDotActive: {
    opacity: 1,
    width: 20,
    backgroundColor: Colors.primary,
  },
  headerCard: {
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  jobTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  orderId: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  createdDate: {
    ...Typography.small,
    color: Colors.text.light,
  },
  scheduledDate: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  description: {
    ...Typography.body,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  priceLabel: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
  },
  priceValue: {
    ...Typography.h2,
    color: Colors.primary,
    fontWeight: '700',
  },
  bannedAlert: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: 12,
    gap: Spacing.md,
  },
  bannedContent: {
    flex: 1,
  },
  bannedTitle: {
    ...Typography.bodyBold,
    color: '#92400E',
    marginBottom: Spacing.xs,
  },
  bannedMessage: {
    ...Typography.small,
    color: '#92400E',
    lineHeight: 18,
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
  cardTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    ...Typography.small,
    color: Colors.white,
    fontWeight: '700',
  },
  itemGrid: {
    gap: Spacing.md,
  },
  itemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  itemLabel: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  itemValue: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyStateText: {
    ...Typography.bodyBold,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
  },
  emptyStateSubtext: {
    ...Typography.small,
    color: Colors.text.light,
    marginTop: Spacing.xs,
  },
  paymentSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: Spacing.md,
    borderRadius: 8,
    gap: Spacing.md,
  },
  paymentWarning: {
    backgroundColor: '#FEF3C7',
    padding: Spacing.md,
    borderRadius: 8,
    gap: Spacing.md,
  },
  paymentContent: {
    flex: 1,
  },
  paymentStatus: {
    ...Typography.bodyBold,
    color: '#065F46',
    marginBottom: Spacing.xs,
  },
  paymentTitle: {
    ...Typography.bodyBold,
    color: '#92400E',
    marginBottom: Spacing.xs,
  },
  paymentMessage: {
    ...Typography.small,
    color: '#92400E',
    marginBottom: Spacing.md,
  },
  payButton: {
    backgroundColor: Colors.primary,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  driverAvatarPlaceholder: {
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    ...Typography.small,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
  },
  cancelButton: {
    backgroundColor: Colors.error,
  },
});
