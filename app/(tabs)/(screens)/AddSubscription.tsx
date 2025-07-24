// import { View, Text, ScrollView, TouchableOpacity, TextInput, Image  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';

import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'; // You may need to install this library for dropdowns
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { useNavigation } from '@react-navigation/native';

const AddSubscriptionScreen = () => {
  const navigation = useNavigation();
  const [appName, setAppName] = useState('');
  const [cost, setCost] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [cycle, setCycle] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [remindMe, setRemindMe] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [show, setShow] = useState(false);


  // Placeholder options for dropdowns

   const onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'set' && date) {
      setSelectedDate(date);
    }
    setShow(false);
  };

  //  const appNames = [
  //   { key: '1', value: 'App 1' },
  //   { key: '2', value: 'App 2' },
  // ];
  const cycles = [
    { key: '1', value: 'Monthly' },
    { key: '2', value: 'Yearly' },
  ];
  const paymentMethods = [
    { key: '1', value: 'Credit Card' },
    { key: '2', value: 'PayPal' },
  ];
  const reminders = [
    { key: '1', value: '1 Day Before' },
    { key: '2', value: '1 Week Before' },
  ];

  const handleAddSubscription = () => {
    // Your logic to handle adding the subscription
    // console.log({
    //   appName,
    //   cost,
    //   dueDate,
    //   cycle,
    //   paymentMethod,
    //   remindMe,
    // });
  };
  

return (
  <>
        <View className="pt-12 pb-6 px-6 bg-[#D9D9D9] rounded-b-3xl">
          <View className="relative items-center justify-center">
            {/* <TouchableOpacity
             // onPress={() => navigation.goBack()}
              onPress={() => (navigation as any).navigate('Home')}
              className="absolute left-0 px-4"
            >
              <Ionicons name="chevron-back" size={25} color="black" />
            </TouchableOpacity> */}
            <Text className="text-xl font-semibold text-gray-800">
               Add Subscription
            </Text>
          </View>
        </View>

        <View className="flex-1 bg-white p-4">
            <View>
              <Text className="text-sm mb-1 mt-4">Cost</Text>
              <TextInput 
                className="border border-gray-600 rounded-xl p-4" 
                placeholder="Enter cost" 
                keyboardType="numeric"
                value={cost}
                onChangeText={setCost}
              />
            </View>

             <View>
              <Text className="text-sm mb-1 mt-4">App Name</Text>
              <TextInput 
                className="border border-gray-600 rounded-xl p-4" 
                placeholder="Enter cost" 
                keyboardType="numeric"
                value={appName}
                onChangeText={setAppName}
              />
            </View>

            {/* <View >
              <Text className="text-sm mb-1 mt-3">App Name</Text>
              <SelectList setSelected={setAppName} data={appNames} placeholder="Select App" />
            </View> */}

            <View>
                <Text className="text-sm mb-1 mt-4">Due Date</Text>
                <TouchableOpacity onPress={() => setShow(true)} 
                  className="border border-gray-600 rounded-xl p-4" 
                >
                  <Text className="text-black">{selectedDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
            </View>

            <View>
              <Text className="text-sm mb-1 mt-4">Cycle</Text>
              <SelectList setSelected={setCycle} data={cycles} placeholder="Select Cycle" />
            </View>

            <View>
              <Text className="text-sm mb-1 mt-4">Payment Method</Text>
              <SelectList setSelected={setPaymentMethod} data={paymentMethods} placeholder="Select Payment" />
            </View>

            <View>
              <Text className="text-sm mb-1 mt-4">Remind Me</Text>
              <SelectList setSelected={setRemindMe} data={reminders} placeholder="Select Reminder" />
            </View>

            <TouchableOpacity 
              className="bg-[#3AABCC] rounded-lg p-3 mt-6"
              onPress={handleAddSubscription}
            >
              <Text className="text-white text-center text-xl font-bold">Add Subscription</Text>
            </TouchableOpacity>

             {show && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
        </View>
    </>
  );
};

export default AddSubscriptionScreen;