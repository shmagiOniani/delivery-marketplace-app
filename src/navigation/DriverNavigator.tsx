import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../theme/colors';
import {DriverDashboardScreen} from '../screens/driver/DashboardScreen';
import {BrowseJobsScreen} from '../screens/driver/BrowseJobsScreen';
import {MyJobsScreen} from '../screens/driver/MyJobsScreen';
import {DriverJobDetailScreen} from '../screens/driver/JobDetailScreen';
import {DriverProfileScreen} from '../screens/driver/ProfileScreen';
import {DriverSetupScreen} from '../screens/driver/SetupScreen';
import {MessagesScreen} from '../screens/shared/MessagesScreen';
import {ConversationScreen} from '../screens/shared/ConversationScreen';
import {NotificationsScreen} from '../screens/shared/NotificationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DriverTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        headerShown: false,
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DriverDashboardScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BrowseJobs"
        component={BrowseJobsScreen}
        options={{
          tabBarLabel: 'Browse',
          tabBarIcon: ({color, size}) => (
            <Icon name="briefcase-search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyJobs"
        component={MyJobsScreen}
        options={{
          tabBarLabel: 'My Jobs',
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
        component={DriverProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const DriverNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DriverTabs"
        component={DriverTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="JobDetail"
        component={DriverJobDetailScreen}
        options={{title: 'Job Details'}}
      />
      <Stack.Screen
        name="Conversation"
        component={ConversationScreen}
        options={{title: 'Conversation'}}
      />
      <Stack.Screen
        name="Setup"
        component={DriverSetupScreen}
        options={{title: 'Driver Setup'}}
      />
    </Stack.Navigator>
  );
};

