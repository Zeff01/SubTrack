import * as Notifications from "expo-notifications";

export interface PushNotification {
  title: string;
  body: string;
  data?: Record<string, any>;
  triggerDate?: Date | null;
}

export const schedulePushNotification = async (
  notification: PushNotification
): Promise<{ success: boolean; error?: string }> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "This is just a random test from a banana.",
        data: notification.data ?? {},
      },
      trigger: null,
    });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message ?? "Failed to schedule notification",
    };
  }
};
