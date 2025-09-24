import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../../../config/firebase"; // Assuming db is not needed here
import { getUsernameByEmail } from "../../../services/userService";

import { User } from 'firebase/auth';

import { retrieveAllDocumentSubscriptionSpecificUser } from "../../../services/userService";
import { useAuth } from '../../providers/AuthProvider'; // Import your AuthProvider

import { Subscription } from '../../../types/SubscriptionType';
import PaymentCard from '../../components/PaymentCard';



const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(moment());
  const [currentDateMonth] = useState(moment());

 // const [currentDay, setCurrentDay] = useState(moment());
  const [active, setActive] = useState(false);
  //const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>('');
  const [subscriptionSelectedDay, setSubscriptionSelectedDay] = useState<
  | {
      date: string;
      colors: string[];
      id: string[];
      cost: string[];
      app_name: string[];
      due_date: string[];
    }
  | null
>();

  const authContext = useAuth();
  const { user, authLoading } = authContext;
  const [userData, setUserData] =  useState<User | null>(null); // ✅ Allow User or null
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [highlightedDays, setHighlightedDays] = useState<{ date: string; colors: string[], id: string[], cost: string[], app_name: string[], due_date: string[]} []>([]);
  // const [highlightedDays, setHighlightedDays] = useState<{ day: number, colors: string[] }[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [monthlyCost, setMonthlyCost] = useState(0);
  const [currentDay, setCurrentDay] = useState<moment.Moment>(moment());

     useFocusEffect(
        useCallback(() => {
          const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            fetchSubscriptions(firebaseUser?.uid as string);
          });
        }, [])
      );


      useFocusEffect(
        useCallback(() => {
            setUserData(user);
            getUsername(userData?.email as string);
          }, [authLoading, user, userData])
      );




      const fetchSubscriptions = async (user_id: string) => {
        try {
          const res = await retrieveAllDocumentSubscriptionSpecificUser(user_id);
          const data = res.data as Subscription[];
          setSubscriptions(data);
          if (data.length > 0) {
              const highlights = generateHighlightedDays(data, currentDate);
              setHighlightedDays(highlights); // Uncomment to use it
              setSubscriptionSelectedDay(highlights.find(h => h.date === moment(currentDay).format('YYYY-MM-DD'))); // if hl might be undefined
              setMonthlyCost(getTotalMonthlyCost(highlights));
            }
        } catch (error) {
         // console.log('Failed to fetch subscriptions:', error);
        } 
      };


    const getTotalMonthlyCost = (highlightedDays: any[]) => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // 0-indexed (0 = Jan)
      const currentYear = currentDate.getFullYear();

      return highlightedDays
        .filter((entry) => {
          const date = new Date(entry.date);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((monthlyTotal, entry) => {
          const costs = entry.cost || [];
          const entryTotal = costs.reduce((entrySum: number, cost: any) => {
            const numericCost = parseFloat(cost);
            return entrySum + (isNaN(numericCost) ? 0 : numericCost);
          }, 0);
          return monthlyTotal + entryTotal;
        }, 0);
    };




const updatedSubscriptions = useMemo(() => {
  if (!subscriptionSelectedDay) return []; // no subscriptions if undefined

  return subscriptions
    .filter(sub => subscriptionSelectedDay.id.includes(sub.id)) // only matching IDs
    .map(sub => {
      const matchIndex = subscriptionSelectedDay.id.findIndex(hlId => hlId === sub.id);
      return {
        ...sub,
        // app_name: subscriptionSelectedDay.app_name[matchIndex],
        // selected_color: subscriptionSelectedDay.colors[matchIndex],
        // cost: subscriptionSelectedDay.cost[matchIndex],
        // due_date: subscriptionSelectedDay.due_date[matchIndex],
      };
    });
}, [subscriptions, subscriptionSelectedDay]);



    const getUsername = async (email : string) => {
      try {
        const response =  await getUsernameByEmail(email);
        if (response) {
          setUsername(response);
        } 
      } catch (error) {
        Alert.alert("Error", "An error occurred while logging in.");
      }
    };
  
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

const generateHighlightedDays = (subscriptions: Subscription[], currentDate: moment.Moment) => {
  const daysMap = new Map<
    string,
    {
      colors: Set<string>;
      id: string[];
      app_name: string[];
      cost: string[];
      due_date: string[];
    }
  >();

  const startDate = currentDate.clone().startOf('month');
  const endDate = currentDate.clone().add(3, 'years').endOf('month');

  const cycleMap: {
    [key: string]: { unit: moment.unitOfTime.DurationConstructor; step: number } | null;
  } = {
    daily: { unit: 'day', step: 1 },
    weekly: { unit: 'week', step: 1 },
    biweekly: { unit: 'week', step: 2 },
    semimonthly: null,
    monthly: { unit: 'month', step: 1 },
    bimonthly: { unit: 'month', step: 2 },
    quarterly: { unit: 'month', step: 3 },
    semiannually: { unit: 'month', step: 6 },
    yearly: { unit: 'year', step: 1 },
  };

  const addEntry = (date: moment.Moment, sub: Subscription) => {
    const key = date.format('YYYY-MM-DD');
    if (!daysMap.has(key)) {
      daysMap.set(key, {
        colors: new Set(),
        id: [],
        app_name: [],
        cost: [],
        due_date: [],
      });
    }
    const entry = daysMap.get(key)!;
    entry.colors.add(sub.selected_color);
    entry.id.push(sub.id);
    entry.app_name.push(sub.app_name);
    entry.cost.push(sub.cost);
    entry.due_date.push(sub.due_date);
  };

  subscriptions.forEach((sub) => {
    const baseDate = moment(sub.due_date, 'MM/DD/YYYY');
    const cycle = sub.cycle.toLowerCase();
    const config = cycleMap[cycle];

    if (!baseDate.isValid()) return;

    if (cycle === 'semimonthly') {
      let current = startDate.clone().startOf('month');
      const end = endDate.clone();

      while (current.isSameOrBefore(end)) {
        const first = current.clone().date(1);
        const fifteenth = current.clone().date(15);

        [first, fifteenth].forEach((d) => {
          if (d.isSameOrAfter(startDate) && d.isSameOrBefore(endDate)) {
            addEntry(d, sub);
          }
        });

        current.add(1, 'month');
      }

      return;
    }

    if (!config) return;

    let current = baseDate.clone();
    const { unit, step } = config;

    const diff = current.diff(startDate, unit, true);
    if (diff < 0) {
      const increment = Math.ceil(Math.abs(diff) / step);
      current.add(increment * step, unit);
    }

    while (current.isSameOrBefore(endDate)) {
      addEntry(current, sub);
      current.add(step, unit);
    }
  });

  // Convert map to array
  const result: {
    date: string;
    colors: string[];
    id: string[];
    app_name: string[];
    cost: string[];
    due_date: string[];
  }[] = [];

  daysMap.forEach((value, date) => {
    result.push({
      date,
      colors: Array.from(value.colors),
      id: value.id,
      app_name: value.app_name,
      cost: value.cost,
      due_date: value.due_date,
    });
  });

  return result;
};

function formatEntryDate(dateStr: string): string {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}


   return (
    <View className="flex-1 bg-white">
      <View className="pt-12 pb-6 px-6 bg-[#D9D9D9] rounded-b-3xl">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-gray-400 rounded-full mr-2" />
            <Text className="text-xl font-semibold text-gray-800">Hello, {username}!</Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity 
              className="mr-4"
              onPress={() => (navigation as any).navigate('Home', { screen: 'notification' })}
            >
              <Ionicons name="notifications-outline" color="black" size={24}  />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => (navigation as any).navigate('Account', { screen: 'account_settings' })}
            >
              <Ionicons name="settings-outline" color="black" size={24}  /> 
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView className="flex-1 px-4 ">
        <View className="mt-4">
          <Text className="text-gray-700 text-xl font-bold">Total Monthly Payment</Text>
          <View className="flex-row items-center mt-4 bg-blue-400 rounded-3xl p-5">
            <Text className="text-2xl font-bold flex-1 text-gray-800">{currentDateMonth.format('MMMM YYYY')}</Text>
            <TouchableOpacity className="ml-2 p-2 flex-row items-center">
              <Text className="text-white text-center font-semibold">₱{monthlyCost.toFixed(2)}</Text>
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
                {highlightedDays
                // Sort by date ascending
                .sort((a, b) => {
                  const dateA = new Date(a.date);
                  const dateB = new Date(b.date);
                  return dateA.getTime() - dateB.getTime();
                })
                // Filter by current month and year
                .filter((entry) => {
                  const date = new Date(entry.date);
                  const currentMonth = new Date().getMonth(); // 0-indexed (0 = January)
                  const currentYear = new Date().getFullYear();
                  return (
                    date.getMonth() === currentMonth &&
                    date.getFullYear() === currentYear
                  );
                })
                // Render the filtered entries
                .flatMap((entry) =>
                  entry.id.map((id, index) => (
                    <PaymentCard
                      key={`${id}-${entry.date}`}
                      color={entry.colors[index] || '#ccc'}
                      subscription={entry.app_name[index] || 'Unknown'}
                      amount={`₱${entry.cost[index] || '0'}`}
                      dueDate={formatEntryDate(entry.date)} // "July 30, 2028"
                    />
                  ))
                )}
              </View>
            </ScrollView>
        </View>

        <ScrollView className="flex-1 bg-white"> 
              <View className="pt-2 pb-6 px-3 flex-row justify-between items-center">
                <View className="flex items-start justify-start">
                  <Text className="text-2xl font-semibold text-center flex-1">{currentDate.format('MMMM YYYY')}</Text>
                  <Text className="text-base text-blue-600 mt-2 text-center">
                    {`${currentDay.format('dddd')}, ${currentDay.format('MMMM')} ${currentDay.format('D')}`}
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
                        const dayDateStr = day
                          ? currentDate.clone().date(day).format('YYYY-MM-DD')
                          : null;

                        const hl = dayDateStr
                          ? highlightedDays.find(h => h.date === dayDateStr)
                          : null;

                        return (
                          <TouchableOpacity
                            key={di}
                            onPress={() => {
                              if (day !== null) {
                                setSubscriptionSelectedDay(hl); // if hl might be undefined
                                setSelectedDay(dayDateStr); // set full date string as selectedDay
                                setCurrentDay(currentDate.clone().date(day)); // update currentDay for header display
                              }
                            }}
                            activeOpacity={0.8}
                          >
                            <View className="flex-1 items-center">
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
                                      selectedDay === dayDateStr ? 'text-[#3AABCC]' : 'text-gray-900'
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


        <View className="mt-4 border-t-2 pt-6 mb-6">
          {updatedSubscriptions.map((subscription, index) => (
            <TouchableOpacity
                            key={index}
                            className="py-6 px-4 my-2 flex-row justify-between items-center rounded-3xl shadow-xl"
                            style={{ backgroundColor: `${subscription.selected_color}`}}
                            onPress={() =>
                              //(navigation as any).navigate('SubscriptionDetails', { subscription })
                              (navigation as any).navigate('Auth', {
                                screen: 'SubscriptionDetails',
                                params: {
                                  subscription,
                                },
                              })
                            }
                          >
                            <View className="flex justify-center items-center min-h-16">
                              <View className="bg-gray-200 rounded-full h-14 w-14 shadow-xl" />
                            </View>
                            <View className="min-h-16 max-w-52 min-w-52  flex justify-center items-start">
                              <Text
                                className="font-bold text-base"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {subscription.app_name}
                              </Text>
                              <Text
                                className="text-sm text-gray-600"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {subscription.cycle.charAt(0).toUpperCase() + subscription.cycle.slice(1)}, {`${currentDay.format('MMMM')} ${currentDay.format('D')}, ${currentDay.format('YYYY')}`}

                                {/* {subscription.cycle.charAt(0).toUpperCase() + subscription.cycle.slice(1)}, {formatDueDate(subscription.due_date)} */}
                              </Text>

                              
                            </View>
            
                            <View className="flex-row justify-between items-center min-h-16">
                              <Text>₱{subscription.cost}</Text>
                              <Ionicons name="chevron-forward" size={25} color="black" className="ml-2" />
                            </View>
                          </TouchableOpacity>
          ))}
        </View> 
      </ScrollView>
    </View>
  );

};
export default HomeScreen;