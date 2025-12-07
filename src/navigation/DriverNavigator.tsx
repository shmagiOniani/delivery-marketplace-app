import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { DriverStackParamList } from '@/types/navigation';
import { DriverTabNavigator } from './DriverTabNavigator';
import { JobDetailScreen } from '@/screens/driver/JobDetailScreen';
import { OrderTrackingScreen } from '@/screens/customer/OrderTrackingScreen';
import { ChatScreen } from '@/screens/shared/ChatScreen';

const Stack = createStackNavigator<DriverStackParamList>();

export const DriverNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#0F172A',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="DriverTabs"
        component={DriverTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JobDetail"
        component={JobDetailScreen}
        options={{ title: 'Job Details' }}
      />
      <Stack.Screen
        name="OrderTracking"
        component={OrderTrackingScreen}
        options={{ title: 'Track Order' }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: 'Chat' }}
      />
    </Stack.Navigator>
  );
};

