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

const FITNESS_LEVELS = [
  {
    id: 'beginner',
    label: 'Beginner',
    icon: '🌱',
    description: 'New to fitness or returning after a long break. Focus on building habits.',
    workoutsPerWeek: '2–3 workouts',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    icon: '🔥',
    description: 'Active for 6+ months with consistent training. Ready to push harder.',
    workoutsPerWeek: '3–5 workouts',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: '⚡',
    description: 'Experienced athlete with 2+ years of training. High intensity focus.',
    workoutsPerWeek: '5–6 workouts',
  },
];

const FITNESS_LEVEL_KEY = '@pulserise_fitness_level';

export default function FitnessLevelScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = async () => {
    if (!selected) return;
    await AsyncStorage.setItem(FITNESS_LEVEL_KEY, selected);
    router.push('/(onboarding)/training-days');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '75%' }]} />
          </View>
          <Text style={styles.step}>Step 3 of 4</Text>
          <Text style={styles.title}>Fitness Level</Text>
          <Text style={styles.subtitle}>Choose what best describes your current fitness</Text>
        </View>

        <View style={styles.cards}>
          {FITNESS_LEVELS.map((level) => {
            const isSelected = selected === level.id;
            return (
              <TouchableOpacity
                key={level.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelected(level.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.icon}>{level.icon}</Text>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                      {level.label}
                    </Text>
                    <Text style={[styles.cardFreq, isSelected && styles.cardFreqSelected]}>
                      {level.workoutsPerWeek}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.radioSelected}>
                      <View style={styles.radioDot} />
                    </View>
                  )}
                  {!isSelected && <View style={styles.radio} />}
                </View>
                <Text style={[styles.cardDesc, isSelected && styles.cardDescSelected]}>
                  {level.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selected}
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
  cards: { gap: 16 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    backgroundColor: Colors.brand.white,
    borderColor: Colors.brand.white,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  icon: { fontSize: 36 },
  cardInfo: { flex: 1 },
  cardLabel: { color: Colors.brand.white, fontSize: 18, fontWeight: '700' },
  cardLabelSelected: { color: Colors.brand.primary },
  cardFreq: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  cardFreqSelected: { color: 'rgba(6,15,138,0.6)' },
  cardDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18 },
  cardDescSelected: { color: 'rgba(6,15,138,0.7)' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  radioSelected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.brand.white,
  },
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
