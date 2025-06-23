import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import LoginUserScreen from './login'; //Import your screen components here
import RegisterScreen from './register'; // Import your screen components here
import WelcomeScreen from './welcome'; // Import your screen components here

const Stack = createStackNavigator();

export default function AppScreens() { // Renamed for clarity
  return (
        <>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="welcome" component={WelcomeScreen} />
            <Stack.Screen name="login" component={LoginUserScreen} />
            <Stack.Screen name="register" component={RegisterScreen} />
          </Stack.Navigator>
        </>
  );
}


