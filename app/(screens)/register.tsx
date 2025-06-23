import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { createUser } from "../../services/authService";
import { auth } from "../../config/firebase"; // Assuming db is not needed here
import { useNavigation } from '@react-navigation/native';



const RegisterScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

   const registerSubmit = async () => {
      if (email === "" || password === "" || name === "" || phone === "") {
        Alert.alert("Validation", "Please fill in all fields");
        return;
      }
  
      try {
        const user_info = { email, password, name, phone }; // shorthand for object properties
        const response =  await createUser(user_info);
  
        if (response.success) {
          Alert.alert("Success", response.message);
          router.push("/(screens)/login"); // Change '/home' to your desired route
        } else {
          Alert.alert("Login Failed", response.error);
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while logging in.");
      }
    };

 
    return (
  <View className="flex-1 justify-center bg-black px-6">
    <Text className="text-4xl font-bold text-white mb-10 text-center">Create Account</Text>

    <TextInput
      className="border border-gray-700 bg-gray-900 text-white rounded-xl p-4 mb-4"
      placeholder="Complete Name"
      placeholderTextColor="#888"
      keyboardType="default"
      value={name}
      onChangeText={setName}
    />

    <TextInput
      className="border border-gray-700 bg-gray-900 text-white rounded-xl p-4 mb-4"
      placeholder="Contact Number"
      placeholderTextColor="#888"
      keyboardType="phone-pad"
      value={phone}
      onChangeText={setPhone}
    />

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

    <TouchableOpacity className="bg-blue-600 rounded-xl p-4 mb-6 shadow-lg shadow-blue-800/50" onPress={registerSubmit}>
      <Text className="text-center text-white font-semibold text-lg">Register</Text>
    </TouchableOpacity>

    <Text className="text-center text-gray-400">
      Already have an account?{" "}
      <TouchableOpacity onPress={() => router.push("/(screens)/login")}>
        <Text className="text-blue-500 font-semibold">Login</Text>
      </TouchableOpacity>
    </Text>
  </View>
);

}

export default RegisterScreen;
