import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AccountScreen from './(screens)/Account';
import UpdateProfileScreen from './(screens)/UpdateProfile'; // 👈 add as needed
import UpdatePasswordScreen from './(screens)/UpdatePassword'; // 👈 add as needed

import { useNavigationState, useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';


const Stack = createNativeStackNavigator();

const AccountStack = () => {
  return (
    <Stack.Navigator
    >
      <Stack.Screen name="account_settings" component={AccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="update_profile" component={UpdateProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="update_password" component={UpdatePasswordScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AccountStack;
