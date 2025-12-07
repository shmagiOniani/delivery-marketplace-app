import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { CustomerStackParamList } from '@/types/navigation';
import { CustomerTabNavigator } from './CustomerTabNavigator';
import { NewOrderStep1Screen } from '@/screens/customer/order/NewOrderStep1Screen';
import { NewOrderStep2Screen } from '@/screens/customer/order/NewOrderStep2Screen';
import { NewOrderStep3Screen } from '@/screens/customer/order/NewOrderStep3Screen';
import { NewOrderStep4Screen } from '@/screens/customer/order/NewOrderStep4Screen';
import { OrderSuccessScreen } from '@/screens/customer/order/OrderSuccessScreen';
import { OrderTrackingScreen } from '@/screens/customer/OrderTrackingScreen';
import { OrderDetailScreen } from '@/screens/customer/OrderDetailScreen';
import { ChatScreen } from '@/screens/shared/ChatScreen';

const Stack = createStackNavigator<CustomerStackParamList>();

export const CustomerNavigator = () => {
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
        name="CustomerTabs"
        component={CustomerTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewOrderStep1"
        component={NewOrderStep1Screen}
        options={{ title: 'New Order' }}
      />
      <Stack.Screen
        name="NewOrderStep2"
        component={NewOrderStep2Screen}
        options={{ title: 'Select Location' }}
      />
      <Stack.Screen
        name="NewOrderStep3"
        component={NewOrderStep3Screen}
        options={{ title: 'Item Details' }}
      />
      <Stack.Screen
        name="NewOrderStep4"
        component={NewOrderStep4Screen}
        options={{ title: 'Confirm Order' }}
      />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderTracking"
        component={OrderTrackingScreen}
        options={{ title: 'Track Order' }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Order Details' }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: 'Chat' }}
      />
    </Stack.Navigator>
  );
};

