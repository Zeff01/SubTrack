// import { View, Text, ScrollView, TouchableOpacity, TextInput, Image  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';

import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, Pressable, Alert } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'; // You may need to install this library for dropdowns
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { User } from 'firebase/auth';


import LoginScreen from '../../(screens)/Login';
import { useAuth } from '../../providers/AuthProvider'; // Import your AuthProvider
import { useRoute } from '@react-navigation/native';

import ColorModal from '../../modals/SelectColorModal';
import { useFocusEffect } from '@react-navigation/native';



const EditSubscriptionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [appName, setAppName] = useState('');
  const [cost, setCost] = useState('');
  const [dueDate, setDueDate] =  useState(new Date());
  const [cycle, setCycle] = useState('');
  const [remindMe, setRemindMe] = useState('');
  const [show, setShow] = useState(false);
  const authContext = useAuth();
  const { user, authLoading } = authContext;
  const { subscription } = route.params as { subscription: any };
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#7FB3FF');
  const [userData, setUserData] =  useState<User | null>(null); // ✅ Allow User or null
  
  
  useFocusEffect(
      useCallback(() => {
          setUserData(user);
      }, [authLoading, user])
  );

  if (!user) {
    return <LoginScreen />;
  }

  useEffect(() => {
    if (subscription) {
      const [month, day, year] = subscription.due_date.split('/').map(Number);
      const parsed = new Date(year, month - 1, day); // JS months are 0-based

      setAppName(subscription.app_name);
      setCost(subscription.cost);
      setCycle(subscription.cycle);
      setRemindMe(subscription.remind_me);
      // setRemindMe(getReminderLabel(subscription.remind_me));
      console.log(getReminderLabel(subscription.remind_me))
      setDueDate(parsed);
      setSelectedColor(subscription.selected_color)
     // setDueDate(new Date(subscription.due_date));
    }
  }, [subscription]);

   const onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'set' && date) {
      setDueDate(date);
    }
    setShow(false);
  };


  const getReminderLabel = (key: string) => {
      const reminder = reminders.find(r => r.key === key);
      return reminder ? reminder.value : key;
  };

  const reminders = [
    { key: '1_day_before', value: '1 Day Before' },
    { key: '3_day_before', value: '3 Day Before' },
    { key: '1_week_before', value: '1 Week Before' },
  ];

  const cycles = [
    { key: 'weekly', value: 'Weekly' },
    { key: 'monthly', value: 'Monthly'},
    { key: 'quarterly', value: 'Quarterly'},
    { key: 'yearly', value: 'Yearly' },
  ];

  const defaultReminder = reminders.find(item => item.key === remindMe);
  const defaultCycle = cycles.find(item => item.key === cycle);


  const handleEditSubscription = async () => {
      if (appName === "" || cost === ""  || dueDate.toLocaleDateString() === "" || cycle === ""  || remindMe === "" || selectedColor === "") {
        Alert.alert("Validation", "Please fill in all fields");
        return;
      }
  
      try {
        const user_info = { uid: userData?.uid, app_name: appName, cost: cost, due_date: dueDate.toLocaleDateString(), cycle: cycle, remind_me: remindMe, selected_color : selectedColor }; // shorthand for object properties
       // const response = await createDocumentSubscription(user_info);
        Alert.alert("Success", JSON.stringify(user_info, null, 2));
      //  reset();
      } catch (error) {
        Alert.alert("Error", "An error occurred while logging in.");
      }
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
               Edit Subscription
            </Text>
          </View>
        </View>

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
              <SelectList 
                setSelected={setCycle} 
                data={cycles} 
                placeholder="Select Cycle"
                save="key" // Ensures it saves the key, not value
                defaultOption={defaultCycle}
               />
            </View>


            <View>
              <Text className="text-sm mb-1 mt-4">Remind Me</Text>
              <SelectList 
              setSelected={setRemindMe} 
              data={reminders} 
              placeholder="Select Reminder" 
              save="key" // Ensures it saves the key, not value
              defaultOption={defaultReminder}
              />
            </View>

            
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
              onPress={handleEditSubscription}
            >
              <Text className="text-white text-center text-xl font-bold">Edit Subscription</Text>
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
    </>
  );
};

export default EditSubscriptionScreen;