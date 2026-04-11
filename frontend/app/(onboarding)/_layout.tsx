import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="fitness-level" />
      <Stack.Screen name="parameters" />
      <Stack.Screen name="schedule" />
      <Stack.Screen name="equipment" />
      <Stack.Screen name="limitations" />
      <Stack.Screen name="workout-style" />
      <Stack.Screen name="account" />
      <Stack.Screen name="generating" />
    </Stack>
  );
}
