import React from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  useAnimatedProps,
} from 'react-native-reanimated';
import { useEffect } from 'react';

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
    <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-500">This Month</Text>
          <Text className="text-2xl font-bold text-gray-900 mt-1">
            ₱{monthlyCost.toFixed(2)}
          </Text>
          <Text className="text-xs text-gray-400 mt-1">
            {currentDate.format('MMMM YYYY')}
          </Text>
        </View>
        <View className="bg-[#3AABCC]/10 p-3 rounded-xl">
          <Text className="text-xl">💵</Text>
        </View>
      </View>
      
      {/* Yearly Stats */}
      <View className="bg-gray-50 -mx-5 -mb-5 px-5 py-4 rounded-b-2xl mt-3">
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="text-xs text-gray-500">Yearly Total</Text>
            <Text className="text-base font-semibold text-gray-800 mt-0.5">
              ₱{yearlyCost?.toFixed(2)}
            </Text>
          </View>
          <View className="flex-1 items-end">
            <Text className="text-xs text-gray-500">Monthly Average</Text>
            <Text className="text-base font-semibold text-gray-800 mt-0.5">
              ₱{yearlyAverage?.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MonthlyPayment;