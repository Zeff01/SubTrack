import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { SubscriptionFormData, FormErrors, Subscription } from '../../types';

interface UseSubscriptionFormProps {
  initialData?: Partial<SubscriptionFormData>;
  onSubmit: (data: SubscriptionFormData) => Promise<void>;
  mode: 'add' | 'edit';
}

export const useSubscriptionForm = ({ initialData, onSubmit, mode }: UseSubscriptionFormProps) => {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    app_name: initialData?.app_name || '',
    cost: initialData?.cost || '',
    cost_type: initialData?.cost_type || 'fixed',
    average_cost: initialData?.average_cost || '',
    cycle: initialData?.cycle || 'monthly',
    due_date: initialData?.due_date || null,
    reminder: initialData?.reminder || '1 day before',
    color: initialData?.color || '#3AABCC',
    category: initialData?.category || 'other',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.app_name.trim()) {
      newErrors.app_name = 'Subscription name is required';
    }

    if (!formData.cost) {
      newErrors.cost = 'Cost is required';
    } else if (isNaN(parseFloat(formData.cost)) || parseFloat(formData.cost) <= 0) {
      newErrors.cost = 'Please enter a valid cost';
    }

    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = useCallback((field: keyof SubscriptionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleDateChange = useCallback((event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleFieldChange('due_date', selectedDate);
    }
  }, [handleFieldChange]);

  const handleColorSelect = useCallback((color: string) => {
    handleFieldChange('color', color);
    setShowColorModal(false);
  }, [handleFieldChange]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || `Failed to ${mode} subscription`
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      app_name: '',
      cost: '',
      cost_type: 'fixed',
      average_cost: '',
      cycle: 'monthly',
      due_date: null,
      reminder: '1 day before',
      color: '#3AABCC',
      category: 'other',
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    loading,
    showDatePicker,
    showColorModal,
    setShowDatePicker,
    setShowColorModal,
    handleFieldChange,
    handleDateChange,
    handleColorSelect,
    handleSubmit,
    resetForm,
  };
};