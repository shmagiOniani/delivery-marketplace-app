import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import { Button } from '@/components/ui/Button';
import { useOrderMutations } from '@/hooks/mutations/useOrderMutations';

interface CustomerDeliveryApprovalProps {
  jobId: string;
  deliveryTime?: string | null;
}

export const CustomerDeliveryApproval: React.FC<CustomerDeliveryApprovalProps> = ({
  jobId,
  deliveryTime,
}) => {
  const { updateOrderStatus } = useOrderMutations();
  const [isApproving, setIsApproving] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleApprove = () => {
    Alert.alert(
      'Confirm Delivery',
      'Please confirm that you have received your delivery. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            setIsApproving(true);
            try {
              await updateOrderStatus.mutateAsync({
                orderId: jobId,
                status: 'done',
              });
              Alert.alert(
                'Success',
                'Delivery confirmed! Thank you for using our service.'
              );
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to confirm delivery. Please try again.'
              );
            } finally {
              setIsApproving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="check-circle-outline" size={32} color={Colors.success} />
        <Text style={styles.title}>Delivery Completed</Text>
      </View>

      {deliveryTime && (
        <Text style={styles.deliveryTime}>
          Delivered on {formatDate(deliveryTime)}
        </Text>
      )}

      <Text style={styles.description}>
        Please confirm that you have received your delivery. Once confirmed, the
        payment will be released to the driver.
      </Text>

      <Button
        title={isApproving ? 'Confirming...' : 'Confirm Delivery'}
        onPress={handleApprove}
        disabled={isApproving}
        style={styles.approveButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#34D399',
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    color: '#065F46',
    fontWeight: '700',
  },
  deliveryTime: {
    ...Typography.body,
    color: '#065F46',
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.body,
    color: '#065F46',
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  approveButton: {
    backgroundColor: Colors.success,
  },
});

