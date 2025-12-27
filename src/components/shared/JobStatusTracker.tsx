import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';

interface JobStatusTrackerProps {
  status: string;
  pickupTime?: string | null;
  deliveryTime?: string | null;
  createdAt: string;
}

export const JobStatusTracker: React.FC<JobStatusTrackerProps> = ({
  status,
  pickupTime,
  deliveryTime,
  createdAt,
}) => {
  const steps = [
    { key: 'pending', label: 'Pending', icon: 'schedule' },
    { key: 'accepted', label: 'Accepted', icon: 'check-circle' },
    { key: 'in_transit', label: 'In Transit', icon: 'local-shipping' },
    { key: 'delivered', label: 'Delivered', icon: 'where-to-vote' },
    { key: 'done', label: 'Done', icon: 'done-all' },
  ];

  const statusOrder = ['pending', 'accepted', 'in_transit', 'delivered', 'done'];
  const currentIndex = statusOrder.indexOf(status);
  const isCancelled = status === 'cancelled';
  const isBanned = status === 'banned';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Status</Text>

      {isCancelled && (
        <View style={styles.cancelledBanner}>
          <Icon name="cancel" size={24} color={Colors.error} />
          <Text style={styles.cancelledText}>This order has been cancelled</Text>
        </View>
      )}

      {isBanned && (
        <View style={styles.bannedBanner}>
          <Icon name="warning" size={24} color="#92400E" />
          <Text style={styles.bannedText}>This order has been banned</Text>
        </View>
      )}

      {!isCancelled && !isBanned && (
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <View key={step.key} style={styles.stepWrapper}>
                <View style={styles.stepRow}>
                  <View
                    style={[
                      styles.stepIcon,
                      isCompleted && styles.stepIconCompleted,
                      isCurrent && styles.stepIconCurrent,
                    ]}
                  >
                    <Icon
                      name={step.icon}
                      size={20}
                      color={isCompleted ? Colors.white : Colors.text.light}
                    />
                  </View>
                  <View style={styles.stepContent}>
                    <Text
                      style={[
                        styles.stepLabel,
                        isCompleted && styles.stepLabelCompleted,
                      ]}
                    >
                      {step.label}
                    </Text>
                    {step.key === 'pending' && (
                      <Text style={styles.stepTime}>{formatDate(createdAt)}</Text>
                    )}
                    {step.key === 'in_transit' && pickupTime && (
                      <Text style={styles.stepTime}>
                        Picked up: {formatDate(pickupTime)}
                      </Text>
                    )}
                    {step.key === 'delivered' && deliveryTime && (
                      <Text style={styles.stepTime}>
                        Delivered: {formatDate(deliveryTime)}
                      </Text>
                    )}
                  </View>
                </View>
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.stepConnector,
                      isCompleted && styles.stepConnectorCompleted,
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
    ...Typography.h3,
    color: Colors.text.primary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  cancelledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: Spacing.md,
    borderRadius: 8,
    gap: Spacing.sm,
  },
  cancelledText: {
    ...Typography.body,
    color: '#991B1B',
    fontWeight: '600',
  },
  bannedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: Spacing.md,
    borderRadius: 8,
    gap: Spacing.sm,
  },
  bannedText: {
    ...Typography.body,
    color: '#92400E',
    fontWeight: '600',
  },
  stepsContainer: {
    paddingLeft: Spacing.sm,
  },
  stepWrapper: {
    position: 'relative',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIconCompleted: {
    backgroundColor: Colors.primary,
  },
  stepIconCurrent: {
    backgroundColor: Colors.primary,
  },
  stepContent: {
    flex: 1,
    paddingTop: Spacing.xs,
  },
  stepLabel: {
    ...Typography.body,
    color: Colors.text.light,
    fontWeight: '600',
  },
  stepLabelCompleted: {
    color: Colors.text.primary,
  },
  stepTime: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  stepConnector: {
    position: 'absolute',
    left: 20,
    top: 40,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.border,
  },
  stepConnectorCompleted: {
    backgroundColor: Colors.primary,
  },
});

