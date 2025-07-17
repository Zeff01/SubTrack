import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
            placeholder="Full Name"
            placeholderTextColor="#9fcbdc"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            className="border border-[#3AABCC] rounded-xl px-4 py-3 mb-4 text-base text-gray-800"
            placeholder="Email"
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
            onPress={() => alert(`Registering\nName: ${name}\nEmail: ${email}`)}
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
