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
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
          backgroundColor: Colors.white,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name="home" 
              size={size} 
              color={focused ? Colors.darkBlue : Colors.gray} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersListScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Icon name="description" size={size} color={color} />
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
            return (
              <TouchableOpacity
                {...props}
                style={styles.createButton}
                onPress={() => {
                  navigation.navigate('Customer', {
                    screen: 'NewOrderStep1',
                  } as any);
                }}
              >
                <View style={styles.createButtonInner}>
                  <Icon name="add" size={32} color={Colors.white} />
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesListScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.messageIconContainer}>
              <Icon name="chat-bubble-outline" size={size} color={color} />
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
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  createButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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

