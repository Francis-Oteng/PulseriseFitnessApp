import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useWorkout } from '@/contexts/WorkoutContext';

const SAMPLE_WORKOUTS: Record<string, { name: string; description: string; duration: string; difficulty: string; emoji: string; exercises: { id: string; name: string; sets: number; reps: number; weight?: number; restDuration: number; notes?: string }[] }> = {
  '1': {
    name: 'Full Body Strength',
    description: 'A comprehensive full body workout targeting all major muscle groups for maximum strength gains.',
    duration: '45 min',
    difficulty: 'Intermediate',
    emoji: '💪',
    exercises: [
      { id: 'e1', name: 'Barbell Squat', sets: 4, reps: 8, weight: 80, restDuration: 90, notes: 'Keep chest up' },
      { id: 'e2', name: 'Bench Press', sets: 4, reps: 8, weight: 70, restDuration: 90 },
      { id: 'e3', name: 'Deadlift', sets: 3, reps: 6, weight: 100, restDuration: 120 },
      { id: 'e4', name: 'Pull-Ups', sets: 3, reps: 10, restDuration: 60 },
      { id: 'e5', name: 'Overhead Press', sets: 3, reps: 8, weight: 50, restDuration: 90 },
      { id: 'e6', name: 'Barbell Row', sets: 3, reps: 10, weight: 60, restDuration: 60 },
      { id: 'e7', name: 'Dips', sets: 3, reps: 12, restDuration: 60 },
      { id: 'e8', name: 'Plank', sets: 3, reps: 1, restDuration: 30, notes: 'Hold 60 seconds' },
    ],
  },
  '2': {
    name: 'HIIT Cardio Blast',
    description: 'High intensity interval training to torch calories and boost cardiovascular fitness.',
    duration: '30 min',
    difficulty: 'Advanced',
    emoji: '🔥',
    exercises: [
      { id: 'e1', name: 'Burpees', sets: 4, reps: 15, restDuration: 30 },
      { id: 'e2', name: 'Jump Squats', sets: 4, reps: 20, restDuration: 30 },
      { id: 'e3', name: 'Mountain Climbers', sets: 4, reps: 30, restDuration: 30 },
      { id: 'e4', name: 'High Knees', sets: 4, reps: 40, restDuration: 30 },
      { id: 'e5', name: 'Box Jumps', sets: 3, reps: 12, restDuration: 45 },
      { id: 'e6', name: 'Jump Rope', sets: 4, reps: 1, restDuration: 30, notes: '1 minute each set' },
    ],
  },
};

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { startSession, startRestTimer, completeExercise, endSession, currentSession } = useWorkout();
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);

  const workout = SAMPLE_WORKOUTS[id ?? ''] ?? SAMPLE_WORKOUTS['1'];

  const handleStartWorkout = () => {
    startSession(id ?? '1');
  };

  const handleCompleteSet = (exercise: { id: string; restDuration: number }) => {
    startRestTimer(exercise.restDuration);
    router.push('/workout/rest-timer');
  };

  const handleCompleteExercise = (exerciseId: string) => {
    setCompletedExercises((prev) => [...prev, exerciseId]);
    completeExercise(exerciseId);
  };

  const handleFinishWorkout = () => {
    Alert.alert(
      'Finish Workout',
      'Great work! Do you want to save this workout session?',
      [
        { text: 'Discard', style: 'destructive', onPress: () => { endSession(); router.back(); } },
        { text: 'Save', onPress: () => { endSession('Completed workout session'); router.back(); } },
      ]
    );
  };

  const isSessionActive = currentSession?.workoutId === (id ?? '1');
  const progress = workout.exercises.length > 0
    ? completedExercises.length / workout.exercises.length
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Workout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero section */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{workout.emoji}</Text>
          <Text style={styles.heroTitle}>{workout.name}</Text>
          <Text style={styles.heroDesc}>{workout.description}</Text>
          <View style={styles.heroMeta}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>⏱ {workout.duration}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>📊 {workout.difficulty}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>🏋️ {workout.exercises.length} exercises</Text>
            </View>
          </View>
        </View>

        {/* Progress bar */}
        {isSessionActive && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPct}>{Math.round(progress * 100)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
          </View>
        )}

        {/* Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {workout.exercises.map((exercise, index) => {
            const done = completedExercises.includes(exercise.id);
            return (
              <View key={exercise.id} style={[styles.exerciseCard, done && styles.exerciseCardDone]}>
                <View style={styles.exerciseNum}>
                  <Text style={[styles.exerciseNumText, done && styles.exerciseNumTextDone]}>
                    {done ? '✓' : index + 1}
                  </Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={[styles.exerciseName, done && styles.exerciseNameDone]}>
                    {exercise.name}
                  </Text>
                  <Text style={styles.exerciseMeta}>
                    {exercise.sets} sets × {exercise.reps === 1 ? 'hold' : `${exercise.reps} reps`}
                    {exercise.weight ? ` @ ${exercise.weight}kg` : ''}
                  </Text>
                  {exercise.notes && (
                    <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
                  )}
                  <Text style={styles.exerciseRest}>Rest: {exercise.restDuration}s</Text>
                </View>
                {isSessionActive && !done && (
                  <View style={styles.exerciseActions}>
                    <TouchableOpacity
                      style={styles.restBtn}
                      onPress={() => handleCompleteSet(exercise)}
                    >
                      <Text style={styles.restBtnText}>Rest</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.doneBtn}
                      onPress={() => handleCompleteExercise(exercise.id)}
                    >
                      <Text style={styles.doneBtnText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom action */}
      <View style={styles.bottomBar}>
        {!isSessionActive ? (
          <TouchableOpacity style={styles.actionBtn} onPress={handleStartWorkout}>
            <Text style={styles.actionBtnText}>Start Workout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.finishBtn} onPress={handleFinishWorkout}>
            <Text style={styles.finishBtnText}>Finish Workout</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.brand.primary },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { color: Colors.brand.white, fontSize: 24 },
  navTitle: { color: Colors.brand.white, fontSize: 16, fontWeight: '700' },
  hero: { padding: 20, alignItems: 'center', paddingTop: 8 },
  heroEmoji: { fontSize: 64, marginBottom: 12 },
  heroTitle: { color: Colors.brand.white, fontSize: 26, fontWeight: '800', textAlign: 'center' },
  heroDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  heroMeta: { flexDirection: 'row', gap: 8, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' },
  metaBadge: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  metaText: { color: Colors.brand.white, fontSize: 12, fontWeight: '600' },
  progressSection: { paddingHorizontal: 20, marginBottom: 8 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  progressPct: { color: Colors.brand.white, fontWeight: '700', fontSize: 13 },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: Colors.brand.white, borderRadius: 3 },
  section: { padding: 20, paddingTop: 8 },
  sectionTitle: { color: Colors.brand.white, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  exerciseCard: {
    backgroundColor: Colors.brand.cardBackground,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  exerciseCardDone: { opacity: 0.6 },
  exerciseNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseNumText: { color: Colors.brand.white, fontWeight: '700', fontSize: 13 },
  exerciseNumTextDone: { color: Colors.brand.success },
  exerciseInfo: { flex: 1 },
  exerciseName: { color: Colors.brand.white, fontWeight: '700', fontSize: 15 },
  exerciseNameDone: { textDecorationLine: 'line-through' },
  exerciseMeta: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 },
  exerciseNotes: { color: Colors.brand.accent, fontSize: 12, marginTop: 4 },
  exerciseRest: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 },
  exerciseActions: { gap: 6 },
  restBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  restBtnText: { color: Colors.brand.white, fontSize: 12, fontWeight: '600' },
  doneBtn: {
    backgroundColor: Colors.brand.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  doneBtnText: { color: Colors.brand.primary, fontSize: 12, fontWeight: '700' },
  bottomBar: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  actionBtn: {
    backgroundColor: Colors.brand.white,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  actionBtnText: { color: Colors.brand.primary, fontSize: 16, fontWeight: '700' },
  finishBtn: {
    backgroundColor: Colors.brand.success,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  finishBtnText: { color: Colors.brand.white, fontSize: 16, fontWeight: '700' },
});
