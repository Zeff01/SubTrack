import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-6">
      <View className="bg-white p-6 rounded-2xl shadow-md items-center">
        <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="alert-circle" size={32} color="#EF4444" />
        </View>
        <Text className="text-gray-900 font-semibold text-lg mb-2">Oops!</Text>
        <Text className="text-gray-600 text-center mb-4">{message}</Text>
        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            className="bg-[#3AABCC] px-6 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ErrorMessage;