import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuthStore} from '../store/authStore';
import {LoadingSpinner} from '../components/common/LoadingSpinner';
import {AuthNavigator} from './AuthNavigator';
import {CustomerNavigator} from './CustomerNavigator';
import {DriverNavigator} from './DriverNavigator';
import {AdminNavigator} from './AdminNavigator';
import {HomeScreen} from '../screens/home/HomeScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const {user, isLoading, checkAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        ) : user.role === 'customer' ? (
          <Stack.Screen name="Customer" component={CustomerNavigator} />
        ) : user.role === 'driver' ? (
          <Stack.Screen name="Driver" component={DriverNavigator} />
        ) : (
          <Stack.Screen name="Admin" component={AdminNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

