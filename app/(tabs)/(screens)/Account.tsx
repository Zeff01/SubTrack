import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from "../../../config/firebase";
import { FadeInView } from '../../components/animated/FadeInView';
import { SlideInView } from '../../components/animated/SlideInView';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';

const AccountSettingsScreen = () => {
  const navigation = useNavigation();

  const [isEnabledAuth, setIsEnabledAuth] = React.useState(false);
  const [isEnabledMode, setIsEnabledMode] = React.useState(false);
  const toggleSwitchAuth = () => setIsEnabledAuth(prev => !prev);
  const toggleSwitchMode = () => setIsEnabledMode(prev => !prev);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              // Navigation handled by auth state change
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
      className={`flex-row items-center py-4 ${danger ? '' : 'border-b border-gray-100'}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${danger ? 'bg-red-50' : 'bg-gray-100'}`}>
        <Ionicons name={icon as any} size={22} color={danger ? '#DC2626' : '#374151'} />
      </View>
      <View className="flex-1">
        <Text className={`font-medium ${danger ? 'text-red-600' : 'text-gray-900'}`}>{title}</Text>
        <Text className="text-gray-500 text-sm">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={danger ? '#DC2626' : '#9CA3AF'} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="pb-6 px-6 bg-white shadow-sm">
        <FadeInView duration={300}>
          <Text className="text-2xl font-bold text-gray-900 text-center">
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
          <View className="bg-white rounded-2xl p-5 mb-4 mt-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 bg-[#3AABCC]/10 rounded-lg items-center justify-center mr-2">
                <Ionicons name="shield-checkmark" size={18} color="#3AABCC" />
              </View>
              <Text className="text-lg font-semibold text-gray-900">Account Security</Text>
            </View>
            
            {settingItem("person-outline", "Update Profile", "Change your name and email"
              , () => (navigation as any).navigate('Account', { screen: 'update_profile' }))}
            
            {settingItem("lock-closed-outline", "Change Password", "Update your password regularly"
              , () => (navigation as any).navigate('Account', { screen: 'update_password' }))}
            
            {settingItem("time-outline", "Login Activity", "View recent login sessions")}
            
            {/* Two-Factor Auth */}
            <View className="flex-row items-center py-4">
              <View className="w-10 h-10 rounded-lg bg-gray-100 items-center justify-center mr-3">
                <Ionicons name="key-outline" size={22} color="#374151" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-900">Two-Factor Authentication</Text>
                <Text className="text-gray-500 text-sm">Extra layer of security</Text>
              </View>
              <Switch
                trackColor={{ false: '#E5E7EB', true: '#3AABCC' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
                onValueChange={toggleSwitchAuth}
                value={isEnabledAuth}
              />
            </View>
          </View>
        </SlideInView>

        {/* Preferences */}
        <SlideInView direction="up" duration={250} delay={200}>
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 bg-[#3AABCC]/10 rounded-lg items-center justify-center mr-2">
                <Ionicons name="settings-outline" size={18} color="#3AABCC" />
              </View>
              <Text className="text-lg font-semibold text-gray-900">Preferences</Text>
            </View>

            {/* Dark Mode */}
            <View className="flex-row items-center py-4 border-b border-gray-100">
              <View className="w-10 h-10 rounded-lg bg-gray-100 items-center justify-center mr-3">
                <Ionicons name="moon-outline" size={22} color="#374151" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-900">Dark Mode</Text>
                <Text className="text-gray-500 text-sm">Switch to dark theme</Text>
              </View>
              <Switch
                trackColor={{ false: '#E5E7EB', true: '#3AABCC' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#E5E7EB"
                onValueChange={toggleSwitchMode}
                value={isEnabledMode}
              />
            </View>

            {settingItem("notifications-outline", "Notifications", "Manage push notifications")}
            {settingItem("language-outline", "Language", "English (United States)")}
          </View>
        </SlideInView>

        {/* Support */}
        <SlideInView direction="up" duration={250} delay={300}>
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 bg-[#3AABCC]/10 rounded-lg items-center justify-center mr-2">
                <Ionicons name="help-circle-outline" size={18} color="#3AABCC" />
              </View>
              <Text className="text-lg font-semibold text-gray-900">Support</Text>
            </View>

            {settingItem("information-circle-outline", "About", "Version 1.0.0")}
            {settingItem("document-text-outline", "Terms of Service", "Read our terms")}
            {settingItem("shield-outline", "Privacy Policy", "How we protect your data")}
          </View>
        </SlideInView>

        {/* Danger Zone */}
        <SlideInView direction="up" duration={250} delay={400}>
          <View className="bg-white rounded-2xl p-5 shadow-sm border border-red-100 mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 bg-red-50 rounded-lg items-center justify-center mr-2">
                <Ionicons name="warning" size={18} color="#DC2626" />
              </View>
              <Text className="text-lg font-semibold text-red-600">Danger Zone</Text>
            </View>

            {settingItem("trash-outline", "Delete Account", "Permanently delete your account", undefined, true)}
            
            <TouchableOpacity
              className="flex-row items-center py-4"
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-lg bg-red-50 items-center justify-center mr-3">
                <Ionicons name="log-out-outline" size={22} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-red-600">Logout</Text>
                <Text className="text-gray-500 text-sm">Sign out of your account</Text>
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