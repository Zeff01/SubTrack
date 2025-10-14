import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { useAuth } from '../providers/AuthProvider';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { useTheme } from '../providers/ThemeProvider';

import CalendarView from '../components/home/CalendarView';
import SubscriptionItem from '../components/home/SubscriptionItem';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { FadeInView } from '../components/animated/FadeInView';

import { Subscription } from '../../types';

const Calendar = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { subscriptions, highlightedDays, loading, error } = useSubscriptions();

  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDay, setSelectedDay] = useState<string | null>(moment().format('YYYY-MM-DD'));

  // Get subscriptions for selected day
  const selectedDayData = highlightedDays.find(h => h.date === selectedDay);
  const selectedDaySubscriptions = selectedDayData
    ? subscriptions.filter(sub => selectedDayData.id.includes(sub.id || ''))
    : [];

  const handlePrevMonth = () => {
    const newDate = currentDate.clone().subtract(1, 'month');
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = currentDate.clone().add(1, 'month');
    setCurrentDate(newDate);
  };

  const handleDayPress = (day: string) => {
    setSelectedDay(day);
  };

  const handleAddSubscription = () => {
    (navigation as any).navigate('Subscriptions', { screen: 'add_subscriptions' });
  };

  const handleSubscriptionPress = (subscription: Subscription) => {
    (navigation as any).navigate('Subscriptions', {
      screen: 'subscription_details',
      params: { subscription },
    });
  };

  if (loading) {
    return <Loading message="Loading calendar..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => {}} />;
  }

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`}
      edges={['top']}
    >
      <View className="flex-1" style={{ paddingBottom: Platform.OS === 'ios' ? 100 : 120 }}>
        {/* Calendar */}
        <FadeInView delay={0} duration={300}>
          <View className="mx-4 mt-4 mb-4">
            <View
              className={`rounded-2xl shadow-sm border p-4 ${
                isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'
              }`}
            >
              <CalendarView
                currentDate={currentDate}
                selectedDay={selectedDay}
                highlightedDays={highlightedDays}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onDayPress={handleDayPress}
                onAddSubscription={handleAddSubscription}
              />
            </View>
          </View>
        </FadeInView>

        {/* Selected Day Subscriptions */}
        {selectedDaySubscriptions.length > 0 && (
          <FadeInView delay={200} duration={300}>
            <View className="mx-4 mb-4">
              <Text
                className={`text-lg font-semibold mb-3 ${
                  isDark ? 'text-zinc-200' : 'text-gray-900'
                }`}
              >
                Subscriptions on {moment(selectedDay).format('MMMM D, YYYY')}
              </Text>
              <View
                className={`rounded-2xl shadow-sm border p-4 ${
                  isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'
                }`}
              >
                {selectedDaySubscriptions.map((subscription, index) => (
                  <SubscriptionItem
                    key={index}
                    index={index}
                    subscription={subscription}
                    currentDay={moment(selectedDay)}
                    onPress={() => handleSubscriptionPress(subscription)}
                  />
                ))}
              </View>
            </View>
          </FadeInView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Calendar;
