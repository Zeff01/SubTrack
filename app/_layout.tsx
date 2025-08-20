import 'react-native-gesture-handler';
import '../global.css'; // For Tailwind (NativeWind)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';


import RootNavigator from './navigators/RootNavigator';
import AuthProvider from './providers/AuthProvider';
import ThemeProvider from './providers/ThemeProvider';



export default function App() {

  return (
        <>
            <ThemeProvider>
              <AuthProvider>
                {/* <Slot />  */}
                <RootNavigator />
                {/* <StatusBar style="auto" /> */}
              </AuthProvider>
            </ThemeProvider>
        </>
  );
}
