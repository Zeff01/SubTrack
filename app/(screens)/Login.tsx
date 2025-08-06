import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { authenticateUser } from "../../services/authService";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validate = () => {
    const newErrors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginSubmit = async () => {
    if (!validate()) return;

    try {
      const user_info = { email, password };
      const response = await authenticateUser(user_info);

      if (response.success) {
        Alert.alert("Success", response.message);
        //(navigation as any).navigate('MainTabs', { screen: 'Home' });
        (navigation as any).navigate('Auth', {
          screen: 'MainTabs',
          params: {
            screen: 'Home',
          },
        });
      } else {
        if(response.error == "Firebase: Error (auth/invalid-credential).") {
            Alert.alert("Login Failed", "Invalid email/password combination.");
            return;
        }
        Alert.alert("Login Failed", response.error);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while logging in.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-[#3AABCC] justify-center px-6"
    >
      <View className="bg-white rounded-3xl p-8 shadow-lg mt-20">
        <Text className="text-3xl font-extrabold text-[#3AABCC] mb-8 text-center">
          Welcome Back
        </Text>

        {/* Email */}
        <TextInput
          className="border border-[#3AABCC] rounded-xl px-4 py-3  text-base text-gray-800"
          placeholder="Email"
          placeholderTextColor="#9fcbdc"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors({ ...errors, email: '' });
          }}
        />
        <Text className={`text-red-500 mb-2  ${errors.email ? '' : 'invisible'}`}>
          {errors.email || 'placeholder'}
        </Text>

        {/* Password */}
        <TextInput
          className="border border-[#3AABCC] rounded-xl px-4 py-3  text-base text-gray-800"
          placeholder="Password"
          placeholderTextColor="#9fcbdc"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors({ ...errors, password: '' });
          }}
        />
        <Text className={`text-red-500 mb-2 ${errors.password ? '' : 'invisible'}`}>
          {errors.password || 'placeholder'}
        </Text>

        {/* Login Button */}
        <TouchableOpacity
          className="bg-[#3AABCC] rounded-xl py-3 mb-6 shadow-md"
          activeOpacity={0.8}
          onPress={loginSubmit}
        >
          <Text className="text-white font-bold text-lg text-center">Login</Text>
        </TouchableOpacity>

        {/* Register Link */}
        <View className="flex-row justify-center items-center">
          <Text className="text-gray-500 font-medium">Don't have an account?</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            // onPress={() => (navigation as any).navigate('Register')}
            onPress={() => (navigation as any).navigate('App', { screen: 'Register' })}
          >
            <Text className="text-[#3AABCC] font-semibold underline ml-1">Register</Text>
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          activeOpacity={0.8}
          // onPress={() => (navigation as any).navigate('AccountRecovery')}
          onPress={() => (navigation as any).navigate('App', { screen: 'AccountRecovery' })}
        >
          <Text className="text-black font-bold text-lg text-center mt-4">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
