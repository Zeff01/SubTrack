import React, { ReactNode } from 'react';
import Animated, { 
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SlideInViewProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  distance?: number; // Custom slide distance
}

export const SlideInView: React.FC<SlideInViewProps> = ({ 
  children, 
  direction = 'left',
  duration = 250,  // Reduced from 400ms
  delay = 0,
  distance
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Calculate slide distance (more subtle)
  const getDistance = () => {
    if (distance) return distance;
    
    switch (direction) {
      case 'left':
      case 'right':
        return 30; // Reduced from full screen width
      case 'up':
      case 'down':
        return 30; // Reduced from full screen height
    }
  };

  useEffect(() => {
    const slideDistance = getDistance();
    
    // Set initial position
    switch (direction) {
      case 'left':
        translateX.value = -slideDistance;
        break;
      case 'right':
        translateX.value = slideDistance;
        break;
      case 'up':
        translateY.value = -slideDistance;
        break;
      case 'down':
        translateY.value = slideDistance;
        break;
    }

    // Animate to final position
    translateX.value = withDelay(
      delay,
      withTiming(0, {
        duration,
        easing: Easing.out(Easing.cubic), // Smooth easing instead of spring
      })
    );
    
    translateY.value = withDelay(
      delay,
      withTiming(0, {
        duration,
        easing: Easing.out(Easing.cubic),
      })
    );
    
    // Fade in alongside the slide
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: duration * 0.8, // Slightly faster fade
        easing: Easing.out(Easing.quad),
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

// Default export to prevent Expo Router from treating this as a route
export default SlideInView;