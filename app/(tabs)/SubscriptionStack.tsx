import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SubscriptionScreen from './(screens)/Subscription';
import SubscriptionDetails from './(screens)/SubscriptionDetails'; // 👈 add as needed
import EditSubscription from './(screens)/EditSubscription'; // 👈 add as needed


const Stack = createNativeStackNavigator();

const SubscriptionStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="subscriptions" component={SubscriptionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="subscription_details" component={SubscriptionDetails} options={{ headerShown: false }}  />
      <Stack.Screen name="edit_subscription" component={EditSubscription} options={{ headerShown: false }}  />
    </Stack.Navigator>
  );
};

export default SubscriptionStack;
