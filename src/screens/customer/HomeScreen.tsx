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
  StatusBar,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HomeScreen: React.FC<CustomerTabScreenProps<'Home'>> = () => {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const insets = useSafeAreaInsets();
  
  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useJobsQuery({ limit: 10 });
    
    console.log(jobsData)

  const activeJobs = jobsData || [];

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
      <StatusBar barStyle="light-content" />
      
      {/* Dark Blue Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
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
            activeOpacity={0.8}
          >
            {user?.avatar_url ? (
              <Image
                source={{ uri: user.avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="person" size={24} color={Colors.darkBlue} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Action Buttons - Positioned Absolutely at Bottom */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleNewOrder}
            activeOpacity={0.8}
          >
            <View style={styles.actionIcon}>
              <Icon name="add" size={32} color={Colors.darkBlue} />
          <Text style={styles.actionLabel}>New Order</Text>
            </View>
            
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleTrackOrder}
            activeOpacity={0.8}
          >
            <View style={styles.actionIcon}>
              <Icon name="location-on" size={32} color={Colors.darkBlue} />
          <Text style={styles.actionLabel}>Track</Text>
            </View>
            
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewHistory}
            activeOpacity={0.8}
          >
            <View style={styles.actionIcon}>
              <Icon name="history" size={32} color={Colors.darkBlue} />
          <Text style={styles.actionLabel}>History</Text>
            </View>
            
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
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
  const orderNumber = `ORD-${order.id.slice(-4).toUpperCase()}`;
  
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
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: 20,
    paddingBottom: 60,
      
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 50,
  },
  headerTextContainer: {
    flex: 1,
      
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FDB022',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: -70,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
    zIndex: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionIcon: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#FDB022',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
      marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  horizontalList: {
    paddingRight: 20,
  },
  horizontalCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  horizontalCardContent: {
    flex: 1,
  },
  horizontalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  horizontalCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  horizontalCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  horizontalCardPrice: {
    marginLeft: 4,
  },
  horizontalCardPriceText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FDB022',
    borderRadius: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDB022',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
  },
});
