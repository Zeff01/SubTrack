import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import moment from 'moment';

import { 
  retrieveAllDocumentSubscriptionSpecificUser,
  retrieveAllDocumentNotificationSpecificUser,
  createDocumentSubscription,
  createDocumentNotification
} from '../../services/userService';
import { Subscription, Notification, ServiceResponse } from '../../types';

interface ExportData {
  subscriptions: Subscription[];
  notifications: Notification[];
  exportDate: string;
  version: string;
}

// Export user data to JSON
export const exportUserData = async (userId: string): Promise<ServiceResponse> => {
  try {
    // Fetch all user data
    const [subscriptionsRes, notificationsRes] = await Promise.all([
      retrieveAllDocumentSubscriptionSpecificUser(userId),
      retrieveAllDocumentNotificationSpecificUser(userId)
    ]);

    if (!subscriptionsRes.success) {
      return { success: false, error: subscriptionsRes.error };
    }

    const exportData: ExportData = {
      subscriptions: subscriptionsRes.data || [],
      notifications: notificationsRes.data || [],
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    // Create filename with timestamp
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const filename = `SubTrack_Export_${timestamp}.json`;
    const fileUri = FileSystem.documentDirectory + filename;

    // Write data to file
    await FileSystem.writeAsStringAsync(
      fileUri, 
      JSON.stringify(exportData, null, 2),
      { encoding: FileSystem.EncodingType.UTF8 }
    );

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export SubTrack Data'
      });
    }

    return {
      success: true,
      message: 'Data exported successfully',
      data: { filename, fileUri }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to export data'
    };
  }
};

// Export subscriptions to CSV format
export const exportSubscriptionsToCSV = async (userId: string): Promise<ServiceResponse> => {
  try {
    const subscriptionsRes = await retrieveAllDocumentSubscriptionSpecificUser(userId);
    
    if (!subscriptionsRes.success || !subscriptionsRes.data) {
      return { success: false, error: subscriptionsRes.error || 'No data to export' };
    }

    const subscriptions = subscriptionsRes.data;
    
    // CSV headers
    const headers = [
      'Name',
      'Cost',
      'Cost Type',
      'Average Cost',
      'Cycle',
      'Due Date',
      'Category',
      'Status',
      'Color',
      'Notes',
      'Created Date'
    ];

    // Convert subscriptions to CSV rows
    const rows = subscriptions.map(sub => [
      sub.app_name || '',
      sub.cost || '',
      sub.cost_type || 'fixed',
      sub.average_cost || '',
      sub.cycle || '',
      sub.due_date || '',
      sub.category || '',
      sub.status || 'active',
      sub.color || '',
      sub.notes || '',
      sub.created_at || ''
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Create filename with timestamp
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const filename = `SubTrack_Subscriptions_${timestamp}.csv`;
    const fileUri = FileSystem.documentDirectory + filename;

    // Write CSV to file
    await FileSystem.writeAsStringAsync(
      fileUri,
      csvContent,
      { encoding: FileSystem.EncodingType.UTF8 }
    );

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Subscriptions'
      });
    }

    return {
      success: true,
      message: 'Subscriptions exported to CSV successfully',
      data: { filename, fileUri }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to export CSV'
    };
  }
};

// Import user data from JSON
export const importUserData = async (userId: string): Promise<ServiceResponse> => {
  try {
    // Pick a file
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true
    });

    if (result.canceled) {
      return { success: false, error: 'Import cancelled' };
    }

    const fileUri = result.assets[0].uri;
    
    // Read the file
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8
    });

    // Parse JSON
    const importData: ExportData = JSON.parse(fileContent);
    
    // Validate data structure
    if (!importData.subscriptions || !Array.isArray(importData.subscriptions)) {
      return { success: false, error: 'Invalid file format' };
    }

    let importedSubs = 0;
    let importedNotifs = 0;

    // Import subscriptions
    for (const subscription of importData.subscriptions) {
      try {
        // Remove ID and timestamps to create new records
        const { id, created_at, updated_at, ...subData } = subscription;
        const newSub = {
          ...subData,
          uid: userId,
          user_id: userId
        };
        
        const result = await createDocumentSubscription(newSub);
        if (result.success) {
          importedSubs++;
        }
      } catch (error) {
        console.log('Failed to import subscription:', subscription.app_name);
      }
    }

    // Import notifications if they exist
    if (importData.notifications && Array.isArray(importData.notifications)) {
      for (const notification of importData.notifications) {
        try {
          const { id, created_at, updated_at, ...notifData } = notification;
          const newNotif = {
            ...notifData,
            uid: userId
          };
          
          const result = await createDocumentNotification(newNotif);
          if (result.success) {
            importedNotifs++;
          }
        } catch (error) {
          console.log('Failed to import notification:', notification.title);
        }
      }
    }

    return {
      success: true,
      message: `Import completed! ${importedSubs} subscriptions and ${importedNotifs} notifications imported.`,
      data: { importedSubs, importedNotifs }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to import data'
    };
  }
};

