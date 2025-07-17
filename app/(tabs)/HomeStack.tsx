import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './(screens)/Home';
import HomeDetails from './(screens)/Home'; // 👈 add as needed

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
      {/* <Stack.Screen name="HomeDetails" component={HomeDetails} /> */}
    </Stack.Navigator>
  );
};

export default HomeStack;
