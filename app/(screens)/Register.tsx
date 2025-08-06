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

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validate = () => {
    const newErrors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) newErrors.username = 'Username is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerSubmit = async () => {
    if (!validate()) return;

    try {
      const user_info = { email, password, username };
      const response = await createUser(user_info);

      if (response.success) {
        Alert.alert("Success", response.message);
        (navigation as any).navigate('Login');
      } else {
        if(response.error == "Username already exist.") {
          Alert.alert("Registration Failed", response.error);
          return;
        }
        if(response.error == "Firebase: Error (auth/email-already-in-use).") {
          Alert.alert("Registration Failed", "Email Address already exist.");
          return;
        }
        Alert.alert("Registration Failed", response.error);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while registering.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-[#3AABCC]"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View className="bg-white rounded-3xl p-8 shadow-lg mt-20">
          <Text className="text-3xl font-extrabold text-[#3AABCC] mb-8 text-center">
            Create Account
          </Text>

          {/* Username */}
          <TextInput
            className="border border-[#3AABCC] rounded-xl px-4 py-3 text-base text-gray-800"
            placeholder="Username"
            placeholderTextColor="#9fcbdc"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setErrors({ ...errors, username: '' });
            }}
            autoCapitalize="words"
          />

          <Text className={`text-red-500 mb-1 ${errors.username ? '' : 'invisible'}`}>
            {errors.username || 'placeholder'}
          </Text>

          {/* Email */}
          <TextInput
            className="border border-[#3AABCC] rounded-xl px-4 py-3 text-base text-gray-800"
            placeholder="Email Address"
            placeholderTextColor="#9fcbdc"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors({ ...errors, email: '' });
            }}
          />

          <Text className={`text-red-500 mb-1 ${errors.email ? '' : 'invisible'}`}>
            {errors.email || 'placeholder'}
          </Text>

          {/* Password */}
          <TextInput
            className="border border-[#3AABCC] rounded-xl px-4 py-3 text-base text-gray-800"
            placeholder="Password"
            placeholderTextColor="#9fcbdc"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: '' });
            }}
          />

          <Text className={`text-red-500 mb-1 ${errors.password ? '' : 'invisible'}`}>
            {errors.password || 'placeholder'}
          </Text>

          {/* Confirm Password */}
          <TextInput
            className="border border-[#3AABCC] rounded-xl px-4 py-3 text-base text-gray-800"
            placeholder="Confirm Password"
            placeholderTextColor="#9fcbdc"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setErrors({ ...errors, confirmPassword: '' });
            }}
          />

          <Text className={`text-red-500 mb-1 ${errors.confirmPassword ? '' : 'invisible'}`}>
            {errors.confirmPassword || 'placeholder'}
          </Text>

          {/* Register Button */}
          <TouchableOpacity
            className="bg-[#3AABCC] rounded-xl py-3 mb-6 shadow-md"
            activeOpacity={0.8}
            onPress={registerSubmit}
          >
            <Text className="text-white font-bold text-lg text-center">REGISTER</Text>
          </TouchableOpacity>

          {/* Navigate to Login */}
          <View className="flex-row justify-center items-center space-x-2">
            <Text className="text-gray-500 font-medium">Already have an account?</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              // onPress={() => (navigation as any).navigate('Login')}
              onPress={() => (navigation as any).navigate('App', { screen: 'Login' })}
            >
              <Text className="text-[#3AABCC] font-semibold underline">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
