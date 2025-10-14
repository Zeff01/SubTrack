import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import moment from 'moment';
import { useTheme } from '../../providers/ThemeProvider';
import { Subscription } from '../../../types';

interface SpendingTrendsProps {
  subscriptions: Subscription[];
}

interface MonthlyData {
  month: string;
  total: number;
  fixed: number;
  variable: number;
}

const SpendingTrends: React.FC<SpendingTrendsProps> = ({ subscriptions }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const generateMonthlyData = (): MonthlyData[] => {
    const monthsData: MonthlyData[] = [];
    const now = moment();
    
    // Generate last 6 months of data
    for (let i = 5; i >= 0; i--) {
      const month = now.clone().subtract(i, 'months');
      const monthKey = month.format('YYYY-MM');
      
      let totalFixed = 0;
      let totalVariable = 0;

      subscriptions.forEach(sub => {
        if (sub.status === 'cancelled') return;
        
        const isVariable = sub.cost_type === 'variable';
        const cost = parseFloat(isVariable ? (sub.average_cost || '0') : (sub.cost || '0'));
        
        if (isNaN(cost)) return;

        // Calculate monthly amount based on cycle
        let monthlyAmount = 0;
        switch (sub.cycle) {
          case 'weekly':
            monthlyAmount = cost * 4.33; // Average weeks per month
            break;
          case 'biweekly':
            monthlyAmount = cost * 2.17;
            break;
          case 'monthly':
            monthlyAmount = cost;
            break;
          case 'quarterly':
            monthlyAmount = cost / 3;
            break;
          case 'semiannually':
            monthlyAmount = cost / 6;
            break;
          case 'yearly':
            monthlyAmount = cost / 12;
            break;
          default:
            monthlyAmount = cost;
        }

        if (isVariable) {
          totalVariable += monthlyAmount;
        } else {
          totalFixed += monthlyAmount;
        }
      });

      monthsData.push({
        month: month.format('MMM'),
        total: totalFixed + totalVariable,
        fixed: totalFixed,
        variable: totalVariable,
      });
    }

    return monthsData;
  };

  const monthlyData = generateMonthlyData();
  const maxAmount = Math.max(...monthlyData.map(d => d.total));

  return (
    <View className={`p-4 rounded-2xl border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
      <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Spending Trends (Last 6 Months)
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row items-end space-x-4 pb-2">
          {monthlyData.map((data, index) => {
            const heightPercentage = maxAmount > 0 ? (data.total / maxAmount) * 100 : 0;
            const fixedPercentage = data.total > 0 ? (data.fixed / data.total) * 100 : 0;
            
            return (
              <View key={index} className="items-center" style={{ minWidth: 60 }}>
                {/* Bar Chart */}
                <View className="h-32 justify-end mb-2">
                  <View
                    className="w-8 rounded-t-lg overflow-hidden"
                    style={{ height: `${Math.max(heightPercentage, 5)}%` }}
                  >
                    {/* Fixed costs (bottom part) */}
                    <View
                      className="bg-[#3AABCC] w-full"
                      style={{ height: `${fixedPercentage}%` }}
                    />
                    {/* Variable costs (top part) */}
                    <View
                      className="bg-[#10B981] w-full"
                      style={{ height: `${100 - fixedPercentage}%` }}
                    />
                  </View>
                </View>
                
                {/* Amount */}
                <Text className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  ₱{data.total.toFixed(0)}
                </Text>
                
                {/* Month */}
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {data.month}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Legend */}
      <View className="flex-row justify-center space-x-4 mt-4 pt-4 border-t border-gray-200">
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-[#3AABCC] rounded mr-2" />
          <Text className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Fixed Costs
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-[#10B981] rounded mr-2" />
          <Text className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Variable Costs
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SpendingTrends;