// Generate spending report
export const generateSpendingReport = async (userId: string, period: 'monthly' | 'yearly' = 'yearly'): Promise<ServiceResponse> => {
  try {
    const subscriptionsRes = await retrieveAllDocumentSubscriptionSpecificUser(userId);
    
    if (!subscriptionsRes.success || !subscriptionsRes.data) {
      return { success: false, error: 'No subscription data available' };
    }

    const subscriptions = subscriptionsRes.data.filter(sub => sub.status !== 'cancelled');
    
    // Calculate totals
    let totalYearly = 0;
    const categoryTotals: { [key: string]: number } = {};
    
    subscriptions.forEach(sub => {
      const isVariable = sub.cost_type === 'variable';
      const cost = parseFloat(isVariable ? (sub.average_cost || '0') : (sub.cost || '0'));
      
      if (isNaN(cost)) return;

      // Convert to yearly amount
      let yearlyAmount = 0;
      switch (sub.cycle) {
        case 'weekly':
          yearlyAmount = cost * 52;
          break;
        case 'biweekly':
          yearlyAmount = cost * 26;
          break;
        case 'monthly':
          yearlyAmount = cost * 12;
          break;
        case 'quarterly':
          yearlyAmount = cost * 4;
          break;
        case 'semiannually':
          yearlyAmount = cost * 2;
          break;
        case 'yearly':
          yearlyAmount = cost;
          break;
        default:
          yearlyAmount = cost * 12;
      }

      totalYearly += yearlyAmount;
      
      const category = sub.category || 'other';
      categoryTotals[category] = (categoryTotals[category] || 0) + yearlyAmount;
    });

    // Generate report content
    const reportDate = moment().format('MMMM DD, YYYY');
    const totalMonthly = totalYearly / 12;
    
    const reportContent = `
SUBTRACK SPENDING REPORT
Generated on: ${reportDate}

SUMMARY
=======
Active Subscriptions: ${subscriptions.length}
Total Yearly Cost: ₱${totalYearly.toFixed(2)}
Total Monthly Average: ₱${totalMonthly.toFixed(2)}

CATEGORY BREAKDOWN
==================
${Object.entries(categoryTotals)
  .sort(([,a], [,b]) => b - a)
  .map(([category, amount]) => {
    const percentage = ((amount / totalYearly) * 100).toFixed(1);
    return `${category.toUpperCase()}: ₱${amount.toFixed(2)} (${percentage}%)`;
  })
  .join('\n')}

SUBSCRIPTION DETAILS
====================
${subscriptions.map(sub => {
  const isVariable = sub.cost_type === 'variable';
  const cost = parseFloat(isVariable ? (sub.average_cost || '0') : (sub.cost || '0'));
  return `• ${sub.app_name} - ₱${cost.toFixed(2)} ${sub.cycle} (${sub.status})`;
}).join('\n')}

Report generated by SubTrack
    `.trim();

    // Save report to file
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const filename = `SubTrack_Report_${timestamp}.txt`;
    const fileUri = FileSystem.documentDirectory + filename;

    await FileSystem.writeAsStringAsync(
      fileUri,
      reportContent,
      { encoding: FileSystem.EncodingType.UTF8 }
    );

    // Share the report
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'SubTrack Spending Report'
      });
    }

    return {
      success: true,
      message: 'Spending report generated successfully',
      data: { filename, fileUri, reportContent }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to generate report'
    };
  }
};