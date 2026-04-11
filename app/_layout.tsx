import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// New src/ providers
import { UserProvider, useUser } from '../src/context/UserContext';
import { WorkoutProvider } from '../src/context/WorkoutContext';
import { ProgressProvider } from '../src/context/ProgressContext';

import { Colors } from '@/constants/Colors';

function AuthGuard() {
  const { user, isLoading } = useAuth();
  const { profile } = useUser();
  const segments = useSegments();
  const router = useRouter();

  const inAuthGroup = segments[0] === '(auth)';
  const inOnboardingGroup = segments[0] === '(onboarding)';

  useEffect(() => {
    if (isLoading) return;
    if (!user && !inAuthGroup && !inOnboardingGroup) {
      router.replace('/(onboarding)/welcome');
    } else if (user && !profile.onboardingComplete && !inOnboardingGroup) {
      router.replace('/(onboarding)/goals');
    } else if (user && profile.onboardingComplete && (inAuthGroup || inOnboardingGroup)) {
      router.replace('/(tabs)/workout');
    }
  }, [user, isLoading, profile.onboardingComplete, inAuthGroup, inOnboardingGroup]);

  return null;
}

function RootLayoutInner() {
  const { isLoading, user } = useAuth();
  const colorScheme = useColorScheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.brand.primary }}>
        <ActivityIndicator size="large" color={Colors.brand.white} />
      </View>
    );
  }

  return (
    <ProgressProvider userId={user?.id || 'guest'}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthGuard />
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="workout/active" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="workout/complete" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="workout/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="workout/rest-timer" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </ProgressProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <UserProvider>
        <WorkoutProvider>
          <RootLayoutInner />
        </WorkoutProvider>
      </UserProvider>
    </AuthProvider>
  );
}
