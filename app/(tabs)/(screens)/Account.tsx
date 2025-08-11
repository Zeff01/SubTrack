import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { signOut } from 'firebase/auth';
import { auth } from "../../../config/firebase"; // Assuming db is not needed here


const AccountSettingsScreen = () => {
  const navigation = useNavigation();

  const [isEnabledAuth, setIsEnabledAuth] = React.useState(false);
  const [isEnabledMode, setIsEnabledMode] = React.useState(false);
  const toggleSwitchAuth = () => setIsEnabledAuth(prev => !prev);
  const toggleSwitchMode = () => setIsEnabledMode(prev => !prev);


   const handleLogout = async () => {
    try {
      await signOut(auth);
     // (navigation as any).navigate('Login')
      (navigation as any).navigate('App', { screen: 'Login' });
      Alert.alert("Logged out", "You have been signed out.");
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
      console.error("Logout error:", error);
    }
  };

  return (
    <>
    <View className="flex-1 bg-white">
       <View className="pt-12 pb-6 px-6 bg-[#D9D9D9] rounded-b-3xl">
          <View className="relative items-center justify-center">
            {/* <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute left-0 px-4"
            >
              <Ionicons name="chevron-back" size={25} color="black" />
            </TouchableOpacity> */}
            <Text className="text-xl font-semibold text-gray-800">
               Account Settings
            </Text>
          </View>
        </View> 
    <ScrollView className="flex-1 bg-white px-4">
      {/* Account Security */}
      <View className="rounded-2xl py-6  px-4 mb-6 shadow-md  bg-white mt-10">
        <Text className="text-xl font-semibold mb-4">Account Security</Text>
  
   
       
    

         <TouchableOpacity
            className="flex-row justify-between items-center py-4 border-b border-gray-100"
            onPress={() => (navigation as any).navigate('Account', { screen: 'update_profile' })}
          >
            <View>
              <Text className="font-medium">Update Profile</Text>
              <Text className="text-gray-500 text-sm">Update your profile</Text>
            </View>
            <Text className="text-gray-400 text-xl">{'›'}</Text>
          </TouchableOpacity>

           <TouchableOpacity
            className="flex-row justify-between items-center py-4 border-b border-gray-100"
            onPress={() => (navigation as any).navigate('Account', { screen: 'update_password' })}
          >
            <View>
              <Text className="font-medium">Change Password</Text>
              <Text className="text-gray-500 text-sm">Update your password regularly</Text>
            </View>
            <Text className="text-gray-400 text-xl">{'›'}</Text>
          </TouchableOpacity>

           <TouchableOpacity
            className="flex-row justify-between items-center py-4 border-b border-gray-100"
          >
            <View>
              <Text className="font-medium">Login Activity</Text>
              <Text className="text-gray-500 text-sm">View recent logins</Text>
            </View>
            <Text className="text-gray-400 text-xl">{'›'}</Text>
          </TouchableOpacity>

        <View className="flex-row justify-between items-center py-4">
          <View>
            <Text className="font-medium">Two-Factor Authentication</Text>
            <Text className="text-gray-500 text-sm">Extra layer of security</Text>
          </View>
          <Switch
            trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
            thumbColor="#ffffff"
            ios_backgroundColor="#e5e7eb"
            onValueChange={toggleSwitchAuth}
            value={isEnabledAuth}
          />
        </View>
      </View>

      {/* Preferences */}
      <View className="bg-white rounded-2xl py-6 px-4 mb-6 shadow-md">
        <Text className="text-xl font-semibold mb-4">Preferences</Text>

        {[
          {
            title: 'Dark Mode',
            subtitle: 'Switch to dark theme',
            type: 'switch',
          },
          {
            title: 'Notifications',
            subtitle: 'Manage notifications',
          },
          {
            title: 'Language',
            subtitle: 'English (United States)',
          },
        ].map((item, idx) =>
          item.type === 'switch' ? (
            <View
              key={idx}
              className="flex-row justify-between items-center py-4 border-b border-gray-100"
            >
              <View>
                <Text className="font-medium">{item.title}</Text>
                <Text className="text-gray-500 text-sm">{item.subtitle}</Text>
              </View>
              <Switch
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#e5e7eb"
                onValueChange={toggleSwitchMode}
                value={isEnabledMode}
              />
            </View>
          ) : (
            <TouchableOpacity
              key={idx}
              className={`flex-row justify-between items-center py-4 ${
                idx < 2 ? 'border-b border-gray-100' : ''
              }`}
            >
              <View>
                <Text className="font-medium">{item.title}</Text>
                <Text className="text-gray-500 text-sm">{item.subtitle}</Text>
              </View>
              <Text className="text-gray-400 text-xl">{'›'}</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Danger Zone */}
      <View className="bg-white rounded-2xl py-6 px-4  shadow-md border border-red-200 mb-10">
        <Text className="text-xl font-semibold mb-4 text-red-600">Danger Zone</Text>


          <TouchableOpacity
            className={`flex-row justify-between items-center py-4 border-b border-red-100`}
          >
            <View>
              <Text className="font-medium text-red-600">Delete Account</Text>
              <Text className="text-gray-500 text-sm">Permanently delete your account</Text>
            </View>
            <Text className="text-red-400 text-xl">{'›'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-row justify-between items-center py-4`}
            onPress={handleLogout} 
          >
            <View>
              <Text className="font-medium text-red-600">Logout</Text>
          
            </View>
            <Text className="text-red-400 text-xl">{'›'}</Text>
          </TouchableOpacity>
      </View>
    </ScrollView>
     </View>
        </>
  );
};

export default AccountSettingsScreen;
