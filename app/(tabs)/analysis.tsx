import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useProgressContext } from '../../src/context/ProgressContext';
import { dummyWorkoutHistory } from '../../src/data/achievements';
import { formatRelativeDate, formatDurationMinutes } from '../../src/utils/formatters';
import { achievements as allAchievements, streakRewards } from '../../src/data/achievements';

const BAR_MAX = 400;

export default function AnalysisTab() {
  const { stats, history, unlockedAchievements, levelInfo } = useProgressContext();
  const displayHistory = history.length > 0 ? history : dummyWorkoutHistory;

  const xpPercent = levelInfo ? levelInfo.progressPercent : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Progress</Text>

        {/* Level card */}
        <View style={styles.levelCard}>
          <View style={styles.levelTop}>
            <Text style={styles.levelBadge}>Lv {levelInfo?.level || 1}</Text>
            <Text style={styles.levelTitle}>{levelInfo?.title || 'Newcomer'}</Text>
            <Text style={styles.xpLabel}>{levelInfo?.xpToNext || 0} XP to next level</Text>
          </View>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${xpPercent}%` }]} />
          </View>
          <Text style={styles.xpTotal}>{stats.xp || 0} total XP</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Workouts', value: stats.totalWorkouts || 0, icon: '💪' },
            { label: 'Streak', value: `${stats.currentStreak || 0}d`, icon: '🔥' },
            { label: 'Hours', value: `${Math.floor((stats.totalMinutes || 0) / 60)}h`, icon: '⏱' },
            { label: 'kcal', value: Math.round((stats.totalCaloriesBurned || 0) / 1000) + 'k', icon: '🔥' },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Weekly volume bars */}
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.barsCard}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
            const vol = [280, 0, 340, 0, 350, 0, 0][i];
            return (
              <View key={d} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: `${Math.round((vol / BAR_MAX) * 100)}%` }]} />
                </View>
                <Text style={styles.barLabel}>{d}</Text>
              </View>
            );
          })}
        </View>

        {/* Streak rewards */}
        <Text style={styles.sectionTitle}>Streak Rewards</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.streakScroll} contentContainerStyle={{ gap: 12, paddingRight: 24 }}>
          {streakRewards.map((sr) => {
            const earned = (stats.longestStreak || 0) >= sr.days;
            return (
              <View key={sr.days} style={[styles.streakCard, earned && styles.streakCardEarned]}>
                <Text style={styles.streakIcon}>{sr.icon}</Text>
                <Text style={[styles.streakName, earned && styles.streakNameEarned]}>{sr.reward}</Text>
                <Text style={styles.streakDays}>{sr.days} days</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achGrid}>
          {allAchievements.map((ach) => {
            const earned = unlockedAchievements.includes(ach.id);
            return (
              <View key={ach.id} style={[styles.achCard, !earned && styles.achCardLocked]}>
                <Text style={[styles.achIcon, !earned && styles.achIconLocked]}>{ach.icon}</Text>
                <Text style={[styles.achName, !earned && styles.achNameLocked]}>{ach.name}</Text>
                <Text style={styles.achDesc}>{ach.description}</Text>
              </View>
            );
          })}
        </View>

        {/* Recent workouts */}
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        {displayHistory.slice(0, 5).map((w: any) => (
          <View key={w.id} style={styles.historyCard}>
            <View style={styles.historyLeft}>
              <Text style={styles.historyName}>{w.workoutName}</Text>
              <Text style={styles.historyMeta}>{formatRelativeDate(w.date)} · {formatDurationMinutes(w.durationMinutes)}</Text>
            </View>
            <View style={styles.historyRight}>
              <Text style={styles.historyCalories}>~{w.estimatedCalories} kcal</Text>
              <Text style={styles.historyCheck}>{w.completed ? '✅' : '❌'}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#111827', paddingTop: 20, marginBottom: 16 },
  levelCard: { backgroundColor: '#1E40AF', borderRadius: 20, padding: 20, marginBottom: 16 },
  levelTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  levelBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, fontSize: 13, fontWeight: '700', color: '#fff' },
  levelTitle: { fontSize: 18, fontWeight: '800', color: '#fff', flex: 1 },
  xpLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  xpTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  xpFill: { height: '100%', backgroundColor: '#06B6D4', borderRadius: 4 },
  xpTotal: { fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'right' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 12, alignItems: 'center' },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 12, marginTop: 4 },
  barsCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', gap: 8, marginBottom: 24, height: 140, alignItems: 'flex-end' },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barTrack: { width: '100%', height: '80%', backgroundColor: '#F3F4F6', borderRadius: 6, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', backgroundColor: '#2563EB', borderRadius: 6 },
  barLabel: { fontSize: 10, color: '#9CA3AF', marginTop: 4 },
  streakScroll: { marginBottom: 24 },
  streakCard: { width: 90, alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 12, borderWidth: 2, borderColor: '#E5E7EB' },
  streakCardEarned: { borderColor: '#F59E0B', backgroundColor: '#FFFBEB' },
  streakIcon: { fontSize: 28, marginBottom: 4 },
  streakName: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', textAlign: 'center' },
  streakNameEarned: { color: '#D97706' },
  streakDays: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
  achGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  achCard: { width: '47%', backgroundColor: '#fff', borderRadius: 14, padding: 14 },
  achCardLocked: { backgroundColor: '#F9FAFB', opacity: 0.5 },
  achIcon: { fontSize: 28, marginBottom: 6 },
  achIconLocked: { opacity: 0.4 },
  achName: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 2 },
  achNameLocked: { color: '#9CA3AF' },
  achDesc: { fontSize: 11, color: '#9CA3AF', lineHeight: 16 },
  historyCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, alignItems: 'center' },
  historyLeft: { flex: 1 },
  historyName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  historyMeta: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  historyRight: { alignItems: 'flex-end', gap: 4 },
  historyCalories: { fontSize: 13, fontWeight: '600', color: '#374151' },
  historyCheck: { fontSize: 16 },
});
