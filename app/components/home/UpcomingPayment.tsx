import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UpcomingPaymentProps {
  dayNumber: number;
  dayName: string;
  app_name: string;
  subscriptionCount: number;
  totalCost: number;
  color: string;
  icon?: string;
  subscriptionId?: string;
  onPress: () => void;
  onMarkAsPaid?: () => void;
}

const UpcomingPayment: React.FC<UpcomingPaymentProps> = ({
  dayNumber,
  dayName,
  app_name,
  subscriptionCount,
  totalCost,
  color,
  icon,
  subscriptionId,
  onPress,
  onMarkAsPaid
}) => {
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMarkAsPaid = async () => {
    if (onMarkAsPaid) {
      setLoading(true);
      setIsPaid(true);
      onMarkAsPaid();
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View className={`bg-white p-4 mb-2 rounded-xl border ${isPaid ? 'border-green-200 bg-green-50' : 'border-gray-100'} flex-row items-center`}>
        <View className="w-14 h-14 rounded-xl items-center justify-center mr-3" 
          style={{ backgroundColor: isPaid ? '#10B98120' : `${color}20` }}>
          <Text className="text-lg font-bold" style={{ color: isPaid ? '#10B981' : color }}>{dayNumber}</Text>
          <Text className="text-[10px]" style={{ color: isPaid ? '#10B981' : color }}>{dayName}</Text>
        </View>
        <View className="flex-row items-center flex-1">
          {icon && (
            <View className="w-10 h-10 rounded-lg items-center justify-center mr-2" 
              style={{ backgroundColor: isPaid ? '#10B98110' : `${color}10` }}>
              <Text className={`text-xl ${isPaid ? 'opacity-60' : ''}`}>{icon}</Text>
            </View>
          )}
          <View className="flex-1">
            <Text className={`font-medium text-sm ${isPaid ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
              {app_name} 
            </Text>
            <Text className={`text-xs mt-0.5 ${isPaid ? 'text-green-600' : 'text-gray-500'}`}>
              {isPaid ? 'Paid' : 'Due on this date'}
            </Text>
          </View>
        </View>
        <View className="items-end mr-2">
          <Text className={`font-semibold text-base ${isPaid ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
            ₱{totalCost.toFixed(2)}
          </Text>
        </View>
        
        {/* Small Paid Button */}
        {!isPaid && onMarkAsPaid && (
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              handleMarkAsPaid();
            }}
            disabled={loading}
            className="bg-green-500 rounded-lg px-3 py-1.5"
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-xs font-medium">Paid</Text>
            )}
          </TouchableOpacity>
        )}
        
        {isPaid && (
          <View className="bg-green-500 rounded-lg px-3 py-1.5">
            <Ionicons name="checkmark" size={16} color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default UpcomingPayment;