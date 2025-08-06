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

  const [errors, setErrors] = useState({
    appName: '',
    cost: '',
    dueDate: '',
    cycle: '',
    remindMe: '',
    selectedColor: '',
  });
  
  
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
  if (!validateForm()) return;

  try {
    const subscription_data = {
      uid: userData?.uid,
      app_name: appName,
      cost,
      due_date: dueDate?.toLocaleDateString(),
      cycle,
      remind_me: remindMe,
      selected_color: selectedColor,
    };

    await updateDocumentSubscription(id, subscription_data);

    Alert.alert("Success", "Subscription updated successfully!");
    (navigation as any).navigate('MainTabs', {
      screen: 'Subscriptions',
      params: { screen: 'subscriptions' },
    });

  } catch (error) {
    Alert.alert("Error", "An error occurred while updating the subscription.");
  }
};


  const validateForm = () => {
  const newErrors: any = {};

  if (!appName.trim()) newErrors.appName = 'App name is required';
  if (!cost.trim()) newErrors.cost = 'Cost is required';
  else if (isNaN(Number(cost))) newErrors.cost = 'Cost must be a number';

  if (!dueDate) newErrors.dueDate = 'Due date is required';
  if (!cycle) newErrors.cycle = 'Cycle selection is required';
  if (!remindMe) newErrors.remindMe = 'Reminder selection is required';
  if (!selectedColor) newErrors.selectedColor = 'Color is required';

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
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
                  value={appName}
                  onChangeText={(text) => {
                    setAppName(text);
                    setErrors({ ...errors, appName: '' });
                  }}
                />
                <Text className={`text-red-500 text-sm  ${errors.appName ? '' : 'invisible'}`}>
                  {errors.appName || 'placeholder'}
                </Text>
            </View>

            <View>
              <Text className="text-sm mb-1 mt-1">Cost</Text>
              <TextInput
                className="border border-gray-600 rounded-xl p-4"
                placeholder="Enter Cost"
                keyboardType="numeric"
                value={cost}
                onChangeText={(text) => {
                  setCost(text);
                  setErrors({ ...errors, cost: '' });
                }}
              />
              <Text className={`text-red-500 text-sm mt-1 ${errors.cost ? '' : 'invisible'}`}>
                {errors.cost || 'placeholder'}
              </Text>

            </View>

            <View>
                <Text className="text-sm  ">Due Date</Text>
                <TouchableOpacity
                  onPress={() => setShow(true)}
                  className="border border-gray-600 rounded-xl p-4"
                >
                  <Text className="text-black">
                    {dueDate?.toLocaleDateString() || 'Select Due Date'}
                  </Text>
                </TouchableOpacity>
                <Text className={`text-red-500 text-sm ${errors.dueDate ? '' : 'invisible'}`}>
                  {errors.dueDate || 'placeholder'}
                </Text>
            </View>

            <View>
              <Text className="text-sm mb-1 ">Cycle</Text>
              <SelectList
                setSelected={(val : any) => {
                  setCycle(val);
                  setErrors({ ...errors, cycle: '' });
                }}
                data={cycles}
                placeholder="Select Cycle"
                save="key"
                defaultOption={defaultCycle}
              />
              <Text className={`text-red-500 text-sm  ${errors.cycle ? '' : 'invisible'}`}>
                {errors.cycle || 'placeholder'}
              </Text>

            </View>


            <View>
              <Text className="text-sm mb-1 mt-1">Remind Me</Text>
              <SelectList
                setSelected={(val : any) => {
                  setRemindMe(val);
                  setErrors({ ...errors, remindMe: '' });
                }}
                data={reminders}
                placeholder="Select Reminder"
                save="key"
                defaultOption={defaultReminder}
              />
              <Text className={`text-red-500 text-sm ${errors.remindMe ? '' : 'invisible'}`}>
                {errors.remindMe || 'placeholder'}
              </Text>

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
                onPress={() => {
                  setShowModal(true);
                  setErrors({ ...errors, selectedColor: '' });
                }}
                className="mt-4 px-4 py-3 rounded-lg"
                style={{ backgroundColor: selectedColor }}
              >
                <Text className="text-white text-center font-bold">Selected Color</Text>
              </Pressable>
              <Text className={`text-red-500 text-sm  ${errors.selectedColor ? '' : 'invisible'}`}>
                {errors.selectedColor || 'placeholder'}
              </Text>

              {/* {color && <Text className="mt-4 text-white  px-4 py-3 rounded-lg text-center"  style={{ backgroundColor: `${color}`}} >Selected Color: {color}</Text>} */}
            </View>

            <TouchableOpacity 
              className="bg-[#3AABCC] rounded-lg p-3 mt-1"
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