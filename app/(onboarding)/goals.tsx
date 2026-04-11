import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../src/context/UserContext';
import OnboardingHeader from '../../src/components/onboarding/OnboardingHeader';

const GOALS = [
  { id: 'lose_weight', label: 'Lose Weight', desc: 'Burn fat and get leaner', icon: '🔥' },
  { id: 'build_muscle', label: 'Build Muscle', desc: 'Increase strength and size', icon: '💪' },
  { id: 'improve_endurance', label: 'Improve Endurance', desc: 'Boost stamina and cardio', icon: '🏃' },
  { id: 'get_toned', label: 'Get Toned', desc: 'Define muscles without bulk', icon: '✨' },
  { id: 'increase_flexibility', label: 'Increase Flexibility', desc: 'Improve mobility and recovery', icon: '🧘' },
  { id: 'reduce_stress', label: 'Reduce Stress', desc: 'Feel better mentally and physically', icon: '🌿' },
  { id: 'stay_active', label: 'Stay Active', desc: 'Maintain general fitness', icon: '⚡' },
];

export default function GoalsScreen() {
  const { profile, updateProfile } = useUser();
  const [selected, setSelected] = useState<string[]>(profile.goals?.map((g: any) => g.id) || []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((g) => g !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleNext = async () => {
    await updateProfile({ goals: selected.map((id, i) => ({ id, priority: i + 1 })) });
    router.push('/(onboarding)/fitness-level');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader step={1} total={8} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.question}>What do you want to achieve?</Text>
        <Text style={styles.subtitle}>Select up to 3 goals · tap to rank by priority</Text>
        <View style={styles.list}>
          {GOALS.map((g) => {
            const isSelected = selected.includes(g.id);
            const priority = selected.indexOf(g.id) + 1;
            return (
              <TouchableOpacity key={g.id} style={[styles.card, isSelected && styles.cardSelected]} onPress={() => toggle(g.id)} activeOpacity={0.8}>
                <Text style={styles.goalIcon}>{g.icon}</Text>
                <View style={styles.goalText}>
                  <Text style={[styles.goalLabel, isSelected && styles.selectedText]}>{g.label}</Text>
                  <Text style={[styles.goalDesc, isSelected && styles.selectedDesc]}>{g.desc}</Text>
                </View>
                {isSelected && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{priority}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.btn, selected.length === 0 && styles.btnDisabled]} onPress={handleNext} disabled={selected.length === 0}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingHorizontal: 24, paddingBottom: 24 },
  question: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 6, marginTop: 4 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  list: { gap: 12 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 2, borderColor: '#E5E7EB', padding: 16, gap: 14, backgroundColor: '#fff' },
  cardSelected: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  goalIcon: { fontSize: 28 },
  goalText: { flex: 1 },
  goalLabel: { fontSize: 16, fontWeight: '700', color: '#111827' },
  goalDesc: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  selectedText: { color: '#2563EB' },
  selectedDesc: { color: '#3B82F6' },
  badge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  footer: { padding: 24, paddingBottom: 32 },
  btn: { backgroundColor: '#2563EB', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { backgroundColor: '#93C5FD' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
