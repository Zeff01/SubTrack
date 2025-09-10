import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import useSubscriptions from '@/app/hooks/useSubscriptions';
import { FadeInView } from '../../components/animated/FadeInView';
import { SlideInView } from '../../components/animated/SlideInView';
import { useTheme } from '../../providers/ThemeProvider';

//This types already appears in the types/index.ts 
// type Subscription = {
//   id?: string;
//   uid?: string;
//   user_id?: string;
//   app_name: string;
//   cost: string;
//   cost_type?: 'fixed' | 'variable';
//   average_cost?: string;
//   cycle: string;
//   due_date: string;
//   reminder?: string;
//   remind_me?: string;
//   color?: string;
//   selected_color?: string;
//   category?: string;
//   icon?: string;
//   notes?: string;
//   status?: 'active' | 'paused' | 'cancelled';
//   updated_at?: string;
//   created_at?: string;
// };

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { initialLoad, loading, subscriptions } = useSubscriptions();
  //this code is commented because it already appears in useSubscriptions.ts hook
  // useFocusEffect(
  //   useCallback(() => {
  //     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
  //       if (firebaseUser?.uid) {
  //         fetchSubscriptions(firebaseUser.uid);
  //       }
  //     });
  //     return () => unsubscribe();
  //   }, [])
  // );
  // const fetchSubscriptions = async (user_id: string) => {
  //   try {
  //     setLoading(true);
  //     const res = await retrieveAllDocumentSubscriptionSpecificUser(user_id);
  //     setSubscriptions(res.data as Subscription[]);
  //   } catch (error) {
  //     console.error('Failed to fetch subscriptions:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const formatDueDate2 = (dateStr: string): string => {
    const [month, day, year] = dateStr.split('/');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.app_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`} edges={['top']}>
      {/* Header */}
      <View className={`flex-1 justify-center items-center min-h-10 max-h-14 px-6 shadow-sm ${isDark ? 'bg-[#27272A]' : 'bg-white'}`}>
        <FadeInView duration={300}>
          <Text className={`text-2xl font-bold text-center ${isDark ? 'text-zinc-200' : 'text-gray-900'}`}>
            Subscriptions
          </Text>
        </FadeInView>
      </View>

      <ScrollView
        className={`flex-1 px-4 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 80 : 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <SlideInView direction="down" duration={250} delay={100}>
          <View className="flex-row items-center mt-4 mb-4">
            <View className={`flex-1 flex-row items-center rounded-xl px-4 py-1 border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-200'}`}>
              <FontAwesome name="search" size={18} color={isDark ? '#9CA3AF' : '#9CA3AF'} />
              <TextInput
                placeholder="Search subscriptions..."
                placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                className={`flex-1 ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
              />
            </View>
            <TouchableOpacity className={`ml-3 rounded-xl py-4 px-4 border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-200'}`}>
              <FontAwesome name="filter" size={18} color={isDark ? '#E5E7EB' : '#374151'} />
            </TouchableOpacity>
          </View>
        </SlideInView>

        {/* Subscriptions List */}
        { !initialLoad ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#3AABCC" />
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Loading subscriptions...</Text>
          </View>
        ) : filteredSubscriptions.length === 0 ? (
          <FadeInView delay={200}>
            <View className="items-center py-20">
              <Text className={`${isDark ? 'text-gray-500' : 'text-gray-400'} text-6xl mb-4`}>📭</Text>
              <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg font-medium`}>No subscriptions found</Text>
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mt-1`}>
                {searchQuery ? 'Try a different search' : 'Add your first subscription'}
              </Text>
            </View>
          </FadeInView>
        ) : (
          <View className="pb-4">
            {filteredSubscriptions.map((subscription, index) => (
              <SlideInView
                key={subscription.id}
                direction="right"
                duration={250}
                delay={150 + index * 50}
                distance={20}
              >
                <TouchableOpacity
                  className={`rounded-xl p-4 mb-3 flex-row items-center border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}
                  onPress={() => (navigation as any).navigate('subscription_details', { subscription })}
                  activeOpacity={0.7}
                >
                  {/* Icon */}
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                    style={{
                      backgroundColor: `${subscription.selected_color || subscription.color || '#3AABCC'}20`,
                    }}
                  >
                    <Text className="text-2xl">
                      {subscription.icon || subscription.app_name.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>

                  {/* Content */}
                  <View className="flex-1">
                    <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-base`} numberOfLines={1}>
                      {subscription.app_name}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                      <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                        {formatDueDate2(subscription.due_date)}
                      </Text>
                      {subscription.cost_type === 'variable' && (
                        <View className="ml-2 px-2 py-0.5 bg-orange-100 rounded">
                          <Text className="text-orange-600 text-xs font-medium">Variable</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Price */}
                  <View className="items-end">
                    <Text className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} text-base`}>
                      {subscription.cost_type === 'variable' ? '~' : ''} ₱
                      {subscription.cost_type === 'variable'
                        ? parseFloat(subscription.average_cost || '0').toFixed(2)
                        : parseFloat(subscription.cost || '0').toFixed(2)}
                    </Text>
                    <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                      {subscription.cost_type === 'variable' ? 'avg/' : '/'}
                      {subscription.cycle.toLowerCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              </SlideInView>
            ))}

            { loading && (
              <View className="flex-1 items-center justify-center py-2">
                <ActivityIndicator size="large" color="#3AABCC" />
                <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Loading subscriptions...</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Add Button */}
      <Animatable.View animation="fadeInUp" duration={400} delay={300} className="absolute bottom-6 right-4">
        <TouchableOpacity
          className="bg-[#3AABCC] rounded-full w-14 h-14 items-center justify-center shadow-lg"
          onPress={() => (navigation as any).navigate('add_subscriptions')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
};

export default SubscriptionScreen;
