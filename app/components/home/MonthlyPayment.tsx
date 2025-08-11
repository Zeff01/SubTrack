import React from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  interpolate,
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
    animatedValue.value = withTiming(monthlyCost, { duration: 1000 });
  }, [monthlyCost]);

  const animatedProps = useAnimatedProps(() => {
    return {
      text: `₱${animatedValue.value.toFixed(2)}`,
    } as any;
  });

  return (
    <View className="bg-white p-6 rounded-3xl shadow-md">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-600">This Month</Text>
          <Text className="text-3xl font-bold text-gray-900 mt-1">
            ₱{monthlyCost.toFixed(2)}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {currentDate.format('MMMM YYYY')}
          </Text>
        </View>
        <View className="bg-blue-100 p-3 rounded-full">
          <Text className="text-2xl">💰</Text>
        </View>
      </View>
      
      {/* Yearly Stats */}
      <View className="border-t border-gray-200 pt-4 flex-row justify-between">
        <View className="flex-1">
          <Text className="text-xs text-gray-500">Yearly Total</Text>
          <Text className="text-lg font-semibold text-gray-800 mt-1">
            ₱{yearlyCost?.toFixed(2)}
          </Text>
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-xs text-gray-500">Monthly Average</Text>
          <Text className="text-lg font-semibold text-gray-800 mt-1">
            ₱{yearlyAverage?.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MonthlyPayment;