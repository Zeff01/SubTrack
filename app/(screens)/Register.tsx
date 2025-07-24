import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { createUser } from "../../services/authService";


export default function RegisterScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const registerSubmit = async () => {
      if (email === "" || password === "" || username === "" ) {
        Alert.alert("Validation", "Please fill in all fields");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Validation", "Password not matched");
        return;
      }
  
      try {
        const user_info = { email, password, username }; // shorthand for object properties
        const response =  await createUser(user_info);
  
        if (response.success) {
          Alert.alert("Success", response.message);
          (navigation as any).navigate('Login')
         // router.push("/(screens)/login"); // Change '/home' to your desired route
        } else {
          Alert.alert("Login Failed", response.error);
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while logging in.");
      }
    };


  return (
    <KeyboardAvoidingView
      behavior={'padding'}
      className="flex-1 bg-[#3AABCC]"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View className="bg-white rounded-3xl p-8 shadow-lg mt-20">
          <Text className="text-3xl font-extrabold text-[#3AABCC] mb-8 text-center">
            Create Account
          </Text>

          <TextInput
            className="border border-[#3AABCC] rounded-xl px-4 py-3 mb-4 text-base text-gray-800"
            placeholder="Username"
            placeholderTextColor="#9fcbdc"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="words"
          />

          <TextInput
            className="border border-[#3AABCC] rounded-xl px-4 py-3 mb-4 text-base text-gray-800"
            placeholder="Email Address"
            placeholderTextColor="#9fcbdc"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            className="border border-[#3AABCC] rounded-xl px-4 py-3 mb-4 text-base text-gray-800"
            placeholder="Password"
            placeholderTextColor="#9fcbdc"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            className="border border-[#3AABCC] rounded-xl px-4 py-3 mb-6 text-base text-gray-800"
            placeholder="Confirm Password"
            placeholderTextColor="#9fcbdc"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            className="bg-[#3AABCC] rounded-xl py-3 mb-6 shadow-md"
            activeOpacity={0.8}
            //onPress={() => alert(`Registering\nName: ${name}\nEmail: ${email}`)}
            onPress={registerSubmit}
          >
            <Text className="text-white font-bold text-lg text-center">REGISTER</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center space-x-2">
            <Text className="text-gray-500 font-medium">Already have an account?</Text>
            <TouchableOpacity activeOpacity={0.7} 
              onPress={() => (navigation as any).navigate('Login')}
            //onPress={() => alert('Navigate to Login')}
            >
              <Text className="text-[#3AABCC] font-semibold underline">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
