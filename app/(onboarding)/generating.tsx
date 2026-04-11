import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../src/context/UserContext';
import { useWorkout } from '../../src/context/WorkoutContext';
import { generateWorkoutPlan } from '../../src/services/workoutGenerator';

const STEPS = [
  'Analyzing your goals…',
  'Selecting optimal exercises…',
  'Building your personalized plan…',
  'Calculating progression…',
  'Almost ready…',
];

export default function GeneratingScreen() {
  const { profile, updateProfile } = useUser();
  const { savePlan } = useWorkout();
  const [stepIndex, setStepIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();

    // Progress bar
    Animated.timing(progress, { toValue: 1, duration: 3000, useNativeDriver: false }).start();

    // Step cycling
    const interval = setInterval(() => {
      setStepIndex((i) => (i < STEPS.length - 1 ? i + 1 : i));
    }, 600);

    // Generate plan and navigate
    const generate = async () => {
      try {
        const plan = generateWorkoutPlan(profile);
        await savePlan(plan);
        await updateProfile({ onboardingComplete: true });
      } catch (e) {
        console.warn('Plan generation error:', e);
      }
      setTimeout(() => {
        clearInterval(interval);
        router.replace('/(tabs)/workout');
      }, 3200);
    };

    generate();
    return () => clearInterval(interval);
  }, []);

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <LinearGradient colors={['#1E40AF', '#2563EB', '#06B6D4']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Animated.View style={[styles.logoCircle, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.logoText}>P</Text>
          </Animated.View>
          <Text style={styles.title}>Building Your Plan</Text>
          <Text style={styles.step}>{STEPS[stepIndex]}</Text>

          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width }]} />
          </View>

          <View style={styles.bullets}>
            {STEPS.map((s, i) => (
              <View key={s} style={styles.bulletRow}>
                <View style={[styles.dot, i <= stepIndex && styles.dotActive]} />
                <Text style={[styles.bulletText, i <= stepIndex && styles.bulletTextActive]}>{s.replace('…', '')}</Text>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  logoText: { fontSize: 36, fontWeight: '900', color: '#fff' },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 8, textAlign: 'center' },
  step: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 28, textAlign: 'center', minHeight: 22 },
  track: { width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden', marginBottom: 36 },
  fill: { height: '100%', backgroundColor: '#fff', borderRadius: 4 },
  bullets: { width: '100%', gap: 12 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { backgroundColor: '#fff' },
  bulletText: { fontSize: 14, color: 'rgba(255,255,255,0.5)' },
  bulletTextActive: { color: '#fff', fontWeight: '600' },
});
