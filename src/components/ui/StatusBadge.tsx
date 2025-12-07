import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import type { JobStatus } from '@/types';

interface StatusBadgeProps {
  status: JobStatus;
}

const getStatusConfig = (status: JobStatus) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        backgroundColor: Colors.warning,
        textColor: Colors.dark,
      };
    case 'active':
      return {
        label: 'Active',
        backgroundColor: Colors.success,
        textColor: Colors.white,
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        backgroundColor: Colors.primary,
        textColor: Colors.white,
      };
    case 'completed':
      return {
        label: 'Completed',
        backgroundColor: Colors.darkBlue,
        textColor: Colors.white,
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        backgroundColor: Colors.error,
        textColor: Colors.white,
      };
    default:
      return {
        label: status,
        backgroundColor: Colors.gray,
        textColor: Colors.white,
      };
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = getStatusConfig(status);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.backgroundColor },
      ]}
    >
      <Text style={[styles.text, { color: config.textColor }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.tiny,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

