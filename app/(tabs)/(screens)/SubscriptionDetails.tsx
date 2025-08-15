import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Modal, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import LoginScreen from '../../(screens)/Login';
import { useAuth } from '../../providers/AuthProvider'; // Import your AuthProvider

import { useRoute } from '@react-navigation/native';
import { deleteDocumentSubscription, retrieveSpecificDocumentSubscriptionSpecificUser } from '../../../services/userService';
import { cycles, reminders, payments, formatDueDate } from '../../modules/constants'; // Adjust path as needed
import { User } from 'firebase/auth';
import { FadeInView } from '../../components/animated/FadeInView';
import { SlideInView } from '../../components/animated/SlideInView';



const SubscriptionDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const authContext = useAuth();
  const { user } = authContext;
  const params = route.params as { subscription: any } | undefined;
  const subscription = params?.subscription;

  const [appName, setAppName] = useState('');
  const [cost, setCost] = useState('');
  const [dueDate, setDueDate] = useState<string>(new Date().toLocaleDateString());
  const [cycle, setCycle] = useState('');
  const [remindMe, setRemindMe] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] =  useState<User | null>(null); // ✅ Allow User or null
  const [subscriptionData, setSubscriptionData] =  useState<any>(null); // ✅ Allow User or null

  if (!user) {
    return <LoginScreen />;
  }

  if (!subscription) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No subscription data provided</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-blue-500 mt-4">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    setUserData(user);
    if (user?.uid && subscription?.id) {
      fetchSubscription(user.uid);
    }
  }, [user, subscription]);

  const fetchSubscription = async (user_uid : string) => {
      if (!subscription?.id) return;
      const response = await retrieveSpecificDocumentSubscriptionSpecificUser(user_uid, subscription.id); // Call your Firebase update method
      if (response?.data && response.data.length > 0) {
        setSubscriptionData(response.data[0]);
      }
  };

 
  const getPaymentLabel = (key: string) => {
      const payment = payments.find(r => r.key === key);
      return payment ? payment.value : key;
  };

  const getCycleLabel = (key: string) => {
      const cycle = cycles.find(r => r.key === key);
      return cycle ? cycle.value : key;
  };

  const getReminderLabel = (key: string) => {
      const reminder = reminders.find(r => r.key === key);
      return reminder ? reminder.value : key;
  };


  const handleDelete = async () => {
    const response = await deleteDocumentSubscription(subscription.id); // Call your Firebase update method
    setModalVisible(false); // close modal
    (navigation as any).navigate('MainTabs', {
          screen: 'Subscriptions',
          params: {
            screen: 'subscriptions',
          },
    });
  };


   return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="bg-white shadow-sm border-b border-gray-100">
        <View className="flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-2"
          >
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900">
            Subscription Details
          </Text>
          <View className="w-10" />
        </View>
      </View>

    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="px-4 pb-24">
        {/* Header Card with Icon */}
        <SlideInView direction="down" duration={250} delay={100}>
          <View className="bg-white rounded-2xl p-6 mb-4 mt-4 shadow-sm border border-gray-100">
            <View className="items-center">
              <View className="w-24 h-24 rounded-2xl mb-4 items-center justify-center"
                style={{ backgroundColor: `${subscriptionData?.selected_color || subscriptionData?.color || subscription?.color || '#3AABCC'}20` }}>
                <Text className="text-5xl">
                  {subscriptionData?.icon || subscription?.icon || subscriptionData?.app_name?.substring(0, 2).toUpperCase() || '?'}
                </Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900 text-center">
                {subscriptionData?.app_name || subscription?.app_name}
              </Text>
              {(subscriptionData?.category || subscription?.category) && (
                <View className="mt-2 px-3 py-1 bg-gray-100 rounded-full">
                  <Text className="text-sm text-gray-600">{subscriptionData?.category || subscription?.category}</Text>
                </View>
              )}
            </View>
          </View>
        </SlideInView>

        {/* Cost Information */}
        <SlideInView direction="left" duration={250} delay={200}>
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
            <Text className="text-sm font-medium text-gray-500 mb-3">Payment Details</Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-700">Cost Type</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-900 font-medium">
                    {(subscriptionData?.cost_type || subscription?.cost_type) === 'variable' ? 'Variable' : 'Fixed'}
                  </Text>
                  {(subscriptionData?.cost_type || subscription?.cost_type) === 'variable' && (
                    <View className="ml-2 px-2 py-0.5 bg-orange-100 rounded">
                      <Text className="text-orange-600 text-xs font-medium">Varies</Text>
                    </View>
                  )}
                </View>
              </View>

              <View className="h-px bg-gray-100" />

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-700">
                  {(subscriptionData?.cost_type || subscription?.cost_type) === 'variable' ? 'Average Cost' : 'Cost'}
                </Text>
                <Text className="text-lg font-semibold text-gray-900">
                  ₱{subscriptionData?.cost || subscription?.cost}
                </Text>
              </View>

              <View className="h-px bg-gray-100" />

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-700">Billing Cycle</Text>
                <Text className="text-gray-900 font-medium">
                  {getCycleLabel(subscriptionData?.cycle || subscription?.cycle)}
                </Text>
              </View>
            </View>
          </View>
        </SlideInView>

        {/* Schedule Information */}
        <SlideInView direction="right" duration={250} delay={250}>
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
            <Text className="text-sm font-medium text-gray-500 mb-3">Schedule</Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-700">Due Date</Text>
                <Text className="text-gray-900 font-medium">
                  {subscriptionData?.due_date || subscription?.due_date}
                </Text>
              </View>

              <View className="h-px bg-gray-100" />

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-700">Reminder</Text>
                <Text className="text-gray-900 font-medium">
                  {getReminderLabel(subscriptionData?.remind_me || subscriptionData?.reminder || subscription?.reminder)}
                </Text>
              </View>
            </View>
          </View>
        </SlideInView>

        {/* Additional Information */}
        <SlideInView direction="left" duration={250} delay={300}>
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
            <Text className="text-sm font-medium text-gray-500 mb-3">Additional Details</Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-700">Status</Text>
                <View className={`px-2 py-1 rounded ${
                  (subscriptionData?.status || subscription?.status) === 'active' 
                    ? 'bg-green-100' 
                    : (subscriptionData?.status || subscription?.status) === 'paused'
                    ? 'bg-yellow-100'
                    : 'bg-red-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    (subscriptionData?.status || subscription?.status) === 'active' 
                      ? 'text-green-600' 
                      : (subscriptionData?.status || subscription?.status) === 'paused'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {(subscriptionData?.status || subscription?.status || 'active').toUpperCase()}
                  </Text>
                </View>
              </View>

              <View className="h-px bg-gray-100" />

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-700">Color</Text>
                <View className="flex-row items-center">
                  <View 
                    className="w-6 h-6 rounded-full mr-2"
                    style={{ backgroundColor: subscriptionData?.selected_color || subscriptionData?.color || subscription?.color || '#3AABCC' }}
                  />
                  <Text className="text-gray-500 text-sm">
                    {subscriptionData?.selected_color || subscriptionData?.color || subscription?.color || '#3AABCC'}
                  </Text>
                </View>
              </View>

              {(subscriptionData?.notes || subscription?.notes) && (
                <>
                  <View className="h-px bg-gray-100" />
                  <View>
                    <Text className="text-gray-700 mb-1">Notes</Text>
                    <Text className="text-gray-600 text-sm">
                      {subscriptionData?.notes || subscription?.notes}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </SlideInView>

        {/* Action Buttons */}
        <SlideInView direction="up" duration={250} delay={350}>
          <View className="space-y-3 mt-6">
            <TouchableOpacity 
              className="bg-[#3AABCC] rounded-xl py-4 w-full shadow-sm"
              onPress={() => 
                (navigation as any).navigate('edit_subscription', { 
                  subscription: subscriptionData || subscription 
                })
              }
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="create-outline" size={20} color="white" />
                <Text className="text-white text-center text-lg font-semibold ml-2">Edit Subscription</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-red-500 rounded-xl py-4 w-full shadow-sm"
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="trash-outline" size={20} color="white" />
                <Text className="text-white text-center text-lg font-semibold ml-2">Delete Subscription</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SlideInView>
      </View>
    </ScrollView>

    <Modal
      transparent
      visible={modalVisible}
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl w-[85%] p-6">
          <View className="items-center mb-4">
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-3">
              <Ionicons name="warning-outline" size={32} color="#EF4444" />
            </View>
            <Text className="text-xl font-semibold text-gray-900 text-center">
              Delete Subscription?
            </Text>
          </View>
          
          <Text className="text-gray-600 text-center mb-6">
            Are you sure you want to delete "{subscriptionData?.app_name || subscription?.app_name}"? This action cannot be undone.
          </Text>
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              className="flex-1 bg-gray-200 py-3 rounded-lg mr-2"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#F2786F] py-3 rounded-lg ml-2"
              onPress={handleDelete}
            >
              <Text className="text-center text-white font-semibold">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </SafeAreaView>
  );

};
export default SubscriptionDetailsScreen;