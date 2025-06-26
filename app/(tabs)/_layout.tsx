import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // ✅ Icon library
import { useAuth } from '../providers/AuthProvider'; // Import your AuthProvider
import WelcomeScreen from '../(screens)/welcome'; // Import the AuthScreen component


export default function TabLayout() {
  const authContext = useAuth();
  const { user } = authContext;

  // If user does not exist
  if (!user) {
    return <WelcomeScreen />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4f46e5', // Indigo (matches NativeWind)
        tabBarInactiveTintColor: '#9ca3af', // Gray-400
        tabBarStyle: {
          backgroundColor: '#1f2937', // bg-gray-800
          borderTopWidth: 0,
          height: 100,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: string;

          switch (route.name) {
            case 'home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'calendar':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'stacks':
              iconName = focused ? 'list' : 'list-outline';
              break;
            default:
              iconName = 'alert-circle-outline';
          }

          return <Ionicons name={iconName as any} size={20} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Subscriptions' }} />
      <Tabs.Screen name="stacks" options={{ title: 'List' }} />
    </Tabs>
  );
}
