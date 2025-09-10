import { getAllNotification } from '@/services/notificationService';
import { Notification } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { auth } from '../../config/firebase';

import { Timestamp } from 'firebase/firestore';

/** Format Firestore Timestamp or string into "Month Day, Year".
 * This format the date like: "January 9, 2025". Note it accepts FieldValue ( a serverTimestamp() )
 */
export const formatNotificationDate = (date: any): string => {
    if (!date) return 'Loading...';
    let jsDate: Date;
    if (date instanceof Timestamp) {
        jsDate = date.toDate();
    } else {
        jsDate = new Date(date);
    }
    return jsDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const useNotification = () => {
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);
    const [initialLoad, setInitialLoad]   = useState(false);
    const [notification, setNotification] = useState<Notification[]>([]);

    const fetchUserNotifcation = useCallback(async (userId: string) => {
        if (!userId) return;
        try {
            setLoading(true);
            setError(null);
            const res = await getAllNotification(userId);
            if (res.success && res.data) {
                setNotification(res.data);
            } else {
                setError(res.error || 'Failed to fetch subscriptions');
            }
        } catch (error: any) {
            setError(error.message || 'Failed to fetch notification');
        }
        finally {
            setLoading(false);
            if (!initialLoad)
                setInitialLoad(true);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                if (firebaseUser?.uid) {
                    fetchUserNotifcation(firebaseUser.uid);
                }
            });

            return unsubscribe;
        }, [fetchUserNotifcation])
    );

    return {
        /** Tracks whether the initial data load has been completed.
         * True if the app already loaded the initial data.
         * False if the app just started and the states are empty
         */
        initialLoad,
        loading,
        error,
        refetch: fetchUserNotifcation,

        notification,
    };
};

export default useNotification;