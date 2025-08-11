// User and Auth Types
export interface User {
  uid: string;
  email: string;
  username?: string;
  displayName?: string;
  photoURL?: string;
}

export interface AuthState {
  user: User | null;
  authLoading: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

// Subscription Types
export interface Subscription {
  id?: string;
  user_id: string;
  app_name: string;
  cost: number;
  cost_type: 'fixed' | 'variable';
  average_cost?: number; // For variable costs
  cost_history?: CostHistoryEntry[]; // Track variable cost history
  cycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  due_date: string;
  reminder: string;
  color: string;
  status?: 'active' | 'paused' | 'cancelled';
  category?: 'entertainment' | 'utilities' | 'productivity' | 'health' | 'education' | 'other';
  created_at?: string;
  updated_at?: string;
}

export interface CostHistoryEntry {
  date: string;
  amount: number;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  is_read: boolean;
  subscription_id?: string;
  type: 'reminder' | 'alert' | 'info';
}

// Form Types
export interface FormErrors {
  [key: string]: string;
}

export interface SubscriptionFormData {
  app_name: string;
  cost: string;
  cost_type: 'fixed' | 'variable';
  average_cost?: string;
  cycle: string;
  due_date: Date | null;
  reminder: string;
  color: string;
  category?: string;
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AccountRecovery: undefined;
  Auth: undefined;
  TabNavigator: undefined;
};

export type AuthStackParamList = {
  TabNavigator: undefined;
  SubscriptionDetails: { subscription: Subscription };
  EditSubscription: { subscription: Subscription };
  AddSubscription: undefined;
  UpdatePassword: undefined;
  UpdateProfile: undefined;
  Notification: undefined;
};

export type HomeStackParamList = {
  home: undefined;
};

export type SubscriptionStackParamList = {
  subscriptions: undefined;
  AddSubscription: undefined;
  EditSubscription: { subscription: Subscription };
  SubscriptionDetails: { subscription: Subscription };
};

export type AccountStackParamList = {
  account: undefined;
  UpdateProfile: undefined;
  UpdatePassword: undefined;
};

// Service Response Types
export interface ServiceResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Date Utility Types
export interface DateInfo {
  month: number;
  year: number;
}

// Color Modal Types
export interface ColorOption {
  id: string;
  color: string;
  label: string;
}