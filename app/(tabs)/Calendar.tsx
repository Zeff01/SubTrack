import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Calendar = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(moment());

  const highlightedDays = [
    { day: 3, colors: ['#dc3545', '#ffc107', '#ffc107'] },
    { day: 22, colors: ['#28a745', '#17a2b8'] },
    { day: 30, colors: ['#007bff'] },
  ];

  const getWeeks = () => {
    const days = [];
    const firstDayIdx = currentDate.clone().startOf('month').day();
    for (let i = 0; i < firstDayIdx; i++) days.push(null);
    for (let d = 1; d <= currentDate.daysInMonth(); d++) days.push(d);
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      const week = days.slice(i, i + 7);
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
    return weeks;
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Top header */}
        <View className="pt-12 pb-6 px-6 bg-[#D9D9D9] rounded-b-3xl">
           <View className="relative items-center justify-center">
             <TouchableOpacity
               onPress={() => navigation.goBack()}
               className="absolute left-0 px-4"
             >
               <Ionicons name="chevron-back" size={25} color="black" />
             </TouchableOpacity>
             <Text className="text-xl font-semibold text-gray-800">
                Calendar
             </Text>
           </View>
         </View>


      <View className="pt-12 pb-6 px-6 mt-16 flex-row justify-between items-center">
        <View className="flex items-start justify-start">
          <Text className="text-2xl font-semibold text-center flex-1">{currentDate.format('MMMM YYYY')}</Text>
          <Text className="text-base text-blue-600 mt-2 text-center">
            {`Sunday, ${currentDate.format('MMMM')} ${currentDate.format('DD')}`}
          </Text>
        </View>

      <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => setCurrentDate(m => m.clone().subtract(1, 'month'))}>
            <Ionicons className="mr-4" name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          
          {/* <Text className="text-lg font-bold">June 2025</Text> */}
          
          <TouchableOpacity onPress={() => setCurrentDate(m => m.clone().add(1, 'month'))}>
            <Ionicons className="ml-4" name="chevron-forward" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>



      <View className="p-4">
        {/* Weekday headers */}
        <View className="flex-row justify-between mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <Text key={d} className="text-center flex-1 text-gray-600 font-semibold">
              {d}
            </Text>
          ))}
        </View>

        {/* Calendar weeks */}
        {getWeeks().map((week, wi) => (
          <View key={wi} className="flex-row justify-between mb-4">
            {week.map((day, di) => {
              const hl = highlightedDays.find(h => h.day === day);
              return (
                <View key={di} className="flex-1 items-center">
                  {day ? (
                    <View className="w-10 h-10 items-center justify-center relative">
                      {/* Colored dots BELOW day number */}
                      {hl && (
                        <View className="absolute  flex-row space-x-1">
                          {hl.colors.map((color, index) => (
                            <View
                              key={index}
                              style={{
                                backgroundColor: color,
                                width: 16,
                                height: 16,
                                borderRadius: 8,
                              }}
                            />
                          ))}
                        </View>
                      )}
                      {/* Day number on top */}
                      <Text className="text-xl text-gray-900 font-semibold z-10">{day}</Text>
                    </View>
                  ) : (
                    <View className="w-10 h-10" />
                  )}
                </View>
              );
            })}
          </View>
        ))}

            {/* Button */}
          <View className="mt-6 items-center">
            <TouchableOpacity className="bg-[#3AABCC] rounded-3xl shadow-md w-full h-14 justify-center"
              onPress={() => (navigation as any).navigate('Plus')}
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

export default Calendar;
