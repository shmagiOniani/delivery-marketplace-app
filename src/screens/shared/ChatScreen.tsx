import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import type { CustomerScreenProps } from '@/types/navigation';

export const ChatScreen: React.FC<CustomerScreenProps<'Chat'>> = () => {
  const route = useRoute();
  const { jobId } = route.params as { jobId?: string };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat Screen - Coming Soon</Text>
      {jobId && <Text style={styles.subtext}>Job ID: {jobId}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  text: {
    color: Colors.text.primary,
  },
  subtext: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
});

