import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeStack from './HomeStack';
import SubscriptionStack from './SubscriptionStack';
import AccountStack from './AccountStack';

import Plus from './(screens)/AddSubscription';
import PlusButton from '../components/PlusButton';

import LoginScreen from '../(screens)/Login';
import { useAuth } from '../providers/AuthProvider';
import { useTheme } from '../providers/ThemeProvider';

const TabNavigator = () => {
  const authContext = useAuth();
  const Tab = createBottomTabNavigator();
  const { user, authLoading } = authContext;
  const { theme } = useTheme();

  const isDarkMode = theme === 'dark';

  if (!user && authLoading === false) {
    return <LoginScreen />;
  }
  console.log(theme);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: isDarkMode ? '#4FD1C5' : '#3AABCC', // teal-ish active color in dark
        tabBarInactiveTintColor: isDarkMode ? '#A0AEC0' : '#9ca3af',
        tabBarLabelStyle: {
          fontSize: 10,
          paddingBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1F2937' : '#fff', // dark: gray-800, light: white
          height: 100,
          borderTopColor: isDarkMode ? '#374151' : '#e5e7eb', // dark: gray-700
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName = '';
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Calendar':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Subscriptions':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Account':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Home', {
              screen: 'home',
            });
          },
        })}
      />
      
      <Tab.Screen 
        name="Subscriptions" 
        component={SubscriptionStack}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Subscriptions', {
              screen: 'subscriptions',
            });
          },
        })}
      />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
