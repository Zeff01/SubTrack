import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, Platform, KeyboardAvoidingView, Modal, ScrollView, Keyboard, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from '../../(screens)/Login';
import { useAuth } from '../../providers/AuthProvider';
import { useRoute } from '@react-navigation/native';
import ColorModal from '../../modals/SelectColorModal';
import { useFocusEffect } from '@react-navigation/native';
import { updateDocumentSubscription } from '../../../services/userService';
import { cycles, reminders, categories, defaultIcons } from '../../modules/constants';
import { SlideInView } from '../../components/animated/SlideInView';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../../providers/ThemeProvider';

const EditSubscriptionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [cost, setCost] = useState('');
  const [cycle, setCycle] = useState('');
  const [remindMe, setRemindMe] = useState('');
  const authContext = useAuth();
  const { user } = authContext;
  const { subscription } = route.params as { subscription: any };
  const [selectedColor, setSelectedColor] = useState('#7FB3FF');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('📺');
  const [showColorModal, setShowColorModal] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [costType, setCostType] = useState<'fixed' | 'variable'>('fixed');
  const [averageCost, setAverageCost] = useState('0');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('Entertainment');

  const costRef = useRef<TextInput>(null);
  const averageCostRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
        app_name: serviceName.trim(),
        cost: costType === 'fixed' ? cost : "0",
        average_cost: costType === 'variable' ? averageCost : "0",
        cost_type: costType,
        cycle: cycle.toLowerCase(),
        due_date: dueDate?.toLocaleDateString('en-US'), // MM/DD/YYYY
        reminder: remindMe,
        color: selectedColor,
        selected_color: selectedColor,
        category: category,
        icon: selectedIcon,
        notes: notes.trim(),
        status: 'active',
      };

      const response = await updateDocumentSubscription(subscription.id, subscriptionData);

      if (response.success) {
        Alert.alert(
        'Success',
        'Subscription updated successfully!',
        [
          {
            text: 'OK',
            onPress: () =>
              (navigation as any).navigate('MainTabs', {
                screen: 'Subscriptions',
                params: {
                  screen: 'subscriptions',
                },
              }),
          },
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

    const defaultReminder = reminders.find(item => item.key === remindMe);
  const defaultCycle = cycles.find(item => item.key === cycle);
  const defaultCategory = categories.find(item => item.key === category);

      const parseDate = (dateString : any) => {
        if (typeof dateString !== 'string') return null;
        const parts = dateString.split('/');
        if (parts.length !== 3) return null;
        const [month, day, year] = parts.map(Number);
        const parsed = new Date(year, month - 1, day);
        return isNaN(parsed.getTime()) ? null : parsed;
      };

  useFocusEffect(
    useCallback(() => {
      // Load subscription data if available
      if (subscription) {
        setServiceName(subscription.app_name);
        setCategory(subscription.category);
        setSelectedIcon(subscription.icon);
        setCostType(subscription.cost_type);
        setCost(subscription.cost || '0');
        setAverageCost(subscription.average_cost || '0');
        setNotes(subscription.notes);
        setRemindMe(subscription.remind_me);
        setCycle(subscription.cycle);
        setDueDate(parseDate(subscription.due_date));
        setSelectedColor(subscription.selected_color);
      }
    }, [subscription])
  );

  if (!user) {
    return <LoginScreen />;
  }

  const styledCategories = categories.map(item => ({
    key: item.key,
    value: <Text style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{item.value}</Text>, // White text
  }));

  const styledReminders = reminders.map(item => ({
    key: item.key,
    value: <Text style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{item.value}</Text>, // White text
  }));

    const styledCycles = cycles.map(item => ({
    key: item.key,
    value: <Text style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{item.value}</Text>, // White text
  }));

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        {/* Header */}
        <View className={`${isDark ? 'bg-[#27272A] border-b-[#3F3F46]' : 'bg-white'} shadow-sm`}>
                <View className="flex-row items-center justify-between px-4 py-4">
                  <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color={isDark ? '#E5E7EB' : '#374151'} />
                  </TouchableOpacity>
                  <Text className={`${isDark ? 'text-zinc-200' : 'text-gray-900'} text-xl font-semibold`}>
                    Edit Subscription
                  </Text>
                  <View className="w-10" />
                </View>
        </View>

        <ScrollView className={`flex-1 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 40 : 60, paddingTop: 16 }}>
          {/* Icon and Color Selection */}
          <SlideInView direction="down" duration={250} delay={100}>
            <View className={`mx-4 mb-4 p-4 rounded-2xl border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
              <View className="flex-row items-center justify-center">
                {/* Icon Selector */}
                <TouchableOpacity onPress={() => setShowIconPicker(!showIconPicker)} className="items-center mr-6" activeOpacity={0.7}>
                  <View className="w-20 h-20 rounded-2xl items-center justify-center" style={{ backgroundColor: `${selectedColor}20` }}>
                    <Text className="text-4xl">{selectedIcon}</Text>
                  </View>
                  <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Tap to change</Text>
                </TouchableOpacity>

                {/* Color Selector */}
                <TouchableOpacity onPress={() => setShowColorModal(true)} className="items-center" activeOpacity={0.7}>
                  <View className={`w-20 h-20 rounded-2xl items-center justify-center border-2 ${isDark ? 'border-gray-600' : 'border-gray-200'}`} style={{ backgroundColor: selectedColor }}>
                    <Ionicons name="color-palette" size={32} color="white" />
                  </View>
                  <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Change color</Text>
                </TouchableOpacity>
              </View>

              {/* Icon Picker */}
              {showIconPicker && (
                <Animatable.View animation="fadeIn" duration={200} className="mt-4 pt-4 border-t border-gray-100">
                  <View className="flex-row flex-wrap justify-center">
                    {defaultIcons.map((icon, index) => (
                      <TouchableOpacity key={index} onPress={() => { setSelectedIcon(icon); setShowIconPicker(false); }} className="p-3 m-1 rounded-lg hover:bg-gray-100">
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
            <View className={`mx-4 mb-4 p-4 rounded-2xl border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
              <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Service Name</Text>
              <TextInput
                className={`border border-gray-200 rounded-xl px-4 py-3 text-base ${isDark ? 'text-white' : 'text-[#000000]'}`}
                placeholder="e.g., Netflix, Electric Bill, Gym"
                placeholderTextColor= { isDark ? '#FFFFFF' : '#000000' }
                value={serviceName}
                onChangeText={setServiceName}
                returnKeyType="next"
                onSubmitEditing={() => costRef.current?.focus()}
              />
            </View>
          </SlideInView>



          {/* Category */}
          <SlideInView direction="right" duration={250} delay={250}>
            <View className={`mx-4 mb-4 p-4 rounded-2xl border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
              <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Category</Text>
              <SelectList
                setSelected={setCategory}
                data={styledCategories}
                save="key"
                placeholder="Select a category"
                defaultOption={defaultCategory}
                boxStyles={{
                  borderRadius: 12,
                  borderColor: isDark ? '#3F3F46' : '#E5E7EB',
                  paddingVertical: 12,
                  backgroundColor: isDark ? '#5A5A61' : '#FFFFFF', // Match dropdown for consistency
                }}
                inputStyles={{
                  color: isDark ? '#FFFFFF' : '#000000' 
                }}
         
                dropdownStyles={{
                  borderRadius: 12,
                  borderColor: isDark ? '#3F3F46' : '#E5E7EB',
                  backgroundColor: isDark ? '#5A5A61' : '#FFFFFF'
                }}
              />
            </View>
          </SlideInView>

          {/* Cost Type and Amount */}
          <SlideInView direction="left" duration={250} delay={300}>
            <View className={`mx-4 mb-4 p-4 rounded-2xl border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
              <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Cost Type</Text>

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
                  <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Monthly Cost</Text>
                  <TextInput
                    ref={costRef}
                    className={`border border-gray-200 rounded-xl px-4 py-3 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
                    placeholder="0.00"
                    placeholderTextColor= { isDark ? '#FFFFFF' : '#000000' }
                    value={cost}
                    onChangeText={setCost}
                    keyboardType="decimal-pad"
                    returnKeyType="next"
                    onSubmitEditing={() => notesRef.current?.focus()}
                  />
                </View>
              ) : (
                <View>
                  <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Average Monthly Cost</Text>
                  <TextInput
                    ref={averageCostRef}
                    className={`border border-gray-200 rounded-xl px-4 py-3 text-base ${isDark ? 'text-gray-300' : 'text-gray-900'}`}
                    placeholder="Enter average amount"
                    placeholderTextColor= { isDark ? '#FFFFFF' : '#000000' }
                    value={averageCost}
                    onChangeText={setAverageCost}
                    keyboardType="decimal-pad"
                    returnKeyType="next"
                    onSubmitEditing={() => notesRef.current?.focus()}
                  />
                  <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    For bills that vary each month (electricity, water, etc.)
                  </Text>
                </View>
              )}
            </View>
          </SlideInView>

          {/* Billing Cycle and Due Date */}
          <SlideInView direction="right" duration={250} delay={350}>
            <View className={`mx-4 mb-4 p-4 rounded-2xl border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
              <View className="flex-row">
                {/* Billing Cycle */}
                <View className="flex-1 mr-3">
                  <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Billing Cycle</Text>
                  <SelectList
                    setSelected={setCycle}
                    data={styledCycles}
                    save="key"
                    defaultOption={defaultCycle}
                    boxStyles={{
                      borderRadius: 12,
                      borderColor: isDark ? '#3F3F46' : '#E5E7EB',
                      paddingVertical: 12,
                      backgroundColor: isDark ? '#5A5A61' : '#FFFFFF', // Match dropdown for consistency
                    }}
                    inputStyles={{
                      color: isDark ? '#FFFFFF' : '#000000' 
                    }}
                    dropdownStyles={{
                      borderRadius: 12,
                      borderColor: isDark ? '#3F3F46' : '#E5E7EB',
                      backgroundColor: isDark ? '#5A5A61' : '#FFFFFF'
                    }}
                  />
                </View>

                {/* Due Date */}
                <View className="flex-1">
                  <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Due Date</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className={`border border-gray-200 rounded-xl px-4 py-3.5 ${isDark ? 'bg-[#27272A]' : 'bg-white'}`}
                    activeOpacity={0.7}
                  >
                    <Text className={`text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {dueDate?.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SlideInView>

          {/* Reminder */}
          <SlideInView direction="left" duration={250} delay={400}>
            <View className={`mx-4 mb-4 p-4 rounded-2xl border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
              <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Reminder</Text>
              <SelectList
                setSelected={setRemindMe}
                data={styledReminders}
                save="key"
                defaultOption={defaultReminder}
                boxStyles={{
                  borderRadius: 12,
                  borderColor: isDark ? '#3F3F46' : '#E5E7EB',
                  paddingVertical: 12,
                  backgroundColor: isDark ? '#5A5A61' : '#FFFFFF', // Match dropdown for consistency
                }}
                inputStyles={{
                  color: isDark ? '#FFFFFF' : '#000000' 
                }}
                dropdownStyles={{
                  borderRadius: 12,
                  borderColor: isDark ? '#3F3F46' : '#E5E7EB',
                  backgroundColor: isDark ? '#5A5A61' : '#FFFFFF'
                }}
              />
            </View>
          </SlideInView>

          {/* Notes */}
          <SlideInView direction="right" duration={250} delay={450}>
            <View className={`mx-4 mb-4 p-4 rounded-2xl border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
              <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Notes (Optional)</Text>
              <TextInput
                ref={notesRef}
                className={`border border-gray-200 rounded-xl px-4 py-3 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
                placeholder="Add any additional notes..."
                placeholderTextColor= { isDark ? '#FFFFFF' : '#000000' }
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
                    Update Subscription
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
              <View className={`bg-white rounded-t-3xl ${isDark ? 'bg-[#27272A]' : 'bg-white'}`}>
                <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text className="text-[#3AABCC] text-base">Cancel</Text>
                  </TouchableOpacity>
                  <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Select Due Date</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text className="text-[#3AABCC] text-base font-semibold">Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={dueDate ?? new Date()} // fallback if dueDate is null
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
            value={dueDate ?? new Date()} // fallback if dueDate is null
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showColorModal && (
          <View>
            <ColorModal
              visible={showColorModal}
              onClose={() => setShowColorModal(false)}
              onSelect={setSelectedColor}
              defaultColor={selectedColor}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditSubscriptionScreen;
