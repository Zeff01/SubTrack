import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../(screens)/Login';
import Register from '../(screens)/Register';
import AccountRecovery from '../(screens)/AccountRecovery';

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="AccountRecovery" component={AccountRecovery} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;