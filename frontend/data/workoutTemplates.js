// Workout structure templates for different splits and styles

export const workoutSplits = {
  2: { name: 'Full Body', days: ['full_body', 'full_body'], description: 'Train all muscle groups each session' },
  3: { name: 'Full Body', days: ['full_body', 'full_body', 'full_body'], description: 'Train all muscle groups each session' },
  4: { name: 'Upper/Lower', days: ['upper', 'lower', 'upper', 'lower'], description: 'Alternate between upper and lower body' },
  5: { name: 'Push/Pull/Legs + Upper/Lower', days: ['push', 'pull', 'legs', 'upper', 'lower'], description: 'Mixed split for optimal recovery' },
  6: { name: 'Push/Pull/Legs x2', days: ['push', 'pull', 'legs', 'push', 'pull', 'legs'], description: 'Train each muscle group twice per week' },
  7: { name: 'Bro Split + Active Recovery', days: ['chest', 'back', 'shoulders', 'legs', 'arms', 'full_body', 'active_recovery'], description: 'Dedicated days for each muscle group' },
};

export const dayTypeMuscleMap = {
  full_body: ['quadriceps', 'glutes', 'hamstrings', 'chest', 'back', 'shoulders', 'core'],
  upper: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'core'],
  lower: ['quadriceps', 'glutes', 'hamstrings', 'calves', 'core'],
  push: ['chest', 'shoulders', 'triceps'],
  pull: ['back', 'biceps', 'rear_delts'],
  legs: ['quadriceps', 'glutes', 'hamstrings', 'calves'],
  chest: ['chest', 'triceps'],
  back: ['back', 'biceps', 'rear_delts'],
  shoulders: ['shoulders', 'trapezius'],
  arms: ['biceps', 'triceps', 'forearms'],
  core: ['core', 'obliques'],
  active_recovery: ['full_body'],
};

export const hiitTemplates = {
  beginner: { workInterval: 30, restInterval: 30, rounds: 3, exercisesPerRound: 4 },
  intermediate: { workInterval: 40, restInterval: 20, rounds: 4, exercisesPerRound: 5 },
  advanced: { workInterval: 45, restInterval: 15, rounds: 5, exercisesPerRound: 6 },
};

export const strengthTemplates = {
  beginner: { sets: 3, repRange: { min: 10, max: 15 }, restSeconds: 90 },
  intermediate: { sets: 4, repRange: { min: 8, max: 12 }, restSeconds: 75 },
  advanced: { sets: 5, repRange: { min: 6, max: 10 }, restSeconds: 60 },
};

export const circuitTemplates = {
  beginner: { rounds: 2, exercisesPerRound: 5, restBetweenExercises: 30, restBetweenRounds: 90 },
  intermediate: { rounds: 3, exercisesPerRound: 6, restBetweenExercises: 20, restBetweenRounds: 60 },
  advanced: { rounds: 4, exercisesPerRound: 8, restBetweenExercises: 15, restBetweenRounds: 45 },
};

export const workoutNameParts = {
  full_body: ['Total Body Burn', 'Full Body Blast', 'Complete Body Workout', 'All-In-One Training'],
  upper: ['Upper Body Power', 'Pushing Limits', 'Upper Body Builder', 'Chest & Back Focus'],
  lower: ['Leg Day', 'Lower Body Strength', 'Quad & Glute Focus', 'Leg Builder'],
  push: ['Push Day', 'Chest & Shoulders', 'Push Strength', 'Press & Fly'],
  pull: ['Pull Day', 'Back & Biceps', 'Pull Strength', 'Row & Pull'],
  legs: ['Leg Destroyer', 'Quad Killer', 'Lower Body Power', 'Leg Day'],
  chest: ['Chest Day', 'Pec Builder', 'Chest & Tri', 'Bench Day'],
  back: ['Back Day', 'Back & Bi', 'Pull Workout', 'Back Builder'],
  shoulders: ['Shoulder Day', 'Delt Builder', 'Overhead Press Day', 'Boulder Shoulders'],
  arms: ['Arm Day', 'Bi & Tri', 'Gun Show', 'Arm Builder'],
  active_recovery: ['Active Recovery', 'Mobility Flow', 'Light Movement', 'Recovery Session'],
};

export const sampleWeeklyPlan = {
  userId: 'sample',
  weekNumber: 1,
  totalWeeks: 12,
  days: [
    {
      dayOfWeek: 'Monday', dayKey: 'mon',
      workout: { id: 'w1', name: 'Upper Body Power', duration: 45, difficulty: 'intermediate', style: 'strength', estimatedCalories: 280, exerciseCount: 7, targetMuscles: ['chest', 'back', 'shoulders'] },
    },
    { dayOfWeek: 'Tuesday', dayKey: 'tue', workout: null },
    {
      dayOfWeek: 'Wednesday', dayKey: 'wed',
      workout: { id: 'w2', name: 'Leg Day', duration: 45, difficulty: 'intermediate', style: 'strength', estimatedCalories: 320, exerciseCount: 7, targetMuscles: ['quadriceps', 'glutes', 'hamstrings'] },
    },
    { dayOfWeek: 'Thursday', dayKey: 'thu', workout: null },
    {
      dayOfWeek: 'Friday', dayKey: 'fri',
      workout: { id: 'w3', name: 'Full Body HIIT', duration: 30, difficulty: 'intermediate', style: 'hiit', estimatedCalories: 350, exerciseCount: 8, targetMuscles: ['full_body'] },
    },
    { dayOfWeek: 'Saturday', dayKey: 'sat', workout: null },
    { dayOfWeek: 'Sunday', dayKey: 'sun', workout: null },
  ],
};
