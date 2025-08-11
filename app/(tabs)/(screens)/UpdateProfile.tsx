import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import { ProfileForm } from '../../../types/ProfileFormType'; // Adjust path as needed
import { changeProfile } from '../../../services/authService';
import { useAuth } from '../../providers/AuthProvider'; // Import your AuthProvider
import { useFocusEffect } from '@react-navigation/native';
import { getUsernameByEmail } from "../../../services/userService";
import { User } from 'firebase/auth';



const UpdateProfileScreen = () => {
  const navigation = useNavigation();
  const authContext = useAuth();
  const { user, authLoading } = authContext;
  const [username, setUsername] = useState<string | null>('');
  const [email, setEmail] = useState<string | null>('');
  const [userData, setUserData] =  useState<User | null>(null); // ✅ Allow User or null
  

    useFocusEffect(
        useCallback(() => {
            setUserData(user);
            getUsername(userData?.email as string);
            setEmail(userData?.email as string);
        }, [authLoading, user, userData])
    );
  
    
  const getUsername = async (email: string) => {
  try {
    if (!email) {
      // throw new Error("No email provided");
    }

    const response = await getUsernameByEmail(email);
    if (response) {
      setUsername(response);
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "An error occurred while logging in.");
  }
};



  const handleSave = async () => {
      if (email == "" || username == "") {
        Alert.alert("Validation", "Please fill in all fields");
        return;
      }
  
      try {
        const user_info = { email: email, username: username }; // shorthand for object properties
        const response = await changeProfile(user, user_info); // Call your Firebase update method

        if (response.success) {
          Alert.alert("Success", JSON.stringify(user_info, null, 2)); 
         // Alert.alert("Success", response.message);
        } else {
          Alert.alert("Update Profile Failed", response.error);
          // console.log(response.error)
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred.");
      }
    };

  return (
    <>
    <View className="flex-1 bg-white">
    <View className="pt-12 pb-6 px-6 bg-[#D9D9D9] rounded-b-3xl">
          <View className="relative items-center justify-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute left-0 px-4"
            >
              <Ionicons name="chevron-back" size={25} color="black" />
            </TouchableOpacity>
            <Text className="text-xl font-semibold text-gray-800">
               Update Profile
            </Text>
          </View>
        </View>

     <KeyboardAvoidingView
      behavior={'padding'}
     // className="flex-1 bg-[#3AABCC] justify-center px-6"
    >
    <ScrollView className="bg-white px-4 py-6">
      {/* Form */}
  
      <View className="bg-white rounded-2xl p-6 shadow-md">
        {/* First Name */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Username</Text>
          <TextInput
            className="border border-gray-200 p-3 rounded-lg bg-gray-50"
            placeholder="username"
            value={username || ''} // fallback for null
            onChangeText={(text) => setUsername(text)}
          />
        </View>



        {/* Email */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Email Address</Text>
          <TextInput
            className="border border-gray-200 p-3 rounded-lg bg-gray-50"
            placeholder="test@gmail.com"
            keyboardType="email-address"
            editable={false} // <- makes it read-only
            value={email || ''} // fallback for null
            onChangeText={(text) => setEmail(text)}          />
        </View>


        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-blue-600 py-3 rounded-lg mt-4 shadow-sm"
        >
          <Text className="text-white font-bold text-center">Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
    </View>
  </>
  );
};

export default UpdateProfileScreen;
