import Loading from '@/app/components/common/Loading';
import SubscriptionItem from '@/app/components/SubscriptionItem';
import { useAuth } from '@/app/providers/AuthProvider';
import { useTheme } from '@/app/providers/ThemeProvider';
import { retrieveSpecificDocumentSubscriptionSpecificUser } from '@/services/userService';
import { Subscription } from '@/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ViewNotification(props: any) {
    const { user } = useAuth();
    const route = useRoute();
    const notification = (route.params as any)?.notification;
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const navigation = useNavigation();

    const fetchASubscription = useCallback(async (userId: string) => {
        if (!userId) return;
        try {
            const res = await retrieveSpecificDocumentSubscriptionSpecificUser(userId, notification.subscription_id);
            if (res.success && res.data) {
                setCurrentSubscription(res.data[0] as Subscription)
            }
        } catch (error: any) {
            console.log(error.message || 'Failed to fetch notification');
        }
    }, []);

    useEffect(() => {
        fetchASubscription(user?.uid || '')
    }, []);

    return (
        <View className={`flex-1 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
            <View className={`pt-12 pb-6 px-6 ${isDark ? 'bg-[#1F1F1F]' : 'bg-[#D9D9D9]'}`}>
                <View className="relative items-center justify-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="absolute left-0 px-4"
                    >
                        <Ionicons name="chevron-back" size={25} color={isDark ? 'white' : 'black'} />
                    </TouchableOpacity>
                    <Text className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        Subscription Details
                    </Text>
                </View>
            </View>

            {/* Notification List */}
            <View className={`flex-1 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
                <ScrollView className="flex-1 px-4 mt-4">
                    { !currentSubscription ?
                        <Loading message="Loading...." /> 
                        :
                        <SubscriptionItem subscription={currentSubscription} />
                    }
                </ScrollView>
            </View>
        </View>
    );

}
