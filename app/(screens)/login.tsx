import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from "react-native";
import { useRouter } from "expo-router";
import { authenticateUser } from "../../services/authService";
import { auth } from "../../config/firebase.js"; // Assuming db is not needed here

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginSubmit = async () => {
    if (email === "" || password === "") {
      Alert.alert("Validation", "Please fill in all fields");
      return;
    }

    try {
      const user_info = { email, password }; // shorthand for object properties
      const response =  await authenticateUser(user_info);

      if (response.success) {
        Alert.alert("Success", response.message);
        router.replace("/(tabs)/home"); // Change '/home' to your desired route
      } else {
        Alert.alert("Login Failed", response.error);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while logging in.");
    }
  };

  return (
  <View className="flex-1 justify-center bg-black px-6">
    <Text className="text-4xl font-bold text-white mb-10 text-center">Welcome Back</Text>
    <KeyboardAvoidingView
            behavior="padding"
    >
    <TextInput
      className="border border-gray-700 bg-gray-900 text-white rounded-xl p-4 mb-4"
      placeholder="Email"
      placeholderTextColor="#888"
      keyboardType="email-address"
      value={email}
      onChangeText={setEmail}
    />
    <TextInput
      className="border border-gray-700 bg-gray-900 text-white rounded-xl p-4 mb-6"
      placeholder="Password"
      placeholderTextColor="#888"
      secureTextEntry
      value={password}
      onChangeText={setPassword}
    />
    </KeyboardAvoidingView>

    <TouchableOpacity className="bg-blue-600 rounded-xl p-4 mb-6 shadow-lg shadow-blue-800/50" onPress={loginSubmit}>
      <Text className="text-center text-white font-semibold text-lg">Login</Text>
    </TouchableOpacity>

    <Text className="text-center text-gray-400">
      Don't have an account?{" "}
      <TouchableOpacity onPress={() => router.push("/(screens)/register")}>
        <Text className="text-blue-500 font-semibold">Register</Text>
      </TouchableOpacity>
    </Text>
  </View>
);

};

export default LoginScreen; // Ensure it is exported as default
