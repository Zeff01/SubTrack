import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-gesture-handler";
import "../global.css"; // For Tailwind (NativeWind)
import { pushNotification } from "../services/userService";
import AuthProvider from "./providers/AuthProvider";
import RootStack from "./stacks/RootStack";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Permission for notifications not granted.");
  }
};

export default function App() {
  useEffect(() => {
    requestNotificationPermission();
    pushNotification();
  }, []);

  return (
    <>
      <AuthProvider>
        {/* <Slot />  */}
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
