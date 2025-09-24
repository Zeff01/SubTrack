import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'folder-open-outline',
  title,
  message,
  actionText,
  onAction,
}) => {
  return (
    <View className="flex-1 justify-center items-center px-6">
      <View className="items-center">
        <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
          <Ionicons name={icon as any} size={48} color="#9CA3AF" />
        </View>
        <Text className="text-xl font-semibold text-gray-900 mb-2">{title}</Text>
        <Text className="text-gray-600 text-center mb-6">{message}</Text>
        {actionText && onAction && (
          <TouchableOpacity
            onPress={onAction}
            className="bg-[#3AABCC] px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default EmptyState;