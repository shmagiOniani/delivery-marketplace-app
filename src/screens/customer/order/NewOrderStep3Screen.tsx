import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const NewOrderStep3Screen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>New Order Step 3 - Coming Soon</Text>
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

