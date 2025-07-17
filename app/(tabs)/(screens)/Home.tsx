import React from 'react';
import { View, Text, ScrollView, TouchableOpacity,  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { PaymentCardProps } from '../../../types/PaymentCardPropsType'; // Adjust path as needed


const HomeScreen = () => {
  const navigation = useNavigation();
  
  const subscriptions = [
    { name: 'Netflix', price: '₱600', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Disney+', price: '₱800', dueDate: 'Due date: June 29, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Netflix', price: '₱600', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Disney+', price: '₱800', dueDate: 'Due date: June 29, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
  ];


const PaymentCard = ({ color, subscription, amount, dueDate }: PaymentCardProps) => {
  return (
    <View
      className="w-52 rounded-b-3xl p-4 mr-4  bg-white border"
      // style={{ backgroundColor: color }}
    >
      <Text className="text-right text-2xl font-extrabold text-gray-900">{amount}</Text>

      <View className="flex items-start mt-6">
        {/* Icon placeholder */}
        <View className="bg-gray-500 rounded-full h-10 w-10 mb-3 shadow-xl" />

        <Text className="text-lg font-semibold text-gray-800">{subscription}</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Due date:{' '}
          <Text className="text-red-500 font-semibold text-base">{dueDate}</Text>
        </Text>
      </View>
    </View>
  );
};

   return (
    <View className="flex-1 bg-white">
      <View className="pt-12 pb-6 px-6 bg-[#D9D9D9] rounded-b-3xl">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-gray-400 rounded-full mr-2" />
            <Text className="text-xl font-semibold text-gray-800">Hello, Kristine!</Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity className="mr-2">
              <Text className="text-gray-600">🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-gray-600">⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView className="flex-1 px-4">
        <View className="mt-4">
          <Text className="text-gray-700 text-xl font-bold">Total Monthly Payment</Text>
          <View className="flex-row items-center mt-4 bg-blue-500 rounded-3xl p-5">
            <Text className="text-2xl font-bold flex-1 text-gray-800">June 2025</Text>
            <TouchableOpacity className="ml-2 p-2 flex-row items-center">
              <Text className="text-white text-center font-semibold">₱2600</Text>
              <Ionicons name="chevron-forward" size={25} color="white" className="ml-2" />
            </TouchableOpacity>
          </View>
        </View>

         <View className="mt-4 bg-white flex-1 justify-center align-center">
            <Text className="text-xl font-bold">Upcoming Payments</Text>
            <ScrollView horizontal={true} className="py-4 bg-transparent">
                <View className="flex-row">
                    <PaymentCard 
                        color="lightgreen" 
                        subscription="Disney+" 
                        amount="₱800" 
                        dueDate="June 25, 2025" 
                    />
                    <PaymentCard 
                        color="lightyellow" 
                        subscription="Netflix" 
                        amount="₱600" 
                        dueDate="June 30, 2025" 
                    />
                      <PaymentCard 
                        color="lightgreen" 
                        subscription="Disney+" 
                        amount="₱800" 
                        dueDate="June 25, 2025" 
                    />
                    <PaymentCard 
                        color="lightyellow" 
                        subscription="Netflix" 
                        amount="₱600" 
                        dueDate="June 30, 2025" 
                    />
                      <PaymentCard 
                        color="lightgreen" 
                        subscription="Disney+" 
                        amount="₱800" 
                        dueDate="June 25, 2025" 
                    />
                    <PaymentCard 
                        color="lightyellow" 
                        subscription="Netflix" 
                        amount="₱600" 
                        dueDate="June 30, 2025" 
                    />
                      <PaymentCard 
                        color="lightgreen" 
                        subscription="Disney+" 
                        amount="₱800" 
                        dueDate="June 25, 2025" 
                    />
                    <PaymentCard 
                        color="lightyellow" 
                        subscription="Netflix" 
                        amount="₱600" 
                        dueDate="June 30, 2025" 
                    />
                </View>
            </ScrollView>
        </View>

        <View className="mt-4">
           <View className="flex-row justify-between items-center w-full">
            <Text className="text-gray-700 text-2xl font-bold">My Subscriptions</Text>
            <TouchableOpacity 
              onPress={() => (navigation as any).navigate('Subscriptions', { screen: 'subscriptions' })}
            >
              <Text className=" text-xs underline text-[#3AABCC]">See All</Text>
            </TouchableOpacity>                  
          </View>
        </View>

        <View className="mt-4">
          {subscriptions.map((subscription, index) => (
            <View key={index}  className="py-6 px-4 my-1 flex-row justify-between mt-2  items-center rounded-3xl shadow-xl bg-white">
              <View className="flex justify-center items-center  min-h-16">
                <View className="bg-gray-400 rounded-full h-10 w-10 shadow-xl" />
              </View>
              <View className="min-h-16 flex justify-center  items-start">
                <Text className="font-bold">{subscription.name}</Text>
                <Text>{subscription.dueDate}</Text>
              </View>
              <View className="flex-row justify-between items-center min-h-16">
                <Text>{subscription.price}</Text>
                <Ionicons name="chevron-forward" size={25} color="black" className="ml-2" />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

};
export default HomeScreen;