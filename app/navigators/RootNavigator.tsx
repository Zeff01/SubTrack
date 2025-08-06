import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import TabNavigator from '../(tabs)/TabNavigator';
import TabNavigator from './TabNavigator';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

import LoginScreen from '../(screens)/Login';
import RegisterScreen from '../(screens)/Register';
import AccountRecovery from '../(screens)/AccountRecovery';
import Home from '../(tabs)/(screens)/Home';

import SubscriptionDetails from '../(tabs)/(screens)/SubscriptionDetails'; 
import EditSubscription from '../(tabs)/(screens)/EditSubscription'; 

import { useAuth } from '../providers/AuthProvider'; // Import your AuthProvider

const RootStack = () => {
  const Stack = createNativeStackNavigator();
  const authContext = useAuth();
  const { user, authLoading } = authContext;

  // if (!user) {
  //   return <LoginScreen />;
  // } 

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="App" component={AppNavigator} />
      {/* {!user && authLoading == false ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )} */}
    </Stack.Navigator>
  );
};

export default RootStack;
