import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSubscriptions } from '../../hooks/useSubscriptions';
import { useUsername } from '../../hooks/useUsername';
import { useAuth } from '../../providers/AuthProvider';

import CalendarView from '../../components/home/CalendarView';
import Header from '../../components/home/Header';
import MonthlyPayment from '../../components/home/MonthlyPayment';
import SubscriptionItem from '../../components/home/SubscriptionItem';
import UpcomingPayment from '../../components/home/UpcomingPayment';

import { Subscription } from '../../../types';
import { FadeInView } from '../../components/animated/FadeInView';
import { SlideInView } from '../../components/animated/SlideInView';

import ErrorMessage from '../../components/common/ErrorMessage';

import Loading from '@/app/components/common/Loading';
import { generateNotifications } from '@/services/notificationService';
import { useTheme } from '../../providers/ThemeProvider';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  //@ts-ignore
  const { username } = useUsername(user);

  const { initialLoad, subscriptions, highlightedDays, loading, error, getTotalMonthlyCost, getYearlyStats, getUpcomingSubscriptions } =
    useSubscriptions();


  const [currentDateMonth, setCurrentMonth] = useState(moment());
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDay, setSelectedDay] = useState<string | null>(moment().format('YYYY-MM-DD'));
  const [currentDay, setCurrentDay] = useState<moment.Moment>(moment());

  //Generaten notification for the user
  React.useEffect(() => {
    if (user && subscriptions.length) {
      const currentSubs = getUpcomingSubscriptions();
      generateNotifications(user.uid, currentSubs );
    }
  }, [user, subscriptions]);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
      const today = moment().startOf('day');
      const endOfMonth = moment().endOf('month');
      return dayMoment.isSameOrAfter(today) && dayMoment.isSameOrBefore(endOfMonth);
    })
    .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

  const handlePrevMonth = () => {
    const newDate = currentDate.clone().subtract(1, 'month');
    setCurrentDate(newDate);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = currentDate.clone().add(1, 'month');
    setCurrentDate(newDate);
    setCurrentMonth(newDate);
  };

  const handleDayPress = (day: string) => {
    setSelectedDay(day);
    setCurrentDay(moment(day));
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

  if (!initialLoad) {
    return <Loading message="Loading subscriptions..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => {}} />;
  }

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`}
      edges={['top']}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 100 : 120,
          paddingHorizontal: 16,
        }}
      >
        {/* Header */}
        <FadeInView delay={0} duration={300}>
          <View className="mb-4 mt-2">
            <Header username={username} />
          </View>
        </FadeInView>

        {/* Monthly Payment Summary */}
        <SlideInView delay={100} duration={250} direction="up">
          <View className="mb-4">
            <MonthlyPayment
              monthlyCost={monthlyCost}
              yearlyCost={yearlyStats.total}
              yearlyAverage={yearlyStats.average}
              currentDate={currentDateMonth}
            />
          </View>
        </SlideInView>

      {/* Upcoming Payments */}
        {upcomingPayments.length > 0 && (
          <FadeInView delay={200} duration={300}>
            <View className="mb-4">
              <Text
                className={`text-lg font-semibold mb-3 ${
                  isDark ? 'text-zinc-200' : 'text-gray-900'
                }`}
              >
                Upcoming Payments
              </Text>
              {upcomingPayments.flatMap((payment, parentIndex) =>
                payment.id.map((id: string, i: number) => {
                  const isVariable = payment.cost_type?.[i] === 'variable';
                  const cost = parseFloat(
                    isVariable ? payment.average_cost?.[i] ?? '0' : payment.cost?.[i] ?? '0'
                  );
                  const appName = payment.app_name[i];
                  const color = payment.colors[i];
                  const dueDate = payment.due_date[i];
                  const date = moment(payment.date);

                  const fullSubscription = subscriptions.find(sub => sub.id === id);
                  const icon = fullSubscription?.icon;

                  const subscription = {
                    id,
                    app_name: appName,
                    color,
                    cost,
                    due_date: dueDate,
                    date: payment.date,
                    icon,
                  };

                  return (
                    <SlideInView
                      key={`${parentIndex}-${i}`}
                      delay={250 + parentIndex * 50}
                      duration={250}
                      direction="right"
                    >
                      <UpcomingPayment
                        dayNumber={date.date()}
                        dayName={date.format('ddd')}
                        subscriptionCount={1}
                        totalCost={cost}
                        app_name={appName}
                        color={color || '#3AABCC'}
                        icon={icon}
                        subscriptionId={id}
                        onPress={() =>
                          (navigation as any).navigate('Subscriptions', {
                            screen: 'subscription_details',
                            params: { subscription },
                          })
                        }
                        onMarkAsPaid={() =>
                          console.log('Marked as paid:', appName, date.format('YYYY-MM-DD'))
                        }
                      />
                    </SlideInView>
                  );
                })
              )}
            </View>
          </FadeInView>
        )}

        {/* Calendar */}
        <FadeInView delay={300} duration={300}>
          <View className="mb-4">
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
          <FadeInView delay={400} duration={300}>
            <View className="mb-4">
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
                    currentDay={currentDay}
                    onPress={() => handleSubscriptionPress(subscription)}
                  />
                ))}
              </View>
            </View>
          </FadeInView>
        )}

        { loading && initialLoad && (
          <View className="flex-1 items-center justify-center py-2">
            <ActivityIndicator size="large" color="#3AABCC" />
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Loading subscriptions...</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
