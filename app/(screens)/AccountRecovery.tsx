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
import { auth } from "../../config/firebase.js";
import { sendPasswordResetEmail } from "firebase/auth";
import { checkIfEmailExists } from "../../services/userService";

export default function AccountRecoveryScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({
      email: '',
  });


  const validate = () => {
    const newErrors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleResetPassword = async () => {
    if (!validate()) return;

    try {
       const result = await checkIfEmailExists(email);
       console.log(result)
       if(result.success) {
          await sendPasswordResetEmail(auth, email);
          Alert.alert("Password Reset Email Sent", `An email has been sent to ${email}.`);
          return;
       }
      Alert.alert("Email Not Found", "No account was found with that email address.");
    } catch (error) {
      Alert.alert("Error", "An error occurred.");
    }
  }
  

 return (
  <KeyboardAvoidingView
    behavior="padding"
    className="flex-1 bg-[#3AABCC]"
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
      <View className="bg-white rounded-3xl p-8 shadow-lg">
        <Text className="text-3xl font-extrabold text-[#3AABCC] mb-3 text-center">
          Reset Password
        </Text>

        <Text className="text-base text-gray-600 text-center mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <TextInput
          className="border border-[#3AABCC] rounded-xl px-4 py-3 mb-6 text-base text-gray-800"
          placeholder="Email Address"
          placeholderTextColor="#9fcbdc"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          className="bg-[#3AABCC] rounded-xl py-3 mb-6 shadow-md"
          activeOpacity={0.8}
          onPress={handleResetPassword}
        >
          <Text className="text-white font-bold text-lg text-center">Send Reset Link</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center space-x-2">
          <Text className="text-gray-500 font-medium">Remember your password?</Text>
          <TouchableOpacity
            activeOpacity={0.7}
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
