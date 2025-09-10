import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

const lightModeColor = '#2A8699';
const darkModeColor  = '#3AABCC';

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', size = 'large', color }) => {
  const { theme } = useTheme();
  const isDark    = theme === 'dark';
  let iconColor   = color ?? ( isDark ? darkModeColor : lightModeColor );

  return (
    <View className={`flex-1 justify-center items-center ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`}
    >
      <ActivityIndicator size={size} color={iconColor} />
      {message && (
        <Text className="mt-3 text-gray-600 text-center">{message}</Text>
      )}
    </View>
  );
};

export default Loading;