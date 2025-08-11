import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Modal   } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import LoginScreen from '../../(screens)/Login';
import { useAuth } from '../../providers/AuthProvider'; // Import your AuthProvider

import { useRoute } from '@react-navigation/native';
import { deleteDocumentSubscription, retrieveSpecificDocumentSubscriptionSpecificUser } from '../../../services/userService';
import { cycles, reminders, payments, formatDueDate } from '../../modules/constants'; // Adjust path as needed
import { User } from 'firebase/auth';



const SubscriptionDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const authContext = useAuth();
  const { user } = authContext;
  const { subscription } = route.params as { subscription: any };
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

  useEffect(() => {
    setUserData(user);
    fetchSubscription(userData?.uid as string);
  }, [userData]);

  const fetchSubscription = async (user_uid : string) => {
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
    <View className="flex-1 bg-white">
      <View className="pt-12 pb-6 px-6 bg-[#D9D9D9] rounded-b-3xl">
          <View className="relative items-center justify-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute left-0 px-4"
            >
              <Ionicons name="chevron-back" size={25} color="black" />
            </TouchableOpacity>
            <Text className="text-xl font-semibold text-gray-800">
               My Subscription
            </Text>
          </View>
        </View>

    <ScrollView className="flex-1">
    <View className="flex-1 items-center bg-white p-4 rounded-lg shadow-md px-10">
        <View className="w-24 h-24 bg-gray-300 rounded-full mb-4">
          <Image
            source={{ uri: 'url_to_your_image' }} // Replace with your image URL
            className="w-full h-full rounded-full"
          />
        </View>

        <Text className="text-2xl font-bold">{subscriptionData?.app_name}</Text>
        {/* <Text className="text-sm text-gray-500 mb-4">Price</Text> */}
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-16" />
      
       <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700">Cost per month</Text>
          <Text className="text-lg font-medium">₱{subscriptionData?.cost}</Text>
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-4" />


       <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700 mt-4">Due Date</Text>
          <Text className="text-lg font-medium">{subscriptionData?.due_date}</Text>
          {/* <Text className="text-lg font-medium">{formatDueDate(subscriptionData?.due_date)}</Text> */}
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-4" />

        <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700 mt-4">Cycle</Text>
          <Text className="text-lg font-medium">{getCycleLabel(subscriptionData?.cycle)}</Text>
          {/* <Text className="text-lg font-medium">{cycle.charAt(0).toUpperCase() + cycle.slice(1)}</Text> */}
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-4" />

        <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700 mt-4">Remind me</Text>
          <Text className="text-lg font-medium">{getReminderLabel(subscriptionData?.remind_me)}</Text>
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-3 mt-4" />

         {/* <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700 mt-4">Payment Status</Text>
          <Text className="text-lg font-medium">{getPaymentLabel(subscriptionData?.payment_status)}</Text>
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-3 mt-4" /> */}

        <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700  w-full py-4" style={{ backgroundColor: subscriptionData?.selected_color}}></Text>
          {/* <Text className="text-lg font-medium w-36"  >ads</Text> */}
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-4" />

        <View className="flex flex-row justify-between items-center w-full">
            <TouchableOpacity 
                className="bg-[#71E0BB] rounded-lg p-3 mt-6 w-full"
                onPress={() => 
                  // (navigation as any).navigate('EditSubscription', {subscription : subscriptionData})
                     (navigation as any).navigate('Auth', {
                        screen: 'EditSubscription',
                        params: {
                          subscription : subscriptionData,
                        },
                    })
                }
            >
                <Text className="text-white text-center text-xl font-bold">EDIT</Text>
            </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-between items-center w-full mb-28">
            <TouchableOpacity 
                className="bg-[#F2786F] rounded-lg p-3 mt-6 w-full"
                // onPress={handleAddSubscription}
                onPress={() => setModalVisible(true)}
            >
                <Text className="text-white text-center text-xl font-bold">DELETE</Text>
            </TouchableOpacity>
        </View>

        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-xl w-[80%] p-6">
              <Text className="text-lg font-semibold text-center mb-4">
                Are you sure you want to delete this item?
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

      </View>
      </ScrollView>
    </View>
  );

};
export default SubscriptionDetailsScreen;