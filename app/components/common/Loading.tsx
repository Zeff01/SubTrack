import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  size = 'large',
  color = '#3AABCC' 
}) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text className="mt-3 text-gray-600 text-center">{message}</Text>
      )}
    </View>
  );
};

export default Loading;