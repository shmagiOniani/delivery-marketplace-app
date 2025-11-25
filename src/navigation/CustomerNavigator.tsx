import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../theme/colors';
import {CustomerDashboardScreen} from '../screens/customer/DashboardScreen';
import {JobListScreen} from '../screens/customer/JobListScreen';
import {CreateJobScreen} from '../screens/customer/CreateJobScreen';
import {JobDetailScreen} from '../screens/customer/JobDetailScreen';
import {CustomerProfileScreen} from '../screens/customer/ProfileScreen';
import {MessagesScreen} from '../screens/shared/MessagesScreen';
import {ConversationScreen} from '../screens/shared/ConversationScreen';
import {NotificationsScreen} from '../screens/shared/NotificationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        headerShown: false,
      }}>
      <Tab.Screen
        name="Dashboard"
        component={CustomerDashboardScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={JobListScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="message-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={CustomerProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const CustomerNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CustomerTabs"
        component={CustomerTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateJob"
        component={CreateJobScreen}
        options={{title: 'Create Job'}}
      />
      <Stack.Screen
        name="JobDetail"
        component={JobDetailScreen}
        options={{title: 'Job Details'}}
      />
      <Stack.Screen
        name="Conversation"
        component={ConversationScreen}
        options={{title: 'Conversation'}}
      />
    </Stack.Navigator>
  );
};

