import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { changePassword } from '../../../services/authService';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { FadeInView } from '../../components/animated/FadeInView';
import { SafeAreaView } from 'react-native-safe-area-context';

const UpdatePasswordScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (form.newPassword !== form.confirmPassword) {
      Alert.alert('Validation Error', 'New password and confirmation do not match.');
      return;
    }

    try {
      const response = await changePassword(user, form.newPassword);
      if (response.success) {
        Alert.alert("Success", "Password updated successfully.");
        (navigation as any).navigate('App', { screen: 'Login' });
      } else {
        Alert.alert("Update Failed", response.error || "Unknown error");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating password.");
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`} edges={['top']}>
      {/* Header */}
      <View className={`flex-1 justify-center items-center min-h-10 max-h-14 px-6 shadow-sm ${isDark ? 'bg-[#27272A]' : 'bg-white'}`}>
        <FadeInView duration={300}>
          <Text className={`text-2xl font-bold text-center ${isDark ? 'text-zinc-200' : 'text-gray-900'}`}>
            Change Password
          </Text>
        </FadeInView>
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className={`flex-1 px-4 py-6 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
            
            {/* Optional: Current Password Field (disabled by default) */}
            {/*
            <View className="mb-4">
              <Text className={`mb-1 font-medium ${isDark ? 'text-zinc-200' : 'text-gray-700'}`}>
                Current Password
              </Text>
              <TextInput
                className={`p-3 rounded-lg ${isDark ? 'bg-[#1F2937] text-white border border-[#3F3F46]' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
                placeholder="Enter current password"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                secureTextEntry
                value={form.currentPassword}
                onChangeText={(text) => handleChange('currentPassword', text)}
              />
            </View>
            */}

            {/* New Password */}
            <View className="mb-4">
              <Text className={`mb-1 font-medium ${isDark ? 'text-zinc-200' : 'text-gray-700'}`}>
                New Password
              </Text>
              <TextInput
                className={`p-3 rounded-lg ${isDark ? 'bg-[#1F2937] text-white border border-[#3F3F46]' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
                placeholder="Enter new password"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                secureTextEntry
                value={form.newPassword}
                onChangeText={(text) => handleChange('newPassword', text)}
              />
            </View>

            {/* Confirm Password */}
            <View className="mb-4">
              <Text className={`mb-1 font-medium ${isDark ? 'text-zinc-200' : 'text-gray-700'}`}>
                Confirm Password
              </Text>
              <TextInput
                className={`p-3 rounded-lg ${isDark ? 'bg-[#1F2937] text-white border border-[#3F3F46]' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
                placeholder="Confirm new password"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdatePasswordScreen;
