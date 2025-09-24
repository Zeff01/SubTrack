import { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Subscription } from '../../types';

// Root Stack
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AccountRecovery: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
};

// Auth Stack (Main app stack after login)
export type AuthStackParamList = {
  TabNavigator: NavigatorScreenParams<TabParamList>;
  SubscriptionDetails: { subscription: Subscription };
  EditSubscription: { subscription: Subscription };
  AddSubscription: undefined;
  UpdatePassword: undefined;
  UpdateProfile: undefined;
  Notification: undefined;
};

// Tab Navigator
export type TabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Subscriptions: NavigatorScreenParams<SubscriptionStackParamList>;
  Account: NavigatorScreenParams<AccountStackParamList>;
};

// Home Stack
export type HomeStackParamList = {
  home: undefined;
};

// Subscription Stack
export type SubscriptionStackParamList = {
  subscriptions: undefined;
  AddSubscription: undefined;
};

// Account Stack
export type AccountStackParamList = {
  account: undefined;
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = 
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type TabScreenProps<T extends keyof TabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, T>,
    AuthStackScreenProps<keyof AuthStackParamList>
  >;

export type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'home'>,
  TabScreenProps<'Home'>
>;

export type SubscriptionScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SubscriptionStackParamList, 'subscriptions'>,
  TabScreenProps<'Subscriptions'>
>;

export type AccountScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AccountStackParamList, 'account'>,
  TabScreenProps<'Account'>
>;

// Navigation prop type helpers
export type NavigationProp = HomeScreenProps['navigation'] | 
  SubscriptionScreenProps['navigation'] | 
  AccountScreenProps['navigation'] |
  AuthStackScreenProps<any>['navigation'];

export default {};
