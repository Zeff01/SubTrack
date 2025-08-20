import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import LoginScreen from '../../(screens)/Login';
import { useAuth } from '../../providers/AuthProvider';
import {
  deleteDocumentSubscription,
  retrieveSpecificDocumentSubscriptionSpecificUser
} from '../../../services/userService';
import { FadeInView } from '../../components/animated/FadeInView';
import { SlideInView } from '../../components/animated/SlideInView';
import { cycles, reminders, categories } from '../../modules/constants';
import { useTheme } from '../../providers/ThemeProvider';

const SubscriptionDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const subscription = (route.params as any)?.subscription;
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (user?.uid && subscription?.id) {
      (async () => {
        const res = await retrieveSpecificDocumentSubscriptionSpecificUser(user.uid, subscription.id);
        if (res?.data?.length) setSubscriptionData(res.data[0]);
      })();
    }
  }, [user, subscription]);

  if (!user) return <LoginScreen />;
  if (!subscription) return (
    <View className={`${isDark ? 'bg-[#18181B]' : 'bg-gray-50'} flex-1 items-center justify-center`}>
      <Text className={`${isDark ? 'text-zinc-200' : 'text-gray-900'}`}>No subscription data</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-blue-500 mt-4">Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const getLabel = (list: any[], key?: string) => list.find(r => r.key === key)?.value || key;

  const handleDelete = async () => {
    await deleteDocumentSubscription(subscription.id);
    setModalVisible(false);
    Alert.alert("Deleted", "Subscription removed successfully.", [{
      text: "OK",
         onPress: () =>
              (navigation as any).navigate('MainTabs', {
                screen: 'Subscriptions',
                params: {
                  screen: 'subscriptions',
                },
              }),
    }]);
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`} edges={['top']}>
      {/* Header */}
      <View className={`${isDark ? 'bg-[#27272A] border-b-[#3F3F46]' : 'bg-white'} shadow-sm`}>
        <View className="flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="chevron-back" size={24} color={isDark ? '#E5E7EB' : '#374151'} />
          </TouchableOpacity>
          <Text className={`${isDark ? 'text-zinc-200' : 'text-gray-900'} text-xl font-semibold`}>
            Subscription Details
          </Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className={`${isDark ? 'bg-[#18181B]' : 'bg-gray-50'} flex-1`} showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-24">
          {/* Header Card */}
          <SlideInView direction="down" duration={250} delay={100}>
            <View className={`${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'} rounded-2xl p-6 mb-4 mt-4 border shadow-sm`}>
              <View className="items-center">
                <View
                  className="w-24 h-24 rounded-2xl mb-4 items-center justify-center"
                  style={{ backgroundColor: `${(subscriptionData?.selected_color ?? subscription?.color) || '#3AABCC'}20` }}
                >
                  <Text className={`${isDark ? 'text-white' : 'text-gray-900'} text-5xl`}>
                    {(
                      subscriptionData?.icon ??
                      subscription?.icon ??
                      subscription?.app_name?.substring(0, 2).toUpperCase()
                    ) ?? '?'}
                  </Text>
                </View>
                <Text className={`${isDark ? 'text-white' : 'text-gray-900'} text-2xl font-bold text-center`}>
                  {subscriptionData?.app_name ?? subscription?.app_name}
                </Text>
                {(subscriptionData?.category || subscription?.category) && (
                  <View className={`${isDark ? 'bg-gray-400' : 'bg-gray-100'} mt-2 px-3 py-1 rounded-full`}>
                    <Text className={`${isDark ? 'text-gray-100' : 'text-gray-600'} text-sm`}>
                      {getLabel(categories, subscriptionData?.category ?? subscription?.category)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </SlideInView>

          {/* Payment Details */}
          <SlideInView direction="left" duration={250} delay={200}>
            <View className={`${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'} rounded-2xl p-4 mb-4 border shadow-sm`}>
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} font-extrabold text-xl mb-3`}>Payment Details</Text>
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Cost Type</Text>
                  <View className="flex-row items-center">
                    <Text className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>
                      {(subscriptionData?.cost_type ?? subscription?.cost_type) === 'variable' ? 'Variable' : 'Fixed'}
                    </Text>
                    {(subscriptionData?.cost_type ?? subscription?.cost_type) === 'variable' && (
                      <View className="ml-2 px-2 py-0.5 bg-orange-100 rounded">
                        <Text className="text-orange-600 text-xs">Varies</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View className={`${isDark ? 'bg-[#3F3F46]' : 'bg-gray-100'} h-px`} />
                <View className="flex-row justify-between items-center">
                  <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
                    {(subscriptionData?.cost_type ?? subscription?.cost_type) === 'variable' ? 'Average Cost' : 'Cost'}
                  </Text>
                  <Text className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>
                    {(subscriptionData?.cost_type ?? subscription?.cost_type) === 'variable'
                      ? parseFloat(subscriptionData?.average_cost ?? subscription?.average_cost ?? '0').toFixed(2)
                      : parseFloat(subscriptionData?.cost ?? subscription?.cost ?? '0').toFixed(2)}
                  </Text>
                </View>
                <View className={`${isDark ? 'bg-[#3F3F46]' : 'bg-gray-100'} h-px`} />
                <View className="flex-row justify-between items-center">
                  <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Billing Cycle</Text>
                  <Text className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>
                    {getLabel(cycles, subscriptionData?.cycle ?? subscription?.cycle)}
                  </Text>
                </View>
              </View>
            </View>
          </SlideInView>

          {/* Schedule Section */}
          <SlideInView direction="right" duration={250} delay={300}>
            <View className={`${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'} rounded-2xl p-4 mb-4 border shadow-sm`}>
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} font-extrabold text-xl mb-3`}>Schedule</Text>
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Due Date</Text>
                  <Text className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>
                    {subscriptionData?.due_date ?? subscription?.due_date}
                  </Text>
                </View>
                <View className={`${isDark ? 'bg-[#3F3F46]' : 'bg-gray-100'} h-px`} />
                <View className="flex-row justify-between items-center">
                  <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Reminder</Text>
                  <Text className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>
                    {getLabel(reminders, (subscriptionData?.remind_me ?? subscription?.reminder))}
                  </Text>
                </View>
              </View>
            </View>
          </SlideInView>

          {/* Additional Details Section */}
          <SlideInView direction="left" duration={250} delay={400}>
            <View className={`${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'} rounded-2xl p-4 mb-4 border shadow-sm`}>
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} font-extrabold text-xl  mb-3`}>Additional Details</Text>
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Status</Text>
                  <View className={`${(subscriptionData?.status ?? subscription?.status) === 'active'
                    ? 'bg-green-100'
                    : (subscriptionData?.status ?? subscription?.status) === 'paused'
                      ? 'bg-yellow-100'
                      : 'bg-red-100'
                  } px-2 py-1 rounded`}>
                    <Text className={`${(subscriptionData?.status ?? subscription?.status) === 'active'
                      ? 'text-green-600'
                      : (subscriptionData?.status ?? subscription?.status) === 'paused'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    } text-xs font-medium`}>
                      {(subscriptionData?.status ?? subscription?.status ?? 'active').toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View className={`${isDark ? 'bg-[#3F3F46]' : 'bg-gray-100'} h-px`} />
                <View className="flex-row justify-between items-center">
                  <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Color</Text>
                  <View className="flex-row items-center">
                    <View
                      className="w-6 h-6 rounded-full mr-2"
                      style={{ backgroundColor: subscriptionData?.selected_color ?? subscription?.color ?? '#3AABCC' }}
                    />
                    <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                      {subscriptionData?.selected_color ?? subscription?.color ?? '#3AABCC'}
                    </Text>
                  </View>
                </View>
                {(subscriptionData?.notes ?? subscription?.notes) && (
                  <>
                    <View className={`${isDark ? 'bg-[#3F3F46]' : 'bg-gray-100'} h-px`} />
                    <View>
                      <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Notes</Text>
                      <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        {subscriptionData?.notes ?? subscription?.notes}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </SlideInView>

          {/* Action Buttons */}
<SlideInView direction="up" duration={250} delay={500}>
  <View className="mt-6">
    <TouchableOpacity
      className="bg-[#3AABCC] rounded-xl py-4 w-full shadow-sm mb-6"
      onPress={() => (navigation as any).navigate('edit_subscription', {
        subscription: subscriptionData ?? subscription
      })}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-center">
        <Ionicons name="create-outline" size={20} color="white" />
        <Text className="text-white text-lg font-semibold ml-2">Edit Subscription</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      className="bg-red-500 rounded-xl py-4 w-full shadow-sm"
      onPress={() => setModalVisible(true)}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-center">
        <Ionicons name="trash-outline" size={20} color="white" />
        <Text className="text-white text-lg font-semibold ml-2">Delete Subscription</Text>
      </View>
    </TouchableOpacity>
  </View>
</SlideInView>



          
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <View>
      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-center items-center ">
          <View className={`${isDark ? 'bg-[#27272A]' : 'bg-white'} rounded-2xl w-[85%] p-6`}>
            <View className="items-center mb-4">
              <View className={`${isDark ? 'bg-red-800' : 'bg-red-100'} w-16 h-16 rounded-full items-center justify-center mb-3`}>
                <Ionicons name="warning-outline" size={32} color={isDark ? '#F87171' : '#EF4444'} />
              </View>
              <Text className={`${isDark ? 'text-zinc-200' : 'text-gray-900'} text-xl font-semibold text-center`}>
                Delete Subscription?
              </Text>
            </View>  
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-center mb-6`}>
              Are you sure you want to delete “{subscriptionData?.app_name ?? subscription?.app_name}”? This action cannot be undone.
            </Text>
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity className={`${isDark ? 'bg-[#3F3F46]' : 'bg-gray-200'} flex-1 py-3 rounded-lg mr-2`} onPress={() => setModalVisible(false)}>
                <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-semibold text-center`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-[#F2786F] flex-1 py-3 rounded-lg ml-2" onPress={handleDelete}>
                <Text className="text-white font-semibold text-center">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </View>

    </SafeAreaView>
  );
};

export default SubscriptionDetailsScreen;
