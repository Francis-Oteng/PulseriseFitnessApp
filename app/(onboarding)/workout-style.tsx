import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../src/context/UserContext';
import OnboardingHeader from '../../src/components/onboarding/OnboardingHeader';

const STYLES = [
  { id: 'hiit', label: 'HIIT', icon: '⚡', desc: 'High intensity, short bursts, maximum calorie burn', color: '#EF4444', bg: '#FEF2F2' },
  { id: 'strength', label: 'Strength Training', icon: '🏋️', desc: 'Build muscle with weights and resistance', color: '#2563EB', bg: '#EFF6FF' },
  { id: 'circuit', label: 'Circuit Training', icon: '🔄', desc: 'Mix of cardio and strength in rounds', color: '#10B981', bg: '#ECFDF5' },
  { id: 'bodyweight', label: 'Bodyweight / Calisthenics', icon: '🤸', desc: 'Master your body as the weight', color: '#8B5CF6', bg: '#F5F3FF' },
  { id: 'mixed', label: 'Mixed / Varied', icon: '🎯', desc: 'Surprise me with variety', color: '#F59E0B', bg: '#FFFBEB' },
];

export default function WorkoutStyleScreen() {
  const { profile, updateProfile } = useUser();
  const [selected, setSelected] = useState<string | null>(profile.workoutStyle || null);

  const handleNext = async () => {
    if (!selected) return;
    await updateProfile({ workoutStyle: selected });
    router.push('/(onboarding)/account');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader step={7} total={8} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What type of training do you enjoy?</Text>
        <View style={styles.list}>
          {STYLES.map((s) => {
            const active = selected === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.card, active && { borderColor: s.color, backgroundColor: s.bg }]}
                onPress={() => setSelected(s.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.icon}>{s.icon}</Text>
                <View style={styles.cardText}>
                  <Text style={[styles.cardLabel, active && { color: s.color }]}>{s.label}</Text>
                  <Text style={[styles.cardDesc, active && { color: s.color, opacity: 0.75 }]}>{s.desc}</Text>
                </View>
                <View style={[styles.radio, active && { borderColor: s.color, backgroundColor: s.color }]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.btn, !selected && styles.btnDisabled]} onPress={handleNext} disabled={!selected}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingHorizontal: 24, paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 20, marginTop: 4 },
  list: { gap: 12 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 2, borderColor: '#E5E7EB', padding: 16, gap: 14, backgroundColor: '#fff' },
  icon: { fontSize: 30 },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 16, fontWeight: '700', color: '#111827' },
  cardDesc: { fontSize: 13, color: '#6B7280', marginTop: 2, lineHeight: 18 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  footer: { padding: 24, paddingBottom: 32 },
  btn: { backgroundColor: '#2563EB', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { backgroundColor: '#93C5FD' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
