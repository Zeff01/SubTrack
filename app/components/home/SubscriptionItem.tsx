import moment from 'moment';
import React from 'react';
import { Text, View } from 'react-native';
import Animated, {
  interpolate,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Subscription } from '../../../types';
import { ScaleButton } from '../animated/ScaleButton';

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

  const displayCost = subscription.cost_type === 'variable' 
    ? `~₱${subscription.average_cost || subscription.cost}`
    : `₱${subscription.cost}`;

  const backgroundColor = subscription.selected_color || subscription.color || '#3AABCC';

  return (
    <Animated.View
      entering={SlideInRight.delay(index * 100).springify()}
    >
      <ScaleButton
        onPress={onPress}
        scaleTo={0.98}
        className="my-2"
      >
        <Animated.View
          className="flex-row items-center justify-between py-6 px-4 rounded-3xl shadow-sm"
          style={[{ backgroundColor }, animatedStyle]}
        >
          {/* LEFT: Icon + App Info */}
          <View className="flex-row items-center flex-1 pr-4">
            {/* Icon */}
            <View className="items-center justify-center mr-4">
              <View className="bg-white/20 rounded-full h-14 w-14 items-center justify-center">
                <Text className="text-2xl text-white">
                  {subscription.icon || subscription.app_name.substring(0, 2).toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Text Info */}
            <View className="flex-1 justify-center">
              <Text
                className="font-bold text-base text-white"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {subscription.app_name}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text
                  className="text-sm text-white/80"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {subscription.cycle.charAt(0).toUpperCase() + subscription.cycle.slice(1)}
                </Text>
                {subscription.cost_type === 'variable' && (
                  <View className="ml-2 px-2 py-0.5 bg-white/20 rounded">
                    <Text className="text-white text-xs font-medium">Variable</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* RIGHT: Price + Chevron */}
          <View className="flex-row items-center justify-end min-w-[80px] gap-x-2">
            <Text className="text-white font-semibold text-base">{displayCost}</Text>
            <Ionicons name="chevron-forward" size={25} color="white" />
          </View>
        </Animated.View>
      </ScaleButton>
    </Animated.View>
  );
};

export default SubscriptionItem;