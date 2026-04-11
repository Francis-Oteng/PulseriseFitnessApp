import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../src/context/UserContext';
import OnboardingHeader from '../../src/components/onboarding/OnboardingHeader';

const EQUIPMENT = [
  { id: 'none', label: 'No Equipment', desc: 'Bodyweight only', icon: '🤸' },
  { id: 'dumbbells', label: 'Dumbbells', desc: 'Fixed or adjustable', icon: '🏋️' },
  { id: 'barbell', label: 'Barbell & Plates', desc: 'Olympic or standard', icon: '⚖️' },
  { id: 'kettlebell', label: 'Kettlebell', desc: 'Single or multiple', icon: '⚙️' },
  { id: 'pull_up_bar', label: 'Pull-up Bar', desc: 'Door or wall mounted', icon: '🔝' },
  { id: 'resistance_bands', label: 'Resistance Bands', desc: 'Loop or tube bands', icon: '🔗' },
  { id: 'bench', label: 'Bench', desc: 'Flat or adjustable', icon: '🛋️' },
  { id: 'gym', label: 'Full Gym Access', desc: 'All machines & equipment', icon: '🏟️' },
  { id: 'yoga_mat', label: 'Yoga Mat', desc: 'For floor exercises', icon: '🧘' },
  { id: 'jump_rope', label: 'Jump Rope', desc: 'For cardio', icon: '🪢' },
];

export default function EquipmentScreen() {
  const { profile, updateProfile } = useUser();
  const [selected, setSelected] = useState<string[]>(profile.equipment || []);
  const [location, setLocation] = useState<'home' | 'gym'>(profile.workoutLocation || 'home');

  const toggle = (id: string) => {
    if (id === 'none') { setSelected(['none']); return; }
    setSelected((prev) => {
      const withoutNone = prev.filter((e) => e !== 'none');
      return withoutNone.includes(id) ? withoutNone.filter((e) => e !== id) : [...withoutNone, id];
    });
  };

  const handleNext = async () => {
    const eq = selected.length === 0 ? ['none'] : selected;
    await updateProfile({ equipment: eq, workoutLocation: location });
    router.push('/(onboarding)/limitations');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader step={5} total={8} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What equipment do you have?</Text>

        {/* Location toggle */}
        <View style={styles.locationRow}>
          {(['home', 'gym'] as const).map((loc) => (
            <TouchableOpacity key={loc} style={[styles.locBtn, location === loc && styles.locBtnActive]} onPress={() => setLocation(loc)}>
              <Text style={[styles.locText, location === loc && styles.locTextActive]}>
                {loc === 'home' ? '🏠 I work out at home' : '🏋️ I go to a gym'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.grid}>
          {EQUIPMENT.map((eq) => {
            const active = selected.includes(eq.id);
            return (
              <TouchableOpacity key={eq.id} style={[styles.card, active && styles.cardActive]} onPress={() => toggle(eq.id)}>
                <Text style={styles.eqIcon}>{eq.icon}</Text>
                <Text style={[styles.eqLabel, active && styles.activeText]}>{eq.label}</Text>
                <Text style={[styles.eqDesc, active && styles.activeDesc]}>{eq.desc}</Text>
                {active && <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>}
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
  locationRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  locBtn: { flex: 1, borderRadius: 12, borderWidth: 2, borderColor: '#E5E7EB', paddingVertical: 12, alignItems: 'center' },
  locBtnActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  locText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  locTextActive: { color: '#2563EB' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', borderRadius: 16, borderWidth: 2, borderColor: '#E5E7EB', padding: 14, alignItems: 'center', position: 'relative' },
  cardActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  eqIcon: { fontSize: 28, marginBottom: 6 },
  eqLabel: { fontSize: 13, fontWeight: '700', color: '#111827', textAlign: 'center' },
  activeText: { color: '#2563EB' },
  eqDesc: { fontSize: 11, color: '#9CA3AF', marginTop: 2, textAlign: 'center' },
  activeDesc: { color: '#60A5FA' },
  check: { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  checkText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  footer: { padding: 24, paddingBottom: 32 },
  btn: { backgroundColor: '#2563EB', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
