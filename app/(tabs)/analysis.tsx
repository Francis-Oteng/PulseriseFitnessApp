import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type Period = 'week' | 'month' | 'year';

const MOCK_STATS = {
  totalWorkouts: 24,
  totalMinutes: 960,
  avgDuration: 40,
  streak: 5,
  weeklyData: [3, 2, 4, 3, 5, 2, 3],
  monthlyData: [12, 15, 18, 22, 19, 24],
};

export default function AnalysisScreen() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>('week');

  const barData = period === 'week' ? MOCK_STATS.weeklyData : MOCK_STATS.monthlyData;
  const maxBar = Math.max(...barData);
  const barLabels = period === 'week'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : MONTHS.slice(0, 6);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Analysis</Text>
          <Text style={styles.subtitle}>Track your progress</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{MOCK_STATS.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{MOCK_STATS.streak}</Text>
            <Text style={styles.statLabel}>Day Streak 🔥</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{MOCK_STATS.totalMinutes}</Text>
            <Text style={styles.statLabel}>Total Minutes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{MOCK_STATS.avgDuration}m</Text>
            <Text style={styles.statLabel}>Avg Duration</Text>
          </View>
        </View>

        {/* Workout Frequency Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Workout Frequency</Text>
            <View style={styles.periodToggle}>
              {(['week', 'month'] as Period[]).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.periodBtn, period === p && styles.periodBtnActive]}
                  onPress={() => setPeriod(p)}
                >
                  <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                    {p === 'week' ? 'Week' : 'Month'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.chartContainer}>
            {barData.map((value, index) => (
              <View key={index} style={styles.barColumn}>
                <Text style={styles.barValue}>{value}</Text>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      { height: maxBar > 0 ? (value / maxBar) * 120 : 0 },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{barLabels[index]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Personal Records */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Records</Text>
          {[
            { exercise: 'Bench Press', value: '80 kg', date: '3 days ago' },
            { exercise: 'Squat', value: '100 kg', date: '1 week ago' },
            { exercise: 'Deadlift', value: '120 kg', date: '2 weeks ago' },
            { exercise: '5K Run', value: '24:30', date: '5 days ago' },
          ].map((pr, index) => (
            <View key={index} style={styles.prCard}>
              <View style={styles.prIcon}>
                <Text style={styles.prIconText}>🏆</Text>
              </View>
              <View style={styles.prInfo}>
                <Text style={styles.prExercise}>{pr.exercise}</Text>
                <Text style={styles.prDate}>{pr.date}</Text>
              </View>
              <Text style={styles.prValue}>{pr.value}</Text>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {[
            { name: 'Full Body Strength', date: 'Today', duration: '45 min', exercises: 8 },
            { name: 'HIIT Cardio', date: 'Yesterday', duration: '30 min', exercises: 6 },
            { name: 'Core & Flexibility', date: '3 days ago', duration: '25 min', exercises: 10 },
          ].map((activity, index) => (
            <View key={index} style={styles.activityCard}>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>{activity.name}</Text>
                <Text style={styles.activityMeta}>
                  {activity.date} · {activity.duration} · {activity.exercises} exercises
                </Text>
              </View>
              <Text style={styles.activityCheck}>✓</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.brand.primary },
  header: { padding: 20, paddingTop: 12 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.brand.white },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 4 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  statCard: {
    width: '47%',
    backgroundColor: Colors.brand.cardBackground,
    borderRadius: 14,
    padding: 16,
  },
  statValue: { fontSize: 28, fontWeight: '800', color: Colors.brand.white },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 },
  section: { padding: 20, paddingTop: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: Colors.brand.white, fontSize: 18, fontWeight: '700' },
  periodToggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' },
  periodBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  periodBtnActive: { backgroundColor: Colors.brand.white },
  periodText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  periodTextActive: { color: Colors.brand.primary },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160 },
  barColumn: { alignItems: 'center', flex: 1 },
  barValue: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 4 },
  barWrapper: { height: 120, justifyContent: 'flex-end', width: '70%' },
  bar: { backgroundColor: Colors.brand.accent, borderRadius: 6, width: '100%' },
  barLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 6 },
  prCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brand.cardBackground,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  prIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  prIconText: { fontSize: 18 },
  prInfo: { flex: 1 },
  prExercise: { color: Colors.brand.white, fontWeight: '600', fontSize: 14 },
  prDate: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  prValue: { color: Colors.brand.white, fontWeight: '800', fontSize: 16 },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brand.cardBackground,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  activityInfo: { flex: 1 },
  activityName: { color: Colors.brand.white, fontWeight: '600', fontSize: 14 },
  activityMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  activityCheck: { color: Colors.brand.success, fontSize: 18, fontWeight: '700' },
});
