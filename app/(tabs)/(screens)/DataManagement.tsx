import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { FadeInView } from '../../components/animated/FadeInView';
import { SlideInView } from '../../components/animated/SlideInView';
import Loading from '../../components/common/Loading';

import {
  exportUserData,
  exportSubscriptionsToCSV,
  importUserData,
  generateSpendingReport
} from '../../services/exportService';

const DataManagementScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleExportData = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    setLoadingAction('export');
    
    try {
      const result = await exportUserData(user.uid);
      
      if (result.success) {
        Alert.alert(
          'Export Successful',
          'Your data has been exported successfully. The file has been shared.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Export Failed', result.error || 'Failed to export data');
      }
    } catch (error) {
      Alert.alert('Export Failed', 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setLoadingAction(null);
    }
  };

  const handleExportCSV = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    setLoadingAction('csv');
    
    try {
      const result = await exportSubscriptionsToCSV(user.uid);
      
      if (result.success) {
        Alert.alert(
          'CSV Export Successful',
          'Your subscriptions have been exported to CSV format.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Export Failed', result.error || 'Failed to export CSV');
      }
    } catch (error) {
      Alert.alert('Export Failed', 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setLoadingAction(null);
    }
  };

  const handleImportData = async () => {
    if (!user?.uid) return;

    Alert.alert(
      'Import Data',
      'This will import subscriptions and notifications from a previously exported file. Existing data will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            setLoading(true);
            setLoadingAction('import');
            
            try {
              const result = await importUserData(user.uid);
              
              if (result.success) {
                Alert.alert('Import Successful', result.message);
              } else {
                Alert.alert('Import Failed', result.error || 'Failed to import data');
              }
            } catch (error) {
              Alert.alert('Import Failed', 'An unexpected error occurred');
            } finally {
              setLoading(false);
              setLoadingAction(null);
            }
          }
        }
      ]
    );
  };

  const handleGenerateReport = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    setLoadingAction('report');
    
    try {
      const result = await generateSpendingReport(user.uid);
      
      if (result.success) {
        Alert.alert(
          'Report Generated',
          'Your spending report has been generated and shared.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Report Failed', result.error || 'Failed to generate report');
      }
    } catch (error) {
      Alert.alert('Report Failed', 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setLoadingAction(null);
    }
  };

  const DataOption = ({ 
    icon, 
    title, 
    description, 
    onPress, 
    color = '#3AABCC',
    isLoading = false 
  }: {
    icon: string;
    title: string;
    description: string;
    onPress: () => void;
    color?: string;
    isLoading?: boolean;
  }) => (
    <TouchableOpacity
      className={`p-4 rounded-2xl border mb-4 ${
        isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'
      } ${isLoading ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={isLoading || loading}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-xl items-center justify-center mr-4"
          style={{ backgroundColor: `${color}20` }}
        >
          {isLoading ? (
            <Loading message="" />
          ) : (
            <Ionicons name={icon as any} size={24} color={color} />
          )}
        </View>
        
        <View className="flex-1">
          <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </Text>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {description}
          </Text>
        </View>
        
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDark ? '#9CA3AF' : '#6B7280'} 
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-[#18181B]' : 'bg-gray-50'}`}
      edges={['top']}
    >
      {/* Header */}
      <FadeInView delay={0} duration={300}>
        <View className={`${isDark ? 'bg-[#27272A] border-b-[#3F3F46]' : 'bg-white'} shadow-sm`}>
          <View className="flex-row items-center justify-between px-4 py-4">
            <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
              <Ionicons name="chevron-back" size={24} color={isDark ? '#E5E7EB' : '#374151'} />
            </TouchableOpacity>
            <Text className={`${isDark ? 'text-zinc-200' : 'text-gray-900'} text-xl font-semibold`}>
              Data Management
            </Text>
            <View className="w-10" />
          </View>
        </View>
      </FadeInView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 100 : 120,
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
      >
        {/* Export Section */}
        <FadeInView delay={100} duration={300}>
          <View className="mb-6">
            <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Export Data
            </Text>
            
            <SlideInView delay={150} duration={250} direction="left">
              <DataOption
                icon="download-outline"
                title="Export All Data"
                description="Export all subscriptions and notifications as JSON"
                onPress={handleExportData}
                color="#3AABCC"
                isLoading={loadingAction === 'export'}
              />
            </SlideInView>

            <SlideInView delay={200} duration={250} direction="right">
              <DataOption
                icon="document-text-outline"
                title="Export to CSV"
                description="Export subscriptions in spreadsheet format"
                onPress={handleExportCSV}
                color="#10B981"
                isLoading={loadingAction === 'csv'}
              />
            </SlideInView>

            <SlideInView delay={250} duration={250} direction="left">
              <DataOption
                icon="analytics-outline"
                title="Generate Report"
                description="Create a detailed spending analysis report"
                onPress={handleGenerateReport}
                color="#8B5CF6"
                isLoading={loadingAction === 'report'}
              />
            </SlideInView>
          </View>
        </FadeInView>

        {/* Import Section */}
        <FadeInView delay={300} duration={300}>
          <View className="mb-6">
            <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Import Data
            </Text>
            
            <SlideInView delay={350} duration={250} direction="right">
              <DataOption
                icon="cloud-upload-outline"
                title="Import Data"
                description="Import subscriptions from a previously exported file"
                onPress={handleImportData}
                color="#F59E0B"
                isLoading={loadingAction === 'import'}
              />
            </SlideInView>
          </View>
        </FadeInView>

        {/* Information */}
        <FadeInView delay={400} duration={300}>
          <View className={`p-4 rounded-2xl border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-blue-50 border-blue-100'}`}>
            <View className="flex-row items-start">
              <Ionicons 
                name="information-circle-outline" 
                size={20} 
                color={isDark ? '#60A5FA' : '#3B82F6'} 
                style={{ marginTop: 2, marginRight: 8 }}
              />
              <View className="flex-1">
                <Text className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-700'} mb-1`}>
                  Data Privacy
                </Text>
                <Text className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                  All exports are stored locally on your device. Your data never leaves your device unless you explicitly share the exported files.
                </Text>
              </View>
            </View>
          </View>
        </FadeInView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataManagementScreen;