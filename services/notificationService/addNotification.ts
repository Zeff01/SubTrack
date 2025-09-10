import { db } from "@/config/firebase";
import { Notification, ServiceResponse } from '@/types';
import { addDoc, collection } from 'firebase/firestore';

export default async function addNotificationFunction(newNotification: Omit<Notification, 'id'>): Promise<ServiceResponse<Notification>> {
    const docRef = await addDoc(collection(db, "notifications"), newNotification);
    return {
        success: true,
        data: {
            ...newNotification,
            id: docRef.id
        },
    };
};
