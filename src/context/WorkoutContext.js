import React, { createContext, useContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAN_KEY = 'pulserise_current_plan';

const WorkoutContext = createContext(null);

export const WorkoutProvider = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null); // workout being done right now
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [completedSets, setCompletedSets] = useState({}); // { exerciseId: [reps, reps, ...] }

  const savePlan = useCallback(async (plan) => {
    setCurrentPlan(plan);
    await AsyncStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  }, []);

  const loadPlan = useCallback(async () => {
    const raw = await AsyncStorage.getItem(PLAN_KEY);
    if (raw) setCurrentPlan(JSON.parse(raw));
  }, []);

  const startWorkout = useCallback((workout) => {
    setActiveWorkout(workout);
    setActiveExerciseIndex(0);
    setActiveSetIndex(0);
    setCompletedSets({});
    setWorkoutStartTime(new Date().toISOString());
  }, []);

  const completeSet = useCallback((exerciseId, reps) => {
    setCompletedSets((prev) => ({
      ...prev,
      [exerciseId]: [...(prev[exerciseId] || []), reps],
    }));
  }, []);

  const nextExercise = useCallback(() => {
    setActiveExerciseIndex((i) => i + 1);
    setActiveSetIndex(0);
  }, []);

  const nextSet = useCallback(() => {
    setActiveSetIndex((i) => i + 1);
  }, []);

  const endWorkout = useCallback(() => {
    const endTime = new Date();
    const startTime = workoutStartTime ? new Date(workoutStartTime) : endTime;
    const durationMinutes = Math.round((endTime - startTime) / 60000);
    const result = {
      ...activeWorkout,
      completedAt: endTime.toISOString(),
      durationMinutes,
      completedSets,
      date: endTime.toISOString(),
      completed: true,
    };
    setActiveWorkout(null);
    setCompletedSets({});
    setWorkoutStartTime(null);
    return result;
  }, [activeWorkout, completedSets, workoutStartTime]);

  const currentExercises = activeWorkout?.mainWorkout?.exercises || [];
  const currentExercise = currentExercises[activeExerciseIndex] || null;
  const isLastExercise = activeExerciseIndex >= currentExercises.length - 1;
  const isLastSet = currentExercise ? activeSetIndex >= (currentExercise.sets || 3) - 1 : false;
  const progressPercent = currentExercises.length ? Math.round((activeExerciseIndex / currentExercises.length) * 100) : 0;

  return (
    <WorkoutContext.Provider value={{
      currentPlan, savePlan, loadPlan,
      activeWorkout, startWorkout, endWorkout,
      activeExerciseIndex, activeSetIndex,
      currentExercise, currentExercises,
      isLastExercise, isLastSet, progressPercent,
      completedSets, completeSet, nextExercise, nextSet,
      workoutStartTime,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkout must be used within WorkoutProvider');
  return ctx;
};

export default WorkoutContext;
