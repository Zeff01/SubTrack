import useNotification from "@/app/hooks/useNotification";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../providers/ThemeProvider";
import { ScaleButton } from "../animated/ScaleButton";

interface HeaderProps {
  username: string | null;
}

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const Header: React.FC<HeaderProps> = ({ username }) => {
  const { notification } = useNotification();
  const unreadCount = notification.filter((n) => !n.is_read).length; // count unread
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

      {/* Notification Bell with Badge */}
      <ScaleButton onPress={handleNotificationPress} className="p-2">
        <Animated.View style={bellStyle}>
          <AnimatedIcon
            name="notifications-outline"
            size={30}
            color={isDark ? "#38BDF8" : "#3AABCC"}
          />

          {unreadCount > 0 && (
            <View
              className="absolute top-0 right-0 w-5 h-5 rounded-full items-center justify-center bg-red-500 border border-white"
              style={{ transform: [{ translateX: 8 }, { translateY: -4 }] }}
            >
              <Text className="text-white text-[10px] font-bold">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </Animated.View>
      </ScaleButton>
    </View>
  );
};

export default Header;
