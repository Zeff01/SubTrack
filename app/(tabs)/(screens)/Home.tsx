import React, { useState, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

import { useAuth } from '../../providers/AuthProvider';
import { useSubscriptions } from '../../hooks/useSubscriptions';
import { useUsername } from '../../hooks/useUsername';

import Header from '../../components/home/Header';
import MonthlyPayment from '../../components/home/MonthlyPayment';
import UpcomingPayment from '../../components/home/UpcomingPayment';
import CalendarView from '../../components/home/CalendarView';
import SubscriptionItem from '../../components/home/SubscriptionItem';
import { Subscription } from '../../../types';
import { FadeInView } from '../../components/animated/FadeInView';
import { SlideInView } from '../../components/animated/SlideInView';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { username } = useUsername(user);
  const { subscriptions, highlightedDays, loading, error, getTotalMonthlyCost, getYearlyStats } = useSubscriptions();

  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDay, setSelectedDay] = useState<string | null>(moment().format('YYYY-MM-DD'));
  const [currentDay, setCurrentDay] = useState<moment.Moment>(moment());

  // Calculate monthly and yearly costs
  const monthlyCost = getTotalMonthlyCost(highlightedDays);
  const yearlyStats = getYearlyStats(subscriptions);

  // Get subscriptions for selected day
  const selectedDayData = highlightedDays.find(h => h.date === selectedDay);
  const selectedDaySubscriptions = selectedDayData 
    ? subscriptions.filter(sub => selectedDayData.id.includes(sub.id || ''))
    : [];

  // Get upcoming payments
  const upcomingPayments = highlightedDays
    .filter(day => moment(day.date).isAfter(moment(), 'day'))
    .sort((a, b) => moment(a.date).diff(moment(b.date)))
    .slice(0, 3);

  const handlePrevMonth = () => {
    setCurrentDate(prev => prev.clone().subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => prev.clone().add(1, 'month'));
  };

  const handleDayPress = (day: string) => {
    setSelectedDay(day);
    setCurrentDay(moment(day));
  };

  const handleAddSubscription = () => {
    (navigation as any).navigate('Subscriptions', { screen: 'AddSubscription' });
  };

  const handleSubscriptionPress = (subscription: Subscription) => {
    (navigation as any).navigate('Auth', {
      screen: 'SubscriptionDetails',
      params: { subscription },
    });
  };

  if (loading) {
    return <Loading message="Loading subscriptions..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => {}} />;
  }

  return (
    <View className="flex-1 bg-gray-50 pt-12">
      <ScrollView 
        className="px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <FadeInView delay={0} className="mb-6">
          <Header username={username} />
        </FadeInView>

        {/* Monthly Payment Summary */}
        <SlideInView delay={200} direction="up" className="mb-6">
          <MonthlyPayment 
            monthlyCost={monthlyCost} 
            yearlyCost={yearlyStats.total}
            yearlyAverage={yearlyStats.average}
            currentDate={currentDate} 
          />
        </SlideInView>

        {/* Upcoming Payments */}
        {upcomingPayments.length > 0 && (
          <FadeInView delay={400} className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Upcoming Payments</Text>
            {upcomingPayments.map((payment, index) => {
              const date = moment(payment.date);
              const totalCost = payment.cost.reduce((sum, cost) => sum + parseFloat(cost), 0);
              
              return (
                <SlideInView key={index} delay={500 + (index * 100)} direction="right">
                  <UpcomingPayment
                    dayNumber={date.date()}
                    dayName={date.format('ddd')}
                    subscriptionCount={payment.app_name.length}
                    totalCost={totalCost}
                    color="#3AABCC"
                    onPress={() => handleDayPress(payment.date)}
                  />
                </SlideInView>
              );
            })}
          </FadeInView>
        )}

        {/* Calendar */}
        <FadeInView delay={600} className="mb-6">
          <CalendarView
            currentDate={currentDate}
            selectedDay={selectedDay}
            highlightedDays={highlightedDays}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onDayPress={handleDayPress}
            onAddSubscription={handleAddSubscription}
          />
        </FadeInView>

        {/* Selected Day Subscriptions */}
        {selectedDaySubscriptions.length > 0 && (
          <FadeInView delay={700} className="mt-4 border-t-2 pt-6 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Subscriptions on {moment(selectedDay).format('MMMM D, YYYY')}
            </Text>
            {selectedDaySubscriptions.map((subscription, index) => (
              <SubscriptionItem
                key={index}
                index={index}
                subscription={subscription}
                currentDay={currentDay}
                onPress={() => handleSubscriptionPress(subscription)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;