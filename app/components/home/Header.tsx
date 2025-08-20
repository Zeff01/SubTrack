import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { ScaleButton } from "../animated/ScaleButton";
import { useTheme } from "../../providers/ThemeProvider";

interface HeaderProps {
  username: string | null;
}

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const Header: React.FC<HeaderProps> = ({ username }) => {
  const navigation = useNavigation();
  const bellRotation = useSharedValue(0);
  const bellScale = useSharedValue(1);
  const { theme } = useTheme();
  const isDark = theme === "dark";


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
      { scale: bellScale.value },
    ],
  }));

  const handleNotificationPress = () => {
    bellScale.value = withSequence(withSpring(1.2), withSpring(1));
    (navigation as any).navigate("Home", { screen: "notification" });
  };

  return (
    <View className="flex-row items-center justify-between">
      {/* Greeting */}
      <View className="flex-1 pr-4">
        <Animated.Text
          className={`text-3xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
          entering={FadeIn.duration(600).springify()}
        >
          Hello, {username || "User"}!
        </Animated.Text>

        <Animated.View entering={FadeIn.delay(200).duration(600)}>
          <Text
            className={`text-base mt-1 ${
              isDark ? "text-gray-100" : "text-gray-600"
            }`}
          >
            Let's check your
          </Text>
          <Text
            className={`text-base ${
              isDark ? "text-gray-100" : "text-gray-600"
            }`}
          >
            subscriptions today!
          </Text>
        </Animated.View>
      </View>

      {/* Notification Bell */}
      <ScaleButton onPress={handleNotificationPress} className="p-2">
        <Animated.View style={bellStyle}>
          <AnimatedIcon
            name="notifications-outline"
            size={30}
            color={isDark ? "#38BDF8" : "#3AABCC"} // cyan-400 in dark, brand in light
          />
        </Animated.View>
      </ScaleButton>
    </View>
  );
};

export default Header;
