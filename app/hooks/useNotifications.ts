import { useFocusEffect } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { auth } from '../../config/firebase';
import { 
  retrieveAllDocumentNotificationSpecificUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount
} from '../../services/userService';
import { Notification } from '../../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (userId: string) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch notifications and unread count in parallel
      const [notificationsRes, unreadRes] = await Promise.all([
        retrieveAllDocumentNotificationSpecificUser(userId),
        getUnreadNotificationCount(userId)
      ]);
      
      if (notificationsRes.success && notificationsRes.data) {
        setNotifications(notificationsRes.data);
      } else {
        setError(notificationsRes.error || 'Failed to fetch notifications');
      }

      if (unreadRes.success && typeof unreadRes.data === 'number') {
        setUnreadCount(unreadRes.data);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await markNotificationAsRead(notificationId);
      if (response.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: 1 }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  const markAllAsRead = useCallback(async (userId: string) => {
    try {
      const response = await markAllNotificationsAsRead(userId);
      if (response.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, is_read: 1 }))
        );
        setUnreadCount(0);
      }
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  const deleteNotif = useCallback(async (notificationId: string) => {
    try {
      const response = await deleteNotification(notificationId);
      if (response.success) {
        // Update local state
        const deletedNotif = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        
        // Update unread count if deleted notification was unread
        if (deletedNotif && deletedNotif.is_read === 0) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [notifications]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser?.uid) {
          fetchNotifications(firebaseUser.uid);
        }
      });
      
      return unsubscribe;
    }, [fetchNotifications])
  );

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotif,
    refetch: fetchNotifications
  };
};

export default useNotifications;