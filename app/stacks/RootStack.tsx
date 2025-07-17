import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from '../(tabs)/TabNavigator';
import LoginScreen from '../(screens)/Login';
import RegisterScreen from '../(screens)/Register';
import AccountRecovery from '../(screens)/AccountRecovery';

import SubscriptionDetails from '../(tabs)/(screens)/SubscriptionDetails'; 
import EditSubscription from '../(tabs)/(screens)/EditSubscription'; 


const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="SubscriptionDetails" component={SubscriptionDetails} />
      <Stack.Screen name="EditSubscription" component={EditSubscription} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="AccountRecovery" component={AccountRecovery} />
    </Stack.Navigator>
  );
};

export default RootStack;
