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

import { updateDocumentSubscription } from '../../../services/userService';
import { cycles, reminders, payments } from '../../modules/constants'; // Adjust path as needed


const EditSubscriptionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [appName, setAppName] = useState('');
  const [cost, setCost] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [cycle, setCycle] = useState('');
  const [remindMe, setRemindMe] = useState('');
  const [show, setShow] = useState(false);
  const [id, setID] = useState(0);
  const authContext = useAuth();
  const { user, authLoading } = authContext;
  const { subscription } = route.params as { subscription: any };
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#7FB3FF');
  const [userData, setUserData] =  useState<User | null>(null); // ✅ Allow User or null
  const [paymentStatus, setPaymentStatus] = useState('');
  
  
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
      setAppName(subscription.app_name);
      setCost(subscription.cost);
      setCycle(subscription.cycle);
      setRemindMe(subscription.remind_me);
      setDueDate(convertToUSDateFormat(subscription.due_date));
      setSelectedColor(subscription.selected_color);
      setID(subscription.id);
     // setPaymentStatus(subscription.payment_status);
    }
  }, [subscription]);

  function convertToUSDateFormat(dateStr: string): Date {
    const [month, day, year] = dateStr.split('/');
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    // Create and return a Date object
    return new Date(yearNum, monthNum - 1, dayNum); // month is 0-based
  }


   const onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'set' && date) {
      setDueDate(date);
    }
    setShow(false);
  };



  const defaultReminder = reminders.find(item => item.key === remindMe);
  const defaultCycle = cycles.find(item => item.key === cycle);
  const defaultPayment = payments.find(item => item.key === paymentStatus);



  const handleEditSubscription = async () => {
      if (appName === "" || cost === ""  || dueDate?.toLocaleDateString() === "" || cycle === ""  || remindMe === "" || selectedColor === "") {
        Alert.alert("Validation", "Please fill in all fields");
        return;
      }
  
      try {
        const subscription_data = { uid: userData?.uid, app_name: appName, cost: cost, due_date: dueDate?.toLocaleDateString(), cycle: cycle, remind_me: remindMe, selected_color : selectedColor }; // shorthand for object properties
        const response = await updateDocumentSubscription(id, subscription_data); // Call your Firebase update method
        Alert.alert("Success", JSON.stringify(subscription_data, null, 2));
        // (navigation as any).navigate('MainTabsSubscriptions', { screen: 'subscriptions' })
        (navigation as any).navigate('MainTabs', {
          screen: 'Subscriptions',
          params: {
            screen: 'subscriptions',
          },
        });
      //  reset();
      } catch (error) {
        Alert.alert("Error", "An error occurred while logging in.");
      }
  };

return (
  <>
    <View className="flex-1 bg-white">
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
                  <Text className="text-black">{dueDate?.toLocaleDateString()}</Text>
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

            {/* <View>
                <Text className="text-sm mb-1 mt-4">Payment Status</Text>
                <SelectList 
                setSelected={setPaymentStatus} 
                data={payments}
                placeholder="Select Payment Status"
                save="key" // Ensures it saves the key, not value
                defaultOption={defaultPayment}
                 />
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
              onPress={handleEditSubscription}
            >
              <Text className="text-white text-center text-xl font-bold">Update Subscription</Text>
            </TouchableOpacity>

             <ColorModal
              visible={showModal}
              onClose={() => setShowModal(false)}
              onSelect={setSelectedColor}
              defaultColor={subscription.selected_color}
            />

             {show && (
                <DateTimePicker
                  value={dueDate!}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
        </View>
      </View>
    </>
  );
};

export default EditSubscriptionScreen;