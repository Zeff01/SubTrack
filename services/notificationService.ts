import addNotificationFunction from './notificationService/addNotification';
import GenerateNotifications from './notificationService/generateNotification';
import { MarkAllAsRead, MarkAsRead } from './notificationService/markAsRead';
import notificationExists from './notificationService/notificationExists';
import retrieveUserNotifications from './notificationService/retrieveUserNotifications';

/**
 * Create a new notification and post it to the Firebase database
 * @param newNotification 
 * @returns the new notification data
 */
export const addNotification    = addNotificationFunction;

/**
 * Returns all of the user notification in the database
 * @param uid user id
 * @returns Arrays of Notification for the user
 */
export const getAllNotification = retrieveUserNotifications;

/** Check if the notification exist based on subscriptions id
 * 
 * Each notification is based on the subscription ID to make sure that there is only 1 
 * notification per subscription.
 * 
 * @param subscriptionId - the subscription id
 * @param reminderDate - the reminder date
 * @returns boolean
 */
export const isNotificationExist = notificationExists;

/** Make the notif as read 
 * @param id - the notification id
*/
export const markAsRead    = MarkAsRead;

/** Make all the notif as read 
 * @param id - the notification id
*/
export const markAllAsRead = MarkAllAsRead;

/**
 * Create a notification to be added in the database. This function will only add  new notification
 * if it is time to make notification about the subscriptions based on the given reminder data.
 * Each notification is based on the subscription ID to make sure that there is only 1 
 * notification per subscription.
 * @param userId  - user ID
 * @param userSubscriptions - subscriptions
 * @example
 * React.useEffect(() => {
     if (user && subscriptions.length) {
       const currentSubs = getUpcomingSubscriptions();
       generateNotifications(user.uid, currentSubs );
     }
   }, [user, subscriptions]);
   //it is ideal to use getUpcomingSubscriptions() from useSubscription() hook because
   //it return upcoming subs withing the next 15 days
 */
export const generateNotifications = GenerateNotifications;
