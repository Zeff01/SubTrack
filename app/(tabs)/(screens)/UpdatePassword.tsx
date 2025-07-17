import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const UpdatePasswordScreen = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = () => {
    if (form.newPassword !== form.confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }

    console.log('Password updated:', form);
    // Add API call or password update logic
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
               Change Password
            </Text>
          </View>
        </View>

      {/* Form */}
      <ScrollView className="flex-1 bg-gray-50 px-4 py-6">
        <View className="bg-white rounded-2xl p-6 shadow-md">
          {/* Current Password */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Current Password</Text>
            <TextInput
              className="border border-gray-200 p-3 rounded-lg bg-gray-50"
              placeholder="Enter current password"
              secureTextEntry
              value={form.currentPassword}
              onChangeText={(text) => handleChange('currentPassword', text)}
            />
          </View>

          {/* New Password */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">New Password</Text>
            <TextInput
              className="border border-gray-200 p-3 rounded-lg bg-gray-50"
              placeholder="Enter new password"
              secureTextEntry
              value={form.newPassword}
              onChangeText={(text) => handleChange('newPassword', text)}
            />
          </View>

          {/* Confirm Password */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Confirm Password</Text>
            <TextInput
              className="border border-gray-200 p-3 rounded-lg bg-gray-50"
              placeholder="Confirm new password"
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className="bg-blue-600 py-3 rounded-lg mt-4 shadow-sm"
          >
            <Text className="text-white font-bold text-center">Update Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default UpdatePasswordScreen;
