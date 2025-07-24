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


  
  const loginSubmit = async () => {
    if (email === "" || password === "") {
      Alert.alert("Validation", "Please fill in all fields");
      return;
    }

    try {
      const user_info = { email, password }; // shorthand for object properties
      const response =  await authenticateUser(user_info);

      if (response.success) {
        Alert.alert("Success", response.message);
        (navigation as any).navigate('MainTabs', { screen: 'Home' })
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
      className="flex-1 bg-[#3AABCC] justify-center px-6"
    >
      <View className="bg-white rounded-3xl p-8 shadow-lg mt-20">
        <Text className="text-3xl font-extrabold text-[#3AABCC] mb-8 text-center">
          Welcome Back
        </Text>

        <TextInput
          className="border border-[#3AABCC] rounded-xl px-4 py-3 mb-5 text-base text-gray-800"
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

        <TouchableOpacity
          className="bg-[#3AABCC] rounded-xl py-3 mb-6 shadow-md"
          activeOpacity={0.8}
          // onPress={() => alert(`Logging in\nEmail: ${email}\nPassword: ${password}`)}
          // onPress={() => (navigation as any).navigate('MainTabs')}                
         // onPress={() => (navigation as any).navigate('MainTabs', { screen: 'Home' })}
         onPress={loginSubmit}
        >
          <Text className="text-white font-bold text-lg text-center">Login</Text>
        </TouchableOpacity>

          {/* <TouchableOpacity
          className="bg-[#3AABCC] rounded-xl py-3 mb-6 shadow-md"
          activeOpacity={0.8}
          // onPress={() => alert(`Logging in\nEmail: ${email}\nPassword: ${password}`)}
          // onPress={() => (navigation as any).navigate('MainTabs')}                
          onPress={() => (navigation as any).navigate('MainTabs', { screen: 'Home' })}
       //  onPress={loginSubmit}
        >
          <Text className="text-white font-bold text-lg text-center">Home</Text>
        </TouchableOpacity> */}

        <View className="flex-row justify-center items-center">
          <Text className="text-gray-500 font-medium">Don't have an account?</Text>
          <TouchableOpacity activeOpacity={0.7} 
         // onPress={() => alert('Navigate to Register')}
            onPress={() => (navigation as any).navigate('Register')
}
          >
            <Text className="text-[#3AABCC] font-semibold underline">Register</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
        //   className="bg-[#3AABCC] rounded-xl py-3 mb-6 shadow-md"
          activeOpacity={0.8}
          //</View>onPress={() => alert('Navigate to Account Recovery')}    
            onPress={() => (navigation as any).navigate('AccountRecovery')}
           >
          <Text className="text-black font-bold text-lg text-center mt-4">  Forgot Password?</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}
