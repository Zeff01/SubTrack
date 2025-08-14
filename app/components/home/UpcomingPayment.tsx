import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface UpcomingPaymentProps {
  dayNumber: number;
  dayName: string;
  app_name: string;
  subscriptionCount: number;
  totalCost: number;
  color: string;
  onPress: () => void;
}

const UpcomingPayment: React.FC<UpcomingPaymentProps> = ({
  dayNumber,
  dayName,
  app_name,
  subscriptionCount,
  totalCost,
  color,
  onPress
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="bg-white p-4 mb-3 rounded-2xl shadow-sm flex-row items-center">
        <View className="w-16 h-16 rounded-2xl items-center justify-center mr-4" 
          style={{ backgroundColor: color }}>
          <Text className="text-white text-2xl font-bold">{dayNumber}</Text>
          <Text className="text-white text-xs">{dayName}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold">
            {/* {subscriptionCount} Subscription{subscriptionCount > 1 ? 's' : ''} */}
            {app_name} 
          </Text>
          <Text className="text-gray-600 text-sm">Due on this date</Text>
        </View>
        <Text className="text-gray-900 font-bold text-lg">₱{totalCost.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default UpcomingPayment;