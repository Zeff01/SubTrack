import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import LoginScreen from '../../(screens)/Login';
import { useAuth } from '../../providers/AuthProvider'; // Import your AuthProvider

import { useRoute } from '@react-navigation/native';


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
  const [selectedColor, setSelectedColor] = useState('');
  

  if (!user) {
    return <LoginScreen />;
  }

  const reminders = [
    { key: '1_day_before', value: '1 Day Before' },
    { key: '3_day_before', value: '3 Day Before' },
    { key: '1_week_before', value: '1 Week Before' },
  ];

  useEffect(() => {
      if (subscription) {
        setAppName(subscription.app_name);
        setCost(subscription.cost);
        setCycle(subscription.cycle);
        setRemindMe(subscription.remind_me || '');
        setDueDate(subscription.due_date);
        setSelectedColor(subscription.selected_color);
      }
  }, [subscription]);

     const formatDate = (dateString: string): string => {
      const [month, day, year] = dateString.split('/').map(Number);

      if (!month || !day || !year) return 'Invalid Date';

      const parsedDate = new Date(year, month - 1, day); // month is 0-based

      return parsedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const getReminderLabel = (key: string) => {
      const reminder = reminders.find(r => r.key === key);
      return reminder ? reminder.value : key;
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

        <Text className="text-2xl font-bold">{appName}</Text>
        {/* <Text className="text-sm text-gray-500 mb-4">Price</Text> */}
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-16" />
      
       <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700">Cost per month</Text>
          <Text className="text-lg font-medium">₱{cost}</Text>
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-4" />


       <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700 mt-4">Due Date</Text>
          <Text className="text-lg font-medium">{formatDate(dueDate)}</Text>
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-4" />

        <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700 mt-4">Cycle</Text>
          <Text className="text-lg font-medium">{cycle.charAt(0).toUpperCase() + cycle.slice(1)}</Text>
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-4" />

        <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700 mt-4">Remind me</Text>
          <Text className="text-lg font-medium">{getReminderLabel(remindMe)}</Text>
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-3 mt-4" />

        <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700  w-full py-4" style={{ backgroundColor: selectedColor}}></Text>
          {/* <Text className="text-lg font-medium w-36"  >ads</Text> */}
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-4" />

        <View className="flex flex-row justify-between items-center w-full">
            <TouchableOpacity 
                className="bg-[#71E0BB] rounded-lg p-3 mt-6 w-full"
                onPress={() => (navigation as any).navigate('EditSubscription', {subscription})}
                // onPress={() => (navigation as any).navigate('Subscriptions', { screen: 'edit_subscription' })}
            >
                <Text className="text-white text-center text-xl font-bold">EDIT</Text>
            </TouchableOpacity>
        </View>

         <View className="flex flex-row justify-between items-center w-full">
            <TouchableOpacity 
                className="bg-[#F2786F] rounded-lg p-3 mt-6 w-full"
                // onPress={handleAddSubscription}
            >
                <Text className="text-white text-center text-xl font-bold">DELETE</Text>
            </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );

};
export default SubscriptionDetailsScreen;