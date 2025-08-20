import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { useTheme } from "../../providers/ThemeProvider";

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
    icons?: string[];
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
  onAddSubscription,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Build weeks for calendar
  const getWeeks = () => {
    const days: (number | null)[] = [];
    const firstDayIdx = currentDate.clone().startOf("month").day();
    for (let i = 0; i < firstDayIdx; i++) days.push(null);
    for (let d = 1; d <= currentDate.daysInMonth(); d++) days.push(d);
    const weeks: (number | null)[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      const week = days.slice(i, i + 7);
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
    return weeks;
  };

  const renderCalendarRows = () => {
    const weeks = getWeeks();
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <>
        {/* Weekdays Header */}
        <View className="flex-row justify-between mb-2">
          {weekdays.map((day, index) => (
            <View key={index} className="flex-1 items-center">
              <Text
                className={`text-sm font-semibold ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Days */}
        {weeks.map((week, wi) => (
          <View key={wi} className="flex-row justify-between mb-2">
            {week.map((day, di) => {
              const dayDateStr = day
                ? `${currentDate.year()}-${String(
                    currentDate.month() + 1
                  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                : "";
              const isSelected = selectedDay === dayDateStr;
              const hl = dayDateStr
                ? highlightedDays.find((h) => h.date === dayDateStr)
                : null;

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
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center relative ${
                        hl && hl.colors.length > 0
                          ? isDark
                            ? "bg-gray-800"
                            : "bg-gray-100"
                          : ""
                      } ${
                        isSelected
                          ? "border-2 border-[#3AABCC] bg-[#3AABCC]/10"
                          : ""
                      }`}
                    >
                      {hl && hl.colors.length > 0 ? (
                        <>
                          {/* Subscription icons */}
                          <View className="absolute top-1 left-0 right-0 flex-row justify-center">
                            {hl.icons && hl.icons.length > 0 ? (
                              <>
                                {hl.icons.slice(0, 2).map((icon, idx) => (
                                  <View
                                    key={idx}
                                    style={{
                                      backgroundColor: hl.colors[idx],
                                      width: 18,
                                      height: 18,
                                      borderRadius: 11,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      marginHorizontal: -2,
                                      borderWidth: 1.5,
                                      borderColor: "white",
                                      zIndex: hl.icons.length - idx,
                                    }}
                                  >
                                    <Text style={{ fontSize: 10 }}>{icon}</Text>
                                  </View>
                                ))}
                                {hl.icons.length > 2 && (
                                  <View
                                    style={{
                                      backgroundColor: "#374151",
                                      width: 18,
                                      height: 18,
                                      borderRadius: 11,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      marginHorizontal: -2,
                                      borderWidth: 1.5,
                                      borderColor: "white",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: "white",
                                        fontSize: 10,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      +{hl.icons.length - 2}
                                    </Text>
                                  </View>
                                )}
                              </>
                            ) : (
                              // fallback: colored dots
                              hl.colors.slice(0, 3).map((color, idx) => (
                                <View
                                  key={idx}
                                  style={{
                                    backgroundColor: color,
                                    width: 16,
                                    height: 16,
                                    borderRadius: 8,
                                    marginHorizontal: -2,
                                    borderWidth: 1.5,
                                    borderColor: "white",
                                    zIndex: hl.colors.length - idx,
                                  }}
                                />
                              ))
                            )}
                          </View>

                          {/* Day number */}
                          <Text
                            className={`text-base font-semibold absolute z-50 ${
                              isSelected
                                ? "text-[#3AABCC]"
                                : isDark
                                ? "text-gray-100"
                                : "text-gray-900"
                            }`}
                          >
                            {day}
                          </Text>
                        </>
                      ) : (
                        <Text
                          className={`text-lg font-semibold text-center ${
                            isSelected
                              ? "text-[#3AABCC]"
                              : isDark
                              ? "text-gray-100"
                              : "text-gray-900"
                          }`}
                        >
                          {day}
                        </Text>
                      )}
                    </View>
                  ) : (
                    <View className="w-14 h-14" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        {/* Month Header */}
        <View className="pt-2 pb-6 px-3 flex-row justify-between items-center">
          <View className="flex items-start justify-start">
            <Text
              className={`text-2xl font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {currentDate.format("MMMM YYYY")}
            </Text>

            <Text
              className={`text-base mt-2 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {`${moment(selectedDay).format("dddd")}, ${moment(
                selectedDay
              ).format("MMMM")} ${moment(selectedDay).format("D")}`}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onPrevMonth}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={isDark ? "white" : "black"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onNextMonth} className="ml-8">
              <Ionicons
                name="chevron-forward"
                size={24}
                color={isDark ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar */}
        <View className="px-2">{renderCalendarRows()}</View>

        {/* Add Subscription Button */}
        <View className="mt-4 items-center">
          <TouchableOpacity
            className="bg-[#3AABCC] rounded-xl w-full h-12 justify-center"
            onPress={onAddSubscription}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-lg text-center">
              Add Subscription
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default CalendarView;
