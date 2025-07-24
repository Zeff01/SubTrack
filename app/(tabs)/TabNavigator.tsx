import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeStack from './HomeStack';
import SubscriptionStack from './SubscriptionStack';
import AccountStack from './AccountStack';

// import Calendar from './Calendar';
// import Plus from './(screens)/AddSubscription';
// import PlusButton from '../components/PlusButton';

import LoginScreen from '../(screens)/Login';
import { useAuth } from '../providers/AuthProvider'; // Import your AuthProvider


const TabNavigator = () => {
  const authContext = useAuth();
  const Tab = createBottomTabNavigator();
  const { user } = authContext;

  // If user does not exist
  if (!user) {
    return <LoginScreen />;
  }
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#3AABCC',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: 10,
          paddingBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 100,
          borderTopColor: '#e5e7eb',
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
            case 'Plus':
              return null; // Custom button handles icon
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
       {/* <Tab.Screen name="Calendar" component={Calendar} /> */}
      {/*<Tab.Screen
        name="Plus"
        component={Plus}
        options={{
          tabBarLabel: '',
          tabBarButton: (props) => (
            <PlusButton onPress={props.onPress || (() => {})} />
          ),
        }}
      /> */}
      
      <Tab.Screen name="Subscriptions" component={SubscriptionStack} />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
