import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';

import SubscriptionDetails from '../(tabs)/(screens)/SubscriptionDetails'; 
import EditSubscription from '../(tabs)/(screens)/EditSubscription'; 

const RootStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="SubscriptionDetails" component={SubscriptionDetails} />
      <Stack.Screen name="EditSubscription" component={EditSubscription} />
    </Stack.Navigator>
  );
};

export default RootStack;
