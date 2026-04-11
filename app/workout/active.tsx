import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useWorkout } from '../../src/context/WorkoutContext';
import { useProgressContext } from '../../src/context/ProgressContext';
import { useTimer } from '../../src/hooks/useTimer';
import { useStopwatch } from '../../src/hooks/useTimer';
import { formatDuration } from '../../src/utils/formatters';
import { findEasierVariation } from '../../src/services/exerciseSelector';

type Phase = 'exercise' | 'rest' | 'done';

export default function ActiveWorkoutScreen() {
  const {
    activeWorkout, currentExercise, currentExercises,
    activeExerciseIndex, activeSetIndex,
    isLastExercise, isLastSet, progressPercent,
    completeSet, nextSet, nextExercise, endWorkout,
  } = useWorkout();
  const { saveWorkout } = useProgressContext();
  const { elapsed, start: startStopwatch } = useStopwatch();
  const [phase, setPhase] = useState<Phase>('exercise');
  const [feedback, setFeedback] = useState<string | null>(null);
  const restSeconds = currentExercise?.restSeconds || 60;
  const restTimer = useTimer(restSeconds, () => setPhase('exercise'));

  useEffect(() => { startStopwatch(); }, []);

  if (!activeWorkout || !currentExercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.noWorkout}>No active workout</Text>
          <TouchableOpacity onPress={() => router.back()}><Text style={styles.backLink}>Go back</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSetDone = () => {
    completeSet(currentExercise.exerciseId || currentExercise.id, currentExercise.reps?.max || currentExercise.defaultReps || 10);
    if (isLastSet) {
      if (isLastExercise) {
        finishWorkout();
      } else {
        nextExercise();
        setPhase('rest');
        restTimer.reset(restSeconds);
        restTimer.start();
      }
    } else {
      nextSet();
      setPhase('rest');
      restTimer.reset(restSeconds);
      restTimer.start();
    }
    setFeedback(null);
  };

  const handleCantDo = () => {
    Alert.alert('Alternative Exercise', 'Would you like an easier variation?', [
      { text: 'Skip Exercise', onPress: () => { if (!isLastExercise) nextExercise(); else finishWorkout(); } },
      { text: 'Try Easier', onPress: () => {} },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const finishWorkout = async () => {
    const result = endWorkout();
    await saveWorkout({ ...result, durationMinutes: Math.round(elapsed / 60), completedFully: true });
    router.replace('/workout/complete');
  };

  const confirmExit = () => {
    Alert.alert('Exit Workout?', 'Your progress will be lost.', [
      { text: 'Keep Going', style: 'cancel' },
      { text: 'Exit', style: 'destructive', onPress: () => { endWorkout(); router.back(); } },
    ]);
  };

  const repsDisplay = currentExercise.duration
    ? `${currentExercise.duration}s`
    : currentExercise.reps
    ? `${currentExercise.reps.min}–${currentExercise.reps.max} reps`
    : `${currentExercise.defaultReps || 10} reps`;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={confirmExit} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{activeWorkout.name}</Text>
          <Text style={styles.headerSub}>{activeExerciseIndex + 1} of {currentExercises.length} exercises</Text>
        </View>
        <Text style={styles.elapsed}>{formatDuration(elapsed)}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      {phase === 'rest' ? (
        <View style={styles.restScreen}>
          <Text style={styles.restLabel}>REST</Text>
          <Text style={styles.restCountdown}>{formatDuration(restTimer.seconds)}</Text>
          <Text style={styles.restNext}>Next: {currentExercises[activeExerciseIndex + (isLastSet && !isLastExercise ? 1 : 0)]?.name || 'Done'}</Text>
          <TouchableOpacity style={styles.skipRestBtn} onPress={() => { restTimer.skip(); setPhase('exercise'); }}>
            <Text style={styles.skipRestText}>Skip Rest →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.exerciseScroll} showsVerticalScrollIndicator={false}>
          {/* Exercise display */}
          <View style={styles.exerciseHero}>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <View style={styles.setIndicatorRow}>
              {Array.from({ length: currentExercise.sets || 3 }).map((_, i) => (
                <View key={i} style={[styles.setDot, i < activeSetIndex && styles.setDotDone, i === activeSetIndex && styles.setDotActive]} />
              ))}
            </View>
            <Text style={styles.setLabel}>Set {activeSetIndex + 1} of {currentExercise.sets || 3}</Text>
            <Text style={styles.repsTarget}>{repsDisplay}</Text>
          </View>

          {/* Instructions */}
          {currentExercise.instructions && (
            <View style={styles.instructions}>
              <Text style={styles.instructionsTitle}>How to do it</Text>
              {currentExercise.instructions.slice(0, 3).map((step: string, i: number) => (
                <Text key={i} style={styles.instructionStep}>{i + 1}. {step}</Text>
              ))}
            </View>
          )}

          {/* Quick feedback */}
          <View style={styles.feedbackRow}>
            {['too_easy', 'just_right', 'too_hard'].map((f) => (
              <TouchableOpacity key={f} style={[styles.feedBtn, feedback === f && styles.feedBtnActive]} onPress={() => setFeedback(f)}>
                <Text style={styles.feedBtnText}>{f === 'too_easy' ? 'Easy' : f === 'just_right' ? 'Good' : 'Hard'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Actions */}
          <TouchableOpacity style={styles.doneBtn} onPress={handleSetDone}>
            <Text style={styles.doneBtnText}>Complete Set</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cantBtn} onPress={handleCantDo}>
            <Text style={styles.cantBtnText}>Can't do this exercise</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  noWorkout: { fontSize: 16, color: '#9CA3AF' },
  backLink: { color: '#2563EB', marginTop: 8, fontSize: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerBtnText: { fontSize: 16, color: '#fff' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  elapsed: { fontSize: 15, fontWeight: '700', color: '#fff', minWidth: 48, textAlign: 'right' },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 16, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: '#2563EB', borderRadius: 2 },
  exerciseScroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  exerciseHero: { alignItems: 'center', marginBottom: 28 },
  exerciseName: { fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 16 },
  setIndicatorRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  setDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.2)' },
  setDotDone: { backgroundColor: '#10B981' },
  setDotActive: { backgroundColor: '#2563EB', width: 16 },
  setLabel: { fontSize: 14, color: '#9CA3AF', marginBottom: 8 },
  repsTarget: { fontSize: 44, fontWeight: '900', color: '#fff' },
  instructions: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginBottom: 20 },
  instructionsTitle: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', marginBottom: 10, letterSpacing: 1 },
  instructionStep: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 22, marginBottom: 4 },
  feedbackRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  feedBtn: { flex: 1, borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', paddingVertical: 10, alignItems: 'center' },
  feedBtnActive: { borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.2)' },
  feedBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  doneBtn: { backgroundColor: '#2563EB', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  doneBtnText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  cantBtn: { alignItems: 'center', paddingVertical: 12 },
  cantBtnText: { fontSize: 14, color: '#6B7280' },
  restScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  restLabel: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', letterSpacing: 2 },
  restCountdown: { fontSize: 72, fontWeight: '900', color: '#fff' },
  restNext: { fontSize: 15, color: '#6B7280' },
  skipRestBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 },
  skipRestText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
