import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { useSubscriptions } from '../../hooks/useSubscriptions';

import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { FadeInView } from '../../components/animated/FadeInView';
import { SlideInView } from '../../components/animated/SlideInView';

import SpendingTrends from '../../components/analytics/SpendingTrends';
import CategoryBreakdown from '../../components/analytics/CategoryBreakdown';
import MonthlyPayment from '../../components/home/MonthlyPayment';

import moment from 'moment';

const AnalyticsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { subscriptions, highlightedDays, loading, error, getTotalMonthlyCost, getYearlyStats } = useSubscriptions();

  // Calculate analytics data
  const monthlyCost = getTotalMonthlyCost(highlightedDays);
  const yearlyStats = getYearlyStats(subscriptions);
  const currentDate = moment();

  // Calculate additional metrics
  const activeSubscriptions = subscriptions.filter(sub => sub.status !== 'cancelled');
  const pausedSubscriptions = subscriptions.filter(sub => sub.status === 'paused');
  const fixedSubscriptions = activeSubscriptions.filter(sub => sub.cost_type !== 'variable');
  const variableSubscriptions = activeSubscriptions.filter(sub => sub.cost_type === 'variable');

  const avgCostPerSubscription = activeSubscriptions.length > 0 
    ? monthlyCost / activeSubscriptions.length 
    : 0;

  if (loading) {
    return <Loading message="Loading analytics..." />;
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
          paddingTop: 16,
        }}
      >
        {/* Header */}
        <FadeInView delay={0} duration={300}>
          <View className="mb-6">
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Analytics
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Insights into your subscription spending
            </Text>
          </View>
        </FadeInView>

        {/* Monthly Summary */}
        <SlideInView delay={100} duration={250} direction="up">
          <View className="mb-6">
            <MonthlyPayment
              monthlyCost={monthlyCost}
              yearlyCost={yearlyStats.total}
              yearlyAverage={yearlyStats.average}
              currentDate={currentDate}
            />
          </View>
        </SlideInView>

        {/* Quick Stats */}
        <SlideInView delay={200} duration={250} direction="left">
          <View className="mb-6">
            <View className={`p-4 rounded-2xl border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
              <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Quick Stats
              </Text>
              
              <View className="grid grid-cols-2 gap-4">
                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Active Subscriptions
                    </Text>
                    <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {activeSubscriptions.length}
                    </Text>
                  </View>
                  
                  <View className="flex-1">
                    <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Avg Cost Per Sub
                    </Text>
                    <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ₱{avgCostPerSubscription.toFixed(0)}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between mt-4">
                  <View className="flex-1">
                    <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Fixed Subscriptions
                    </Text>
                    <Text className={`text-xl font-semibold text-[#3AABCC]`}>
                      {fixedSubscriptions.length}
                    </Text>
                  </View>
                  
                  <View className="flex-1">
                    <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Variable Bills
                    </Text>
                    <Text className={`text-xl font-semibold text-[#10B981]`}>
                      {variableSubscriptions.length}
                    </Text>
                  </View>
                </View>

                {pausedSubscriptions.length > 0 && (
                  <View className="mt-4">
                    <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Paused Subscriptions
                    </Text>
                    <Text className={`text-xl font-semibold text-orange-500`}>
                      {pausedSubscriptions.length}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </SlideInView>

        {/* Spending Trends */}
        <SlideInView delay={300} duration={250} direction="right">
          <View className="mb-6">
            <SpendingTrends subscriptions={activeSubscriptions} />
          </View>
        </SlideInView>

        {/* Category Breakdown */}
        <SlideInView delay={400} duration={250} direction="up">
          <View className="mb-6">
            <CategoryBreakdown subscriptions={activeSubscriptions} />
          </View>
        </SlideInView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;