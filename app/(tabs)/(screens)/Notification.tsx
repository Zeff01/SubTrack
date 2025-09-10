import useNotification, { formatNotificationDate } from '@/app/hooks/useNotification';
import { useTheme } from '@/app/providers/ThemeProvider';
import { markAllAsRead, markAsRead } from '@/services/notificationService';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

//This is the base mock, before mr Anghelo Amir edit this code
// const mockNotifications: Notification[] = [
//   {
//     id: 'GBaJJA6rR0HnaBeBF3k6',
//     title: 'Payment Reminder',
//     message: 'Your Apple subscription is due tomorrow.',
//     date: 'July 28, 2025',
//     uid: 'rt6Or2drlXgDtTeaMvrZOSc4DwX2',
//     is_read: false,
//     subscription_id: '123',
//     type: 'reminder'
//   }
// ];

const NotificationScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigation = useNavigation();
  const { notification } = useNotification();

  return (
    <View className={`flex-1 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
      <View className={`pt-12 pb-6 px-6 ${isDark ? 'bg-[#1F1F1F]' : 'bg-[#D9D9D9]'}`}>
        <View className="relative items-center justify-center">
          <TouchableOpacity
            onPress={() => (navigation as any).navigate('Home', { screen: 'home' })}
            className="absolute left-0 px-4"
          >
            <Ionicons name="chevron-back" size={25} color={isDark ? 'white' : 'black'} />
          </TouchableOpacity>
          <Text className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Notifications</Text>
        </View>
      </View>

      {/* Notification List */}
      <View className={`flex-1 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
        <ScrollView className="flex-1 px-4 mt-4">
          {notification.length === 0 ? (
            <View className="items-center py-6">
              <Text className={`text-gray-500 text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>No notifications found</Text>
            </View>
          ) : (
            <>
              {notification.map((notif) => {
                let bgColor = '';
                if (isDark) {
                  bgColor = !notif.is_read ? 'bg-[#27272A]' : 'bg-[#1F1F1F]';
                } else {
                  bgColor = !notif.is_read ? 'bg-white' : 'bg-blue-100';
                }

                const textColorHeading = isDark ? 'text-white' : 'text-blue-100';
                const textColorText = isDark ? 'text-gray-100' : 'text-gray-500';

                return (
                  <TouchableOpacity
                    key={notif.id}
                    className={`mb-3 p-4 rounded-2xl shadow ${bgColor}`}
                    onPress={() => {
                      markAsRead(notif.id);
                      (navigation as any).navigate('viewNotification', { notification: notif });
                    }}
                  >
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className={`text-base font-semibold ${textColorHeading}`}>
                        {notif.title}
                      </Text>

                      <Text className={`text-xs ${textColorText}`}>
                        {formatNotificationDate(notif.date)}
                      </Text>

                    </View>
                    <Text className="text-sm text-gray-600">{notif.message}</Text>
                  </TouchableOpacity>
                );
              })}

            </>
          )}

          <TouchableOpacity
            className="mt-10 bg-[#3AABCC] rounded-xl py-3 w-full shadow-sm mb-6"
            onPress={() => markAllAsRead()}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="checkmark-done-outline" size={20} color="white" />
              <Text className="text-white text-lg font-semibold ml-2">Mark All as Read</Text>
            </View>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </View>
  );
};

export default NotificationScreen;
