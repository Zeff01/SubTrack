import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { cycles, reminders } from '../../modules/constants';
import { SubscriptionFormData, FormErrors } from '../../../types';
import { ScaleButton } from '../animated/ScaleButton';
import { FadeInView } from '../animated/FadeInView';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

interface EnhancedSubscriptionFormProps {
  formData: SubscriptionFormData;
  errors: FormErrors;
  loading: boolean;
  showDatePicker: boolean;
  onFieldChange: (field: keyof SubscriptionFormData, value: any) => void;
  onDateChange: (event: any, selectedDate?: Date) => void;
  onShowDatePicker: () => void;
  onShowColorModal: () => void;
  onSubmit: () => void;
  submitButtonText: string;
}

const categories = [
  { key: '1', value: 'entertainment', label: '🎬 Entertainment' },
  { key: '2', value: 'utilities', label: '💡 Utilities' },
  { key: '3', value: 'productivity', label: '💼 Productivity' },
  { key: '4', value: 'health', label: '🏃 Health & Fitness' },
  { key: '5', value: 'education', label: '📚 Education' },
  { key: '6', value: 'other', label: '📦 Other' },
];

const EnhancedSubscriptionForm: React.FC<EnhancedSubscriptionFormProps> = ({
  formData,
  errors,
  loading,
  showDatePicker,
  onFieldChange,
  onDateChange,
  onShowDatePicker,
  onShowColorModal,
  onSubmit,
  submitButtonText,
}) => {
  const isVariable = formData.cost_type === 'variable';
  const variableHeight = useSharedValue(isVariable ? 1 : 0);

  React.useEffect(() => {
    variableHeight.value = withTiming(isVariable ? 1 : 0, { duration: 300 });
  }, [isVariable]);

  const variableFieldsStyle = useAnimatedStyle(() => ({
    opacity: variableHeight.value,
    maxHeight: variableHeight.value * 100,
  }));

  return (
    <View className="space-y-4">
      {/* Subscription Name */}
      <FadeInView delay={0}>
        <View>
          <Text className="text-gray-700 mb-1 font-medium">Subscription Name</Text>
          <TextInput
            className={`border ${errors.app_name ? 'border-red-500' : 'border-gray-200'} p-3 rounded-lg bg-gray-50`}
            placeholder="Netflix, Spotify, Electric Bill, etc."
            value={formData.app_name}
            onChangeText={(text) => onFieldChange('app_name', text)}
            editable={!loading}
          />
          {errors.app_name && (
            <Text className="text-red-500 text-sm mt-1">{errors.app_name}</Text>
          )}
        </View>
      </FadeInView>

      {/* Category */}
      <FadeInView delay={100}>
        <View>
          <Text className="text-gray-700 mb-1 font-medium">Category</Text>
          <SelectList
            setSelected={(val: string) => onFieldChange('category', val)}
            data={categories}
            save="value"
            defaultOption={categories.find(c => c.value === formData.category)}
            boxStyles={{
              borderRadius: 8,
              borderColor: '#E5E7EB',
              backgroundColor: '#F9FAFB',
            }}
            dropdownStyles={{
              borderRadius: 8,
              borderColor: '#E5E7EB',
            }}
            disabled={loading}
          />
        </View>
      </FadeInView>

      {/* Cost Type Toggle */}
      <FadeInView delay={200}>
        <View className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-gray-700 font-medium">Variable Cost?</Text>
              <Text className="text-gray-500 text-sm mt-1">
                For bills like electricity, water, etc.
              </Text>
            </View>
            <Switch
              value={isVariable}
              onValueChange={(value) => onFieldChange('cost_type', value ? 'variable' : 'fixed')}
              trackColor={{ false: '#E5E7EB', true: '#3AABCC' }}
              thumbColor={isVariable ? '#fff' : '#f4f3f4'}
              disabled={loading}
            />
          </View>
        </View>
      </FadeInView>

      {/* Cost Fields */}
      <FadeInView delay={300}>
        <View>
          <Text className="text-gray-700 mb-1 font-medium">
            {isVariable ? 'Current/Last Bill Amount' : 'Cost'}
          </Text>
          <TextInput
            className={`border ${errors.cost ? 'border-red-500' : 'border-gray-200'} p-3 rounded-lg bg-gray-50`}
            placeholder="0.00"
            value={formData.cost}
            onChangeText={(text) => onFieldChange('cost', text)}
            keyboardType="decimal-pad"
            editable={!loading}
          />
          {errors.cost && (
            <Text className="text-red-500 text-sm mt-1">{errors.cost}</Text>
          )}
        </View>
      </FadeInView>

      {/* Average Cost for Variable */}
      <Animated.View style={variableFieldsStyle}>
        {isVariable && (
          <View>
            <Text className="text-gray-700 mb-1 font-medium">Average Monthly Cost (Optional)</Text>
            <TextInput
              className="border border-gray-200 p-3 rounded-lg bg-gray-50"
              placeholder="Enter average if known"
              value={formData.average_cost}
              onChangeText={(text) => onFieldChange('average_cost', text)}
              keyboardType="decimal-pad"
              editable={!loading}
            />
            <Text className="text-gray-500 text-xs mt-1">
              Used for yearly calculations
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Billing Cycle */}
      <FadeInView delay={400}>
        <View>
          <Text className="text-gray-700 mb-1 font-medium">Billing Cycle</Text>
          <SelectList
            setSelected={(val: string) => onFieldChange('cycle', val)}
            data={cycles}
            save="value"
            defaultOption={cycles.find(c => c.value === formData.cycle)}
            boxStyles={{
              borderRadius: 8,
              borderColor: '#E5E7EB',
              backgroundColor: '#F9FAFB',
            }}
            dropdownStyles={{
              borderRadius: 8,
              borderColor: '#E5E7EB',
            }}
            disabled={loading}
          />
        </View>
      </FadeInView>

      {/* Due Date */}
      <FadeInView delay={500}>
        <View>
          <Text className="text-gray-700 mb-1 font-medium">Due Date</Text>
          <Pressable
            onPress={onShowDatePicker}
            disabled={loading}
            className={`border ${errors.due_date ? 'border-red-500' : 'border-gray-200'} p-3 rounded-lg bg-gray-50 flex-row justify-between items-center`}
          >
            <Text className={formData.due_date ? 'text-gray-900' : 'text-gray-400'}>
              {formData.due_date 
                ? moment(formData.due_date).format('DD/MM/YYYY')
                : 'Select due date'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
          </Pressable>
          {errors.due_date && (
            <Text className="text-red-500 text-sm mt-1">{errors.due_date}</Text>
          )}
        </View>
      </FadeInView>

      {/* Reminder */}
      <FadeInView delay={600}>
        <View>
          <Text className="text-gray-700 mb-1 font-medium">Reminder</Text>
          <SelectList
            setSelected={(val: string) => onFieldChange('reminder', val)}
            data={reminders}
            save="value"
            defaultOption={reminders.find(r => r.value === formData.reminder)}
            boxStyles={{
              borderRadius: 8,
              borderColor: '#E5E7EB',
              backgroundColor: '#F9FAFB',
            }}
            dropdownStyles={{
              borderRadius: 8,
              borderColor: '#E5E7EB',
            }}
            disabled={loading}
          />
        </View>
      </FadeInView>

      {/* Color Selection */}
      <FadeInView delay={700}>
        <View>
          <Text className="text-gray-700 mb-1 font-medium">Color</Text>
          <TouchableOpacity
            onPress={onShowColorModal}
            disabled={loading}
            className="border border-gray-200 p-3 rounded-lg bg-gray-50 flex-row justify-between items-center"
          >
            <View className="flex-row items-center">
              <View
                className="w-6 h-6 rounded-full mr-3"
                style={{ backgroundColor: formData.color }}
              />
              <Text className="text-gray-900">Selected Color</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </FadeInView>

      {/* Submit Button */}
      <FadeInView delay={800}>
        <ScaleButton
          onPress={onSubmit}
          disabled={loading}
          className={`py-4 rounded-xl mt-4 ${
            loading ? 'bg-gray-400' : 'bg-[#3AABCC]'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-center text-lg">
              {submitButtonText}
            </Text>
          )}
        </ScaleButton>
      </FadeInView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.due_date || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};

export default EnhancedSubscriptionForm;