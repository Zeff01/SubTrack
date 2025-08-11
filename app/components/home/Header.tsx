import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ScaleButton } from '../animated/ScaleButton';

interface HeaderProps {
  username: string | null;
}

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const Header: React.FC<HeaderProps> = ({ username }) => {
  const navigation = useNavigation();
  const bellRotation = useSharedValue(0);
  const bellScale = useSharedValue(1);

  useEffect(() => {
    // Subtle bell animation
    bellRotation.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(0, { duration: 100 }),
        withTiming(0, { duration: 3000 }) // Pause
      ),
      -1,
      false
    );
  }, []);

  const bellStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${bellRotation.value}deg` },
      { scale: bellScale.value }
    ],
  }));

  const handleNotificationPress = () => {
    bellScale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
    (navigation as any).navigate('Auth', { screen: 'Notification' });
  };

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 pr-4">
        <Animated.Text 
          className="text-3xl font-bold text-gray-900"
          entering={Animated.FadeIn.duration(600).springify()}
        >
          Hello, {username || 'User'}!
        </Animated.Text>
        <Animated.View
          entering={Animated.FadeIn.delay(200).duration(600)}
        >
          <Text className="text-base text-gray-600 mt-1">
            Let's check your
          </Text>
          <Text className="text-base text-gray-600">subscriptions today!</Text>
        </Animated.View>
      </View>
      <ScaleButton
        onPress={handleNotificationPress}
        className="p-2"
      >
        <Animated.View style={bellStyle}>
          <AnimatedIcon name="notifications-outline" size={30} color="#3AABCC" />
        </Animated.View>
      </ScaleButton>
    </View>
  );
};

export default Header;