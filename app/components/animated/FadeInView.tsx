import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { ViewProps } from 'react-native';

interface FadeInViewProps extends ViewProps {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  delay = 0,
  duration = 500,
  children,
  style,
  ...props
}) => {
  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(duration)}
      exiting={FadeOut.duration(300)}
      style={style}
      {...props}
    >
      {children}
    </Animated.View>
  );
};