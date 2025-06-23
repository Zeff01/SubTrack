import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { updateDocumentSubscription, deleteDocumentSubscription } from '../../../services/userService';

export default function SubscriptionDetail() {
  const router = useRouter();
  const { id, uid, platform, cycle, cost, created_at } = useLocalSearchParams();

  
  const [selectedUID, setSelectedUID] = useState(uid as string);
  const [selectedPlatform, setSelectedPlatform] = useState(platform as string);
  const [selectedCycle, setSelectedCycle] = useState(cycle as string);
  const [inputCost, setInputCost] = useState(cost as string);
  const [selectedDate, setSelectedDate] = useState(new Date(created_at as string));
  const [show, setShow] = useState(false);

  const onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'set' && date) {
      setSelectedDate(date);
    }
    setShow(false);
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        platform: selectedPlatform,
        cycle: selectedCycle,
        cost: inputCost,
        subscription_date: selectedDate.toLocaleDateString(),
      };

      await updateDocumentSubscription(id, updatedData); // Call your Firebase update method
      Alert.alert("Success", "Subscription updated.");
      router.replace("/(tabs)/stacks");
    } catch (error) {
      Alert.alert("Error", "Failed to update subscription.");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${platform}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteDocumentSubscription(id);
            router.replace("/(tabs)/stacks");
          },
        },
      ]
    );
  };

  return (
    <View className="bg-black flex-1 px-6 py-10 ">
      <Text className="text-white text-2xl font-bold mb-4 mt-10">Edit Subscription</Text>

      {/* Platform Picker */}
      <Text className="text-white text-lg font-semibold">Platform</Text>
      <View className="bg-gray-800 rounded-lg mt-1 mb-4">
        <Picker
          selectedValue={selectedPlatform}
          onValueChange={setSelectedPlatform}
          style={{ color: '#FFFFFF' }}
        >
          <Picker.Item label="Platform 1" value="Platform 1" />
          <Picker.Item label="Platform 2" value="Platform 2" />
        </Picker>
      </View>

      {/* Cycle Picker */}
      <Text className="text-white text-lg font-semibold">Billing Cycle</Text>
      <View className="bg-gray-800 rounded-lg mt-1 mb-4">
        <Picker
          selectedValue={selectedCycle}
          onValueChange={setSelectedCycle}
          style={{ color: '#FFFFFF' }}
        >
          <Picker.Item label="Cycle 1" value="Cycle 1" />
          <Picker.Item label="Cycle 2" value="Cycle 2" />
        </Picker>
      </View>

      {/* Cost Input */}
      <Text className="text-white text-lg font-semibold">Cost</Text>
      <TextInput
        className="text-white p-3 bg-gray-800 rounded-lg mb-4"
        keyboardType="numeric"
        value={inputCost}
        placeholder="0.00"
        placeholderTextColor="#AAAAAA"
        onChangeText={(val) => setInputCost(val.replace(/[^0-9.]/g, ''))}
      />

      {/* Date Picker */}
      <Text className="text-white text-lg font-semibold">Due Date</Text>
      <TouchableOpacity onPress={() => setShow(true)} className="bg-gray-800 p-3 rounded-lg mb-4">
        <Text className="text-white">{selectedDate.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {/* <Text className="text-white text-center font-semibold">{selectedUID}</Text> */}

      {/* Update Button */}
      <TouchableOpacity onPress={handleUpdate} className="bg-blue-600 p-3 rounded mb-4">
        <Text className="text-white text-center font-semibold">Update Subscription</Text>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity onPress={handleDelete} className="bg-red-600 p-3 rounded">
        <Text className="text-white text-center font-semibold">Delete Subscription</Text>
      </TouchableOpacity>
    </View>
  );
}
