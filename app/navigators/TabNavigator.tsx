import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeStack from '../(tabs)/HomeStack';
import SubscriptionStack from '../(tabs)/SubscriptionStack';
import AccountStack from '../(tabs)/AccountStack';

// import Calendar from './Calendar';
import Plus from '../(tabs)/(screens)/AddSubscription';
import PlusButton from '../components/PlusButton';

import LoginScreen from '../(screens)/Login';
import { useAuth } from '../providers/AuthProvider'; // Import your AuthProvider


const TabNavigator = () => {
  const authContext = useAuth();
  const Tab = createBottomTabNavigator();
  const { user, authLoading } = authContext;

  // If user does not exist
  if (!user && authLoading == false) {
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
            e.preventDefault(); // Prevent default behavior
            navigation.navigate('Home', {
              screen: 'home', // 👈 Navigate to this nested screen
            });
          },
        })}
      />
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
      
      <Tab.Screen 
        name="Subscriptions" 
        component={SubscriptionStack} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Prevent default behavior
            navigation.navigate('Subscriptions', {
              screen: 'subscriptions', // 👈 Navigate to this nested screen
            });
          },
        })}
      />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
                                                    