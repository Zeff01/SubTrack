import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState, useEffect } from 'react';

import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { retrieveAllDocumentSubscriptionSpecificUser } from '../../../services/userService.js';
import Subscription from '../../../types/Subscription.js';
import { signOut, onAuthStateChanged, User  } from 'firebase/auth';
import { auth } from "../../../config/firebase"; // Assuming db is not needed here



export default function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  

  // 🔁 Re-fetch when the tab/screen comes into focus
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

  return (
    <View className="bg-black flex-1 p-4">
      <Text className="text-white text-2xl font-bold mb-4 mt-10">Subscriptions</Text>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-2">Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={subscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
            onPress={() => router.push({ pathname: '/(tabs)/stacks/details', params: item})}
            className="bg-gray-800 p-4 rounded mb-2">
              <Text className="text-white font-medium">{item.platform}</Text>
              <Text className="text-gray-400">{item.cycle}</Text>
              <Text className="text-gray-400">{item.cost}</Text>
              <Text className="text-gray-400">{item.subscription_date}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
