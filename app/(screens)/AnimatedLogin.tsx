import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authenticateUser } from "../../services/authService";
import { FadeInView } from '../components/animated/FadeInView';
import { SlideInView } from '../components/animated/SlideInView';
import { ScaleButton } from '../components/animated/ScaleButton';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export default function AnimatedLoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const shakeAnimation = useSharedValue(0);
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }],
  }));

  const triggerShake = () => {
    shakeAnimation.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

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
    if (Object.keys(newErrors).length > 0) {
      triggerShake();
      return false;
    }
    return true;
  };

  const loginSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const user_info = { email, password };
      const response = await authenticateUser(user_info);

      if (response.success) {
        // Navigation will be handled by AuthProvider
      } else {
        triggerShake();
        Alert.alert("Login Failed", response.error || "Invalid credentials");
      }
    } catch (error) {
      triggerShake();
      Alert.alert("Error", "An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#3AABCC] justify-center px-6"
    >
      <View className="w-full max-w-sm mx-auto">
        {/* Logo/Title */}
        <FadeInView delay={0} className="items-center mb-12">
          <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-4 shadow-lg">
            <Text className="text-4xl font-bold text-[#3AABCC]">S</Text>
          </View>
          <Text className="text-3xl font-bold text-white mb-2">SubTrack</Text>
          <Text className="text-white text-base opacity-80">Manage your subscriptions</Text>
        </FadeInView>

        {/* Form Container */}
        <Animated.View style={shakeStyle}>
          <SlideInView delay={200} direction="up" className="bg-white rounded-3xl p-8 shadow-xl">
            {/* Email Input */}
            <FadeInView delay={400}>
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                <TextInput
                  className={`border ${errors.email ? 'border-red-500' : 'border-gray-200'} 
                    p-4 rounded-xl bg-gray-50 text-gray-900`}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({...errors, email: ''});
                  }}
                  editable={!loading}
                />
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
                )}
              </View>
            </FadeInView>

            {/* Password Input */}
            <FadeInView delay={500}>
              <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                <TextInput
                  className={`border ${errors.password ? 'border-red-500' : 'border-gray-200'} 
                    p-4 rounded-xl bg-gray-50 text-gray-900`}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({...errors, password: ''});
                  }}
                  editable={!loading}
                />
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
                )}
              </View>
            </FadeInView>

            {/* Login Button */}
            <FadeInView delay={600}>
              <ScaleButton
                onPress={loginSubmit}
                disabled={loading}
                className={`py-4 rounded-xl ${loading ? 'bg-gray-400' : 'bg-[#3AABCC]'}`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-center text-lg">
                    Sign In
                  </Text>
                )}
              </ScaleButton>
            </FadeInView>

            {/* Forgot Password */}
            <FadeInView delay={700}>
              <TouchableOpacity
                onPress={() => (navigation as any).navigate('AccountRecovery')}
                className="mt-4"
                disabled={loading}
              >
                <Text className="text-[#3AABCC] text-center font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </FadeInView>
          </SlideInView>
        </Animated.View>

        {/* Sign Up Link */}
        <FadeInView delay={800} className="mt-8">
          <TouchableOpacity
            onPress={() => (navigation as any).navigate('Register')}
            disabled={loading}
          >
            <Text className="text-white text-center">
              Don't have an account?{' '}
              <Text className="font-bold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </FadeInView>
      </View>
    </KeyboardAvoidingView>
  );
}