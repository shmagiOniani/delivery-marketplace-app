import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { CustomerScreenProps } from '@/types/navigation';
import { useJobsQuery } from '@/hooks/queries/useJobsQuery';

type TimelineStatus = 'pending' | 'picked' | 'transit' | 'delivered';

interface TimelineItem {
  status: TimelineStatus;
  label: string;
  completed: boolean;
  estimatedTime?: string;
}

export const OrderTrackingScreen: React.FC<
  CustomerScreenProps<'OrderTracking'>
> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { jobId } = route.params as { jobId: string };
  const { data: jobsData, isLoading } = useJobsQuery({});
  const order = jobsData?.data?.find((job) => job.id === jobId);

  if (isLoading || !order) {
    return <LoadingSpinner fullScreen />;
  }

  // Map order status to timeline
  const getTimelineStatus = (status: string): TimelineStatus => {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'accepted':
        return 'picked';
      case 'in_transit':
        return 'transit';
      case 'delivered':
        return 'delivered';
      default:
        return 'pending';
    }
  };

  const currentStatus = getTimelineStatus(order.status);

  const timelineItems: TimelineItem[] = [
    {
      status: 'pending',
      label: 'Pending',
      completed: ['pending', 'accepted', 'in_transit', 'delivered'].includes(
        order.status
      ),
    },
    {
      status: 'picked',
      label: 'Picked',
      completed: ['accepted', 'in_transit', 'delivered'].includes(order.status),
    },
    {
      status: 'transit',
      label: 'Transit',
      completed: ['in_transit', 'delivered'].includes(order.status),
      estimatedTime: order.delivery_time || '15:00',
    },
    {
      status: 'delivered',
      label: 'Delivered',
      completed: order.status === 'delivered',
    },
  ];

  const handleContactCourier = () => {
    if (order.driver_id) {
      navigation.navigate('Customer', {
        screen: 'Chat',
        params: { jobId },
      } as any);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Timeline */}
      <View style={styles.timelineContainer}>
        {timelineItems.map((item, index) => {
          const isLast = index === timelineItems.length - 1;
          const isActive = item.status === currentStatus;
          const isCompleted = item.completed;

          return (
            <View key={item.status} style={styles.timelineItem}>
              {/* Timeline Line */}
              {!isLast && (
                <View
                  style={[
                    styles.timelineLine,
                    isCompleted && styles.timelineLineActive,
                  ]}
                />
              )}

              {/* Timeline Circle */}
              <View
                style={[
                  styles.timelineCircle,
                  isCompleted && styles.timelineCircleActive,
                  isActive && styles.timelineCircleActive,
                ]}
              >
                {isCompleted && (
                  <Icon name="check" size={16} color={Colors.white} />
                )}
              </View>

              {/* Timeline Content */}
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineLabel,
                    isCompleted && styles.timelineLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
                {item.estimatedTime && (
                  <Text style={styles.timelineTime}>
                    Estimated Delivery: {item.estimatedTime}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Courier Information Card */}
      {order.driver && (
        <View style={styles.courierCard}>
          <View style={styles.courierHeader}>
            {order.driver.avatar_url ? (
              <Image
                source={{ uri: order.driver.avatar_url }}
                style={styles.courierAvatar}
              />
            ) : (
              <View style={styles.courierAvatarPlaceholder}>
                <Icon name="person" size={24} color={Colors.white} />
              </View>
            )}
            <View style={styles.courierInfo}>
              <Text style={styles.courierName}>{order.driver.full_name}</Text>
              {order.driver.rating && (
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={16} color={Colors.primary} />
                  <Text style={styles.rating}>{order.driver.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>
          </View>
          <Button
            title="Contact"
            onPress={handleContactCourier}
            style={styles.contactButton}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  timelineContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 11,
    top: 24,
    width: 2,
    height: '100%',
    backgroundColor: Colors.lightGray,
  },
  timelineLineActive: {
    backgroundColor: Colors.primary,
  },
  timelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    zIndex: 1,
  },
  timelineCircleActive: {
    backgroundColor: Colors.primary,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineLabel: {
    ...Typography.bodyBold,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  timelineLabelActive: {
    color: Colors.text.primary,
  },
  timelineTime: {
    ...Typography.small,
    color: Colors.text.light,
  },
  courierCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  courierAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: Spacing.md,
  },
  courierAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  courierInfo: {
    flex: 1,
  },
  courierName: {
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
    backgroundColor: Colors.primary,
  },
});
