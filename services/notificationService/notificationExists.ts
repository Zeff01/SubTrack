import { db } from "@/config/firebase";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";

export default async function notificationExists(subscriptionId: string, reminderDate: Date) {
  const notifCollection = collection(db, "notifications");

  const q = query(
    notifCollection,
    where("subscription_id", "==", subscriptionId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.some(doc => {
    const data = doc.data();
    if (!data.date) return false;

    const notifDate = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
    return notifDate.getTime() === reminderDate.getTime();
  });
}
