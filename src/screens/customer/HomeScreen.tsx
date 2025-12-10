import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useJobsQuery } from '@/hooks/queries/useJobsQuery';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '@/stores/useAuthStore';
import type { CustomerTabScreenProps } from '@/types/navigation';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { timeAgo } from '@/utils/dateFormatters';

export const HomeScreen: React.FC<CustomerTabScreenProps<'Home'>> = () => {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useJobsQuery({ limit: 10 });

  const activeJobs = jobsData?.data || [];

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleNewOrder = () => {
    navigation.navigate('Customer', {
      screen: 'NewOrderStep1',
    } as any);
  };

  const handleTrackOrder = () => {
    navigation.navigate('Customer', {
      screen: 'Orders',
    } as any);
  };

  const handleViewHistory = () => {
    navigation.navigate('Customer', {
      screen: 'Orders',
    } as any);
  };

  const handleOrderPress = (jobId: string) => {
    navigation.navigate('Customer', {
      screen: 'OrderDetail',
      params: { jobId },
    } as any);
  };

  const handleMessages = () => {
    // Navigate to messages - will be implemented
  };

  // Mock recent activity data - replace with actual data from API
  const recentActivity = [
    {
      id: '1',
      courierName: 'Courier John P.',
      action: 'Delivered',
      timeAgo: '2 min ago',
      icon: 'local-shipping',
      avatarUrl: null,
    },
    {
      id: '2',
      courierName: 'Courier John P.',
      action: 'Picked up',
      timeAgo: '15 min ago',
      icon: 'phone',
      avatarUrl: null,
    },
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Dark Blue Header with Avatar */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.appName}>Carryo</Text>
            <Text style={styles.greeting}>
              გამარჯობა, {user?.full_name?.split(' ')[0] || 'User'}!
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Customer', {
                screen: 'Profile',
              } as any)
            }
            style={styles.avatarTouchable}
          >
            <View style={styles.avatarContainer}>
              {user?.avatar_url ? (
                <Image
                  source={{ uri: user.avatar_url }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name="person" size={28} color={Colors.white} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Yellow Action Buttons inside header */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleNewOrder}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="add" size={28} color={Colors.dark} />
            </View>
            <Text style={styles.actionLabel}>New Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleTrackOrder}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="place" size={28} color={Colors.dark} />
            </View>
            <Text style={styles.actionLabel}>Track</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewHistory}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="history" size={28} color={Colors.dark} />
            </View>
            <Text style={styles.actionLabel}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
      >

        {/* Active Orders Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active orders</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Customer', {
                  screen: 'Orders',
                } as any)
              }
            >
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Failed to load orders. Pull to refresh.
              </Text>
            </View>
          ) : activeJobs.length === 0 ? (
            <EmptyState
              title="No Active Orders"
              message="Create your first order to get started"
              actionText="Create Order"
              onAction={handleNewOrder}
              icon="shopping-bag"
            />
          ) : (
            <FlatList
              data={activeJobs}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <HorizontalOrderCard
                  order={item}
                  onPress={() => handleOrderPress(item.id)}
                />
              )}
              contentContainerStyle={styles.horizontalList}
            />
          )}
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              {activity.avatarUrl ? (
                <Image
                  source={{ uri: activity.avatarUrl }}
                  style={styles.activityAvatarImage}
                />
              ) : (
              <View style={styles.activityAvatar}>
                <Icon name="person" size={20} color={Colors.white} />
              </View>
              )}
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  {activity.courierName}
                </Text>
                <Text style={styles.activityTime}>
                  {activity.timeAgo} · {activity.action}
                </Text>
              </View>
              <Icon
                name={activity.icon === 'local-shipping' ? 'inventory-2' : 'phone'}
                size={24}
                color={Colors.text.secondary}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Horizontal Order Card Component
interface HorizontalOrderCardProps {
  order: any;
  onPress: () => void;
}

const HorizontalOrderCard: React.FC<HorizontalOrderCardProps> = ({
  order,
  onPress,
}) => {
  // Format order number as ORD-XXXX
  const orderNumber = `ORD-${order.id.slice(-4).toUpperCase()}`;
  
  // Calculate progress based on status
  const getProgress = () => {
    switch (order.status) {
      case 'pending':
        return '20%';
      case 'accepted':
        return '40%';
      case 'in_transit':
        return '70%';
      case 'delivered':
        return '100%';
      default:
        return '0%';
    }
  };

  return (
    <TouchableOpacity
      style={styles.horizontalCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.horizontalCardContent}>
        <View style={styles.horizontalCardHeader}>
          <Text style={styles.horizontalCardTitle}>
            Order #{orderNumber}
          </Text>
          <StatusBadge status={order.status} />
        </View>
        <View style={styles.horizontalCardBody}>
          <Icon name="inventory-2" size={28} color={Colors.orange} />
          <View style={styles.horizontalCardPrice}>
            <Text style={styles.horizontalCardPriceText}>
              ${order.customer_price.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: getProgress() }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.darkBlue,
    paddingTop: 60,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  headerTextContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 28,
    color: Colors.white,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  greeting: {
    fontSize: 15,
    color: Colors.white,
    opacity: 0.95,
    fontWeight: '400',
  },
  avatarTouchable: {
    marginLeft: Spacing.md,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  actionLabel: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.text.primary,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  horizontalList: {
    paddingRight: Spacing.md,
  },
  horizontalCard: {
    width: 280,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginRight: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  horizontalCardContent: {
    flex: 1,
  },
  horizontalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  horizontalCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  horizontalCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  horizontalCardPrice: {
    marginLeft: Spacing.sm,
  },
  horizontalCardPriceText: {
    fontSize: 20,
    color: Colors.text.primary,
    fontWeight: '700',
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.orange,
    borderRadius: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activityAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  errorContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
  },
});
