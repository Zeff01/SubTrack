import { db } from "@/config/firebase";
import { Notification, ServiceResponse } from '@/types';
import { collection, DocumentData, getDocs, query, QueryDocumentSnapshot, where } from 'firebase/firestore';

export default async function retrieveUserNotifications(uid: string): Promise<ServiceResponse<Notification[]>> {
    const q = query(
        collection(db, 'notifications'),
        where('uid', '==', uid),
       
    );

    const querySnapshot = await getDocs(q);
    const notifications: Notification[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        notifications.push({ id: doc.id, ...doc.data() } as Notification);
    });

    return {
        success: true,
        data:    notifications,
    };

};