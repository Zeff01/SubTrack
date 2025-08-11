import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Subscription } from '../../../types';
import moment from 'moment';
import { ScaleButton } from '../animated/ScaleButton';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface SubscriptionItemProps {
  subscription: Subscription;
  currentDay: moment.Moment;
  onPress: () => void;
  index?: number;
}

const SubscriptionItem: React.FC<SubscriptionItemProps> = ({
  subscription,
  currentDay,
  onPress,
  index = 0
}) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      pressed.value,
      [0, 1],
      [0, 5]
    );
    
    return {
      transform: [{ translateX }],
    };
  });

  const getCategoryIcon = () => {
    switch (subscription.category) {
      case 'entertainment': return '🎬';
      case 'utilities': return '💡';
      case 'productivity': return '💼';
      case 'health': return '🏃';
      case 'education': return '📚';
      default: return '📦';
    }
  };

  const displayCost = subscription.cost_type === 'variable' 
    ? `~₱${subscription.average_cost || subscription.cost}`
    : `₱${subscription.cost}`;

  return (
    <Animated.View
      entering={Animated.SlideInRight.delay(index * 100).springify()}
    >
      <ScaleButton
        onPress={onPress}
        scaleTo={0.98}
        className="my-2"
      >
        <Animated.View
          className="py-6 px-4 flex-row justify-between items-center rounded-3xl shadow-xl"
          style={[{ backgroundColor: subscription.color }, animatedStyle]}
        >
          <View className="flex justify-center items-center min-h-16">
            <View className="bg-white/20 rounded-full h-14 w-14 shadow-xl items-center justify-center">
              <Text className="text-2xl">{getCategoryIcon()}</Text>
            </View>
          </View>
          
          <View className="min-h-16 max-w-52 min-w-52 flex justify-center items-start">
            <Text
              className="font-bold text-base text-white"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subscription.app_name}
            </Text>
            <Text
              className="text-sm text-white/80"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subscription.cycle.charAt(0).toUpperCase() + subscription.cycle.slice(1)}
              {subscription.cost_type === 'variable' && ' • Variable'}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center min-h-16">
            <Text className="text-white font-semibold">{displayCost}</Text>
            <Ionicons name="chevron-forward" size={25} color="white" className="ml-2" />
          </View>
        </Animated.View>
      </ScaleButton>
    </Animated.View>
  );
};

export default SubscriptionItem;