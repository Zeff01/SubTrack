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

  const calendarCells : any = [];
  for (let i = 0; i < totalCells; i++) {
    if (i < firstDayOfMonth || i >= firstDayOfMonth + daysInMonth) {
      calendarCells.push(null);
    } else {
      calendarCells.push(i - firstDayOfMonth + 1);
    }
  }

  // const renderCalendarRows = () => {
  //   const rows = [];
  //   for (let week = 0; week < calendarCells.length / 7; week++) {
  //     const weekCells = calendarCells.slice(week * 7, (week + 1) * 7);
  //     rows.push(
  //       <View key={week} className="flex-row justify-between mb-2">
  //         {weekCells.map((day : any, index : any) => {
  //           const dayDateStr = day
  //             ? `${currentDate.year()}-${String(currentDate.month() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  //             : '';
  //           const isSelected = selectedDay === dayDateStr;
  //           const highlightedDay = highlightedDays.find(h => h.date === dayDateStr);
  //           const uniqueColors = highlightedDay ? [...new Set(highlightedDay.colors)] : [];

  //           return (
  //             <TouchableOpacity
  //               key={index}
  //               className="flex-1 items-center"
  //               onPress={() => day && onDayPress(dayDateStr)}
  //               disabled={!day}
  //             >
  //               <View className="items-center">
  //                 {day ? (
  //                   <View className={`w-10 h-10 rounded-full items-center justify-center relative
  //                     ${isSelected ? 'border-2 border-[#3AABCC]' : ''}`}>
  //                     {uniqueColors.map((color, idx) => {
  //                       const size = uniqueColors.length > 1 ? 6 : 8;
  //                       const shift = (idx * (40 - size)) / Math.max(uniqueColors.length - 1, 1);
  //                       return (
  //                         <View
  //                           key={idx}
  //                           style={{
  //                             backgroundColor: color,
  //                             position: 'absolute',
  //                             width: size,
  //                             height: size,
  //                             borderRadius: size / 2,
  //                             top: 3,
  //                             left: uniqueColors.length > 1 ? shift : 2.5,
  //                             zIndex: 0,
  //                           }}
  //                         />
  //                       );
  //                     })}
  //                     <Text className={`text-xl font-semibold text-center ${
  //                       isSelected ? 'text-[#3AABCC]' : 'text-gray-900'
  //                     }`}>
  //                       {day}
  //                     </Text>
  //                   </View>
  //                 ) : (
  //                   <View className="w-10 h-10" />
  //                 )}
  //               </View>
  //             </TouchableOpacity>
  //           );
  //         })}
  //       </View>
  //     );
  //   }
  //   return rows;
  // };

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


  const renderCalendarRows = () => {
  const weeks = getWeeks(); // 2D array of days

  return weeks.map((week : any, wi : any) => (
    <View key={wi} className="flex-row justify-between mb-4">
      {week.map((day : any, di : any) => {
        // const dayDateStr = day
        //   ? currentDate.clone().date(day).format('YYYY-MM-DD')
        //   : null;

        const dayDateStr = day
        ? `${currentDate.year()}-${String(currentDate.month() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        : '';
        const isSelected = selectedDay === dayDateStr;
        const hl = dayDateStr
        ? highlightedDays.find(h => h.date === dayDateStr)
        : null;

      //  console.log(111)
       // console.log(dayDateStr)
        // console.log(highlightedDays)
          //  console.log(hl)
        // console.log(222)

        return (
          <TouchableOpacity
            key={di}
            onPress={() => day && onDayPress(dayDateStr)}
            activeOpacity={0.8}
            className="flex-1 items-center"
            disabled={!day}
          >
            {day ? (
              <View
                className={`w-10 h-10 relative items-center justify-center ${isSelected ? 'border-2 border-[#3AABCC] rounded-full z-10' : ''}`}
              >
                {hl?.colors.map((color, idx) => {
                  const size = 30;
                  const shift = idx * 6;

                  return (
                    <View
                      key={idx}
                      style={{
                        backgroundColor: color,
                        position: 'absolute',
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        top: '50%',
                        left: '50%',
                        transform: [
                          { translateX: -size / 2 + shift },
                          { translateY: -size / 2 },
                        ],
                        zIndex: 0,
                      }}
                    />
                  );
                })}

                <Text
                  className={`text-xl font-semibold text-center ${isSelected ? 'text-[#3AABCC]' : 'text-gray-900'}`}
                >
                  {day}
                </Text>

                {isSelected && (
                  <View
                    className="absolute w-10 h-10 border-2 border-[#3AABCC] rounded-full"
                    style={{ elevation: 0 }} // Ensures the border appears on top in Android
                  />
                )}
              </View>
            ) : (
              <View className="w-10 h-10" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  ));
};


  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="bg-white p-6 rounded-3xl shadow-md">
         <View className="pt-2 pb-6 px-3 flex-row justify-between items-center">
                        <View className="flex items-start justify-start">
                          <Text className="text-2xl font-semibold text-center flex-1">{currentDate.format('MMMM YYYY')}</Text>
                          {/* <Text className="text-2xl font-semibold text-center flex-1">{moment(selectedDay).format('MMMM YYYY')}</Text> */}
                          <Text className="text-base text-blue-600 mt-2 text-center">
                            {`${moment(selectedDay).format('dddd')}, ${moment(selectedDay).format('MMMM')} ${moment(selectedDay).format('D')}`}
                          </Text>
                        </View>
                
                        <View className="flex-row items-center justify-between">
                          <TouchableOpacity onPress={onPrevMonth}>
                            <Ionicons className="mr-6" name="chevron-back" size={24} color="black" />
                          </TouchableOpacity>
                          
                          {/* <Text className="text-lg font-bold">June 2025</Text> */}
                          
                          <TouchableOpacity onPress={onNextMonth}>
                            <Ionicons className="ml-4" name="chevron-forward" size={24} color="black" />
                          </TouchableOpacity>
                        </View>
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