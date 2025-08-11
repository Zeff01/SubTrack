import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Pressable,
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { createDocumentSubscription } from "../../../services/userService";
import { User } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import ColorModal from '../../modals/SelectColorModal';
import { useAuth } from '../../providers/AuthProvider';
import { cycles, reminders } from '../../modules/constants';

const AddSubscriptionScreen = () => {
  const navigation = useNavigation();
  const [appName, setAppName] = useState('');
  const [cost, setCost] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [cycle, setCycle] = useState('');
  const [remindMe, setRemindMe] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [selectedColor, setSelectedColor] = useState('#7FB3FF');
  const [showModal, setShowModal] = useState(false);
  const { user, authLoading } = useAuth();

  const [errors, setErrors] = useState({
    appName: '',
    cost: '',
    cycle: '',
    remindMe: '',
  });

  useFocusEffect(
    useCallback(() => {
      setUserData(user);
    }, [authLoading, user])
  );

  const onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'set' && date) {
      setDueDate(date);
    }
    setShowDatePicker(false);
  };

  const validate = () => {
    const newErrors: any = {};

    if (!appName.trim()) newErrors.appName = 'App name is required';
    if (!cost.trim()) {
      newErrors.cost = 'Cost is required';
    } else if (isNaN(Number(cost))) {
      newErrors.cost = 'Cost must be a valid number';
    }

    if (!cycle) newErrors.cycle = 'Cycle is required';
    if (!remindMe) newErrors.remindMe = 'Reminder is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setAppName('');
    setCost('');
    setDueDate(new Date());
    setSelectedColor('#7FB3FF');
    //setCycle('');
    //setRemindMe('');
    setErrors({
      appName: '',
      cost: '',
      cycle: '',
      remindMe: '',
    });
  };

  const handleAddSubscription = async () => {
    if (!validate()) return;

    try {
      const payload = {
        uid: userData?.uid,
        app_name: appName,
        cost: cost,
        due_date: dueDate.toLocaleDateString(),
        cycle: cycle,
        remind_me: remindMe,
        selected_color: selectedColor,
      };

      await createDocumentSubscription(payload);
      Alert.alert('Success', 'Subscription added successfully!');
      resetForm();
    } catch (err) {
      Alert.alert('Error', 'Failed to add subscription.');
    }
  };

  return (
    <>
      <View className="pt-12 pb-6 px-6 bg-[#D9D9D9] rounded-b-3xl">
        <View className="relative items-center justify-center">
          <Text className="text-xl font-semibold text-gray-800">Add Subscription</Text>
        </View>
      </View>

      <ScrollView>
        <View className="flex-1 bg-white p-4">

          {/* App Name */}
          <Text className="text-sm mb-1 mt-4">App Name</Text>
          <TextInput
            className="border border-gray-400 rounded-xl p-4"
            placeholder="Enter app name"
            value={appName}
            onChangeText={(text) => {
              setAppName(text);
              setErrors({ ...errors, appName: '' });
            }}
          />
          <Text className={`text-red-500 ${errors.appName ? '' : 'invisible'}`}>
            {errors.appName || 'placeholder'}
          </Text>

          {/* Cost */}
          <Text className="text-sm mb-1 mt-1">Cost</Text>
          <TextInput
            className="border border-gray-400 rounded-xl p-4"
            placeholder="Enter cost"
            keyboardType="numeric"
            value={cost}
            onChangeText={(text) => {
              setCost(text);
              setErrors({ ...errors, cost: '' });
            }}
          />
          <Text className={`text-red-500 ${errors.cost ? '' : 'invisible'}`}>
            {errors.cost || 'placeholder'}
          </Text>

          {/* Due Date */}
          <Text className="text-sm mb-1 mt-1">Due Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="border border-gray-400 rounded-xl p-4"
          >
            <Text>{dueDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {/* Cycle */}
          <Text className="text-sm mb-1 mt-3">Cycle</Text>
          <SelectList
            setSelected={(val: string) => {
              setCycle(val);
              setErrors({ ...errors, cycle: '' });
            }}
            data={cycles}
            placeholder="Select cycle"
            boxStyles={{ borderColor: errors.cycle ? 'red' : '#ccc' }}
          />
          <Text className={`text-red-500 ${errors.cycle ? '' : 'invisible'}`}>
            {errors.cycle || 'placeholder'}
          </Text>

          {/* Reminder */}
          <Text className="text-sm mb-1 mt-1">Remind Me</Text>
          <SelectList
            setSelected={(val: string) => {
              setRemindMe(val);
              setErrors({ ...errors, remindMe: '' });
            }}
            data={reminders}
            placeholder="Select reminder"
            boxStyles={{ borderColor: errors.remindMe ? 'red' : '#ccc' }}
          />
          <Text className={`text-red-500 mb-1 ${errors.remindMe ? '' : 'invisible'}`}>
            {errors.remindMe || 'placeholder'}
          </Text>

          {/* Color Picker */}
          <Pressable
            onPress={() => setShowModal(true)}
            className="mt-4 px-4 py-3 rounded-lg"
            style={{ backgroundColor: selectedColor }}
          >
            <Text className="text-white text-center font-bold">Selected Color</Text>
          </Pressable>

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-[#3AABCC] rounded-lg p-3 mt-6"
            onPress={handleAddSubscription}
          >
            <Text className="text-white text-center text-xl font-bold">Add Subscription</Text>
          </TouchableOpacity>

          {/* Color Modal */}
          <ColorModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            onSelect={setSelectedColor}
            defaultColor="#7FB3FF"
          />

          {/* Date Picker */}
          {showDatePicker && (
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
