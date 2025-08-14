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

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="App" component={AppNavigator} />
      {/* {!user || authLoading == false ? (
          <>
            <Stack.Screen name="App" component={AppNavigator} />
          </>
      ) : (
          <>
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
      )} */}
    </Stack.Navigator>
  );
};

export default RootStack;
