import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useWorkout } from '@/contexts/WorkoutContext';

export default function RestTimerScreen() {
  const { restTimerActive, restTimeRemaining, restFormattedTime, stopRestTimer } = useWorkout();
  const router = useRouter();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!restTimerActive && restTimeRemaining === 0) {
      // Timer finished - could auto-close after a delay
      const timeout = setTimeout(() => {
        if (router.canGoBack()) router.back();
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [restTimerActive, restTimeRemaining]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleSkip = () => {
    stopRestTimer();
    if (router.canGoBack()) router.back();
  };

  const timerDone = !restTimerActive && restTimeRemaining === 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Rest Timer</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>{timerDone ? '🎉 Rest Complete!' : 'Rest & Recover'}</Text>

        <Animated.View style={[styles.timerCircle, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.timerInner}>
            <Text style={styles.timerText}>{timerDone ? '00:00' : restFormattedTime}</Text>
            <Text style={styles.timerSubtext}>{timerDone ? 'Ready to go!' : 'remaining'}</Text>
          </View>
        </Animated.View>

        <Text style={styles.tip}>
          {timerDone
            ? 'Great! You\'re ready for the next set 💪'
            : 'Use this time to hydrate and prepare for your next set.'}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipBtnText}>{timerDone ? 'Continue' : 'Skip Rest'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.brand.primary },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { color: Colors.brand.white, fontSize: 24 },
  navTitle: { color: Colors.brand.white, fontSize: 16, fontWeight: '700' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  label: {
    color: Colors.brand.white,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 48,
    textAlign: 'center',
  },
  timerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.brand.cardBackground,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
    shadowColor: Colors.brand.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  timerInner: { alignItems: 'center' },
  timerText: {
    color: Colors.brand.white,
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: 2,
  },
  timerSubtext: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginTop: 4,
  },
  tip: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: 40,
  },
  actions: { width: '100%', gap: 12 },
  skipBtn: {
    backgroundColor: Colors.brand.white,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  skipBtnText: { color: Colors.brand.primary, fontSize: 16, fontWeight: '700' },
});
