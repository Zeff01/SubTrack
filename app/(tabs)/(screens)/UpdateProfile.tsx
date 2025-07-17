import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import { ProfileForm } from '../../../types/ProfileFormType'; // Adjust path as needed

const UpdateProfileScreen = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    firstName: 'John',
    middleName: '',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    contactNumber: '+1 234 567 8900',
  });

  // const handleChange = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = () => {
    console.log('Updated profile:', form);
    // Add save logic here
  };

  return (
    <>
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
    <ScrollView className="bg-gray-50 px-4 py-6">
      {/* Form */}
  
      <View className="bg-white rounded-2xl p-6 shadow-md">
        {/* First Name */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">First Name</Text>
          <TextInput
            className="border border-gray-200 p-3 rounded-lg bg-gray-50"
            placeholder="John"
            value={form.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
          />
        </View>

        {/* Middle Name */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Middle Name</Text>
          <TextInput
            className="border border-gray-200 p-3 rounded-lg bg-gray-50"
            placeholder="Alexander"
            value={form.middleName}
            onChangeText={(text) => handleChange('middleName', text)}
          />
        </View>

        {/* Last Name */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Last Name</Text>
          <TextInput
            className="border border-gray-200 p-3 rounded-lg bg-gray-50"
            placeholder="Doe"
            value={form.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
          />
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Email</Text>
          <TextInput
            className="border border-gray-200 p-3 rounded-lg bg-gray-50"
            placeholder="john.doe@example.com"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
          />
        </View>

        {/* Contact Number */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Contact Number</Text>
          <TextInput
            className="border border-gray-200 p-3 rounded-lg bg-gray-50"
            placeholder="+1 234 567 8900"
            keyboardType="phone-pad"
            value={form.contactNumber}
            onChangeText={(text) => handleChange('contactNumber', text)}
          />
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
  </>
  );
};

export default UpdateProfileScreen;
