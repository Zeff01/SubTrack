import 'react-native-gesture-handler';
import '../global.css'; // For Tailwind (NativeWind)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';


import RootStack from './stacks/RootStack';



export default function App() {

  return (
        <>
            {/* <Slot />  */}
            <RootStack />
            <StatusBar style="auto" />
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
