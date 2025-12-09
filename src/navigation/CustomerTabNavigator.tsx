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
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: Colors.white,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 10,
          position: 'absolute',
        },
        tabBarIconStyle: {
          marginTop: 4,
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
              size={26} 
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
              name="receipt-long" 
              size={26} 
              color={focused ? Colors.darkBlue : Colors.text.light} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateButtonScreen}
        options={{
          tabBarLabel: 'Create/Add',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 8,
          },
          tabBarButton: (props) => {
            const navigation = useNavigation();
            const cleanProps = Object.fromEntries(
              Object.entries(props).map(([key, value]) => [
                key,
                value === null ? undefined : value,
              ])
            ) as React.ComponentProps<typeof TouchableOpacity>;
            
            return (
              <TouchableOpacity
                {...cleanProps}
                style={styles.createButtonWrapper}
                onPress={() => {
                  navigation.navigate('Customer', {
                    screen: 'NewOrderStep1',
                  } as any);
                }}
              >
                <View style={styles.createButton}>
                  <Icon name="add" size={34} color={Colors.dark} />
                </View>
                <Text style={styles.createLabel}>Create/Add</Text>
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
          tabBarIcon: ({ focused, size }) => (
            <View style={styles.messageIconContainer}>
              <Icon 
                name="chat-bubble-outline" 
                size={26} 
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
              size={26} 
              color={focused ? Colors.darkBlue : Colors.text.light} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  createButtonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: -8,
  },
  createButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  createLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 6,
  },
  messageIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});