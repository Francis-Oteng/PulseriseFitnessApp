import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useProgressContext } from '../../src/context/ProgressContext';
import { formatDurationMinutes } from '../../src/utils/formatters';

export default function WorkoutCompleteScreen() {
  const { stats } = useProgressContext();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Celebration */}
        <View style={styles.hero}>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.title}>Workout Complete!</Text>
          <Text style={styles.subtitle}>You crushed it. Every rep counts.</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatDurationMinutes(stats.totalMinutes % 60 || 30)}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak 🔥</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>~280</Text>
            <Text style={styles.statLabel}>kcal Burned</Text>
          </View>
        </View>

        {/* Overall feedback */}
        <Text style={styles.sectionTitle}>How did it feel overall?</Text>
        <View style={styles.feelRow}>
          {[{e:'😰',l:'Brutal'},{e:'😤',l:'Hard'},{e:'😊',l:'Good'},{e:'😎',l:'Easy'}].map((f) => (
            <TouchableOpacity key={f.l} style={styles.feelBtn}>
              <Text style={styles.feelEmoji}>{f.e}</Text>
              <Text style={styles.feelLabel}>{f.l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.doneBtn} onPress={() => router.replace('/(tabs)/workout')}>
          <Text style={styles.doneBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  hero: { alignItems: 'center', paddingVertical: 36 },
  trophy: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#6B7280', marginTop: 6 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  statCard: { width: '47%', backgroundColor: '#F9FAFB', borderRadius: 16, padding: 18, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  feelRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  feelBtn: { flex: 1, alignItems: 'center', borderRadius: 14, borderWidth: 2, borderColor: '#E5E7EB', paddingVertical: 14 },
  feelEmoji: { fontSize: 28, marginBottom: 4 },
  feelLabel: { fontSize: 12, fontWeight: '600', color: '#374151' },
  doneBtn: { backgroundColor: '#2563EB', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center' },
  doneBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
