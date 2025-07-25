import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from '../(tabs)/TabNavigator';
import LoginScreen from '../(screens)/Login';
import RegisterScreen from '../(screens)/Register';
import AccountRecovery from '../(screens)/AccountRecovery';
import Home from '../(tabs)/(screens)/Home';

import SubscriptionDetails from '../(tabs)/(screens)/SubscriptionDetails'; 
import EditSubscription from '../(tabs)/(screens)/EditSubscription'; 

import { useAuth } from '../providers/AuthProvider'; // Import your AuthProvider

const RootStack = () => {
  const Stack = createNativeStackNavigator();
  //const authContext = useAuth();
  // const { user } = authContext;


  // if (!user) {
  //   return <LoginScreen />;
  // } 

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="AccountRecovery" component={AccountRecovery} />
      <Stack.Screen name="SubscriptionDetails" component={SubscriptionDetails} />
      <Stack.Screen name="EditSubscription" component={EditSubscription} />
    </Stack.Navigator>
  );
};

export default RootStack;
