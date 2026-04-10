import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatTime } from '@/utils/SafeNumberUtils';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restDuration: number;
  imageUrl?: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  scheduledDays: number[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSession {
  workoutId: string;
  startTime: string;
  endTime?: string;
  completedExercises: string[];
  notes?: string;
}

interface WorkoutContextType {
  workouts: Workout[];
  currentSession: WorkoutSession | null;
  restTimerActive: boolean;
  restTimeRemaining: number;
  restFormattedTime: string;
  startRestTimer: (duration: number) => void;
  stopRestTimer: () => void;
  startSession: (workoutId: string) => void;
  completeExercise: (exerciseId: string) => void;
  endSession: (notes?: string) => void;
  addWorkout: (workout: Workout) => void;
  removeWorkout: (workoutId: string) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const WORKOUTS_KEY = '@pulserise_workouts';

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [restTimerActive, setRestTimerActive] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const playBeep = async () => {
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/beep.mp3'),
        { shouldPlay: true }
      );
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch {
      // Audio may not be available in all environments
    }
  };

  const startRestTimer = (duration: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRestTimeRemaining(duration);
    setRestTimerActive(true);
    timerRef.current = setInterval(() => {
      setRestTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setRestTimerActive(false);
          playBeep();
          return 0;
        }
        if (prev === 4) playBeep();
        return prev - 1;
      });
    }, 1000);
  };

  const stopRestTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRestTimerActive(false);
    setRestTimeRemaining(0);
  };

  const startSession = (workoutId: string) => {
    setCurrentSession({
      workoutId,
      startTime: new Date().toISOString(),
      completedExercises: [],
    });
  };

  const completeExercise = (exerciseId: string) => {
    setCurrentSession((prev) =>
      prev
        ? { ...prev, completedExercises: [...prev.completedExercises, exerciseId] }
        : null
    );
  };

  const endSession = async (notes?: string) => {
    if (!currentSession) return;
    const session: WorkoutSession = {
      ...currentSession,
      endTime: new Date().toISOString(),
      notes,
    };
    stopRestTimer();
    // Persist session to storage
    const existing = await AsyncStorage.getItem('@pulserise_sessions');
    const sessions: WorkoutSession[] = existing ? JSON.parse(existing) : [];
    sessions.push(session);
    await AsyncStorage.setItem('@pulserise_sessions', JSON.stringify(sessions));
    setCurrentSession(null);
  };

  const addWorkout = (workout: Workout) => {
    setWorkouts((prev) => {
      const updated = [...prev, workout];
      AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeWorkout = (workoutId: string) => {
    setWorkouts((prev) => {
      const updated = prev.filter((w) => w.id !== workoutId);
      AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        currentSession,
        restTimerActive,
        restTimeRemaining,
        restFormattedTime: formatTime(restTimeRemaining),
        startRestTimer,
        stopRestTimer,
        startSession,
        completeExercise,
        endSession,
        addWorkout,
        removeWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout(): WorkoutContextType {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
