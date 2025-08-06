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


export default function AccountRecoveryScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');


  const handleResetPassword = async () => {
    console.log(123)
    console.log(email)
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Success");
    } catch (error) {
      Alert.alert("Error", "An error occurred while logging in.");
    }
  }
  

  return (
    <KeyboardAvoidingView
      behavior={'padding'}
      className="flex-1 bg-[#3AABCC]"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View className="bg-white rounded-3xl p-8 shadow-lg">
          <Text className="text-3xl font-extrabold text-[#3AABCC] mb-3 text-center">
            Send OTP
          </Text>

          <Text className="text-base text-gray-600 text-center mb-6">
            Enter your email and we’ll send you a one-time password (OTP) to verify your identity.
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
            <Text className="text-white font-bold text-lg text-center">Send OTP</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center space-x-2">
            <Text className="text-gray-500 font-medium">Remember your password?</Text>
            <TouchableOpacity activeOpacity={0.7}
            //  onPress={() => alert('Navigate to Login')}
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
