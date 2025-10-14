import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { useNotifications } from '../../hooks/useNotifications';
import { useSubscriptions } from '../../hooks/useSubscriptions';

import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { FadeInView } from '../../components/animated/FadeInView';
import { SlideInView } from '../../components/animated/SlideInView';

import { Notification } from '../../../types';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead, deleteNotif } = useNotifications();
  const { subscriptions } = useSubscriptions();


  const handleNotificationPress = async (notif: Notification) => {
    // Mark as read if unread
    if (notif.is_read === 0 && notif.id) {
      await markAsRead(notif.id);
    }

    // Navigate to subscription details if it's linked to a subscription
    if (notif.subscription_id) {
      const subscription = subscriptions.find(sub => sub.id === notif.subscription_id);
      if (subscription) {
        (navigation as any).navigate('Subscriptions', {
          screen: 'subscription_details',
          params: { subscription },
        });
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.uid) return;
    
    const response = await markAllAsRead(user.uid);
    if (!response.success) {
      Alert.alert('Error', response.error || 'Failed to mark all as read');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const response = await deleteNotif(notificationId);
            if (!response.success) {
              Alert.alert('Error', response.error || 'Failed to delete notification');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return moment(date).fromNow();
    } else if (diffInHours < 168) { // Less than a week
      return moment(date).format('dddd');
    } else {
      return moment(date).format('MMM DD');
    }
  };

  if (loading) {
    return <Loading message="Loading notifications..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => {}} />;
  }

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`}
      edges={['top']}
    >
      {/* Header */}
      <FadeInView delay={0} duration={300}>
        <View className={`${isDark ? 'bg-[#27272A] border-b-[#3F3F46]' : 'bg-white'} shadow-sm`}>
          <View className="flex-row items-center justify-between px-4 py-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2"
            >
              <Ionicons name="chevron-back" size={24} color={isDark ? '#E5E7EB' : '#374151'} />
            </TouchableOpacity>
            
            <View className="flex-1 items-center">
              <Text className={`${isDark ? 'text-zinc-200' : 'text-gray-900'} text-xl font-semibold`}>
                Notifications
              </Text>
              {unreadCount > 0 && (
                <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mt-1`}>
                  {unreadCount} unread
                </Text>
              )}
            </View>

            {notifications.length > 0 && unreadCount > 0 && (
              <TouchableOpacity
                onPress={handleMarkAllAsRead}
                className="p-2"
              >
                <Text className="text-[#3AABCC] text-sm font-medium">
                  Mark All Read
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </FadeInView>

      {/* Notification List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 100 : 120,
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
      >
        {notifications.length === 0 ? (
          <FadeInView delay={200} duration={300}>
            <View className="items-center py-12">
              <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Ionicons name="notifications-outline" size={32} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </View>
              <Text className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                No notifications yet
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2 text-center`}>
                You'll see payment reminders and updates here
              </Text>
            </View>
          </FadeInView>
        ) : (
          <>
            {notifications.map((notif, index) => {
              const isUnread = notif.is_read === 0;
              
              return (
                <SlideInView
                  key={notif.id}
                  delay={100 + index * 50}
                  duration={250}
                  direction="right"
                >
                  <TouchableOpacity
                    className={`mb-3 p-4 rounded-2xl shadow-sm border ${
                      isUnread
                        ? isDark
                          ? 'bg-[#3AABCC]/10 border-[#3AABCC]/20'
                          : 'bg-blue-50 border-blue-100'
                        : isDark
                        ? 'bg-[#27272A] border-[#3F3F46]'
                        : 'bg-white border-gray-100'
                    }`}
                    onPress={() => handleNotificationPress(notif)}
                    activeOpacity={0.8}
                  >
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1 mr-3">
                        <View className="flex-row items-center mb-1">
                          <Text className={`text-base font-semibold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {notif.title}
                          </Text>
                          {isUnread && (
                            <View className="w-2 h-2 bg-[#3AABCC] rounded-full ml-2" />
                          )}
                        </View>
                        <Text className={`text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {notif.message}
                        </Text>
                        <Text className={`text-xs mt-2 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {formatDate(notif.date)}
                        </Text>
                      </View>
                      
                      <TouchableOpacity
                        onPress={() => notif.id && handleDeleteNotification(notif.id)}
                        className="p-2"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons 
                          name="trash-outline" 
                          size={16} 
                          color={isDark ? '#9CA3AF' : '#6B7280'} 
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </SlideInView>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;
