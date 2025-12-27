import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';

interface JobDetailRatingPromptProps {
  jobId: string;
  driverName?: string;
}

export const JobDetailRatingPrompt: React.FC<JobDetailRatingPromptProps> = ({
  jobId,
  driverName,
}) => {
  const navigation = useNavigation();

  const handleRateDriver = () => {
    // Navigate to rating screen
    // @ts-ignore - Navigation types may need to be extended
    navigation.navigate('RateDriver', { jobId, driverName });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleRateDriver}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon name="star-border" size={32} color={Colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Rate Your Experience</Text>
        <Text style={styles.description}>
          {driverName
            ? `How was your experience with ${driverName}?`
            : 'How was your experience with the driver?'}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color={Colors.text.secondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
});

