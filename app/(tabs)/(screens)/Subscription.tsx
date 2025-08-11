import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';

import React, { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, User  } from 'firebase/auth';

import { auth } from "../../../config/firebase"; // Assuming db is not needed here
import { retrieveAllDocumentSubscriptionSpecificUser } from "../../../services/userService";

import { formatDueDate } from '../../modules/constants';


type Subscription = {
  id: string;
  uid: string;
  app_name: string;
  cost: string;
  cycle: string;
  due_date: string;
  remind_me: string;
  selected_color: string;
  created_at: string;
};

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchQuery, setSearchQuery] = useState('');


    useFocusEffect(
      useCallback(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          fetchSubscriptions(firebaseUser?.uid as string);
        });
      }, [])
    );

    const fetchSubscriptions = async (user_id: string) => {
      try {
        setLoading(true);
        const res = await retrieveAllDocumentSubscriptionSpecificUser(user_id);
        const data = res.data as Subscription[];
        setSubscriptions(data);
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    function formatDueDate2(dateStr: string): string {
      // Split the input "DD/MM/YYYY" into parts
      const [day, month, year] = dateStr.split('/');

      // Convert to numbers
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);

      // Create a Date object (Note: month is 0-based in JS)
      const dateObj = new Date(yearNum, monthNum - 1, dayNum);

      // Format the date to "Month DD, YYYY"
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }


    const filteredSubscriptions = subscriptions.filter(sub =>
      sub.app_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

   return (
    <>
    <View className="flex-1 bg-white">
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
              value={searchQuery}
              onChangeText={setSearchQuery}
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
          {filteredSubscriptions.length === 0 ? (
            <View className="items-center py-6">
              <Text className="text-gray-500 text-lg ">No records found</Text>
            </View>
          ) : (
            filteredSubscriptions.map((subscription, index) => (
              <TouchableOpacity
                key={index}
                className="py-6 px-4 my-1 flex-row justify-between items-center rounded-3xl shadow-xl bg-white"
                onPress={() =>
                  // (navigation as any).navigate('SubscriptionDetails', { subscription })
                  (navigation as any).navigate('Auth', {
                      screen: 'SubscriptionDetails',
                      params: {
                        subscription,
                      },
                  })
                }
              >
                <View className="flex justify-center items-center min-h-16">
                  <View className="bg-gray-400 rounded-full h-16 w-16 shadow-xl" />
                </View>
                <View className="min-h-16 max-w-52 min-w-52 flex justify-center items-start">
                  <Text
                    className="font-bold text-base"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {subscription.app_name}
                  </Text>
                  <Text
                    className="text-sm text-gray-600"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {subscription.cycle.charAt(0).toUpperCase() + subscription.cycle.slice(1)}, {formatDueDate(subscription.due_date)} 
                  </Text>
                </View>

                <View className="flex-row justify-between items-center min-h-16">
                  <Text>₱{subscription.cost}</Text>
                  <Ionicons name="chevron-forward" size={25} color="black" className="ml-2" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
    </View>
       </>
  );

};
export default SubscriptionScreen;