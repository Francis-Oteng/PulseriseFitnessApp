import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { useUser } from '@/contexts/UserContext';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAY_KEYS = ['mon','tue','wed','thu','fri','sat','sun'];
const DURATIONS = [15, 20, 30, 45, 60];
const TIMES = [
  { id: 'morning', label: 'Morning', icon: '🌅', desc: '6am–12pm' },
  { id: 'afternoon', label: 'Afternoon', icon: '☀️', desc: '12pm–5pm' },
  { id: 'evening', label: 'Evening', icon: '🌆', desc: '5pm–10pm' },
  { id: 'flexible', label: 'Flexible', icon: '🔄', desc: 'Any time works' },
];

export default function ScheduleScreen() {
  const { profile, updateProfile } = useUser();
  const [selectedDays, setSelectedDays] = useState<string[]>(profile.schedule?.selectedDays || []);
  const [duration, setDuration] = useState<number>(profile.schedule?.sessionDuration || 30);
  const [preferredTime, setPreferredTime] = useState<string>(profile.schedule?.preferredTime || 'flexible');

  const toggleDay = (key: string) => {
    setSelectedDays((prev) => prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]);
  };

  const handleNext = async () => {
    if (selectedDays.length < 2) return;
    await updateProfile({
      schedule: { daysPerWeek: selectedDays.length, selectedDays, sessionDuration: duration, preferredTime },
    });
    router.push('/(onboarding)/equipment');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader step={4} total={8} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Schedule Setup</Text>

        <Text style={styles.label}>Which days can you train?</Text>
        <View style={styles.daysRow}>
          {DAYS.map((d, i) => {
            const key = DAY_KEYS[i];
            const active = selectedDays.includes(key);
            return (
              <TouchableOpacity key={key} style={[styles.dayBtn, active && styles.dayBtnActive]} onPress={() => toggleDay(key)}>
                <Text style={[styles.dayText, active && styles.dayTextActive]}>{d}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.daysCount}>{selectedDays.length} days/week selected</Text>

        <Text style={styles.label}>How long per session?</Text>
        <View style={styles.durationRow}>
          {DURATIONS.map((d) => (
            <TouchableOpacity key={d} style={[styles.durBtn, duration === d && styles.durBtnActive]} onPress={() => setDuration(d)}>
              <Text style={[styles.durText, duration === d && styles.durTextActive]}>{d}<Text style={styles.durMin}> min</Text></Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Preferred workout time?</Text>
        <View style={styles.timeGrid}>
          {TIMES.map((t) => (
            <TouchableOpacity key={t.id} style={[styles.timeCard, preferredTime === t.id && styles.timeCardActive]} onPress={() => setPreferredTime(t.id)}>
              <Text style={styles.timeIcon}>{t.icon}</Text>
              <Text style={[styles.timeLabel, preferredTime === t.id && styles.timeLabelActive]}>{t.label}</Text>
              <Text style={[styles.timeDesc, preferredTime === t.id && styles.timeDescActive]}>{t.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.btn, selectedDays.length < 2 && styles.btnDisabled]} onPress={handleNext} disabled={selectedDays.length < 2}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingHorizontal: 24, paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 24, marginTop: 4 },
  label: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 12, marginTop: 8 },
  daysRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  dayBtn: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  dayBtnActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  dayText: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  dayTextActive: { color: '#fff' },
  daysCount: { fontSize: 13, color: '#6B7280', marginTop: 8, marginBottom: 20 },
  durationRow: { flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  durBtn: { flex: 1, minWidth: 56, alignItems: 'center', borderRadius: 12, borderWidth: 2, borderColor: '#E5E7EB', paddingVertical: 12 },
  durBtnActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  durText: { fontSize: 16, fontWeight: '700', color: '#374151' },
  durTextActive: { color: '#2563EB' },
  durMin: { fontSize: 11, fontWeight: '400', color: '#9CA3AF' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  timeCard: { width: '47%', borderRadius: 14, borderWidth: 2, borderColor: '#E5E7EB', padding: 14, alignItems: 'center' },
  timeCardActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  timeIcon: { fontSize: 26, marginBottom: 6 },
  timeLabel: { fontSize: 14, fontWeight: '700', color: '#111827' },
  timeLabelActive: { color: '#2563EB' },
  timeDesc: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  timeDescActive: { color: '#60A5FA' },
  footer: { padding: 24, paddingBottom: 32 },
  btn: { backgroundColor: '#2563EB', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { backgroundColor: '#93C5FD' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
