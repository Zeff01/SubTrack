import { db } from "@/config/firebase";
import { collection, deleteDoc, doc, getDocs, query, Timestamp, where } from "firebase/firestore";

/**
 * A function that is usually called before a new notification is added in the database.
 * this prevemts old notification from filling up with old notifications
 * @param subscriptionId - the subscription id
 */
export default async function cleanOldNotification(subscriptionId: string) :Promise<void> {
  const notifCollection = collection(db, "notifications");
  const q = query(notifCollection, where("subscription_id", "==", subscriptionId));
  const snapshot = await getDocs(q);

  const now = new Date();
  now.setHours(0, 0, 0, 0); // normalize to start of today

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    if (!data.due_date) continue;

    // Convert Firestore Timestamp / FieldValue / string to JS Date
    let notifDueDate: Date;
    if (data.due_date instanceof Timestamp) {
      notifDueDate = data.due_date.toDate();
    } else if (typeof data.due_date === "string") {
      notifDueDate = new Date(data.due_date);
    } else {
      continue; // unknown type
    }

    notifDueDate.setHours(23, 59, 59, 999); // treat whole day as valid

    // Delete notification if its due date is in the past
    if (notifDueDate < now) {
      await deleteDoc(doc(db, "notifications", docSnap.id));
      console.log("Deleted old notification for subscription:", subscriptionId, notifDueDate);
    }
  }
}
