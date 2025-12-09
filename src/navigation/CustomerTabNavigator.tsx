import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { CustomerTabParamList } from '@/types/navigation';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { HomeScreen } from '@/screens/customer/HomeScreen';
import { OrdersListScreen } from '@/screens/customer/OrdersListScreen';
import { ProfileScreen } from '@/screens/shared/ProfileScreen';
import { MessagesListScreen } from '@/screens/customer/MessagesListScreen';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CreateButtonScreen = () => {
  return null;
};

// Custom Tab Bar Background with Concave Cutout
const TabBarBackground = () => {
  const height = 70;
  const circleRadius = 40;
  const circleWidth = 100;
  
  return (
    <View style={styles.tabBarBackground}>
      <Svg width={SCREEN_WIDTH} height={height} style={styles.svg}>
        <Path
          d={`
            M 0,20
            Q 0,0 20,0
            L ${SCREEN_WIDTH / 2 - circleWidth / 2},0
            Q ${SCREEN_WIDTH / 2 - circleWidth / 2 + 10},0 ${SCREEN_WIDTH / 2 - circleWidth / 2 + 15},10
            Q ${SCREEN_WIDTH / 2 - 10},${circleRadius} ${SCREEN_WIDTH / 2},${circleRadius}
            Q ${SCREEN_WIDTH / 2 + 10},${circleRadius} ${SCREEN_WIDTH / 2 + circleWidth / 2 - 15},10
            Q ${SCREEN_WIDTH / 2 + circleWidth / 2 - 10},0 ${SCREEN_WIDTH / 2 + circleWidth / 2},0
            L ${SCREEN_WIDTH - 20},0
            Q ${SCREEN_WIDTH},0 ${SCREEN_WIDTH},20
            L ${SCREEN_WIDTH},${height}
            L 0,${height}
            Z
          `}
          fill={Colors.white}
        />
      </Svg>
    </View>
  );
};

export const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.darkBlue,
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarStyle: {
          height: 70,
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          position: 'absolute',
          elevation: 0,
        },
        tabBarBackground: () => <TabBarBackground />,
        tabBarIconStyle: {
          marginTop: 2,
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
              size={24} 
              color={focused ? Colors.darkBlue : '#999'} 
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
              size={24} 
              color={focused ? Colors.darkBlue : '#999'} 
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
                  style={styles.createButtonTouchable}
                  onPress={() => {
                    navigation.navigate('Customer', {
                      screen: 'NewOrderStep1',
                    } as any);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.createButton}>
                    <Icon name="add" size={32} color="#000" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.createLabel}>Create/Add</Text>
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
                size={24} 
                color={focused ? Colors.darkBlue : '#999'} 
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
              size={24} 
              color={focused ? Colors.darkBlue : '#999'} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  createButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    top: -20,
  },
  createButtonTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  createLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.text.primary,
    marginTop: 2,
  },
  messageIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
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