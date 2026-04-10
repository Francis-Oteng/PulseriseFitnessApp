import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Colors } from '@/constants/Colors';

const SAMPLE_WORKOUTS = [
  {
    id: '1',
    name: 'Full Body Strength',
    duration: '45 min',
    exercises: 8,
    difficulty: 'Intermediate',
    category: 'Strength',
    emoji: '💪',
  },
  {
    id: '2',
    name: 'HIIT Cardio Blast',
    duration: '30 min',
    exercises: 6,
    difficulty: 'Advanced',
    category: 'Cardio',
    emoji: '🔥',
  },
  {
    id: '3',
    name: 'Core & Flexibility',
    duration: '25 min',
    exercises: 10,
    difficulty: 'Beginner',
    category: 'Flexibility',
    emoji: '🧘',
  },
  {
    id: '4',
    name: 'Upper Body Power',
    duration: '40 min',
    exercises: 7,
    difficulty: 'Intermediate',
    category: 'Strength',
    emoji: '⚡',
  },
];

export default function WorkoutScreen() {
  const { user } = useAuth();
  const { workouts, currentSession, restTimerActive, restFormattedTime } = useWorkout();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand.white} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.userName}>{user?.displayName?.split(' ')[0] ?? 'Athlete'} 👋</Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Active rest timer banner */}
        {restTimerActive && (
          <TouchableOpacity
            style={styles.restTimerBanner}
            onPress={() => router.push('/workout/rest-timer')}
          >
            <Text style={styles.restTimerLabel}>Rest Timer</Text>
            <Text style={styles.restTimerTime}>{restFormattedTime}</Text>
            <Text style={styles.restTimerAction}>Tap to view →</Text>
          </TouchableOpacity>
        )}

        {/* Today's Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Plan</Text>
          <View style={styles.todayCard}>
            <Text style={styles.todayEmoji}>🎯</Text>
            <View style={styles.todayInfo}>
              <Text style={styles.todayTitle}>Full Body Strength</Text>
              <Text style={styles.todayMeta}>45 min · 8 exercises</Text>
            </View>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => router.push('/workout/1')}
            >
              <Text style={styles.startBtnText}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weekRow}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <View key={index} style={[styles.dayDot, index < 3 && styles.dayDotCompleted]}>
                <Text style={[styles.dayLabel, index < 3 && styles.dayLabelCompleted]}>{day}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.weekSummary}>3 of 5 workouts completed this week 🏆</Text>
        </View>

        {/* Workout Library */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Library</Text>
          {SAMPLE_WORKOUTS.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={styles.workoutCard}
              onPress={() => router.push(`/workout/${workout.id}`)}
              activeOpacity={0.8}
            >
              <Text style={styles.workoutEmoji}>{workout.emoji}</Text>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutMeta}>
                  {workout.duration} · {workout.exercises} exercises · {workout.difficulty}
                </Text>
              </View>
              <View style={[styles.categoryBadge, getCategoryStyle(workout.category)]}>
                <Text style={styles.categoryText}>{workout.category}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getCategoryStyle(category: string) {
  switch (category) {
    case 'Strength': return { backgroundColor: 'rgba(74,144,217,0.2)' };
    case 'Cardio': return { backgroundColor: 'rgba(255,87,87,0.2)' };
    case 'Flexibility': return { backgroundColor: 'rgba(76,175,80,0.2)' };
    default: return { backgroundColor: 'rgba(255,255,255,0.1)' };
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.brand.primary },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 12,
  },
  greeting: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  userName: { color: Colors.brand.white, fontSize: 24, fontWeight: '800' },
  settingsBtn: { padding: 8 },
  settingsIcon: { fontSize: 22 },
  restTimerBanner: {
    margin: 16,
    backgroundColor: Colors.brand.accent,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restTimerLabel: { color: Colors.brand.white, fontWeight: '600', fontSize: 14 },
  restTimerTime: { color: Colors.brand.white, fontWeight: '800', fontSize: 28 },
  restTimerAction: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  section: { padding: 20, paddingTop: 4 },
  sectionTitle: { color: Colors.brand.white, fontSize: 18, fontWeight: '700', marginBottom: 14 },
  todayCard: {
    backgroundColor: Colors.brand.cardBackground,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  todayEmoji: { fontSize: 36 },
  todayInfo: { flex: 1 },
  todayTitle: { color: Colors.brand.white, fontSize: 16, fontWeight: '700' },
  todayMeta: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 },
  startBtn: {
    backgroundColor: Colors.brand.white,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  startBtnText: { color: Colors.brand.primary, fontWeight: '700', fontSize: 14 },
  weekRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  dayDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotCompleted: { backgroundColor: Colors.brand.white },
  dayLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' },
  dayLabelCompleted: { color: Colors.brand.primary },
  weekSummary: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  workoutCard: {
    backgroundColor: Colors.brand.cardBackground,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  workoutEmoji: { fontSize: 30 },
  workoutInfo: { flex: 1 },
  workoutName: { color: Colors.brand.white, fontSize: 15, fontWeight: '700' },
  workoutMeta: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  categoryBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  categoryText: { color: Colors.brand.white, fontSize: 11, fontWeight: '600' },
});
