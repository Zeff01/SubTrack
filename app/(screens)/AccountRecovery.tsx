import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from "../../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import * as Animatable from 'react-native-animatable';

export default function AccountRecoveryScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '' };

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePasswordReset = async () => {
    if (!validateForm()) return;
    
    Keyboard.dismiss();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      // Generic success message for security - doesn't reveal if email exists
      Alert.alert(
        "Check Your Email",
        "If an account exists with this email, we've sent password reset instructions to your inbox.",
        [
          {
            text: "OK",
            onPress: () => (navigation as any).navigate('Login')
          }
        ]
      );
    } catch (error: any) {
      // Generic error message for security
      Alert.alert(
        "Request Failed",
        "Unable to process your request. Please try again later."
      );
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
          {/* Header Animation */}
          <Animatable.View 
            animation="fadeInDown" 
            duration={800}
            className="mb-8"
          >
            <View className="w-24 h-24 bg-[#3AABCC] rounded-full self-center mb-6 items-center justify-center">
              <Text className="text-white text-4xl font-bold">🔒</Text>
            </View>
            <Text className="text-4xl font-bold text-center text-[#3AABCC] mb-2">
              Reset Password
            </Text>
            <Text className="text-lg text-center text-gray-600">
              Enter your email to receive reset instructions
            </Text>
          </Animatable.View>

          {/* Email Input */}
          <Animatable.View 
            animation="fadeInLeft" 
            duration={800}
            delay={200}
            className="mb-6"
          >
            <Text className="text-sm font-medium text-gray-700 mb-2">Email Address</Text>
            <View className={`border-2 ${errors.email ? 'border-red-500' : 'border-[#3AABCC]'} rounded-xl overflow-hidden bg-gray-50`}>
              <TextInput
                className="px-4 py-4 text-base text-gray-800 min-h-[56px]"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={(text) => {
                  setEmail(text.trim());
                  setErrors({ email: '' });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="done"
                onSubmitEditing={handlePasswordReset}
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

          {/* Reset Button */}
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={400}
          >
            <TouchableOpacity
              className={`bg-[#3AABCC] rounded-xl py-4 shadow-lg ${loading ? 'opacity-70' : ''}`}
              onPress={handlePasswordReset}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Send Reset Email
                </Text>
              )}
            </TouchableOpacity>
          </Animatable.View>

          {/* Info Message */}
          <Animatable.View 
            animation="fadeIn" 
            delay={600}
            className="mt-6 bg-blue-50 p-4 rounded-xl"
          >
            <Text className="text-sm text-gray-700 text-center">
              After receiving the email, follow the instructions to create a new password. 
              Check your spam folder if you don't see it within a few minutes.
            </Text>
          </Animatable.View>

          {/* Back to Login */}
          <Animatable.View 
            animation="fadeIn" 
            delay={700}
            className="flex-row justify-center items-center mt-8"
          >
            <Text className="text-gray-600 font-medium">Remember your password? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => (navigation as any).navigate('Login')}
            >
              <Text className="text-[#3AABCC] font-bold">Log In</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}