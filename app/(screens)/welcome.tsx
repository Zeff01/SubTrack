import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const WelcomeScreen = () => {
  const router = useRouter();

  return (
  <View className="flex-1 justify-center items-center bg-black px-6">
    <Text className="text-4xl font-bold text-white mb-4">Welcome</Text>
    <Text className="text-lg text-gray-400 mb-10 text-center">
      Let’s get started! Login or create a new account.
    </Text>

    <TouchableOpacity
      onPress={() => router.push("/(screens)/login")}
      className="w-11/12 bg-blue-600 p-4 rounded-full mb-4 shadow-lg shadow-blue-800/50"
    >
      <Text className="text-center text-white font-semibold text-lg">Login</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => router.push("/(screens)/register")}
      className="w-11/12 bg-gray-900 border border-blue-600 p-4 rounded-full"
    >
      <Text className="text-center text-blue-500 font-semibold text-lg">Register</Text>
    </TouchableOpacity>

     <TouchableOpacity
      onPress={() => router.push("/(tabs)/home")}
      className="w-11/12 bg-gray-900 border border-blue-600 p-4 rounded-full"
    >
      <Text className="text-center text-blue-500 font-semibold text-lg">Calendar</Text>
    </TouchableOpacity>
  </View>
);

}

export default WelcomeScreen;