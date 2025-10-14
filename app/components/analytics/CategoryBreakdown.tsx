import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { Subscription } from '../../../types';

interface CategoryBreakdownProps {
  subscriptions: Subscription[];
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  count: number;
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ subscriptions }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const categoryColors: { [key: string]: string } = {
    entertainment: '#F59E0B',
    utilities: '#EF4444',
    productivity: '#8B5CF6',
    health: '#10B981',
    education: '#3B82F6',
    food: '#F97316',
    transport: '#6B7280',
    other: '#9CA3AF',
  };

  const generateCategoryData = (): CategoryData[] => {
    const categoryTotals: { [key: string]: { amount: number; count: number } } = {};

    subscriptions.forEach(sub => {
      if (sub.status === 'cancelled') return;
      
      const category = sub.category || 'other';
      const isVariable = sub.cost_type === 'variable';
      const cost = parseFloat(isVariable ? (sub.average_cost || '0') : (sub.cost || '0'));
      
      if (isNaN(cost)) return;

      // Convert to monthly amount
      let monthlyAmount = 0;
      switch (sub.cycle) {
        case 'weekly':
          monthlyAmount = cost * 4.33;
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

      if (!categoryTotals[category]) {
        categoryTotals[category] = { amount: 0, count: 0 };
      }
      categoryTotals[category].amount += monthlyAmount;
      categoryTotals[category].count += 1;
    });

    const totalAmount = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.amount, 0);

    return Object.entries(categoryTotals)
      .map(([category, data]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: data.amount,
        percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
        color: categoryColors[category] || categoryColors.other,
        count: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const categoryData = generateCategoryData();

  if (categoryData.length === 0) {
    return (
      <View className={`p-4 rounded-2xl border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
        <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Category Breakdown
        </Text>
        <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          No active subscriptions to display
        </Text>
      </View>
    );
  }

  return (
    <View className={`p-4 rounded-2xl border ${isDark ? 'bg-[#27272A] border-[#3F3F46]' : 'bg-white border-gray-100'}`}>
      <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Category Breakdown
      </Text>

      {/* Horizontal Bar Chart */}
      <View className="space-y-3">
        {categoryData.map((category, index) => (
          <View key={index}>
            <View className="flex-row justify-between items-center mb-1">
              <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {category.category}
              </Text>
              <Text className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ₱{category.amount.toFixed(2)}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              {/* Progress bar */}
              <View className={`flex-1 h-2 rounded-full mr-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(category.percentage, 2)}%`,
                    backgroundColor: category.color,
                  }}
                />
              </View>
              
              {/* Percentage and count */}
              <View className="flex-row items-center space-x-2">
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {category.percentage.toFixed(1)}%
                </Text>
                <View
                  className="px-2 py-1 rounded-full"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Text
                    className="text-xs font-medium"
                    style={{ color: category.color }}
                  >
                    {category.count}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Summary */}
      <View className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
        <View className="flex-row justify-between">
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Total Categories: {categoryData.length}
          </Text>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Total Monthly: ₱{categoryData.reduce((sum, cat) => sum + cat.amount, 0).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CategoryBreakdown;