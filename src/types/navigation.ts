import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { Job, Message } from './index';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string };
};

export type CustomerTabParamList = {
  Home: undefined;
  Orders: undefined;
  Create: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type CustomerStackParamList = {
  CustomerTabs: NavigatorScreenParams<CustomerTabParamList>;
  NewOrderStep1: undefined;
  NewOrderStep2: {
    itemType: string;
  };
  NewOrderStep3: {
    itemType: string;
    pickupLocation: { latitude: number; longitude: number; address: string };
    deliveryLocation: { latitude: number; longitude: number; address: string };
    distance: number;
    duration: number;
  };
  NewOrderStep4: {
    itemType: string;
    pickupLocation: { latitude: number; longitude: number; address: string };
    deliveryLocation: { latitude: number; longitude: number; address: string };
    distance: number;
    duration: number;
    images: string[];
    description: string;
    itemSize: string;
    floor?: number;
    hasElevator?: boolean;
  };
  OrderSuccess: {
    jobId: string;
  };
  OrderTracking: {
    jobId: string;
  };
  OrderDetail: {
    jobId: string;
  };
  Chat: {
    jobId: string;
  };
};

export type DriverTabParamList = {
  BrowseJobs: undefined;
  MyJobs: undefined;
  Profile: undefined;
};

export type DriverStackParamList = {
  DriverTabs: NavigatorScreenParams<DriverTabParamList>;
  JobDetail: {
    jobId: string;
  };
  OrderTracking: {
    jobId: string;
  };
  Chat: {
    jobId: string;
  };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Customer: NavigatorScreenParams<CustomerStackParamList>;
  Driver: NavigatorScreenParams<DriverStackParamList>;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, T>;

export type CustomerScreenProps<T extends keyof CustomerStackParamList> =
  StackScreenProps<CustomerStackParamList, T>;

export type DriverScreenProps<T extends keyof DriverStackParamList> =
  StackScreenProps<DriverStackParamList, T>;

export type CustomerTabScreenProps<T extends keyof CustomerTabParamList> =
  BottomTabScreenProps<CustomerTabParamList, T>;

export type DriverTabScreenProps<T extends keyof DriverTabParamList> =
  BottomTabScreenProps<DriverTabParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

