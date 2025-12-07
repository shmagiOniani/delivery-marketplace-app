import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useJobsQuery } from '@/hooks/queries/useJobsQuery';
import { OrderCard } from '@/components/shared/OrderCard';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '@/stores/useAuthStore';
import type { CustomerTabScreenProps } from '@/types/navigation';

export const HomeScreen: React.FC<CustomerTabScreenProps<'Home'>> = () => {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useJobsQuery({ status: 'active', limit: 5 });

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

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.name}>
            {user?.full_name || user?.email || 'User'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleNewOrder}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: Colors.primary }]}>
            <Icon name="add" size={24} color={Colors.white} />
          </View>
          <Text style={styles.actionLabel}>New Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleTrackOrder}
          activeOpacity={0.7}
        >
          <View
            style={[styles.actionIcon, { backgroundColor: Colors.success }]}
          >
            <Icon name="location-on" size={24} color={Colors.white} />
          </View>
          <Text style={styles.actionLabel}>Track</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleViewHistory}
          activeOpacity={0.7}
        >
          <View
            style={[styles.actionIcon, { backgroundColor: Colors.darkBlue }]}
          >
            <Icon name="history" size={24} color={Colors.white} />
          </View>
          <Text style={styles.actionLabel}>History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Orders</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Customer', {
                screen: 'Orders',
              } as any)
            }
          >
            <Text style={styles.seeAll}>See All</Text>
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
          activeJobs.map((job) => (
            <OrderCard
              key={job.id}
              order={job}
              onPress={() => handleOrderPress(job.id)}
            />
          ))
        )}
      </View>
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
  header: {
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  name: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  actionLabel: {
    ...Typography.small,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  section: {
    marginTop: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  seeAll: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: '600',
  },
  errorContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
  },
});
