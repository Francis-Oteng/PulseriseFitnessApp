import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../src/context/UserContext';
import OnboardingHeader from '../../src/components/onboarding/OnboardingHeader';

const INJURIES = [
  { id: 'none', label: 'None', icon: '✅' },
  { id: 'knee', label: 'Knee issues', icon: '🦵' },
  { id: 'lower_back', label: 'Lower back problems', icon: '🔙' },
  { id: 'shoulder', label: 'Shoulder injury', icon: '💪' },
  { id: 'wrist', label: 'Wrist/hand issues', icon: '🤚' },
  { id: 'ankle', label: 'Ankle problems', icon: '🦶' },
  { id: 'neck', label: 'Neck issues', icon: '🏥' },
];

const PREFS = [
  { id: 'lowImpact', label: 'Low-impact exercises only (no jumping)', icon: '🚶' },
  { id: 'quietWorkouts', label: 'Quiet workouts (apartment-friendly)', icon: '🤫' },
  { id: 'noFloorExercises', label: 'No floor exercises', icon: '⬆️' },
];

export default function LimitationsScreen() {
  const { profile, updateProfile } = useUser();
  const [injuries, setInjuries] = useState<string[]>(profile.injuries || []);
  const [prefs, setPrefs] = useState<Record<string, boolean>>(profile.preferences || {});

  const toggleInjury = (id: string) => {
    if (id === 'none') { setInjuries(['none']); return; }
    setInjuries((prev) => {
      const without = prev.filter((i) => i !== 'none');
      return without.includes(id) ? without.filter((i) => i !== id) : [...without, id];
    });
  };
  const togglePref = (id: string) => setPrefs((p) => ({ ...p, [id]: !p[id] }));

  const handleNext = async () => {
    const inj = injuries.filter((i) => i !== 'none');
    await updateProfile({ injuries: inj, preferences: prefs });
    router.push('/(onboarding)/workout-style');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader step={6} total={8} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Limitations & Preferences</Text>

        <Text style={styles.label}>Do you have any injuries or limitations?</Text>
        <View style={styles.list}>
          {INJURIES.map((inj) => {
            const active = injuries.includes(inj.id);
            return (
              <TouchableOpacity key={inj.id} style={[styles.row, active && styles.rowActive]} onPress={() => toggleInjury(inj.id)}>
                <Text style={styles.rowIcon}>{inj.icon}</Text>
                <Text style={[styles.rowLabel, active && styles.rowLabelActive]}>{inj.label}</Text>
                <View style={[styles.check, active && styles.checkActive]}>
                  {active && <Text style={styles.checkText}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: 24 }]}>Any preferences?</Text>
        <View style={styles.list}>
          {PREFS.map((p) => {
            const active = !!prefs[p.id];
            return (
              <TouchableOpacity key={p.id} style={[styles.row, active && styles.rowActive]} onPress={() => togglePref(p.id)}>
                <Text style={styles.rowIcon}>{p.icon}</Text>
                <Text style={[styles.rowLabel, active && styles.rowLabelActive]}>{p.label}</Text>
                <View style={[styles.check, active && styles.checkActive]}>
                  {active && <Text style={styles.checkText}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={handleNext}>
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
  label: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 12 },
  list: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 2, borderColor: '#E5E7EB', padding: 14, gap: 12 },
  rowActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  rowIcon: { fontSize: 22 },
  rowLabel: { flex: 1, fontSize: 15, color: '#374151', fontWeight: '500' },
  rowLabelActive: { color: '#2563EB', fontWeight: '600' },
  check: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  checkActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  checkText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  footer: { padding: 24, paddingBottom: 32 },
  btn: { backgroundColor: '#2563EB', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
