import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const OrderTrackingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Order Tracking Screen - Coming Soon</Text>
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
});

