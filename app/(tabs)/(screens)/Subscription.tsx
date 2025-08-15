import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import React, { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, User  } from 'firebase/auth';

import { auth } from "../../../config/firebase";
import { retrieveAllDocumentSubscriptionSpecificUser } from "../../../services/userService";
import { FadeInView } from '../../components/animated/FadeInView';
import { SlideInView } from '../../components/animated/SlideInView';

type Subscription = {
  id?: string;
  uid?: string;
  user_id?: string;
  app_name: string;
  cost: string;
  cost_type?: 'fixed' | 'variable';
  average_cost?: string;
  cycle: string;
  due_date: string;
  reminder?: string;
  remind_me?: string;
  color?: string;
  selected_color?: string;
  category?: string;
  icon?: string;
  notes?: string;
  status?: 'active' | 'paused' | 'cancelled';
  updated_at?: string;
  created_at?: string;
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
    const [day, month, year] = dateStr.split('/');
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    const dateObj = new Date(yearNum, monthNum - 1, dayNum);
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
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="pb-6 px-6 bg-white shadow-sm">
        <FadeInView duration={300}>
          <Text className="text-2xl font-bold text-gray-900 text-center">
            Subscriptions
          </Text>
        </FadeInView>
      </View>

      <ScrollView 
        className="flex-1 px-4" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 80 : 100 }}
      >
        {/* Search Bar */}
        <SlideInView direction="down" duration={250} delay={100}>
          <View className="flex-row items-center mt-4 mb-4">
            <View className="flex-1 flex-row items-center bg-white rounded-xl border border-gray-200 px-4 py-3">
              <FontAwesome name="search" size={18} color="#9CA3AF" />
              <TextInput
                placeholder="Search subscriptions..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-3 text-gray-900"
              />
            </View>
            <TouchableOpacity className="ml-3 bg-white rounded-xl p-3 border border-gray-200">
              <FontAwesome name="filter" size={18} color="#374151" />
            </TouchableOpacity>
          </View>
        </SlideInView>

        {/* Subscriptions List */}
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#3AABCC" />
            <Text className="text-gray-500 mt-2">Loading subscriptions...</Text>
          </View>
        ) : filteredSubscriptions.length === 0 ? (
          <FadeInView delay={200}>
            <View className="items-center py-20">
              <Text className="text-gray-400 text-6xl mb-4">📭</Text>
              <Text className="text-gray-600 text-lg font-medium">No subscriptions found</Text>
              <Text className="text-gray-500 text-sm mt-1">
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
                delay={150 + (index * 50)}
                distance={20}
              >
                <TouchableOpacity
                  className="bg-white rounded-xl p-4 mb-3 border border-gray-100 flex-row items-center"
                  onPress={() =>
                    (navigation as any).navigate('subscription_details', { subscription })
                  }
                  activeOpacity={0.7}
                >
                  {/* Icon */}
                  <View 
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: `${subscription.selected_color || subscription.color || '#3AABCC'}20` }}
                  >
                    <Text className="text-2xl">
                      {subscription.icon || subscription.app_name.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  
                  {/* Content */}
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 text-base" numberOfLines={1}>
                      {subscription.app_name}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                      <Text className="text-gray-500 text-sm">
                        {formatDueDate2(subscription.due_date)} • {subscription.cycle}
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
                    <Text className="font-bold text-gray-900 text-base">
                      {subscription.cost_type === 'variable' ? '~' : ''}₱{parseFloat(subscription.cost).toFixed(2)}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {subscription.cost_type === 'variable' ? 'avg/' : '/'}{subscription.cycle.toLowerCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              </SlideInView>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Button */}
      <Animatable.View 
        animation="fadeInUp" 
        duration={400}
        delay={300}
        className="absolute bottom-6 right-4"
      >
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