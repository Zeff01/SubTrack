import "react-native-gesture-handler";
import "../global.css"; // For Tailwind (NativeWind)
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import RootStack from "./stacks/RootStack";
import AuthProvider from "./providers/AuthProvider";

export default function App() {
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  return (
    <>
      <AuthProvider>
        <RootStack />
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
