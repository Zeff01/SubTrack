import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { createDocumentSubscription } from "../../../services/userService";
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../../providers/AuthProvider';
import { FadeInView } from '../../components/animated/FadeInView';
import { SlideInView } from '../../components/animated/SlideInView';
import ColorModal from '../../modals/SelectColorModal';

// Constants
const cycles = [
  { key: '1', value: 'Weekly' },
  { key: '2', value: 'Monthly' },
  { key: '3', value: 'Quarterly' },
  { key: '4', value: 'Yearly' },
];

const reminders = [
  { key: '1', value: 'Same day' },
  { key: '2', value: '1 day before' },
  { key: '3', value: '3 days before' },
  { key: '4', value: '1 week before' },
];

const categories = [
  { key: '1', value: 'Entertainment', icon: 'play-circle' },
  { key: '2', value: 'Utilities', icon: 'flash' },
  { key: '3', value: 'Productivity', icon: 'briefcase' },
  { key: '4', value: 'Health & Fitness', icon: 'fitness' },
  { key: '5', value: 'Education', icon: 'school' },
  { key: '6', value: 'Food & Delivery', icon: 'restaurant' },
  { key: '7', value: 'Transportation', icon: 'car' },
  { key: '8', value: 'Shopping', icon: 'cart' },
  { key: '9', value: 'Finance', icon: 'wallet' },
  { key: '10', value: 'Other', icon: 'ellipsis-horizontal' },
];

const defaultIcons = [
  '📺', '💡', '💧', '🔥', '📱', '🎵', '🎮', '📚', 
  '🏋️', '🚗', '🛒', '💳', '🏠', '📡', '☁️', '🎬'
];

const AddSubscriptionScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  // Form states
  const [serviceName, setServiceName] = useState('');
  const [costType, setCostType] = useState<'fixed' | 'variable'>('fixed');
  const [cost, setCost] = useState('');
  const [averageCost, setAverageCost] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [cycle, setCycle] = useState('Monthly');
  const [remindMe, setRemindMe] = useState('1 day before');
  const [category, setCategory] = useState('Entertainment');
  const [selectedIcon, setSelectedIcon] = useState('📺');
  const [selectedColor, setSelectedColor] = useState('#3AABCC');
  const [notes, setNotes] = useState('');
  
  // UI states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Refs for input navigation
  const costRef = useRef<TextInput>(null);
  const averageCostRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    // Validation
    if (!serviceName.trim()) {
      Alert.alert('Error', 'Please enter a service name');
      return;
    }
    
    if (costType === 'fixed' && !cost.trim()) {
      Alert.alert('Error', 'Please enter the cost');
      return;
    }
    
    if (costType === 'variable' && !averageCost.trim()) {
      Alert.alert('Error', 'Please enter the average cost');
      return;
    }
    
    if (!cycle) {
      Alert.alert('Error', 'Please select a billing cycle');
      return;
    }
    
    Keyboard.dismiss();
    setLoading(true);

    try {
      const subscriptionData: any = {
        user_id: user?.uid || '',
        uid: user?.uid || '', // For backward compatibility
        app_name: serviceName.trim(),
        cost: costType === 'fixed' ? cost : averageCost,
        cost_type: costType,
        cycle: cycle.toLowerCase(),
        due_date: dueDate.toLocaleDateString('en-GB'), // DD/MM/YYYY format
        reminder: remindMe,
        remind_me: remindMe, // For backward compatibility
        color: selectedColor,
        selected_color: selectedColor, // For backward compatibility
        category: category,
        icon: selectedIcon,
        notes: notes.trim(),
        status: 'active',
      };
      
      // Only add average_cost if it's a variable cost type
      if (costType === 'variable' && averageCost) {
        subscriptionData.average_cost = averageCost;
      }

      const response = await createDocumentSubscription(subscriptionData);
      
      if (response.success) {
        Alert.alert(
          'Success',
          'Subscription added successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to add subscription');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      setDueDate(selectedDate);
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-white shadow-sm">
          <View className="flex-row items-center justify-between px-4 py-4">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="p-2"
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">Add Subscription</Text>
            <View className="w-10" />
          </View>
        </View>

        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: Platform.OS === 'ios' ? 40 : 60,
            paddingTop: 16
          }}
        >
          {/* Icon and Color Selection */}
          <SlideInView direction="down" duration={250} delay={100}>
            <View className="bg-white mx-4 mb-4 p-4 rounded-2xl border border-gray-100">
              <View className="flex-row items-center justify-center">
                {/* Icon Selector */}
                <TouchableOpacity
                  onPress={() => setShowIconPicker(!showIconPicker)}
                  className="items-center mr-6"
                  activeOpacity={0.7}
                >
                  <View 
                    className="w-20 h-20 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: `${selectedColor}20` }}
                  >
                    <Text className="text-4xl">{selectedIcon}</Text>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">Tap to change</Text>
                </TouchableOpacity>
                
                {/* Color Selector */}
                <TouchableOpacity
                  onPress={() => setShowColorModal(true)}
                  className="items-center"
                  activeOpacity={0.7}
                >
                  <View 
                    className="w-20 h-20 rounded-2xl items-center justify-center border-2"
                    style={{ backgroundColor: selectedColor, borderColor: selectedColor }}
                  >
                    <Ionicons name="color-palette" size={32} color="white" />
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">Change color</Text>
                </TouchableOpacity>
              </View>
              
              {/* Icon Picker */}
              {showIconPicker && (
                <Animatable.View animation="fadeIn" duration={200} className="mt-4 pt-4 border-t border-gray-100">
                  <View className="flex-row flex-wrap justify-center">
                    {defaultIcons.map((icon, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setSelectedIcon(icon);
                          setShowIconPicker(false);
                        }}
                        className="p-3 m-1 rounded-lg hover:bg-gray-100"
                      >
                        <Text className="text-2xl">{icon}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </Animatable.View>
              )}
            </View>
          </SlideInView>

          {/* Service Name */}
          <SlideInView direction="left" duration={250} delay={200}>
            <View className="bg-white mx-4 mb-4 p-4 rounded-2xl border border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-2">Service Name</Text>
              <TextInput
                className="border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                placeholder="e.g., Netflix, Electric Bill, Gym"
                placeholderTextColor="#9CA3AF"
                value={serviceName}
                onChangeText={setServiceName}
                returnKeyType="next"
                onSubmitEditing={() => costRef.current?.focus()}
              />
            </View>
          </SlideInView>

          {/* Category */}
          <SlideInView direction="right" duration={250} delay={250}>
            <View className="bg-white mx-4 mb-4 p-4 rounded-2xl border border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-2">Category</Text>
              <SelectList
                setSelected={setCategory}
                data={categories}
                save="value"
                defaultOption={categories[0]}
                boxStyles={{
                  borderRadius: 12,
                  borderColor: '#E5E7EB',
                  paddingVertical: 12,
                }}
                dropdownStyles={{
                  borderRadius: 12,
                  borderColor: '#E5E7EB',
                }}
              />
            </View>
          </SlideInView>

          {/* Cost Type and Amount */}
          <SlideInView direction="left" duration={250} delay={300}>
            <View className="bg-white mx-4 mb-4 p-4 rounded-2xl border border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-2">Cost Type</Text>
              
              {/* Cost Type Selector */}
              <View className="flex-row space-x-2 mb-4">
                <TouchableOpacity
                  onPress={() => setCostType('fixed')}
                  className={`flex-1 py-3 rounded-xl ${costType === 'fixed' ? 'bg-[#3AABCC]' : 'bg-gray-100'}`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-center font-medium ${costType === 'fixed' ? 'text-white' : 'text-gray-700'}`}>
                    Fixed Cost
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCostType('variable')}
                  className={`flex-1 py-3 rounded-xl ${costType === 'variable' ? 'bg-[#3AABCC]' : 'bg-gray-100'}`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-center font-medium ${costType === 'variable' ? 'text-white' : 'text-gray-700'}`}>
                    Variable Cost
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Cost Input */}
              {costType === 'fixed' ? (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Monthly Cost</Text>
                  <TextInput
                    ref={costRef}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    value={cost}
                    onChangeText={setCost}
                    keyboardType="decimal-pad"
                    returnKeyType="next"
                    onSubmitEditing={() => notesRef.current?.focus()}
                  />
                </View>
              ) : (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Average Monthly Cost</Text>
                  <TextInput
                    ref={averageCostRef}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                    placeholder="Enter average amount"
                    placeholderTextColor="#9CA3AF"
                    value={averageCost}
                    onChangeText={setAverageCost}
                    keyboardType="decimal-pad"
                    returnKeyType="next"
                    onSubmitEditing={() => notesRef.current?.focus()}
                  />
                  <Text className="text-xs text-gray-500 mt-1">
                    For bills that vary each month (electricity, water, etc.)
                  </Text>
                </View>
              )}
            </View>
          </SlideInView>

          {/* Billing Cycle and Due Date */}
          <SlideInView direction="right" duration={250} delay={350}>
            <View className="bg-white mx-4 mb-4 p-4 rounded-2xl border border-gray-100">
              <View className="flex-row">
                {/* Billing Cycle */}
                <View className="flex-1 mr-3">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Billing Cycle</Text>
                  <SelectList
                    setSelected={setCycle}
                    data={cycles}
                    save="value"
                    defaultOption={cycles[1]}
                    boxStyles={{
                      borderRadius: 12,
                      borderColor: '#E5E7EB',
                      paddingVertical: 12,
                    }}
                    dropdownStyles={{
                      borderRadius: 12,
                      borderColor: '#E5E7EB',
                    }}
                  />
                </View>

                {/* Due Date */}
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Due Date</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="border border-gray-200 rounded-xl px-4 py-3.5"
                    activeOpacity={0.7}
                  >
                    <Text className="text-base text-gray-900">
                      {dueDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SlideInView>

          {/* Reminder */}
          <SlideInView direction="left" duration={250} delay={400}>
            <View className="bg-white mx-4 mb-4 p-4 rounded-2xl border border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-2">Reminder</Text>
              <SelectList
                setSelected={setRemindMe}
                data={reminders}
                save="value"
                defaultOption={reminders[1]}
                boxStyles={{
                  borderRadius: 12,
                  borderColor: '#E5E7EB',
                  paddingVertical: 12,
                }}
                dropdownStyles={{
                  borderRadius: 12,
                  borderColor: '#E5E7EB',
                }}
              />
            </View>
          </SlideInView>

          {/* Notes */}
          <SlideInView direction="right" duration={250} delay={450}>
            <View className="bg-white mx-4 mb-4 p-4 rounded-2xl border border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-2">Notes (Optional)</Text>
              <TextInput
                ref={notesRef}
                className="border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                placeholder="Add any additional notes..."
                placeholderTextColor="#9CA3AF"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </SlideInView>

          {/* Submit Button */}
          <SlideInView direction="up" duration={250} delay={500}>
            <View className="mx-4 mt-6">
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className={`bg-[#3AABCC] rounded-xl py-4 ${loading ? 'opacity-70' : ''}`}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    Add Subscription
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </SlideInView>
        </ScrollView>

        {/* Date Picker Modal */}
        {showDatePicker && Platform.OS === 'ios' && (
          <Modal
            transparent
            visible={showDatePicker}
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View className="flex-1 justify-end bg-black/50">
              <View className="bg-white rounded-t-3xl">
                <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text className="text-[#3AABCC] text-base">Cancel</Text>
                  </TouchableOpacity>
                  <Text className="text-base font-semibold">Select Due Date</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text className="text-[#3AABCC] text-base font-semibold">Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={dueDate}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                  style={{ height: 200 }}
                />
              </View>
            </View>
          </Modal>
        )}
        
        {showDatePicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Color Modal */}
        <ColorModal
          visible={showColorModal}
          onClose={() => setShowColorModal(false)}
          onSelect={(color) => {
            setSelectedColor(color);
            setShowColorModal(false);
          }}
          defaultColor={selectedColor}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddSubscriptionScreen;