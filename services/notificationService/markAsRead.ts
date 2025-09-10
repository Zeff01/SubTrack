import { db } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function MarkAsRead(id :string ) {
    if (!id) return;
    const notifRef = doc(db, "notifications", id);
    await updateDoc(notifRef, { is_read: true });
}

export async function MarkAllAsRead() {
    const notifRef = doc(db, "notifications");
    await updateDoc(notifRef, { is_read: true });
}
