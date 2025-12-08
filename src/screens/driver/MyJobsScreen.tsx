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
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { DriverTabScreenProps } from '@/types/navigation';
import type { JobStatus } from '@/types';
import { useAuthStore } from '@/stores/useAuthStore';

const FILTER_TABS: { label: string; status?: JobStatus }[] = [
  { label: 'All' },
  { label: 'Active', status: 'accepted' },
  { label: 'In Transit', status: 'in_transit' },
  { label: 'Delivered', status: 'delivered' },
];

export const MyJobsScreen: React.FC<DriverTabScreenProps<'MyJobs'>> = () => {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined
  );
  const [offset, setOffset] = useState(0);
  const limit = 20;

  // Fetch jobs assigned to this driver
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

  // Filter jobs to only show those assigned to current driver
  const allJobs = jobsData?.data || [];
  const jobs = allJobs.filter(
    (job) => job.driver_id === user?.id || selectedFilter !== undefined
  );
  const hasMore = jobs.length === limit;

  const onRefresh = useCallback(() => {
    setOffset(0);
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setOffset((prev) => prev + limit);
    }
  }, [hasMore, isLoading, limit]);

  const handleJobPress = (jobId: string) => {
    navigation.navigate('Driver', {
      screen: 'JobDetail',
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Jobs</Text>
        <Text style={styles.headerSubtitle}>
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_TABS}
          keyExtractor={(item) => item.label}
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
                    styles.filterTabText,
                    isSelected && styles.filterTabTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.filterTabsContent}
        />
      </View>

      {/* Jobs List */}
      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color={Colors.error} />
          <Text style={styles.errorText}>
            Failed to load jobs. Pull to refresh.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No Jobs Found"
          message={
            selectedFilter
              ? `You don't have any ${selectedFilter} jobs yet`
              : "You haven't accepted any jobs yet"
          }
          icon="work-outline"
        />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={() => handleJobPress(item.id)} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading && offset > 0 ? <LoadingSpinner /> : null
          }
          showsVerticalScrollIndicator={false}
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
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  filterContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterTabsContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
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
  filterTabText: {
    ...Typography.small,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  filterTabTextActive: {
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
    color: Colors.text.secondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
  },
});
