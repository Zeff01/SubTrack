import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../(screens)/Login';
import RegisterScreen from '../(screens)/Register';
import AccountRecovery from '../(screens)/AccountRecovery';

const RootStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="AccountRecovery" component={AccountRecovery} />
    </Stack.Navigator>
  );
};

export default RootStack;
