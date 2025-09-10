import { Subscription } from "@/types";
import { Timestamp } from "firebase/firestore";
import addNotification from "./addNotification";
import cleanOldNotification from "./cleanOldNotif";
import { parseDate, reminderToDays } from "./function";
import notificationExists from "./notificationExists";


export default async function GenerateNotifications(userId: string, userSubscriptions: Subscription[]) {
    const now = new Date();
    
    for (const sub of userSubscriptions) {
        const dueDate = parseDate(sub.due_date);
        if (isNaN(dueDate.getTime())) continue;
        const daysBefore = reminderToDays(sub.remind_me ?? 'none');
        if (daysBefore === null) continue;

    // Calculate reminder date
        const reminderDate = new Date(dueDate);
        reminderDate.setDate(dueDate.getDate() - daysBefore);
        reminderDate.setHours(0, 0, 0, 0);

    // Remove old notifications for the same subscription and due date
        await cleanOldNotification(sub.id as string  );

        if( now > reminderDate ) {
            const exists = await notificationExists(sub.id as string, reminderDate);
            if (!exists) {
                await addNotification({
                    subscription_id: sub.id as string,
                    title: "Payment Reminder",
                    message: `${sub.app_name} payment is due on ${dueDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                    })}`,
                    date:     Timestamp.fromDate(reminderDate),
                    due_date: Timestamp.fromDate(dueDate),
                    type:     "reminder",
                    uid:      userId,
                    is_read:  false,
                });
            }
        }
    }

    //Todo
    //console.log( "todo at service/notifcationService/generateNotification.ts - is adding a shedule notification")

    //const futureReminders: { sub: Subscription; reminderDate: Date }[] = [];
    // Log the nearest upcoming reminder
    // if (futureReminders.length > 0) {
    //     futureReminders.sort((a, b) => a.reminderDate.getTime() - b.reminderDate.getTime());
    //     const nearest = futureReminders[0];
    //     console.log('Next upcoming reminder is for', nearest.sub.app_name, 'on', nearest.reminderDate);
    // } else {
    //     console.log('No upcoming reminders.');
    // }
}
