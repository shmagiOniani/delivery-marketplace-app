import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useJobsQuery } from '@/hooks/queries/useJobsQuery';
import { OrderCard } from '@/components/shared/OrderCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import type { JobStatus } from '@/types';
import type { CustomerTabScreenProps } from '@/types/navigation';

const FILTER_TABS: { label: string; status?: JobStatus }[] = [
  { label: 'All' },
  { label: 'Active', status: 'active' },
  { label: 'Completed', status: 'completed' },
  { label: 'Cancelled', status: 'cancelled' },
];

export const OrdersListScreen: React.FC<CustomerTabScreenProps<'Orders'>> = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined
  );
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useJobsQuery({
    status: selectedFilter,
    limit,
    offset,
  });

  const orders = jobsData?.data || [];
  const hasMore = orders.length === limit;

  const onRefresh = useCallback(() => {
    setOffset(0);
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setOffset((prev) => prev + limit);
    }
  }, [hasMore, isLoading, limit]);

  const handleOrderPress = (jobId: string) => {
    navigation.navigate('Customer', {
      screen: 'OrderDetail',
      params: { jobId },
    } as any);
  };

  const handleFilterPress = (status?: JobStatus) => {
    setSelectedFilter(status);
    setOffset(0);
  };

  if (isLoading && offset === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={FILTER_TABS}
          keyExtractor={(item) => item.label}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isSelected = selectedFilter === item.status;
            return (
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  isSelected && styles.filterTabActive,
                ]}
                onPress={() => handleFilterPress(item.status)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.filterTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Failed to load orders. Pull to refresh.
          </Text>
        </View>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No Orders Found"
          message={
            selectedFilter
              ? `You don't have any ${selectedFilter} orders yet`
              : "You haven't created any orders yet"
          }
          actionText="Create Order"
          onAction={() =>
            navigation.navigate('Customer', {
              screen: 'NewOrderStep1',
            } as any)
          }
          icon="shopping-bag"
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={() => handleOrderPress(item.id)} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading && offset > 0 ? (
              <LoadingSpinner />
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.sm,
  },
  filterList: {
    paddingHorizontal: Spacing.md,
  },
  filterTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    ...Typography.small,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.white,
  },
  listContent: {
    padding: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
    textAlign: 'center',
  },
});
