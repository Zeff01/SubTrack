import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { PaymentCardProps } from '../../../types/PaymentCardPropsType'; // Adjust path as needed
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

import { getUsernameByEmail } from "../../../services/userService";
import { onAuthStateChanged  } from 'firebase/auth';
import { auth } from "../../../config/firebase.js"; // Assuming db is not needed here



const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(moment());
  const [currentDay, setCurrentDay] = useState(moment());
  const [active, setActive] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>('');


  const getUsername = async (email : string) => {
    try {
      const response =  await getUsernameByEmail(email);
      if (response.success) {
        setUsername(response.username);
      } 
    } catch (error) {
      Alert.alert("Error", "An error occurred while logging in.");
    }
  };

    useFocusEffect(
      useCallback(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          getUsername(firebaseUser?.email as string);
        });  
      }, [])
    );

    const highlightedDays = [
      { day: 1, colors: ['#007bff'] },
      { day: 2, colors: ['#007bff'] },
      { day: 3, colors: ['#dc3545', '#ffc107', '#00ffff', '#ffff00'] },
      { day: 22, colors: ['#dc3545', '#17a2b8'] },
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
  
  const subscriptions = [
    { name: 'Netflix', price: '₱600', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Disney+', price: '₱800', dueDate: 'Due date: June 29, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Netflix', price: '₱600', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Disney+', price: '₱800', dueDate: 'Due date: June 29, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
    { name: 'Hulu', price: '₱400', dueDate: 'Monthly, June 30, 2025' },
  ];


const PaymentCard = ({ color, subscription, amount, dueDate }: PaymentCardProps) => {
  return (
    <View
      className="w-52 rounded-3xl p-4 mr-4  bg-white border"
      // style={{ backgroundColor: color }}
    >
      <Text className="text-right text-2xl font-extrabold text-gray-900">{amount}</Text>

      <View className="flex items-start mt-6">
        {/* Icon placeholder */}
        <View className="bg-gray-500 rounded-full h-10 w-10 mb-3 shadow-xl" />

        <Text className="text-lg font-semibold text-gray-800">{subscription}</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Due date:{' '}
          <Text className="text-red-500 font-semibold text-base">{dueDate}</Text>
        </Text>
      </View>
    </View>
  );
};

   return (
    <View className="flex-1 bg-white">
      <View className="pt-12 pb-6 px-6 bg-[#D9D9D9] rounded-b-3xl">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-gray-400 rounded-full mr-2" />
            <Text className="text-xl font-semibold text-gray-800">Hello, {username}!</Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity className="mr-2">
              <Text className="text-gray-600">🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-gray-600">⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView className="flex-1 px-4 ">
        <View className="mt-4">
          <Text className="text-gray-700 text-xl font-bold">Total Monthly Payment</Text>
          <View className="flex-row items-center mt-4 bg-blue-400 rounded-3xl p-5">
            <Text className="text-2xl font-bold flex-1 text-gray-800">June 2025</Text>
            <TouchableOpacity className="ml-2 p-2 flex-row items-center">
              <Text className="text-white text-center font-semibold">₱2600</Text>
              <Ionicons name="chevron-forward" size={25} color="white" className="ml-2" />
            </TouchableOpacity>
          </View>
        </View>

         <View className="mt-4 bg-white flex-1 justify-center align-center">
            {/* <Text className="text-xl font-bold">Upcoming Payments</Text> */}

            <View className="mt-4">
              <View className="flex-row justify-between items-center w-full">
                {/* <Text className="text-gray-700 text-2xl font-bold">Upcoming Payments</Text>
                 */}
                <Text className="text-gray-700 text-xl font-bold">Upcoming Payments</Text>
                <TouchableOpacity 
                  onPress={() => (navigation as any).navigate('Subscriptions', { screen: 'subscriptions' })}
                >
                  {/* <Text className=" text-xs underline text-[#3AABCC]">See All</Text> */}
                </TouchableOpacity>                  
              </View>
            </View>
            <ScrollView horizontal={true} className="py-4 bg-transparent">
                <View className="flex-row">
                    <PaymentCard 
                        color="lightgreen" 
                        subscription="Disney+" 
                        amount="₱800" 
                        dueDate="June 25, 2025" 
                    />
                    <PaymentCard 
                        color="lightyellow" 
                        subscription="Netflix" 
                        amount="₱600" 
                        dueDate="June 30, 2025" 
                    />
                      <PaymentCard 
                        color="lightgreen" 
                        subscription="Disney+" 
                        amount="₱800" 
                        dueDate="June 25, 2025" 
                    />
                    <PaymentCard 
                        color="lightyellow" 
                        subscription="Netflix" 
                        amount="₱600" 
                        dueDate="June 30, 2025" 
                    />
                      <PaymentCard 
                        color="lightgreen" 
                        subscription="Disney+" 
                        amount="₱800" 
                        dueDate="June 25, 2025" 
                    />
                    <PaymentCard 
                        color="lightyellow" 
                        subscription="Netflix" 
                        amount="₱600" 
                        dueDate="June 30, 2025" 
                    />
                      <PaymentCard 
                        color="lightgreen" 
                        subscription="Disney+" 
                        amount="₱800" 
                        dueDate="June 25, 2025" 
                    />
                    <PaymentCard 
                        color="lightyellow" 
                        subscription="Netflix" 
                        amount="₱600" 
                        dueDate="June 30, 2025" 
                    />
                </View>
            </ScrollView>
        </View>

        <ScrollView className="flex-1 bg-white">
              <View className="pt-2 pb-6 px-3 flex-row justify-between items-center">
                <View className="flex items-start justify-start">
                  <Text className="text-2xl font-semibold text-center flex-1">{currentDate.format('MMMM YYYY')}</Text>
                  <Text className="text-base text-blue-600 mt-2 text-center">
                    {`${currentDay.format('dddd')}, ${currentDay.format('MMMM')} ${currentDay.format('DD')}`}
                  </Text>
                </View>
        
              <View className="flex-row items-center justify-between">
                  <TouchableOpacity onPress={() => setCurrentDate(m => m.clone().subtract(1, 'month'))}>
                    <Ionicons className="mr-6" name="chevron-back" size={24} color="black" />
                  </TouchableOpacity>
                  
                  {/* <Text className="text-lg font-bold">June 2025</Text> */}
                  
                  <TouchableOpacity onPress={() => setCurrentDate(m => m.clone().add(1, 'month'))}>
                    <Ionicons className="ml-4" name="chevron-forward" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
        
        
        
              <View >
                {/* Weekday headers */}
                <View className="flex-row justify-between mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <Text key={d} className="text-center flex-1 text-gray-600 font-semibold">
                      {d}
                    </Text>
                  ))}
                </View>
        
                {getWeeks().map((week, wi) => (
                  <View key={wi} className="flex-row justify-between mb-4">
                    {week.map((day, di) => {
                      const hl = highlightedDays.find(h => h.day === day);
                      return (
                        <TouchableOpacity
                          onPress={() => setSelectedDay(day)}
                          activeOpacity={0.7}
                          key={di}
                        >
                        <View  className="flex-1 items-center">
                          {day ? (
                            <View className="w-10 h-10 items-center justify-center relative">
                              {hl &&
                                hl.colors.map((color, index) => {
                                  const size = 30;
                                  const shift = index * 7;
                                  function countColors(colors: any) {
                                    return colors.reduce((acc: any, color: any) => {
                                      acc[color] = (acc[color] || 0) + 1;
                                      return acc;
                                    }, {});
                                  }
                                  const uniqueColors = Object.keys(countColors(hl.colors));
                                  return (
                                    <View
                                      key={index}
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

                             
                                <Text
                                  className={`text-xl font-semibold text-center ${
                                    selectedDay === day ? 'text-[#3AABCC]' : 'text-gray-900'
                                  }`}
                                >
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
                ))}
                    {/* Button */}
                  <View className="mt-6 items-center">
                    <TouchableOpacity className="bg-[#3AABCC] rounded-2xl shadow-md w-full h-14 justify-center"
                      onPress={() => (navigation as any).navigate('Subscriptions', { screen: 'add_subscriptions' })}
                    >
                      <Text className="text-white font-semibold text-xl text-center">
                         Add Subscription
                      </Text>
                    </TouchableOpacity>
                  </View>
        
              </View>
            </ScrollView>

        {/* <View className="mt-4">
           <View className="flex-row justify-between items-center w-full">
            <Text className="text-gray-700 text-2xl font-bold">My Subscriptions</Text>
            <TouchableOpacity 
              onPress={() => (navigation as any).navigate('Subscriptions', { screen: 'subscriptions' })}
            >
              <Text className=" text-xs underline text-[#3AABCC]">See All</Text>
            </TouchableOpacity>                  
          </View>
        </View> */}

        <View className="mt-6 border-t-2 pt-6">
          {subscriptions.map((subscription, index) => (
            <View key={index}  className="py-6 px-4 my-1 flex-row justify-between mt-2  items-center rounded-3xl shadow-xl bg-gray-300">
              <View className="flex justify-center items-center  min-h-16">
                <View className="bg-gray-100 rounded-full h-10 w-10 shadow-xl" />
              </View>
              <View className="min-h-16 flex justify-center  items-start">
                <Text className="font-bold">{subscription.name}</Text>
                <Text>{subscription.dueDate}</Text>
              </View>
              <View className="flex-row justify-between items-center min-h-16">
                <Text>{subscription.price}</Text>
                <Ionicons name="chevron-forward" size={25} color="black" className="ml-2" />
              </View>
            </View>
          ))}
        </View> 
      </ScrollView>
    </View>
  );

};
export default HomeScreen;