import React, { useState, useRef } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authenticateUser } from "../../services/authService";
import * as Animatable from 'react-native-animatable';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    // Email validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    Keyboard.dismiss();
    setLoading(true);

    try {
      // Trim email before sending to avoid whitespace issues
      const trimmedEmail = email.trim().toLowerCase();
      
      // Debug log to check what's being sent
      //console.log('Attempting login with:', { email: trimmedEmail, hasPassword: !!password });
      
      // Ensure email is not empty
      if (!trimmedEmail) {
        Alert.alert('Login Failed', 'Please enter your email address.');
        setLoading(false);
        return;
      }
      
      const response = await authenticateUser({ email: trimmedEmail, password });
      
      if (response.success) {
        // Navigation will be handled by auth state change
      } else {
        // Log the actual error for debugging (remove in production)
        console.log('Login error:', response.error);
        
        // Check for specific Firebase auth errors
        if (response.error?.includes('auth/user-not-found')) {
          Alert.alert('Login Failed', 'No account found with this email address.');
        } else if (response.error?.includes('auth/wrong-password')) {
          Alert.alert('Login Failed', 'Incorrect password. Please try again.');
        } else if (response.error?.includes('auth/invalid-email')) {
          Alert.alert('Login Failed', 'Please enter a valid email address.');
        } else if (response.error?.includes('auth/too-many-requests')) {
          Alert.alert('Login Failed', 'Too many failed attempts. Please try again later.');
        } else {
          Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
        }
      }
    } catch (error) {
      console.log('Login exception:', error);
      Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Logo/Header Animation */}
          <Animatable.View 
            animation="fadeInDown" 
            duration={800}
            className="mb-8"
          >
            <View className="w-24 h-24 bg-[#3AABCC] rounded-full self-center mb-6 items-center justify-center">
              <Text className="text-white text-4xl font-bold">S</Text>
            </View>
            <Text className="text-4xl font-bold text-center text-[#3AABCC] mb-2">
              Welcome Back!
            </Text>
            <Text className="text-lg text-center text-gray-600">
              Log in to manage your subscriptions
            </Text>
          </Animatable.View>

          {/* Email Input */}
          <Animatable.View 
            animation="fadeInLeft" 
            duration={800}
            delay={200}
            className="mb-4"
          >
            <Text className="text-sm font-medium text-gray-700 mb-2">Email Address</Text>
            <View className={`border-2 ${errors.email ? 'border-red-500' : 'border-[#3AABCC]'} rounded-xl overflow-hidden bg-gray-50`}>
              <TextInput
                className="px-4 py-4 text-base text-gray-800 min-h-[56px]"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: '' });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
            {errors.email ? (
              <Animatable.Text 
                animation="fadeIn" 
                className="text-red-500 text-sm mt-1"
              >
                {errors.email}
              </Animatable.Text>
            ) : null}
          </Animatable.View>

          {/* Password Input */}
          <Animatable.View 
            animation="fadeInRight" 
            duration={800}
            delay={400}
            className="mb-6"
          >
            <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
            <View className={`border-2 ${errors.password ? 'border-red-500' : 'border-[#3AABCC]'} rounded-xl overflow-hidden bg-gray-50 flex-row items-center`}>
              <TextInput
                ref={passwordRef}
                className="flex-1 px-4 py-4 text-base text-gray-800 min-h-[56px]"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: '' });
                }}
                secureTextEntry={!showPassword}
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="px-4"
                activeOpacity={0.7}
              >
                <Text className="text-[#3AABCC] font-medium">
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Animatable.Text 
                animation="fadeIn" 
                className="text-red-500 text-sm mt-1"
              >
                {errors.password}
              </Animatable.Text>
            ) : null}
          </Animatable.View>

          {/* Login Button */}
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={600}
          >
            <TouchableOpacity
              className={`bg-[#3AABCC] rounded-xl py-4 shadow-lg ${loading ? 'opacity-70' : ''}`}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Log In
                </Text>
              )}
            </TouchableOpacity>
          </Animatable.View>

          {/* Divider */}
          <Animatable.View 
            animation="fadeIn" 
            delay={700}
            className="flex-row items-center my-6"
          >
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-4 text-gray-500">or</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </Animatable.View>

          {/* Register Link */}
          <Animatable.View 
            animation="fadeIn" 
            delay={800}
            className="flex-row justify-center items-center"
          >
            <Text className="text-gray-600 font-medium">Don't have an account? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => (navigation as any).navigate('Register')}
            >
              <Text className="text-[#3AABCC] font-bold">Sign Up</Text>
            </TouchableOpacity>
          </Animatable.View>

          {/* Forgot Password */}
          <Animatable.View 
            animation="fadeIn" 
            delay={900}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => (navigation as any).navigate('AccountRecovery')}
              className="mt-4"
            >
              <Text className="text-[#3AABCC] font-medium text-center">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}