import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { cycles, reminders } from '../../modules/constants';
import { SubscriptionFormData, FormErrors } from '../../../types';

interface SubscriptionFormProps {
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

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
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
  return (
    <View className="space-y-4">
      {/* Subscription Name */}
      <View>
        <Text className="text-gray-700 mb-1 font-medium">Subscription Name</Text>
        <TextInput
          className={`border ${errors.app_name ? 'border-red-500' : 'border-gray-200'} p-3 rounded-lg bg-gray-50`}
          placeholder="Netflix, Spotify, etc."
          value={formData.app_name}
          onChangeText={(text) => onFieldChange('app_name', text)}
          editable={!loading}
        />
        {errors.app_name && (
          <Text className="text-red-500 text-sm mt-1">{errors.app_name}</Text>
        )}
      </View>

      {/* Cost */}
      <View>
        <Text className="text-gray-700 mb-1 font-medium">Cost</Text>
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

      {/* Billing Cycle */}
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

      {/* Due Date */}
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

      {/* Reminder */}
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

      {/* Color Selection */}
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

      {/* Submit Button */}
      <TouchableOpacity
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
      </TouchableOpacity>

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

export default SubscriptionForm;