import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import HomeScreen from './(screens)/Home';
import NotificationScreen from './(screens)/Notification'; // 👈 add as needed
import ViewNotification from './(screens)/ViewNotification';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home"             component={HomeScreen}          options={{ headerShown: false }} />
      <Stack.Screen name="notification"     component={NotificationScreen}  options={{ headerShown: false }} />
      <Stack.Screen name="viewNotification" component={ViewNotification}     options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default HomeStack;
