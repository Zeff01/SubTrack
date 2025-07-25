// import { View, Text, ScrollView, TouchableOpacity, TextInput, Image  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, Alert, ScrollView, Pressable } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'; // You may need to install this library for dropdowns
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { createDocumentSubscription } from "../../../services/userService.js";
import { User } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import ColorModal from '../../modals/SelectColorModal';
import { useAuth } from '../../providers/AuthProvider';

import { cycles, reminders } from '../../modules/constants'; // Adjust path as needed

const AddSubscriptionScreen = () => {
  const navigation = useNavigation();
  const [appName, setAppName] = useState('');
  const [cost, setCost] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [cycle, setCycle] = useState('');
  const [remindMe, setRemindMe] = useState('');
  const [show, setShow] = useState(false);
  const [userData, setUserData] =  useState<User | null>(null); // ✅ Allow User or null
  const [selectedColor, setSelectedColor] = useState('#7FB3FF');
  const [showModal, setShowModal] = useState(false);
  const { user, authLoading } = useAuth();

  useFocusEffect(
      useCallback(() => {
          setUserData(user);
      }, [authLoading, user])
  );

   const onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'set' && date) {
      setDueDate(date);
    }
    setShow(false);
  };


  const reset = async () => {
      setAppName('');
      setCost('');
      setDueDate(new Date());
      setSelectedColor('#7FB3FF');
      // setCycle('');
      // setRemindMe('');
  }

  const handleAddSubscription = async () => {
      if (appName === "" || cost === ""  || dueDate.toLocaleDateString() === "" || cycle === ""  || remindMe === "" || selectedColor === "") {
        Alert.alert("Validation", "Please fill in all fields");
        return;
      }
  
      try {
        const user_info = { uid: userData?.uid, app_name: appName, cost: cost, due_date: dueDate.toLocaleDateString(), cycle: cycle, remind_me: remindMe, selected_color : selectedColor }; // shorthand for object properties
        const response = await createDocumentSubscription(user_info);
        Alert.alert("Success", JSON.stringify(user_info, null, 2));
        reset();
      } catch (error) {
        Alert.alert("Error", "An error occurred while logging in.");
      }
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

        <ScrollView>
        <View className="flex-1 bg-white p-4">
          
             <View>
              <Text className="text-sm mb-1 mt-4">App Name</Text>
              <TextInput 
                className="border border-gray-600 rounded-xl p-4" 
                placeholder="Enter App Name" 
                keyboardType="default"  // ✅ Optional, can also be removed
                value={appName}
                onChangeText={setAppName}
              />
            </View>
            
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

            {/* <View >
              <Text className="text-sm mb-1 mt-3">App Name</Text>
              <SelectList setSelected={setAppName} data={appNames} placeholder="Select App" />
            </View> */}

            <View>
                <Text className="text-sm mb-1 mt-4">Due Date</Text>
                <TouchableOpacity onPress={() => setShow(true)} 
                  className="border border-gray-600 rounded-xl p-4" 
                >
                  <Text className="text-black">{dueDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
            </View>

            <View>
              <Text className="text-sm mb-1 mt-4">Cycle</Text>
              <SelectList setSelected={setCycle} data={cycles} placeholder="Select Cycle" />
            </View>

            <View>
              <Text className="text-sm mb-1 mt-4">Remind Me</Text>
              <SelectList setSelected={setRemindMe} data={reminders} placeholder="Select Reminder" />
            </View>

  
           {/* <View className="h-96">
            <ColorPicker
              color={selectedColor}
              onColorChange={setSelectedColor}
              thumbSize={40}
              sliderSize={40}
              noSnap={true}
              row={false}
              swatches={false}
              discrete={false}
            />
            <Text className="my-2 text-lg">Selected Color: {selectedColor}</Text>
            <Button title="Save Color" onPress={() => alert(`Saving color: ${selectedColor}`)} />
          </View> */}

          <View>
            <Pressable
              onPress={() => setShowModal(true)}
              //className={`mt-5 px-4 py-3 rounded-lg bg-[${color}]`}
              className={`mt-4 px-4 py-3 rounded-lg bg-blue-400`}
              style={{ backgroundColor: `${selectedColor}`}}
            >
              <Text className="text-white text-center font-bold">Selected Color</Text>
            </Pressable>
            {/* {color && <Text className="mt-4 text-white  px-4 py-3 rounded-lg text-center"  style={{ backgroundColor: `${color}`}} >Selected Color: {color}</Text>} */}
          </View>

    

            <TouchableOpacity 
              className="bg-[#3AABCC] rounded-lg p-3 mt-6"
              onPress={handleAddSubscription}
            >
              <Text className="text-white text-center text-xl font-bold">Add Subscription</Text>
            </TouchableOpacity>

            <ColorModal
              visible={showModal}
              onClose={() => setShowModal(false)}
              onSelect={setSelectedColor}
            />

             {show && (
                <DateTimePicker
                  value={dueDate}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
        </View>
        </ScrollView>
    </>
  );
};

export default AddSubscriptionScreen;