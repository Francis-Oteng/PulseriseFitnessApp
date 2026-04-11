// Progressive overload and deload algorithms

// Double progression: add reps until top of range, then increase weight
export const doubleProgression = (currentReps, repRange, currentWeight, weightUnit) => {
  if (currentReps >= repRange.max) {
    const increment = weightUnit === 'kg' ? 2.5 : 5;
    return { action: 'increase_weight', newWeight: currentWeight + increment, newReps: repRange.min };
  }
  return { action: 'increase_reps', newReps: currentReps + 1 };
};

// Linear progression: add weight each week
export const linearProgression = (weekNumber, startingWeight, weightUnit) => {
  const increment = weightUnit === 'kg' ? 2.5 : 5;
  return { newWeight: startingWeight + weekNumber * increment };
};

// Volume progression: add sets over time
export const volumeProgression = (weekNumber, startingSets) => ({
  newSets: Math.min(startingSets + Math.floor(weekNumber / 2), 5),
});

// Determine if deload week is needed
export const shouldDeload = (stats) => {
  const { weeksSincePlanStart, consecutiveHardWeeks } = stats;
  if (weeksSincePlanStart > 0 && weeksSincePlanStart % 5 === 0) return true;
  if (consecutiveHardWeeks >= 3) return true;
  return false;
};

// Generate a deload version of a workout
export const generateDeloadWorkout = (workout) => ({
  ...workout,
  isDeload: true,
  message: 'Recovery week — focus on form and mobility',
  exercises: workout.exercises.map((ex) => ({
    ...ex,
    sets: Math.ceil((ex.sets || 3) * 0.6),
    weight: ex.weight ? ex.weight * 0.6 : null,
  })),
});

// Process post-workout feedback and return adjustment multipliers
export const processFeedback = (feedback) => {
  const adjustments = { intensityMultiplier: 1.0, volumeChange: 0, exerciseSwaps: [] };

  if (feedback.difficulty === 'too_easy') {
    adjustments.intensityMultiplier = 1.15;
    adjustments.volumeChange = 1;
  } else if (feedback.difficulty === 'too_hard') {
    adjustments.intensityMultiplier = 0.85;
    adjustments.volumeChange = -1;
  }

  if (feedback.energyLevel === 'low') adjustments.intensityMultiplier *= 0.9;
  if (feedback.energyLevel === 'high') adjustments.intensityMultiplier *= 1.05;

  return adjustments;
};

// Configure sets/reps/rest for an exercise based on goal + style + level
export const configureExerciseParameters = (exercise, style, level, primaryGoal) => {
  let sets = 3, repMin = 10, repMax = 15, restSeconds = 60, duration = null;

  // Goal-based defaults
  if (primaryGoal === 'build_muscle') {
    sets = 4; repMin = 8; repMax = 12; restSeconds = 90;
  } else if (primaryGoal === 'lose_weight') {
    sets = 3; repMin = 12; repMax = 15; restSeconds = 45;
  } else if (primaryGoal === 'increase_strength') {
    sets = 5; repMin = 4; repMax = 6; restSeconds = 120;
  }

  // Style overrides
  if (style === 'hiit') {
    duration = 30; restSeconds = 15; sets = 1; repMin = null; repMax = null;
  } else if (style === 'circuit') {
    restSeconds = 30; repMin = 12; repMax = 12;
  }

  // Level adjustments
  if (level === 'beginner') {
    sets = Math.max(2, sets - 1);
    restSeconds = Math.min(90, restSeconds + 15);
    if (repMin) repMin = Math.max(6, repMin - 2);
  } else if (level === 'advanced') {
    sets = sets + 1;
    restSeconds = Math.max(30, restSeconds - 15);
    if (repMax) repMax = repMax + 2;
  }

  return {
    exerciseId: exercise.id,
    sets,
    reps: repMin && repMax ? { min: repMin, max: repMax } : null,
    duration,
    restSeconds,
    type: exercise.type,
  };
};
