import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { auth } from "../../config/firebase"; // Assuming db is not needed here
import { createDocumentSubscription, retrieveAllDocumentSubscriptionMonthlySpecificUser } from "../../services/userService.js";
import Subscription from '../../types/Subscription.js';



const SubscriptionManager = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyExpenses, setMonthlyExpenses] = useState(1050); // Example expense
  const [show, setShow] = useState(false); // State to control the visibility of the date picker
  const [selected, setSelected] = useState('');
  const [selectedCycle, setSelectedCycle] = useState("Cycle 1");
  const [selectedPlatform, setSelectedPlatform] = useState("Platform 1");
  const [cost, setCost] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(6);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [userData, setUserData] =  useState<User | null>(null); // ✅ Allow User or null
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);


  useFocusEffect(
    useCallback(() => {
        const today = getTodayDate();
        setSelectedYear(getCurrentDateParts().year);
        setSelectedMonth(getCurrentDateParts().month);
        setCurrentDate(today)
        console.log(today)
        //setCurrentDate(getCurrentDateParts().year + '-'+  getCurrentDateParts().month +  '-' + getCurrentDateParts().day)
    }, [])
  );

   const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]; // returns YYYY-MM-DD
  };

    useFocusEffect(
      useCallback(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUserData(firebaseUser);
          fetchSubscriptions(firebaseUser?.uid as string, getCurrentDateParts().month, getCurrentDateParts().year);
          // setSelectedYear(getCurrentDateParts().year);
          // setSelectedMonth(getCurrentDateParts().month);
          // setCurrentDate(getCurrentDateParts().year + '-'+  getCurrentDateParts().month +  '-' + getCurrentDateParts().day)
          // console.log(getCurrentDateParts().year + '-0'+  getCurrentDateParts().month +  '-' + getCurrentDateParts().day)
        });  
      }, [])
    );

  const getCurrentDateParts = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();        // 1-31

    return {
      year,
      month,
      day,
    };
  };



  const fetchSubscriptions = async (user_id: string, month: number, year: number) => {
      try {
        setLoading(true);
        const date_info =  { month: month, year: year };
        const res = await retrieveAllDocumentSubscriptionMonthlySpecificUser(user_id, date_info);
        const data = res.data as Subscription[];
        const totalCost = data.reduce((sum, sub) => { return sum + parseFloat(sub?.cost || '0'); }, 0)
        setTotalCost(totalCost);
       // setSubscriptions(data);
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      } finally {
        setLoading(false);
      }
  };



  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/(screens)/welcome");
      Alert.alert("Logged out", "You have been signed out.");
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
      console.error("Logout error:", error);
    }
  };


  
  const subscriptionSubmit = async () => {
      if (selectedCycle === "" || selectedPlatform === "" || cost === "" || selectedDate.toLocaleDateString() === "") {
        Alert.alert("Validation", "Please fill in all fields");
        return;
      }
  
      try {
        const user_info = { uid: userData?.uid, cycle: selectedCycle, platform: selectedPlatform, cost: cost, subscription_date: selectedDate.toLocaleDateString()  }; // shorthand for object properties
        const response = await createDocumentSubscription(user_info);
        fetchSubscriptions(userData?.uid as string, selectedMonth, selectedYear);

        Alert.alert("Success", JSON.stringify(user_info, null, 2));
      } catch (error) {
        Alert.alert("Error", "An error occurred while logging in.");
      }
  };


  // Function to handle date selection
  const onChange = (event: DateTimePickerEvent, date?: Date | undefined) => {
    if (event.type === 'set') {
      // User confirmed the date
      if (date) {
        setSelectedDate(date);
      }
    }
    // Close the picker in any case (dismissed or set)
    setShow(false);
  };

  const showDatePicker = () => {
    setShow(true);
  };

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1); // Days 1 to 31

  return (

<View className="bg-black flex-1 px-6 py-10">
      {/* <Button title="Home1"  onPress={() => router.replace('/(tabs)/stacks')} />
          <Button title="View Details1" onPress={() => router.replace('/(tabs)/stacks/details')} /> */}



    <ScrollView className=" inset-0 w-full" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View className="pt-10 mb-20">
      <Text className="text-white text-xl font-bold">Subscription Manager</Text>
      <Text className="text-gray-400">Manage your subscriptions and view them on a calendar.</Text>
      
      {/* <View className="p-4 bg-gray-800 rounded-lg mt-4">
        <Text className="text-white text-lg font-semibold">Platform</Text>
        <TouchableOpacity className="bg-gray-600 rounded-lg mt-1 hover:bg-gray-500 transition ease-in-out duration-200">
            <View className="w-full">
              <Picker
                style={{ color: '#D1D5DB' }}            
                className="w-full"
                selectedValue={selectedPlatform}
                onValueChange={(itemValue) => setSelectedPlatform(itemValue)}
              >
                <Picker.Item label="Platform 1" value="Platform 1" />
                <Picker.Item label="Platform 2" value="Platform 2" />
              </Picker>
            </View>
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold mt-4">Billing Cycle</Text>
        <TouchableOpacity className="bg-gray-600 rounded-lg mt-1 hover:bg-gray-500 transition ease-in-out duration-200">
          <View className="w-full">
            <Picker
              style={{ color: '#D1D5DB' }}            
              className="w-full"
              selectedValue={selectedCycle}
              onValueChange={(itemValue) => setSelectedCycle(itemValue)}
            >
              <Picker.Item label="Cycle 1" value="Cycle  1" />
              <Picker.Item label="Cycle 2" value="Cycle 2" />
            </Picker>
          </View>
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold mt-4">Cost</Text>
        <TouchableOpacity className="bg-gray-600 rounded-lg mt-1 hover:bg-gray-500 transition ease-in-out duration-200">
          <TextInput
            className="text-gray-300 text-left p-3"
            keyboardType="numeric" // This ensures only numeric input
            placeholder="0.00" // Example placeholder
            placeholderTextColor="#CCCCCC" // Color for placeholder text
          />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold mt-4">Due Date</Text>
        <TouchableOpacity onPress={showDatePicker} className="bg-gray-600 rounded-lg p-3 mt-1 hover:bg-gray-500 transition ease-in-out duration-200">
          <Text className="text-gray-300 text-left">
            {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-6 bg-blue-600 rounded-lg p-3 hover:bg-blue-500 transition ease-in-out duration-200">
          <Text className="text-white text-center font-semibold">Add Subscription</Text>
        </TouchableOpacity>
      </View> */}

      {/* Input Fields */}
      <View className="p-4 bg-black rounded-lg mt-4 border border-gray-500">
        <Text className="text-white text-lg font-semibold">Platform</Text>
        <TouchableOpacity className="bg-gray-800 rounded-lg mt-1 hover:bg-gray-700 transition ease-in-out duration-200">
          <View className="w-full">
            <Picker
              style={{ color: '#FFFFFF' }}            
              className="w-full"
              selectedValue={selectedPlatform}
              onValueChange={(itemValue) => setSelectedPlatform(itemValue)}
            >
              <Picker.Item label="Platform 1" value="Platform 1" />
              <Picker.Item label="Platform 2" value="Platform 2" />
            </Picker>
          </View>
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold mt-4">Billing Cycle</Text>
        <TouchableOpacity className="bg-gray-800 rounded-lg mt-1 hover:bg-gray-700 transition ease-in-out duration-200">
          <View className="w-full">
            <Picker
              style={{ color: '#FFFFFF' }}            
              className="w-full"
              selectedValue={selectedCycle}
              onValueChange={(itemValue) => setSelectedCycle(itemValue)}
            >
              <Picker.Item label="Cycle 1" value="Cycle 1" />
              <Picker.Item label="Cycle 2" value="Cycle 2" />
            </Picker>
          </View>
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold mt-4">Cost</Text>
        <TouchableOpacity className="bg-gray-800 rounded-lg mt-1 hover:bg-gray-700 transition ease-in-out duration-200">
            <TextInput
              className="text-white text-left p-3 border border-gray-700 rounded-xl bg-gray-900"
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#CCCCCC"
              value={cost}
              onChangeText={(text) => {
                // Optional: prevent non-numeric input except "." or ""
                const numeric = text.replace(/[^0-9.]/g, '');
                setCost(numeric);
              }}
            />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold mt-4">Due Date</Text>
        <TouchableOpacity onPress={showDatePicker} className="bg-gray-800 rounded-lg p-3 mt-1 hover:bg-gray-700 transition ease-in-out duration-200">
          <Text className="text-white text-left">
            {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
          
        <TouchableOpacity  className="mt-6 bg-blue-600 rounded-lg p-3 hover:bg-blue-500 transition ease-in-out duration-200" onPress={subscriptionSubmit}>
            <Text className="text-white text-center font-semibold">Add Subscription</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleLogout} 
          className="mt-4 bg-red-600 rounded-lg p-3 hover:bg-red-500 transition ease-in-out duration-200"
        >
          <Text className="text-white text-center font-semibold">Logout</Text>
        </TouchableOpacity>
         {/* <TouchableOpacity 
          onPress={() => router.push("/(screens)/welcome")}
          className="mt-4 bg-red-600 rounded-lg p-3 hover:bg-red-500 transition ease-in-out duration-200"
        >
          <Text className="text-white text-center font-semibold">Welcome</Text>
        </TouchableOpacity> */}
        </View>

          
      {/* DateTimePicker Component */}
      {show && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

      {/* Calendar Display */}
      {/* <Text className="text-white text-lg mt-6 text-center">{selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}</Text> */}
     

      <View className="flex-1 bg-black w-full rounded-lg border border-gray-500 mt-10 p-4">
        <Text className="text-gray-400 text-center">Monthly Expenses</Text>

        <Text className="text-white text-xl text-center">₱{totalCost}</Text>
        {/* <Text className="text-white text-xl text-center">₱{monthlyExpenses.toLocaleString()}</Text> */}
     
        <Calendar
         // key={currentDate} // 👈 THIS IS THE FIX — forces calendar to remount with new current
          //current={currentDate}
          // markedDates={{
          //   '2025-05-15': { marked: true, dotColor: 'green', customText: 'Spotify\n+1' },
          // }}
          markedDates={{
              [selected]: { selected: true, disableTouchEvent: true },
             '2025-05-15': { 
                marked: true, 
                dotColor: 'blue' 
              },
          }}
          theme={{
            selectedDayBackgroundColor: '#00adf5',
            textSectionTitleColor: '#fff',
            backgroundColor: '#000',
            calendarBackground: '#000',
            dayTextColor: '#fff',
            todayTextColor: '#00adf5',
            selectedDayTextColor: '#fff',
            arrowColor: '#fff',
          }}
          onDayPress={day => {
            setSelected(day.dateString);
            console.log('selected day', day);
          }}
          enableSwipeMonths={true}
          onMonthChange={month => {
            setSelectedYear(month.year);
            setSelectedMonth(month.month);
            fetchSubscriptions(userData?.uid as string, month.month, month.year);
           // console.log('Current month:', month.month); // 👉 returns number 1-12
           // console.log('Current year:', month.year);   // 👉 full year like 2025
          }}
        />
      </View>

      </View>
      </ScrollView>
    </View>
  );
};

export default SubscriptionManager; // Ensure it is exported as default