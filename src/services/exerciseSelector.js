import { exerciseDatabase } from '../data/exercises';

// Filter exercises based on user profile constraints
export const filterExercises = (equipment = [], injuries = [], preferences = {}, fitnessLevel = 'beginner') => {
  const normalizedEquipment = ['none', ...equipment];

  return exerciseDatabase.filter((ex) => {
    // Equipment check
    const hasEquipment = ex.equipment.some((eq) => normalizedEquipment.includes(eq));
    if (!hasEquipment) return false;

    // Injury check
    if (injuries.length > 0 && ex.contraindications?.some((c) => injuries.includes(c))) return false;

    // Preference checks
    if (preferences.lowImpact && ex.isHighImpact) return false;
    if (preferences.quietWorkouts && !ex.isQuiet) return false;
    if (preferences.noFloorExercises && ex.requiresFloor) return false;

    // Level check — don't give advanced exercises to beginners
    if (fitnessLevel === 'beginner' && ex.difficulty === 'advanced') return false;

    return true;
  });
};

// Get exercises for a specific day type
export const getExercisesForDayType = (dayType, filteredExercises) => {
  const categoryMap = {
    full_body: ['lower_body', 'upper_push', 'upper_pull', 'core'],
    upper: ['upper_push', 'upper_pull', 'core'],
    lower: ['lower_body', 'core'],
    push: ['upper_push', 'core'],
    pull: ['upper_pull', 'core'],
    legs: ['lower_body', 'core'],
    chest: ['upper_push'],
    back: ['upper_pull'],
    shoulders: ['upper_push'],
    arms: ['upper_push', 'upper_pull'],
    active_recovery: ['warmup', 'cooldown'],
  };

  const categories = categoryMap[dayType] || ['lower_body', 'upper_push', 'upper_pull', 'core'];
  return filteredExercises.filter((ex) => categories.includes(ex.category));
};

// Pick n random items from an array
export const pickRandom = (arr, n) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};

// Find easier variation of an exercise
export const findEasierVariation = (exerciseId) => {
  const exercise = exerciseDatabase.find((e) => e.id === exerciseId);
  if (!exercise) return null;
  if (exercise.easierVariation) return exerciseDatabase.find((e) => e.id === exercise.easierVariation);
  // Fall back to a beginner exercise in the same category
  return exerciseDatabase.find((e) => e.category === exercise.category && e.difficulty === 'beginner' && e.id !== exerciseId) || null;
};

// Find harder variation of an exercise
export const findHarderVariation = (exerciseId) => {
  const exercise = exerciseDatabase.find((e) => e.id === exerciseId);
  if (!exercise) return null;
  if (exercise.harderVariation) return exerciseDatabase.find((e) => e.id === exercise.harderVariation);
  return exerciseDatabase.find((e) => e.category === exercise.category && e.difficulty === 'advanced' && e.id !== exerciseId) || null;
};

// Select warm-up exercises relevant to day type
export const selectWarmupExercises = (dayType, filteredExercises) => {
  const warmups = filteredExercises.filter((e) => e.category === 'warmup');
  return pickRandom(warmups.length >= 4 ? warmups : exerciseDatabase.filter((e) => e.category === 'warmup'), 4);
};

// Select cool-down exercises relevant to day type
export const selectCooldownExercises = (dayType, filteredExercises) => {
  const cooldowns = filteredExercises.filter((e) => e.category === 'cooldown');
  return pickRandom(cooldowns.length >= 4 ? cooldowns : exerciseDatabase.filter((e) => e.category === 'cooldown'), 4);
};
