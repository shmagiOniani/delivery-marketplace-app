import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { CustomerTabParamList } from '@/types/navigation';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { HomeScreen } from '@/screens/customer/HomeScreen';
import { OrdersListScreen } from '@/screens/customer/OrdersListScreen';
import { ProfileScreen } from '@/screens/shared/ProfileScreen';
import { MessagesListScreen } from '@/screens/customer/MessagesListScreen';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator<CustomerTabParamList>();

// Create a placeholder screen for the Create tab button
const CreateButtonScreen = () => {
  return null;
};

export const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.darkBlue,
        tabBarInactiveTintColor: Colors.text.light,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          color: Colors.text.primary,
        },
        tabBarStyle: {
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
          backgroundColor: Colors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, size }) => (
            <Icon 
              name="home" 
              size={size} 
              color={focused ? Colors.darkBlue : Colors.text.light} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersListScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ focused, size }) => (
            <Icon 
              name="description" 
              size={size} 
              color={focused ? Colors.darkBlue : Colors.text.light} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateButtonScreen}
        options={{
          tabBarLabel: '',
          tabBarButton: (props) => {
            const navigation = useNavigation();
            // Convert null values to undefined for TouchableOpacity compatibility
            const cleanProps = Object.fromEntries(
              Object.entries(props).map(([key, value]) => [
                key,
                value === null ? undefined : value,
              ])
            ) as React.ComponentProps<typeof TouchableOpacity>;
            return (
              <View style={styles.createButtonContainer}>
                <TouchableOpacity
                  {...cleanProps}
                  style={styles.createButton}
                  onPress={() => {
                    navigation.navigate('Customer', {
                      screen: 'NewOrderStep1',
                    } as any);
                  }}
                >
                  <View style={styles.createButtonInner}>
                    <Icon name="add" size={32} color={Colors.dark} />
                  </View>
                </TouchableOpacity>
                <Text style={styles.createButtonLabel}>Create/Add</Text>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesListScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ focused, size }) => (
            <View style={styles.messageIconContainer}>
              <Icon 
                name="chat-bubble-outline" 
                size={size} 
                color={focused ? Colors.darkBlue : Colors.text.light} 
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, size }) => (
            <Icon 
              name="person-outline" 
              size={size} 
              color={focused ? Colors.darkBlue : Colors.text.light} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  createButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  createButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -20,
  },
  createButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  createButtonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.primary,
    marginTop: -12,
  },
  messageIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});

