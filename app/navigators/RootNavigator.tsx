import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

//import TabNavigator from '../(tabs)/TabNavigator';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';



import { useAuth } from '../providers/AuthProvider'; // Import your AuthProvider

const RootStack = () => {
  const Stack = createNativeStackNavigator();
  const authContext = useAuth();
  const { user, authLoading } = authContext;

  // if (!user) {
  //   return <LoginScreen />;
  // } 

  // Show loading screen while checking auth status
  if (authLoading) {
    return null; // You could add a loading component here
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootStack;
