import { Stack } from 'expo-router';
import '../global.css';
import AuthProvider from './providers/AuthProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(screens)" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    </AuthProvider>
  );
}

