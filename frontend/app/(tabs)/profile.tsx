import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useProgressContext } from '@/contexts/ProgressContext';
import { useUser } from '@/contexts/UserContext';
import { dummyUser, levelSystem } from '@/data/achievements';

export default function ProfileTab() {
  const { profile, clearProfile } = useUser();
  const { signOut } = useAuth();
  const { stats } = useProgressContext();

  const displayProfile = profile.name ? profile : dummyUser;
  const xp = stats.xp || dummyUser.xp;
  const levelInfo = levelSystem.getLevelForXP(xp);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await clearProfile(); signOut?.(); router.replace('/(onboarding)/welcome'); } },
    ]);
  };

  const MENU_ITEMS = [
    { icon: '📊', label: 'My Progress', onPress: () => router.push('/(tabs)/analysis') },
    { icon: '🏋️', label: 'Exercise Library', onPress: () => router.push('/exercises') },
    { icon: '⚙️', label: 'Settings', onPress: () => router.push('/settings') },
    { icon: '🔔', label: 'Notifications', onPress: () => {} },
    { icon: '❓', label: 'Help & Support', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar / Hero */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(displayProfile.name?.[0] || 'A').toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{displayProfile.name || 'Athlete'}</Text>
          <Text style={styles.email}>{displayProfile.email}</Text>
          <View style={styles.levelRow}>
            <Text style={styles.levelBadge}>Lv {levelInfo.level} · {levelInfo.title}</Text>
          </View>
        </View>

        {/* XP bar */}
        <View style={styles.xpCard}>
          <View style={styles.xpTop}>
            <Text style={styles.xpLabel}>{xp} XP</Text>
            <Text style={styles.xpNext}>{levelInfo.xpToNext} XP to Lv {(levelInfo.level || 1) + 1}</Text>
          </View>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${levelInfo.progressPercent}%` }]} />
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          {[
            { v: stats.totalWorkouts || dummyUser.stats.totalWorkouts, l: 'Workouts' },
            { v: `${stats.currentStreak || dummyUser.stats.currentStreak}d`, l: 'Streak' },
            { v: `${Math.floor((stats.totalMinutes || dummyUser.stats.totalMinutes) / 60)}h`, l: 'Hours' },
          ].map((s) => (
            <View key={s.l} style={styles.statCard}>
              <Text style={styles.statValue}>{s.v}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Fitness profile summary */}
        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>Fitness Profile</Text>
          <View style={styles.profileGrid}>
            <View style={styles.profileItem}><Text style={styles.profileItemLabel}>Level</Text><Text style={styles.profileItemValue}>{displayProfile.fitnessLevel || '—'}</Text></View>
            <View style={styles.profileItem}><Text style={styles.profileItemLabel}>Style</Text><Text style={styles.profileItemValue}>{displayProfile.workoutStyle || '—'}</Text></View>
            <View style={styles.profileItem}><Text style={styles.profileItemLabel}>Days/week</Text><Text style={styles.profileItemValue}>{displayProfile.schedule?.daysPerWeek || '—'}</Text></View>
            <View style={styles.profileItem}><Text style={styles.profileItemLabel}>Session</Text><Text style={styles.profileItemValue}>{displayProfile.schedule?.sessionDuration ? `${displayProfile.schedule.sessionDuration} min` : '—'}</Text></View>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem} onPress={item.onPress}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  hero: { alignItems: 'center', paddingVertical: 28 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  name: { fontSize: 22, fontWeight: '800', color: '#111827' },
  email: { fontSize: 14, color: '#9CA3AF', marginTop: 2 },
  levelRow: { marginTop: 8 },
  levelBadge: { backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: 13, fontWeight: '700', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4 },
  xpCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14 },
  xpTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  xpLabel: { fontSize: 14, fontWeight: '700', color: '#111827' },
  xpNext: { fontSize: 12, color: '#9CA3AF' },
  xpTrack: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: '#2563EB', borderRadius: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  profileCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 12 },
  profileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  profileItem: { width: '47%' },
  profileItemLabel: { fontSize: 11, color: '#9CA3AF', marginBottom: 2 },
  profileItemValue: { fontSize: 14, fontWeight: '600', color: '#374151', textTransform: 'capitalize' },
  menu: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginBottom: 14 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 12 },
  menuIcon: { fontSize: 20 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: '#111827' },
  menuArrow: { fontSize: 20, color: '#9CA3AF' },
  signOutBtn: { borderRadius: 16, borderWidth: 1.5, borderColor: '#FCA5A5', paddingVertical: 16, alignItems: 'center' },
  signOutText: { fontSize: 16, fontWeight: '600', color: '#EF4444' },
});
