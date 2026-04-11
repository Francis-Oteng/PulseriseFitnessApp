import 'react-native-get-random-values';
import { workoutSplits, workoutNameParts, dayTypeMuscleMap } from '../data/workoutTemplates';
import { filterExercises, getExercisesForDayType, pickRandom, selectWarmupExercises, selectCooldownExercises } from './exerciseSelector';
import { configureExerciseParameters } from './progressiveOverload';
import { estimateCalories } from '../utils/calculations';

const generateId = () => Math.random().toString(36).substr(2, 9);

const pickWorkoutName = (dayType) => {
  const names = workoutNameParts[dayType] || ['Workout'];
  return names[Math.floor(Math.random() * names.length)];
};

// Determine split based on days per week
export const determineSplit = (daysPerWeek) => workoutSplits[daysPerWeek] || workoutSplits[3];

// Select the right number of exercises for duration
const exerciseCountForDuration = (duration, style) => {
  const mainMinutes = duration - 8; // subtract warmup + cooldown
  if (style === 'hiit') return Math.floor(mainMinutes / 5); // ~5 min per HIIT exercise with rest
  if (style === 'circuit') return Math.min(8, Math.floor(mainMinutes / 4));
  return Math.min(7, Math.floor(mainMinutes / 6)); // ~6 min per strength exercise
};

// Generate main workout block
const buildMainBlock = (dayType, exercises, duration, style, level, goals) => {
  const primaryGoal = goals?.[0]?.id || 'general';
  const count = exerciseCountForDuration(duration, style);
  const pool = getExercisesForDayType(dayType, exercises).filter(
    (e) => e.category !== 'warmup' && e.category !== 'cooldown' && e.category !== 'cardio'
  );

  // Compound first, then isolation, then one core
  const compounds = pool.filter((e) => ['squat', 'hinge', 'push', 'pull'].includes(e.movementPattern));
  const isolation = pool.filter((e) => !['squat', 'hinge', 'push', 'pull', 'core'].includes(e.movementPattern));
  const coreEx = pool.filter((e) => e.movementPattern === 'core');

  let selected = [];
  selected.push(...pickRandom(compounds, Math.ceil(count * 0.6)));
  selected.push(...pickRandom(isolation.filter((e) => !selected.includes(e)), Math.ceil(count * 0.3)));
  if (dayType !== 'legs' && dayType !== 'lower' && coreEx.length > 0) {
    const coreSelected = pickRandom(coreEx.filter((e) => !selected.includes(e)), 1);
    selected.push(...coreSelected);
  }

  // Trim to count
  selected = selected.slice(0, count);

  // If HIIT, add cardio
  if (style === 'hiit') {
    const { exerciseDatabase } = require('../data/exercises');
    const cardio = exerciseDatabase.filter((e) => e.category === 'cardio' && exercises.includes(e));
    selected = [...pickRandom(cardio.length ? cardio : exerciseDatabase.filter((e) => e.category === 'cardio'), Math.ceil(count * 0.4)), ...selected].slice(0, count);
  }

  return selected.map((ex) => ({
    ...ex,
    ...configureExerciseParameters(ex, style, level, primaryGoal),
  }));
};

// Generate a single workout day
export const generateSingleWorkout = (dayType, filteredExercises, duration, style, goals, level) => {
  const warmup = selectWarmupExercises(dayType, filteredExercises);
  const mainExercises = buildMainBlock(dayType, filteredExercises, duration, style, level, goals);
  const cooldown = selectCooldownExercises(dayType, filteredExercises);

  const workout = {
    id: generateId(),
    name: pickWorkoutName(dayType),
    dayType,
    duration,
    difficulty: level,
    style,
    targetMuscles: dayTypeMuscleMap[dayType] || [],
    warmup: { durationMinutes: 5, exercises: warmup },
    mainWorkout: { exercises: mainExercises },
    cooldown: { durationMinutes: 3, exercises: cooldown },
    exerciseCount: mainExercises.length,
    estimatedCalories: estimateCalories(duration, level, style),
    createdAt: new Date().toISOString(),
  };

  return workout;
};

// Generate a full weekly plan
export const generateWorkoutPlan = (userProfile) => {
  const { schedule, equipment, injuries, preferences, fitnessLevel, goals, workoutStyle } = userProfile;
  const daysPerWeek = schedule?.daysPerWeek || 3;
  const sessionDuration = schedule?.sessionDuration || 30;
  const selectedDays = schedule?.selectedDays || ['mon', 'wed', 'fri'];

  const split = determineSplit(daysPerWeek);
  const filteredExercises = filterExercises(equipment || [], injuries || [], preferences || {}, fitnessLevel);

  const weeklyPlan = split.days.map((dayType, i) => ({
    dayKey: selectedDays[i] || `day${i + 1}`,
    dayOfWeek: getDayLabel(selectedDays[i]),
    workout: generateSingleWorkout(dayType, filteredExercises, sessionDuration, workoutStyle || 'mixed', goals || [], fitnessLevel),
  }));

  return {
    id: generateId(),
    userId: userProfile.id,
    splitName: split.name,
    splitDescription: split.description,
    weekNumber: 1,
    totalWeeks: 12,
    daysPerWeek,
    days: weeklyPlan,
    createdAt: new Date().toISOString(),
  };
};

const DAY_LABELS = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
const getDayLabel = (key) => DAY_LABELS[key] || key || 'Day';
