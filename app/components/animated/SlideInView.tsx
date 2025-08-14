import React from 'react';
import Animated, {
  SlideInRight,
  SlideInLeft,
  SlideInUp,
  SlideInDown,
  SlideOutRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { ViewProps } from 'react-native';

interface SlideInViewProps extends ViewProps {
  delay?: number;
  duration?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  children: React.ReactNode;
}

export const SlideInView: React.FC<SlideInViewProps> = ({
  delay = 0,
  duration = 400,
  direction = 'right',
  children,
  style,
  ...props
}) => {
  const getEnteringAnimation = () => {
    switch (direction) {
      case 'left':
        return SlideInLeft?.delay(delay).duration(duration).springify();
      case 'up':
        return SlideInUp?.delay(delay).duration(duration).springify();
      case 'down':
        return SlideInDown?.delay(delay).duration(duration).springify();
      default:
        return SlideInRight?.delay(delay).duration(duration).springify();
    }
  };

  const getExitingAnimation = () => {
    switch (direction) {
      case 'left':
        return SlideOutLeft?.duration(300);
      default:
        return SlideOutRight?.duration(300);
    }
  };

  return (
    <Animated.View
      entering={getEnteringAnimation()}
      exiting={getExitingAnimation()}
      style={style}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

export default SlideInView;