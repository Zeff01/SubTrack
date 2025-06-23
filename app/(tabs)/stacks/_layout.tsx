import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerTitle: 'Home Screen' }} />
      <Stack.Screen name="details" options={{ headerTitle: 'Details Screen' }} />
    </Stack>
  );
}
