import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import { ProfileForm } from '../../../types/ProfileFormType';
import { changeProfile } from '../../../services/authService';
import { useAuth } from '../../providers/AuthProvider';
import { useFocusEffect } from '@react-navigation/native';
import { getUsernameByEmail } from "../../../services/userService";
import { User } from 'firebase/auth';
import { useTheme } from '../../providers/ThemeProvider';
import { FadeInView } from '../../components/animated/FadeInView';
import { SafeAreaView } from 'react-native-safe-area-context';

const UpdateProfileScreen = () => {
  const navigation = useNavigation();
  const authContext = useAuth();
  const { user, authLoading } = authContext;
  const [username, setUsername] = useState<string | null>('');
  const [email, setEmail] = useState<string | null>('');
  const [userData, setUserData] = useState<User | null>(null);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  useFocusEffect(
    useCallback(() => {
      setUserData(user);
      getUsername(user?.email || '');
      setEmail(user?.email || '');
    }, [user])
  );

  const getUsername = async (email: string) => {
    try {
      if (!email) return;
      const response = await getUsernameByEmail(email);
      if (response) setUsername(response);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while retrieving username.");
    }
  };

  const handleSave = async () => {
    if (!email || !username) {
      Alert.alert("Validation", "Please fill in all fields");
      return;
    }

    try {
      const user_info = { email, username };
      const response = await changeProfile(user, user_info);

      if (response.success) {
        Alert.alert("Success", "Profile updated successfully.");
      } else {
        Alert.alert("Update Failed", response.error || "Unknown error");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred.");
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`}
      edges={['top']}
    >
      <View className={`flex-1 justify-center items-center min-h-10 max-h-14 px-6 shadow-sm ${theme === 'dark' ? 'bg-[#27272A]' : 'bg-white'}`}>
              <FadeInView duration={300}>
                <Text className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-zinc-200' : 'text-gray-900'}`}>
                  Update Profile
                </Text>
              </FadeInView>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className={`flex-1 px-4 py-6 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
            {/* Username Field */}
            <View className="mb-4">
              <Text className={`mb-1 font-medium ${isDark ? 'text-zinc-200' : 'text-gray-700'}`}>
                Username
              </Text>
              <TextInput
                className={`p-3 rounded-lg ${isDark ? 'bg-[#1F2937] text-white border border-[#3F3F46]' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
                placeholder="Username"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={username || ''}
                onChangeText={setUsername}
              />
            </View>

            {/* Email Field (Read-only) */}
            <View className="mb-4">
              <Text className={`mb-1 font-medium ${isDark ? 'text-zinc-200' : 'text-gray-700'}`}>
                Email Address
              </Text>
              <TextInput
                className={`p-3 rounded-lg ${isDark ? 'bg-[#1F2937] text-white border border-[#3F3F46]' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
                placeholder="Email"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                keyboardType="email-address"
                editable={false}
                value={email || ''}
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
    </SafeAreaView>
  );
};

export default UpdateProfileScreen;
