import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';

const GOALS = [
  { id: 'lose_weight', label: 'Lose Weight', icon: '⚡', description: 'Burn fat and get leaner' },
  { id: 'build_muscle', label: 'Build Muscle', icon: '💪', description: 'Increase strength and mass' },
  { id: 'improve_endurance', label: 'Improve Endurance', icon: '🏃', description: 'Boost cardio fitness' },
  { id: 'stay_active', label: 'Stay Active', icon: '🌟', description: 'Maintain a healthy lifestyle' },
  { id: 'sport_specific', label: 'Sport Specific', icon: '🏆', description: 'Train for your sport' },
  { id: 'flexibility', label: 'Flexibility', icon: '🧘', description: 'Improve mobility and flexibility' },
];

const GOALS_KEY = '@pulserise_goals';

export default function GoalsScreen() {
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    if (selectedGoals.length === 0) {
      return;
    }
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(selectedGoals));
    router.push('/(onboarding)/fitness-level');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
          <Text style={styles.step}>Step 2 of 4</Text>
          <Text style={styles.title}>Your Goals</Text>
          <Text style={styles.subtitle}>Select all that apply to your fitness journey</Text>
        </View>

        <View style={styles.grid}>
          {GOALS.map((goal) => {
            const selected = selectedGoals.includes(goal.id);
            return (
              <TouchableOpacity
                key={goal.id}
                style={[styles.goalCard, selected && styles.goalCardSelected]}
                onPress={() => toggleGoal(goal.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.goalIcon}>{goal.icon}</Text>
                <Text style={[styles.goalLabel, selected && styles.goalLabelSelected]}>
                  {goal.label}
                </Text>
                <Text style={[styles.goalDesc, selected && styles.goalDescSelected]}>
                  {goal.description}
                </Text>
                {selected && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, selectedGoals.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedGoals.length === 0}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.brand.primary },
  content: { flexGrow: 1, padding: 24, paddingTop: 60 },
  header: { marginBottom: 32 },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: { height: '100%', backgroundColor: Colors.brand.white, borderRadius: 2 },
  step: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.brand.white, marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  goalCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  goalCardSelected: {
    backgroundColor: Colors.brand.white,
    borderColor: Colors.brand.white,
  },
  goalIcon: { fontSize: 32, marginBottom: 8 },
  goalLabel: { color: Colors.brand.white, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  goalLabelSelected: { color: Colors.brand.primary },
  goalDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  goalDescSelected: { color: 'rgba(6,15,138,0.7)' },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: { color: Colors.brand.white, fontSize: 11, fontWeight: '700' },
  nextButton: {
    backgroundColor: Colors.brand.white,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 32,
  },
  nextButtonDisabled: { opacity: 0.4 },
  nextButtonText: { color: Colors.brand.primary, fontSize: 16, fontWeight: '700' },
});
