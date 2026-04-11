import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useWorkoutGenerator } from '@/hooks/useWorkoutGenerator';
import { formatDurationMinutes } from '@/utils/formatters';

const DAY_ABBR: Record<string, string> = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };
const STYLE_COLORS: Record<string, string> = { hiit: '#EF4444', strength: '#2563EB', circuit: '#10B981', bodyweight: '#8B5CF6', mixed: '#F59E0B' };

export default function WorkoutTab() {
  const { profile } = useUser();
  const { currentPlan, savePlan, startWorkout } = useWorkout();
  const { generate, generating } = useWorkoutGenerator();

  useEffect(() => {
    if (!currentPlan && profile.onboardingComplete) {
      generate(profile).then((plan) => { if (plan) savePlan(plan); });
    }
  }, [profile.onboardingComplete]);

  const todayKey = ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];
  const todayWorkout = currentPlan?.days?.find((d: any) => d.dayKey === todayKey)?.workout;

  const handleStart = (workout: any) => {
    startWorkout(workout);
    router.push('/workout/active');
  };

  if (generating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingCenter}>
          <Text style={styles.loadingText}>Generating your plan…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey, {profile.name?.split(' ')[0] || 'there'} 👋</Text>
            <Text style={styles.subtitle}>Ready to train today?</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakNum}>12</Text>
          </View>
        </View>

        {/* Today's Workout */}
        {todayWorkout ? (
          <View style={styles.todayCard}>
            <View style={styles.todayHeader}>
              <Text style={styles.todayLabel}>TODAY'S WORKOUT</Text>
              <View style={[styles.stylePill, { backgroundColor: STYLE_COLORS[todayWorkout.style] || '#2563EB' }]}>
                <Text style={styles.stylePillText}>{todayWorkout.style?.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.todayName}>{todayWorkout.name}</Text>
            <View style={styles.todayMeta}>
              <Text style={styles.metaItem}>⏱ {formatDurationMinutes(todayWorkout.duration)}</Text>
              <Text style={styles.metaItem}>💪 {todayWorkout.exerciseCount} exercises</Text>
              <Text style={styles.metaItem}>🔥 ~{todayWorkout.estimatedCalories} kcal</Text>
            </View>
            <TouchableOpacity style={styles.startBtn} onPress={() => handleStart(todayWorkout)}>
              <Text style={styles.startBtnText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.restCard}>
            <Text style={styles.restIcon}>😴</Text>
            <Text style={styles.restTitle}>Rest Day</Text>
            <Text style={styles.restDesc}>No workout scheduled today. Recovery is key!</Text>
          </View>
        )}

        {/* Weekly Plan */}
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.weekRow}>
          {(currentPlan?.days || []).map((d: any) => {
            const isToday = d.dayKey === todayKey;
            const hasWorkout = !!d.workout;
            return (
              <TouchableOpacity
                key={d.dayKey}
                style={[styles.dayChip, isToday && styles.dayChipToday, !hasWorkout && styles.dayChipRest]}
                onPress={() => hasWorkout && handleStart(d.workout)}
              >
                <Text style={[styles.dayChipLabel, isToday && styles.dayChipLabelToday]}>{DAY_ABBR[d.dayKey]}</Text>
                <Text style={styles.dayChipIcon}>{hasWorkout ? '💪' : '—'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Upcoming workouts list */}
        <Text style={styles.sectionTitle}>Upcoming</Text>
        {(currentPlan?.days || []).filter((d: any) => d.workout).map((d: any) => (
          <TouchableOpacity key={d.dayKey} style={styles.upcomingCard} onPress={() => handleStart(d.workout)}>
            <View style={[styles.upcomingDot, { backgroundColor: STYLE_COLORS[d.workout.style] || '#2563EB' }]} />
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingName}>{d.workout.name}</Text>
              <Text style={styles.upcomingMeta}>{DAY_ABBR[d.dayKey]} · {formatDurationMinutes(d.workout.duration)} · {d.workout.exerciseCount} exercises</Text>
            </View>
            <Text style={styles.upcomingArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 16, color: '#6B7280' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 },
  greeting: { fontSize: 22, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, gap: 4 },
  streakFire: { fontSize: 18 },
  streakNum: { fontSize: 16, fontWeight: '800', color: '#D97706' },
  todayCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  todayHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  todayLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1 },
  stylePill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  stylePillText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  todayName: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 12 },
  todayMeta: { flexDirection: 'row', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  metaItem: { fontSize: 13, color: '#6B7280' },
  startBtn: { backgroundColor: '#2563EB', borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center' },
  startBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  restCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20 },
  restIcon: { fontSize: 40, marginBottom: 8 },
  restTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  restDesc: { fontSize: 14, color: '#6B7280', marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 12, marginTop: 4 },
  weekRow: { flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  dayChip: { flex: 1, minWidth: 40, alignItems: 'center', borderRadius: 12, backgroundColor: '#fff', paddingVertical: 10, gap: 4 },
  dayChipToday: { backgroundColor: '#2563EB' },
  dayChipRest: { backgroundColor: '#F3F4F6' },
  dayChipLabel: { fontSize: 11, fontWeight: '700', color: '#374151' },
  dayChipLabelToday: { color: '#fff' },
  dayChipIcon: { fontSize: 14 },
  upcomingCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, gap: 12 },
  upcomingDot: { width: 12, height: 12, borderRadius: 6 },
  upcomingInfo: { flex: 1 },
  upcomingName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  upcomingMeta: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  upcomingArrow: { fontSize: 20, color: '#9CA3AF' },
});
