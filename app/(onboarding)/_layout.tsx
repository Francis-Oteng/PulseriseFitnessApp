import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="parameters" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="fitness-level" />
      <Stack.Screen name="training-days" />
    </Stack>
  );
}
