import { PaymentCardProps } from '../../types/PaymentCardPropsType'; // Adjust path as needed
import { View, Text, ScrollView, TouchableOpacity, Alert  } from 'react-native';

const PaymentCard = ({ color, subscription, amount, dueDate }: PaymentCardProps) => {
  return (
    <View
      className="w-52 rounded-3xl p-4 mr-4  bg-white border border-transparent"
      style={{ backgroundColor: color }}
    >
      <Text className="text-right text-2xl font-extrabold text-gray-900">{amount}</Text>

      <View className="flex items-start mt-6">
        {/* Icon placeholder */}
        <View className="bg-gray-200 rounded-full h-16 w-16 mb-3 shadow-xl" />

        <Text className="text-lg font-semibold text-gray-800">{subscription}</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Due date:{' '}
          <Text className="text-red-500 font-semibold text-base">{dueDate}</Text>
        </Text>
      </View>
    </View>
  );
};

export default PaymentCard;
