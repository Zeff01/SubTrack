# Changelog
`this is temporary changelog, should be merge with official change log`

## [2.1.0] - 2025-09-10

### 🎉 Notification feature and Fixes

### Added
- **Notification feature**
  - The notification is generated in the home tab (screen).
  - Notifications are created if the current date is the same as or later than the subscription reminder date.  
    So, if it is time to notify the user about an incoming subscription, it is added as a Notification.
  - Notifications are saved in Firebase, and their interface is defined in /types/index.ts
  - Notifications are automatically removed if the due_date has already passed in Firebase.
  - Screen for viewing a notification: app/(tabs)/(screens)/ViewNotification.tsx
  - Updated Home.tsx to show the number of notifications.
  - The overall notification feature is based on the mock data provided in app/(tabs)/(screens)/Notification.tsx,  
    so it should work as expected before this feature was added.\
  - types.ts is also adjusted to add due_date, which specifies the actual due date of a subscription.

- **hooks/useNotification.ts**
  - A hook that manages and stores notification data.

- **services/notificationService.ts**
  - A function that handles the retrieval and modification of the Notification collection in the database.

- **components/SubscriptionItem.tsx**
  - A component based on SubscriptionDetails.tsx which shows the current subscription information.

- **hooks/useSubscription.ts**
  - Added a function `getUpcomingSubscriptions()` that lists the next subscriptions that need to be paid in the next 15 days.  
    This function is used by notification generation to get the list of incoming subscriptions and then create notifications if they are near the due date.

### Fixed and Changes
- **app/(tabs)/(screens)/Home**
  - In the Home.tsx screen, whenever the user clicks Home, it caused a white flashing if the user is in dark mode.  
    This is fixed by adjusting components/common/Loading.tsx depending on the user’s theme mode (dark mode/light mode).
  - The loading screen on the Home page only shows when the app is first launched or reloaded.

- **app/(tabs)/(screens)/Subscription.tsx**
  - There was code that used `useFocusEffect`, but such code already exists in the useSubscription hook,  
    so that code was commented out and the hook is used instead.
