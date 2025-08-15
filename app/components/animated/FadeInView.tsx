import React, { ReactNode } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface FadeInViewProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  exitDuration?: number;
}

export const FadeInView: React.FC<FadeInViewProps> = ({ 
  children, 
  duration = 300,  // Reduced from 500ms
  delay = 0,
  exitDuration = 200  // Reduced from 300ms
}) => {
  return (
    <Animated.View
      entering={FadeIn.duration(duration).delay(delay)}
      exiting={FadeOut.duration(exitDuration)}
    >
      {children}
    </Animated.View>
  );
};

// Default export to prevent Expo Router from treating this as a route
export default FadeInView;