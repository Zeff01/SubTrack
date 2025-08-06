import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { User } from 'firebase/auth'; // 👈 Ensure this is imported
import { useAuth } from '../../providers/AuthProvider';

  
const mockNotifications: any[] = [
  {
    id: 'GBaJJA6rR0HnaBeBF3k6',
    notif_id: '123',
    title: 'Payment Reminder',
    message: 'Your Apple subscription is due tomorrow.',
    date: 'July 28, 2025',
    uid: 'ULZgwZUukSNsiCSTTaOptnPS9nb2',
    is_read: 0,
  },
  {
    id: 'PrnGsyYatfesnj2ojtvz',
    notif_id: '123',
    title: 'Payment Reminder',
    message: 'Your Test 2 subscription is due tomorrow.',
    date: 'July 28, 2025',
    uid: 'B463Tmk1WSSo2TyJm29ZH5c2MDg2',
    is_read: 0,
  },
  {
    id: 'bvKdVFEQ2sQuMrKBRY9i',
    notif_id: '123',
    title: 'Payment Reminder',
    message: 'Your Try 1 subscription is due tomorrow.',
    date: 'July 28, 2025',
    uid: 'B463Tmk1WSSo2TyJm29ZH5c2MDg2',
    is_read: 1,
  },
  {
    id: 'o4JJpzn9GsaHB1SiIxqk',
    notif_id: '123',
    title: 'Payment Reminder',
    message: 'Your Banana subscription is due tomorrow.',
    date: 'July 28, 2025',
    uid: 'ULZgwZUukSNsiCSTTaOptnPS9nb2',
    is_read: 0,
  },
  {
    id: 'qzOfxf76yqL4yUgTFMKF',
    notif_id: '123',
    title: 'Payment Reminder',
    message: 'Your YouTube subscription is due tomorrow.',
    date: 'July 28, 2025',
    uid: 'WEaiYRAQasbj3PBWe5nlSpDo42I2',
    is_read: 0,
  },
];

const NotificationScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [filteredNotifications, setFilteredNotifications] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        const currentUser = user as User;
        const userNotifications = mockNotifications.filter(
          (notif) => notif.uid === currentUser.uid
        );
        setFilteredNotifications(userNotifications);
      }
    }, [user])
  );


  return (
    <>
      <View className="flex-1 bg-white">
      <View className="pt-12 pb-6 px-6 bg-[#D9D9D9] rounded-b-3xl">
        <View className="relative items-center justify-center">
          <TouchableOpacity
            onPress={() => (navigation as any).navigate('Home', { screen: 'home' })}
            className="absolute left-0 px-4"
          >
            <Ionicons name="chevron-back" size={25} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-800">Notifications</Text>
        </View>
      </View>

      {/* Notification List */}
      <View className="flex-1 bg-white">
        <ScrollView className="flex-1 px-4 mt-4">
          {filteredNotifications.length === 0 ? (
            <View className="items-center py-6">
              <Text className="text-gray-500 text-lg">No notifications found</Text>
            </View>
          ) : (
            <>
              {filteredNotifications.map((notif) => {
                const bgColor = notif.is_read === 0 ? 'bg-blue-100' : 'bg-white';

                return (
                  <TouchableOpacity
                    key={notif.id}
                    className={`mb-3 p-4 rounded-2xl shadow ${bgColor}`}
                    onPress={() =>
                      // (navigation as any).navigate('SubscriptionDetails', { subscription: notif })
                        (navigation as any).navigate('Auth', {
                            screen: 'SubscriptionDetails',
                            params: {
                              subscription : notif,
                            },
                        })
                    }
                  >
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-base font-semibold text-gray-800">
                        {notif.title}
                      </Text>
                      <Text className="text-xs text-gray-500">{notif.date}</Text>
                    </View>
                    <Text className="text-sm text-gray-600">{notif.message}</Text>
                  </TouchableOpacity>
                );
              })}

            </>
          )}
        </ScrollView>
      </View>
         </View>
    </>
  );
};

export default NotificationScreen;
