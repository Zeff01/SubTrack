import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

const SubscriptionScreen = () => {
  const navigation = useNavigation();

  const subscriptions = [
    { name: 'Netflix', price: '₱600', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Disney+', price: '₱800', dueDate: 'Due date: June 29, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
  ];


   return (
    <>
    <View className="pt-12 pb-6 px-6 bg-[#D9D9D9] rounded-b-3xl">
      <View className="relative items-center justify-center">
        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute left-0 px-4"
        >
          <Ionicons name="chevron-back" size={25} color="black" />
        </TouchableOpacity> */}
        <Text className="text-xl font-semibold text-gray-800">
           Subscriptions
        </Text>
      </View>
    </View>

 
    <View className="flex-1 bg-white">
    
    

      {/* Scrollable Content */}
      <ScrollView className="flex-1 px-4">
        {/* <View className="mt-6 items-center">
                    <TouchableOpacity className="bg-[#3AABCC] rounded-xl shadow-md w-full h-14 justify-center"
                      onPress={() => (navigation as any).navigate('Plus')}
                    >
                      <Text className="text-white font-semibold text-xl text-center">
                         Add Subscription
                      </Text>
                    </TouchableOpacity>
                  </View> */}
        
       <View className="flex-row items-center mt-4 py-2">
        
          <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#D1D5DB',
              backgroundColor: 'white',
              elevation: 1,
              flex: 1, // Allow search bar to take available width
            }}>
            <FontAwesome name="search" size={20} color="black" style={{ padding: 10 }} />
            <TextInput
              placeholder="Search..."
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                paddingVertical: 10,
                paddingHorizontal: 0,
              }}
            />
          </View>
          <TouchableOpacity className="rounded-full p-3 ml-2" style={{ justifyContent: 'center', alignItems: 'center', }}>
            <FontAwesome name="filter" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View className="mt-4">
          {subscriptions.map((subscription, index) => (
            <TouchableOpacity key={index}  
              className="py-6 px-4 my-1 flex-row justify-between  items-center rounded-3xl shadow-xl bg-white"
              // onPress={() => (navigation as any).navigate('Subscriptions', { screen: 'subscription_details' })}
              onPress={() => (navigation as any).navigate('SubscriptionDetails')}
            >
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
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
       </>
  );

};
export default SubscriptionScreen;