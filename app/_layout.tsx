import 'react-native-gesture-handler';
import '../global.css'; // For Tailwind (NativeWind)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';


import RootNavigator from './navigators/RootNavigator';
import AuthProvider from './providers/AuthProvider';


export default function App() {

  return (
        <>
            <AuthProvider>
              {/* <Slot />  */}
              <RootNavigator />
              <StatusBar style="auto" />
            </AuthProvider>
        </>
  );
}


// export default function App() {
//   return (
//     <NavigationContainer>
//         <>
//             <RootStack />
//             <StatusBar style="auto" />
//         </>

//     </NavigationContainer>
//   );
// }
