import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

interface CalendarViewProps {
  currentDate: moment.Moment;
  selectedDay: string | null;
  highlightedDays: Array<{
    date: string;
    colors: string[];
    id: string[];
    cost: string[];
    app_name: string[];
    due_date: string[];
  }>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayPress: (day: string) => void;
  onAddSubscription: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  selectedDay,
  highlightedDays,
  onPrevMonth,
  onNextMonth,
  onDayPress,
  onAddSubscription
}) => {
  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.clone().startOf('month').day();
  const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const calendarCells = [];
  for (let i = 0; i < totalCells; i++) {
    if (i < firstDayOfMonth || i >= firstDayOfMonth + daysInMonth) {
      calendarCells.push(null);
    } else {
      calendarCells.push(i - firstDayOfMonth + 1);
    }
  }

  const renderCalendarRows = () => {
    const rows = [];
    for (let week = 0; week < calendarCells.length / 7; week++) {
      const weekCells = calendarCells.slice(week * 7, (week + 1) * 7);
      rows.push(
        <View key={week} className="flex-row justify-between mb-2">
          {weekCells.map((day, index) => {
            const dayDateStr = day
              ? `${currentDate.year()}-${String(currentDate.month() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              : '';
            const isSelected = selectedDay === dayDateStr;
            const highlightedDay = highlightedDays.find(h => h.date === dayDateStr);
            const uniqueColors = highlightedDay ? [...new Set(highlightedDay.colors)] : [];

            return (
              <TouchableOpacity
                key={index}
                className="flex-1 items-center"
                onPress={() => day && onDayPress(dayDateStr)}
                disabled={!day}
              >
                <View className="items-center">
                  {day ? (
                    <View className={`w-10 h-10 rounded-full items-center justify-center relative
                      ${isSelected ? 'border-2 border-[#3AABCC]' : ''}`}>
                      {uniqueColors.map((color, idx) => {
                        const size = uniqueColors.length > 1 ? 6 : 8;
                        const shift = (idx * (40 - size)) / Math.max(uniqueColors.length - 1, 1);
                        return (
                          <View
                            key={idx}
                            style={{
                              backgroundColor: color,
                              position: 'absolute',
                              width: size,
                              height: size,
                              borderRadius: size / 2,
                              top: 3,
                              left: uniqueColors.length > 1 ? shift : 2.5,
                              zIndex: 0,
                            }}
                          />
                        );
                      })}
                      <Text className={`text-xl font-semibold text-center ${
                        isSelected ? 'text-[#3AABCC]' : 'text-gray-900'
                      }`}>
                        {day}
                      </Text>
                    </View>
                  ) : (
                    <View className="w-10 h-10" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    return rows;
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="bg-white p-6 rounded-3xl shadow-md">
        {/* Month Navigation */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={onPrevMonth}>
            <Ionicons name="chevron-back" size={24} color="#3AABCC" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">
            {currentDate.format('MMMM YYYY')}
          </Text>
          <TouchableOpacity onPress={onNextMonth}>
            <Ionicons name="chevron-forward" size={24} color="#3AABCC" />
          </TouchableOpacity>
        </View>

        {/* Week Days */}
        <View className="flex-row justify-between mb-4">
          {weekDays.map((day, index) => (
            <View key={index} className="flex-1 items-center">
              <Text className="text-gray-500 font-medium">{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        {renderCalendarRows()}

        {/* Add Subscription Button */}
        <View className="mt-6 items-center">
          <TouchableOpacity 
            className="bg-[#3AABCC] rounded-2xl shadow-md w-full h-14 justify-center"
            onPress={onAddSubscription}
          >
            <Text className="text-white font-semibold text-xl text-center">
              Add Subscription
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default CalendarView;