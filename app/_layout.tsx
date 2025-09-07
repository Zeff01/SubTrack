import * as Notifications from "expo-notifications";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { auth } from "../config/firebase";
import "../global.css";
import { schedulePushNotification } from "../services/userService";
import RootNavigator from "./navigators/RootNavigator";
import AuthProvider from "./providers/AuthProvider";
import ThemeProvider from "./providers/ThemeProvider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, // shows pop-up while in the foreground (i.e: app is open.)
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    const initNotifications = async () => {
      // 1. Request notification permission
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Notification permission denied");
        return;
      }

      // 2. Listen for auth state changes (login, register, or session restore)
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log("User authenticated:", user.uid);

          // Schedule notifications using internal logic (no external title/body)
          await schedulePushNotification();
        } else {
          console.log("No user logged in");
        }
      });

      // 3. Optional: listen for notifications in foreground (logging purposes)
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(
          "Notification received:",
          notification.request.content.body
        );
      });

      // cleanup
      return unsubscribe;
    };

    const cleanupPromise = initNotifications();

    return () => {
      cleanupPromise.then((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
