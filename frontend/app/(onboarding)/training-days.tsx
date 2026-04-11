import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';

const DAYS = [
  { id: 1, label: 'Mon', full: 'Monday' },
  { id: 2, label: 'Tue', full: 'Tuesday' },
  { id: 3, label: 'Wed', full: 'Wednesday' },
  { id: 4, label: 'Thu', full: 'Thursday' },
  { id: 5, label: 'Fri', full: 'Friday' },
  { id: 6, label: 'Sat', full: 'Saturday' },
  { id: 0, label: 'Sun', full: 'Sunday' },
];

const TRAINING_DAYS_KEY = '@pulserise_training_days';

export default function TrainingDaysScreen() {
  const { setOnboarded } = useAuth();
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleDay = (id: number) => {
    setSelectedDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    if (selectedDays.length === 0) return;
    setSubmitting(true);
    try {
      await AsyncStorage.setItem(TRAINING_DAYS_KEY, JSON.stringify(selectedDays));
      await setOnboarded();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.step}>Step 4 of 4</Text>
          <Text style={styles.title}>Training Days</Text>
          <Text style={styles.subtitle}>Which days do you plan to train?</Text>
        </View>

        <View style={styles.daysContainer}>
          {DAYS.map((day) => {
            const selected = selectedDays.includes(day.id);
            return (
              <TouchableOpacity
                key={day.id}
                style={[styles.dayCard, selected && styles.dayCardSelected]}
                onPress={() => toggleDay(day.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dayShort, selected && styles.dayShortSelected]}>
                  {day.label}
                </Text>
                <Text style={[styles.dayFull, selected && styles.dayFullSelected]}>
                  {day.full}
                </Text>
                {selected && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {selectedDays.length === 0
              ? 'Select at least one training day'
              : `${selectedDays.length} day${selectedDays.length > 1 ? 's' : ''} selected`}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.finishButton, (selectedDays.length === 0 || submitting) && styles.buttonDisabled]}
          onPress={handleFinish}
          disabled={selectedDays.length === 0 || submitting}
        >
          <Text style={styles.finishButtonText}>
            {submitting ? 'Setting up...' : "Let's Go! 🚀"}
          </Text>
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
  daysContainer: { gap: 10 },
  dayCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayCardSelected: {
    backgroundColor: Colors.brand.white,
    borderColor: Colors.brand.white,
  },
  dayShort: {
    color: Colors.brand.white,
    fontSize: 18,
    fontWeight: '800',
    width: 48,
  },
  dayShortSelected: { color: Colors.brand.primary },
  dayFull: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    flex: 1,
  },
  dayFullSelected: { color: 'rgba(6,15,138,0.7)' },
  checkmark: { color: Colors.brand.primary, fontSize: 20, fontWeight: '700' },
  summary: { alignItems: 'center', marginTop: 20 },
  summaryText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  finishButton: {
    backgroundColor: Colors.brand.white,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.4 },
  finishButtonText: { color: Colors.brand.primary, fontSize: 16, fontWeight: '700' },
});
