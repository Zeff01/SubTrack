import React, { useState, useRef } from 'react';
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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { createDocumentUser } from '../../services/userService';
import * as Animatable from 'react-native-animatable';

// Password strength checker
const checkPasswordStrength = (password: string) => {
  let strength = 0;
  let feedback = [];
  
  if (password.length >= 8) strength += 1;
  else feedback.push('At least 8 characters');
  
  if (password.length >= 12) strength += 1;
  
  if (/[a-z]/.test(password)) strength += 1;
  else feedback.push('One lowercase letter');
  
  if (/[A-Z]/.test(password)) strength += 1;
  else feedback.push('One uppercase letter');
  
  if (/[0-9]/.test(password)) strength += 1;
  else feedback.push('One number');
  
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  else feedback.push('One special character');
  
  return { strength, feedback };
};

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', confirmPassword: '', username: '' };

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Password validation with strength check
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else {
      const { strength, feedback } = checkPasswordStrength(password);
      if (strength < 4) {
        newErrors.password = `Weak password. Needs: ${feedback.join(', ')}`;
        isValid = false;
      }
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    Keyboard.dismiss();
    setLoading(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Add user to Firestore
      const response = await createDocumentUser({
        uid: userCredential.user.uid,
        email: email,
        username: username
      });

      if (response.success) {
        Alert.alert("Success", "Account created successfully!");
        (navigation as any).navigate('Login');
      } else {
        // Generic error message for security
        Alert.alert("Registration Failed", "Unable to create account. Please try again.");
        // Delete the user from Firebase Auth if DB save failed
        await userCredential.user.delete();
      }
    } catch (error: any) {
      console.error("Registration error:", error); // Temporary for debugging
      
      // Generic error messages for security
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Registration Failed", "An account with this email already exists.");
      } else if (error.code === 'auth/weak-password') {
        Alert.alert("Registration Failed", "Please choose a stronger password.");
      } else if (error.code === 'auth/invalid-api-key') {
        Alert.alert("Configuration Error", "Firebase is not properly configured. Please check your settings.");
      } else {
        Alert.alert("Registration Failed", `Unable to create account. Error: ${error.code || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrengthColor = () => {
    if (!password) return 'transparent';
    const { strength } = checkPasswordStrength(password);
    if (strength <= 2) return '#EF4444'; // red
    if (strength <= 4) return '#F59E0B'; // yellow
    return '#10B981'; // green
  };

  const getPasswordStrengthText = () => {
    if (!password) return '';
    const { strength } = checkPasswordStrength(password);
    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Medium';
    return 'Strong';
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
              <Text className="text-white text-4xl font-bold">S</Text>
            </View>
            <Text className="text-4xl font-bold text-center text-[#3AABCC] mb-2">
              Create Account
            </Text>
            <Text className="text-lg text-center text-gray-600">
              Start managing your subscriptions today
            </Text>
          </Animatable.View>

          {/* Username Input */}
          <Animatable.View 
            animation="fadeInLeft" 
            duration={800}
            delay={200}
            className="mb-4"
          >
            <Text className="text-sm font-medium text-gray-700 mb-2">Username</Text>
            <View className={`border-2 ${errors.username ? 'border-red-500' : 'border-[#3AABCC]'} rounded-xl overflow-hidden bg-gray-50`}>
              <TextInput
                className="px-4 py-4 text-base text-gray-800 min-h-[56px]"
                placeholder="Choose a username"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={(text) => {
                  setUsername(text.trim());
                  setErrors({ ...errors, username: '' });
                }}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
            {errors.username ? (
              <Animatable.Text 
                animation="fadeIn" 
                className="text-red-500 text-sm mt-1"
              >
                {errors.username}
              </Animatable.Text>
            ) : null}
          </Animatable.View>

          {/* Email Input */}
          <Animatable.View 
            animation="fadeInRight" 
            duration={800}
            delay={300}
            className="mb-4"
          >
            <Text className="text-sm font-medium text-gray-700 mb-2">Email Address</Text>
            <View className={`border-2 ${errors.email ? 'border-red-500' : 'border-[#3AABCC]'} rounded-xl overflow-hidden bg-gray-50`}>
              <TextInput
                ref={emailRef}
                className="px-4 py-4 text-base text-gray-800 min-h-[56px]"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={(text) => {
                  setEmail(text.trim());
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
            animation="fadeInLeft" 
            duration={800}
            delay={400}
            className="mb-4"
          >
            <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
            <View className={`border-2 ${errors.password ? 'border-red-500' : 'border-[#3AABCC]'} rounded-xl overflow-hidden bg-gray-50 flex-row items-center`}>
              <TextInput
                ref={passwordRef}
                className="flex-1 px-4 py-4 text-base text-gray-800 min-h-[56px]"
                placeholder="Create a strong password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: '' });
                }}
                secureTextEntry={!showPassword}
                autoComplete="password-new"
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                blurOnSubmit={false}
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
            {/* Password Strength Indicator */}
            {password ? (
              <View className="mt-2">
                <View className="flex-row items-center">
                  <View className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <View 
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: getPasswordStrengthColor(),
                        width: `${(checkPasswordStrength(password).strength / 6) * 100}%`
                      }}
                    />
                  </View>
                  <Text className={`ml-2 text-sm font-medium`} style={{ color: getPasswordStrengthColor() }}>
                    {getPasswordStrengthText()}
                  </Text>
                </View>
              </View>
            ) : null}
            {errors.password ? (
              <Animatable.Text 
                animation="fadeIn" 
                className="text-red-500 text-sm mt-1"
              >
                {errors.password}
              </Animatable.Text>
            ) : null}
          </Animatable.View>

          {/* Confirm Password Input */}
          <Animatable.View 
            animation="fadeInRight" 
            duration={800}
            delay={500}
            className="mb-6"
          >
            <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
            <View className={`border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-[#3AABCC]'} rounded-xl overflow-hidden bg-gray-50 flex-row items-center`}>
              <TextInput
                ref={confirmPasswordRef}
                className="flex-1 px-4 py-4 text-base text-gray-800 min-h-[56px]"
                placeholder="Re-enter your password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors({ ...errors, confirmPassword: '' });
                }}
                secureTextEntry={!showConfirmPassword}
                autoComplete="password-new"
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="px-4"
                activeOpacity={0.7}
              >
                <Text className="text-[#3AABCC] font-medium">
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Animatable.Text 
                animation="fadeIn" 
                className="text-red-500 text-sm mt-1"
              >
                {errors.confirmPassword}
              </Animatable.Text>
            ) : null}
          </Animatable.View>

          {/* Register Button */}
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={600}
          >
            <TouchableOpacity
              className={`bg-[#3AABCC] rounded-xl py-4 shadow-lg ${loading ? 'opacity-70' : ''}`}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>
          </Animatable.View>

          {/* Terms and Privacy */}
          <Animatable.View 
            animation="fadeIn" 
            delay={700}
            className="mt-4"
          >
            <Text className="text-center text-gray-500 text-sm">
              By signing up, you agree to our{' '}
              <Text className="text-[#3AABCC] font-medium">Terms of Service</Text>
              {' '}and{' '}
              <Text className="text-[#3AABCC] font-medium">Privacy Policy</Text>
            </Text>
          </Animatable.View>

          {/* Login Link */}
          <Animatable.View 
            animation="fadeIn" 
            delay={800}
            className="flex-row justify-center items-center mt-6"
          >
            <Text className="text-gray-600 font-medium">Already have an account? </Text>
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