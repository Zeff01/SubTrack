import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeStack from '../(tabs)/HomeStack';
import SubscriptionStack from '../(tabs)/SubscriptionStack';
import AccountStack from '../(tabs)/AccountStack';

import Plus from '../(tabs)/(screens)/AddSubscription';
import PlusButton from '../components/PlusButton';

import LoginScreen from '../(screens)/Login';
import { useAuth } from '../providers/AuthProvider';
import { useTheme } from '../providers/ThemeProvider';

const TabNavigator = () => {
  const authContext = useAuth();
  const Tab = createBottomTabNavigator();
  const { user, authLoading } = authContext;
  const { theme } = useTheme(); // 'light' or 'dark'

  const isDarkMode = theme === 'dark';

  if (!user && authLoading === false) {
    return <LoginScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: isDarkMode ? '#ffffff' : '#3AABCC', // Teal for dark, sky blue for light
        tabBarInactiveTintColor: isDarkMode ? '#A0AEC0' : '#9ca3af', // Gray
        tabBarLabelStyle: {
          fontSize: 10,
          paddingBottom: 4,
        },
        tabBarStyle: {
         // backgroundColor: isDarkMode ? '#1F2937' : '#ffffff', // Dark gray or white
          backgroundColor: isDarkMode ? '#18181B' : '#F9FAFB', // Matches AccountSettingsScreen
          height: 100,
          borderTopColor: isDarkMode ? 'transparent' : 'transparent', // Border color based on theme
          borderTopWidth: 0,          // ✅ Removes the actual border
          elevation: 0,               // ✅ Removes shadow on Android
          shadowOpacity: 0,           // ✅ Removes shadow on iOS
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

      {/* Optional Plus Button - uncomment if needed */}
      {/* <Tab.Screen
        name="Plus"
        component={Plus}
        options={{
          tabBarLabel: '',
          tabBarButton: (props) => (
            <PlusButton onPress={props.onPress || (() => {})} />
          ),
        }}
      /> */}

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

      <Tab.Screen
        name="Account"
        component={AccountStack}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Account', {
              screen: 'account_settings',
            });
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
