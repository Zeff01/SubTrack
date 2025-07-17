import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

const SubscriptionDetailsScreen = () => {
  const navigation = useNavigation();

  const subscriptions = [
    { name: 'Netflix', price: '₱6001', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Disney+', price: '₱800', dueDate: 'Due date: June 29, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
  ];


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

        <Text className="text-2xl font-bold">Netflix</Text>
        {/* <Text className="text-sm text-gray-500 mb-4">Price</Text> */}
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-16" />
      
       <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700">Cost per month</Text>
          <Text className="text-lg font-medium">₱600</Text>
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-4" />


       <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700 mt-4">Due Date</Text>
          <Text className="text-lg font-medium">July 1, 2025</Text>
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-4" />

        <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700 mt-4">Cycle</Text>
          <Text className="text-lg font-medium">Monthly</Text>
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-4" />

        <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700 mt-4">Payment Method</Text>
          <Text className="text-lg font-medium">Gcash</Text>
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-4" />


        <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-sm text-gray-700 mt-4">Remind me</Text>
          <Text className="text-lg font-medium">5 days before</Text>
        </View>
        <View className="w-full border-b-2 border-gray-800 mb-5 mt-4" />

        <View className="flex flex-row justify-between items-center w-full">
            <TouchableOpacity 
                className="bg-[#71E0BB] rounded-lg p-3 mt-6 w-full"
                onPress={() => (navigation as any).navigate('EditSubscription')}
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