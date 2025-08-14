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


  const [currentDateMonth, setCurrentMonth] = useState(moment());
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

  const upcomingPayments = highlightedDays
  .filter(day => {
    const dayMoment = moment(day.date);
    const now = moment();

    // Future dates in the same month and year as today
    return (
      dayMoment.isAfter(now, 'day') &&
      dayMoment.month() === now.month() &&
      dayMoment.year() === now.year()
    );
  })
  .sort((a, b) => moment(a.date).diff(moment(b.date)))
  .slice(0, 8);

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
    //(navigation as any).navigate('Subscriptions', { screen: 'AddSubscription' });
    (navigation as any).navigate('Subscriptions', { screen: 'add_subscriptions' })
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
        <FadeInView delay={0} duration={500} className="mb-6">
           <Header username={username} />
        </FadeInView>


        {/* Monthly Payment Summary */}
        <SlideInView delay={200} duration={400} direction="up" className="mb-6">
          <MonthlyPayment 
            monthlyCost={monthlyCost} 
            yearlyCost={yearlyStats.total}
            yearlyAverage={yearlyStats.average}
            currentDate={currentDateMonth} 
          />
        </SlideInView>

        {/* Upcoming Payments */}
        {upcomingPayments.length > 0 && (
        <FadeInView delay={400} duration={500} className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Upcoming Payments</Text>

          {upcomingPayments.flatMap((payment, parentIndex) => {
            return payment.id.map((id: string, i: number) => {
              const appName = payment.app_name[i];
              const color = payment.colors[i];
              const cost = parseFloat(payment.cost[i]);
              const dueDate = payment.due_date[i];

              const date = moment(payment.date);

              const subscription = {
                id,
                app_name: appName,
                color,
                cost,
                due_date: dueDate,
                date: payment.date,
              };

              return (
                <SlideInView
                  key={`${parentIndex}-${i}`}
                  delay={500 + (parentIndex * 100)}
                  duration={400}
                  direction="right"
                >
                  <UpcomingPayment
                    dayNumber={date.date()}
                    dayName={date.format('ddd')}
                    subscriptionCount={1}
                    totalCost={cost}
                    app_name={appName}
                   //color={color}
                    color="#3AABCC"
                    onPress={() =>
                      (navigation as any).navigate('Auth', {
                        screen: 'SubscriptionDetails',
                        params: { subscription },
                      })
                    }
                  />
                </SlideInView>
              );
            });
          })}
        </FadeInView>
      )}

      
        {/* Calendar */}
        <FadeInView delay={600} duration={500} className="mb-6">
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
          <FadeInView delay={700} duration={500} className="mt-4 border-t-2 pt-6 mb-6">
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
          </FadeInView>
        )} 
      </ScrollView>
    </View>
  );
};

export default HomeScreen;