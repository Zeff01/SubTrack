import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from "../../../config/firebase";
import { FadeInView } from '../../components/animated/FadeInView';
import { SlideInView } from '../../components/animated/SlideInView';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../providers/ThemeProvider';

const AccountSettingsScreen = () => {
  const navigation = useNavigation();

  const [isEnabledAuth, setIsEnabledAuth] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleSwitchAuth = () => setIsEnabledAuth(prev => !prev);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              Alert.alert("Error", "Failed to logout. Please try again.");
              console.error("Logout error:", error);
            }
          }
        }
      ]
    );
  };

  const settingItem = (icon: string, title: string, subtitle: string, onPress?: () => void, danger?: boolean) => (
    <TouchableOpacity
      className={`flex-row items-center py-4`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${danger ? 'bg-red-50' : 'bg-gray-100 dark:bg-[#27272A]'}`}>
        <Ionicons name={icon as any} size={22} color={danger ? '#DC2626' : '#374151'} />
      </View>
      <View className="flex-1">
        <Text className={`font-semibold ${danger ? 'text-red-600' : theme === 'dark' ? 'text-zinc-200' : 'text-gray-800'}`}>
          {title}
        </Text>
        <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={danger ? '#DC2626' : '#9CA3AF'} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${theme === 'dark' ? 'bg-[#18181B]' : 'bg-gray-50'}`}
      edges={['top']}
    >
      {/* Header */}
      <View className={`flex-1 justify-center items-center min-h-10 max-h-14 px-6 shadow-sm ${theme === 'dark' ? 'bg-[#27272A]' : 'bg-white'}`}>
        <FadeInView duration={300}>
          <Text className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-zinc-200' : 'text-gray-900'}`}>
            Account Settings
          </Text>
        </FadeInView>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 20 : 40 }}
      >
        {/* Account Security */}
        <SlideInView direction="up" duration={250} delay={100}>
          <View className={`rounded-2xl p-5 mb-4 mt-4 shadow-sm border ${theme === 'dark' ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
            <View className="flex-row items-center mb-4">
              <Ionicons name="shield-checkmark" size={18} color={theme === 'dark' ? '#fff' : '#3AABCC'} />
              <Text className={`ml-2 text-lg font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-gray-900'}`}>
                Account Security
              </Text>
            </View>

            {settingItem("person-outline", "Update Profile", "Change your name and email", () => (navigation as any).navigate('Account', { screen: 'update_profile' }))}
            {settingItem("lock-closed-outline", "Change Password", "Update your password regularly", () => (navigation as any).navigate('Account', { screen: 'update_password' }))}
            {settingItem("time-outline", "Login Activity", "View recent login sessions")}

            {/* Two-Factor Auth */}
            <View className="flex-row items-center py-4">
              <View className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#27272A] items-center justify-center mr-3">
                <Ionicons name="key-outline" size={22} color={'#374151'} />
              </View>
              <View className="flex-1">
                <Text className={`font-semibold ${theme === 'dark' ? 'text-zinc-200' : 'text-gray-800'}`}>
                  Two-Factor Authentication
                </Text>
                <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Extra layer of security
                </Text>
              </View>
              <Switch
                trackColor={{ false: '#E5E7EB', true: '#3AABCC' }}
                thumbColor={theme === 'dark' ? '#1E293B' : '#ffffff'}
                ios_backgroundColor="#E5E7EB"
                onValueChange={toggleSwitchAuth}
                value={isEnabledAuth}
              />
            </View>
          </View>
        </SlideInView>

        {/* Preferences */}
        <SlideInView direction="up" duration={250} delay={200}>
          <View className={`rounded-2xl p-5 mb-4 mt-4 shadow-sm border ${theme === 'dark' ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
            <View className="flex-row items-center mb-4">
              <Ionicons name="settings-outline" size={18} color={theme === 'dark' ? '#fff' : '#3AABCC'} />
              <Text className={`ml-2 text-lg font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-gray-900'}`}>
                Preferences
              </Text>
            </View>

            {/* Dark Mode */}
            <View className="flex-row items-center py-4">
              <View className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#27272A] items-center justify-center mr-3">
                <Ionicons name="moon-outline" size={22} color="#374151" />
              </View>
              <View className="flex-1">
                <Text className={`font-semibold ${theme === 'dark' ? 'text-zinc-200' : 'text-gray-800'}`}>
                  Dark Mode
                </Text>
                <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Switch to dark theme
                </Text>
              </View>
              <Switch
                trackColor={{ false: '#E5E7EB', true: '#3AABCC' }}
                thumbColor={theme === 'dark' ? '#1E293B' : '#ffffff'}
                ios_backgroundColor="#E5E7EB"
                onValueChange={toggleTheme}
                value={isDark}
              />
            </View>

            {settingItem("notifications-outline", "Notifications", "Manage push notifications")}
            {settingItem("language-outline", "Language", "English (United States)")}
          </View>
        </SlideInView>

        {/* Support */}
        <SlideInView direction="up" duration={250} delay={300}>
          <View className={`rounded-2xl p-5 mb-4 mt-4 shadow-sm border ${theme === 'dark' ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
            <View className="flex-row items-center mb-4">
              <Ionicons name="help-circle-outline" size={18} color={theme === 'dark' ? '#fff' : '#3AABCC'} />
              <Text className={`ml-2 text-lg font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-gray-900'}`}>
                Support
              </Text>
            </View>

            {settingItem("information-circle-outline", "About", "Version 1.0.0")}
            {settingItem("document-text-outline", "Terms of Service", "Read our terms")}
            {settingItem("shield-outline", "Privacy Policy", "How we protect your data")}
          </View>
        </SlideInView>

        {/* Danger Zone */}
        <SlideInView direction="up" duration={250} delay={400}>
          <View className={`rounded-2xl p-5 mb-4 mt-4 shadow-sm border ${theme === 'dark' ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
          {/* <View className={`rounded-2xl p-5 mb-4 mt-4 shadow-sm border ${theme === 'dark' ? 'bg-[#18181B] border-[#3F3F46]' : 'bg-white border-gray-100'}`}> */}
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8  items-center justify-center mr-2">
                <Ionicons name="warning" size={18} color="#DC2626" />
              </View>
              <Text className="text-lg font-semibold text-red-600">Danger Zone</Text>
            </View>

            {settingItem("trash-outline", "Delete Account", "Permanently delete your account", undefined, true)}

            <TouchableOpacity className="flex-row items-center py-4" onPress={handleLogout} activeOpacity={0.7}>
              <View className="w-10 h-10 rounded-lg bg-red-50 items-center justify-center mr-3">
                <Ionicons name="log-out-outline" size={22} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-red-600">Logout</Text>
                <Text 
                className={` text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
                >Sign out of your account</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </SlideInView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountSettingsScreen;
