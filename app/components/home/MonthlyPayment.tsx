import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import Animated, { 
  useSharedValue, 
  withTiming,
  useAnimatedProps,
} from 'react-native-reanimated';

import { useTheme } from '../../providers/ThemeProvider';

interface MonthlyPaymentProps {
  monthlyCost: number;
  yearlyCost: number;
  yearlyAverage: number;
  currentDate: moment.Moment;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

const MonthlyPayment: React.FC<MonthlyPaymentProps> = ({ 
  monthlyCost, 
  yearlyCost,
  yearlyAverage,
  currentDate 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(monthlyCost, { duration: 600 });
  }, [monthlyCost]);

  const animatedProps = useAnimatedProps(() => {
    return {
      text: `₱${animatedValue.value.toFixed(2)}`,
    } as any;
  });

  return (
    <View
      className={`p-5 rounded-2xl shadow-sm border 
        ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}
    >
      {/* Top section */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-1">
          <Text className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-500'}`}>
            This Month
          </Text>
          <Text className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ₱{monthlyCost.toFixed(2)}
          </Text>
          <Text className={`text-xs mt-1 ${isDark ? 'text-gray-100' : 'text-gray-400'}`}>
            {currentDate.format('MMMM YYYY')}
          </Text>
        </View>
        <View className="bg-[#3AABCC]/10 p-3 rounded-xl">
          <Text className="text-xl">💵</Text>
        </View>
      </View>

      {/* Yearly Stats */}
      <View
        className={`-mx-5 -mb-5 px-5 py-4 rounded-b-2xl mt-3 
          ${isDark ? 'bg-[#1F1F23]' : 'bg-gray-50'}`}
      >
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className={`text-xs ${isDark ? 'text-gray-100' : 'text-gray-500'}`}>
              Yearly Total
            </Text>
            <Text className={`text-base font-semibold mt-0.5 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              ₱{yearlyCost?.toFixed(2)}
            </Text>
          </View>
          <View className="flex-1 items-end">
            <Text className={`text-xs ${isDark ? 'text-gray-100' : 'text-gray-500'}`}>
              Monthly Average
            </Text>
            <Text className={`text-base font-semibold mt-0.5 ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
              ₱{yearlyAverage?.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MonthlyPayment;
