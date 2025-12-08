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

export const BrowseJobsScreen: React.FC<
  DriverTabScreenProps<'BrowseJobs'>
> = () => {
  const navigation = useNavigation();
  const [offset, setOffset] = useState(0);
  const limit = 20;

  // Fetch only pending jobs for drivers to browse
  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useJobsQuery({
    status: 'pending',
    limit,
    offset,
  });

  const jobs = jobsData?.data || [];
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

  if (isLoading && offset === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Browse Jobs</Text>
          <Text style={styles.headerSubtitle}>
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available
          </Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter-list" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
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
          title="No Jobs Available"
          message="There are no pending jobs at the moment. Check back later!"
          icon="work-outline"
        />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard job={item} onPress={() => handleJobPress(item.id)} />
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

// Job Card Component for Driver View
interface JobCardProps {
  job: any;
  onPress: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
  return (
    <TouchableOpacity style={styles.jobCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.jobCardContent}>
        {/* Header */}
        <View style={styles.jobCardHeader}>
          <View style={styles.jobCardTitleContainer}>
            <Text style={styles.jobCardTitle} numberOfLines={1}>
              {job.title}
            </Text>
            <Text style={styles.jobCardId}>
              #{job.id.slice(-4).toUpperCase()}
            </Text>
          </View>
          <View style={styles.payoutBadge}>
            <Text style={styles.payoutAmount}>
              ${job.driver_payout.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.jobRoute}>
          <View style={styles.routeItem}>
            <Icon name="radio-button-checked" size={16} color={Colors.success} />
            <Text style={styles.routeAddress} numberOfLines={1}>
              {job.pickup_address}
            </Text>
          </View>
          <View style={styles.routeItem}>
            <Icon name="place" size={16} color={Colors.error} />
            <Text style={styles.routeAddress} numberOfLines={1}>
              {job.delivery_address}
            </Text>
          </View>
        </View>

        {/* Job Details */}
        <View style={styles.jobDetails}>
          <View style={styles.detailItem}>
            <Icon name="inventory-2" size={16} color={Colors.text.secondary} />
            <Text style={styles.detailText}>
              {job.item_size || 'N/A'} · {job.item_weight || 'N/A'}
            </Text>
          </View>
          {job.requires_help && (
            <View style={styles.helpBadge}>
              <Icon name="help-outline" size={14} color={Colors.primary} />
              <Text style={styles.helpText}>Help needed</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.jobCardFooter}>
          <View style={styles.paymentType}>
            <Icon
              name={job.payment_type === 'CASH' ? 'money' : 'credit-card'}
              size={16}
              color={Colors.text.secondary}
            />
            <Text style={styles.paymentTypeText}>{job.payment_type}</Text>
          </View>
          <View style={styles.timeInfo}>
            <Icon name="access-time" size={14} color={Colors.text.light} />
            <Text style={styles.timeText}>
              {new Date(job.created_at).toLocaleDateString()}
            </Text>
          </View>
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
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filterButton: {
    padding: Spacing.sm,
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
  jobCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobCardContent: {
    padding: Spacing.md,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  jobCardTitleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  jobCardTitle: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  jobCardId: {
    ...Typography.tiny,
    color: Colors.text.light,
  },
  payoutBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  payoutAmount: {
    ...Typography.bodyBold,
    color: Colors.white,
    fontWeight: '700',
  },
  jobRoute: {
    marginBottom: Spacing.md,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  routeAddress: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  jobDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  helpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  helpText: {
    ...Typography.tiny,
    color: Colors.dark,
    fontWeight: '600',
  },
  jobCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  paymentType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  paymentTypeText: {
    ...Typography.small,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  timeText: {
    ...Typography.tiny,
    color: Colors.text.light,
  },
});
