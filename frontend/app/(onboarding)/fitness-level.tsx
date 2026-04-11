import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { useUser } from '@/contexts/UserContext';

const LEVELS = [
  { id: 'beginner', label: 'Beginner', icon: '🌱', desc: 'New to exercise or returning after 6+ months', examples: 'Walking, basic stretching, light activities' },
  { id: 'intermediate', label: 'Intermediate', icon: '🔥', desc: 'Exercise regularly (1–3× per week)', examples: 'Gym sessions, jogging, group fitness classes' },
  { id: 'advanced', label: 'Advanced', icon: '⚡', desc: 'Consistent training (4+ times per week)', examples: 'Weightlifting, CrossFit, competitive sports' },
];

export default function FitnessLevelScreen() {
  const { profile, updateProfile } = useUser();
  const [selected, setSelected] = useState<string | null>(profile.fitnessLevel || null);

  const handleNext = async () => {
    if (!selected) return;
    await updateProfile({ fitnessLevel: selected });
    router.push('/(onboarding)/parameters');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader step={2} total={8} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.question}>How would you describe your current fitness level?</Text>
        <View style={styles.cards}>
          {LEVELS.map((l) => {
            const active = selected === l.id;
            return (
              <TouchableOpacity key={l.id} style={[styles.card, active && styles.cardActive]} onPress={() => setSelected(l.id)} activeOpacity={0.8}>
                <View style={styles.cardTop}>
                  <Text style={styles.icon}>{l.icon}</Text>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardLabel, active && styles.activeLabel]}>{l.label}</Text>
                    <Text style={[styles.cardDesc, active && styles.activeDesc]}>{l.desc}</Text>
                  </View>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                </View>
                <Text style={[styles.examples, active && styles.examplesActive]}>e.g. {l.examples}</Text>
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
  question: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 20, marginTop: 4 },
  cards: { gap: 14 },
  card: { borderRadius: 16, borderWidth: 2, borderColor: '#E5E7EB', padding: 18, backgroundColor: '#fff' },
  cardActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  icon: { fontSize: 32 },
  cardInfo: { flex: 1 },
  cardLabel: { fontSize: 18, fontWeight: '700', color: '#111827' },
  activeLabel: { color: '#2563EB' },
  cardDesc: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  activeDesc: { color: '#3B82F6' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#2563EB', backgroundColor: '#2563EB' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  examples: { fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' },
  examplesActive: { color: '#60A5FA' },
  footer: { padding: 24, paddingBottom: 32 },
  btn: { backgroundColor: '#2563EB', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { backgroundColor: '#93C5FD' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
