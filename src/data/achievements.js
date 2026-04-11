export const achievements = [
  // Consistency
  { id: 'first_workout', name: 'First Step', description: 'Complete your first workout', icon: '🎯', category: 'consistency', xpReward: 50, condition: { type: 'totalWorkouts', value: 1 } },
  { id: 'three_in_a_row', name: 'On A Roll', description: 'Work out 3 days in a row', icon: '🔥', category: 'streak', xpReward: 75, condition: { type: 'streak', value: 3 } },
  { id: 'week_warrior', name: 'Week Warrior', description: 'Work out 7 days in a row', icon: '⚡', category: 'streak', xpReward: 150, condition: { type: 'streak', value: 7 } },
  { id: 'two_weeks_strong', name: 'Two Weeks Strong', description: '14 day workout streak', icon: '💎', category: 'streak', xpReward: 300, condition: { type: 'streak', value: 14 } },
  { id: 'month_master', name: 'Month Master', description: 'Work out for 30 days straight', icon: '👑', category: 'streak', xpReward: 600, condition: { type: 'streak', value: 30 } },
  // Volume
  { id: 'ten_workouts', name: 'Getting Started', description: 'Complete 10 workouts', icon: '✅', category: 'volume', xpReward: 100, condition: { type: 'totalWorkouts', value: 10 } },
  { id: 'fifty_workouts', name: 'Halfway There', description: 'Complete 50 workouts', icon: '🏅', category: 'volume', xpReward: 250, condition: { type: 'totalWorkouts', value: 50 } },
  { id: 'century', name: 'Century', description: 'Complete 100 workouts', icon: '💯', category: 'volume', xpReward: 500, condition: { type: 'totalWorkouts', value: 100 } },
  { id: 'thousand_reps', name: 'Rep Machine', description: 'Complete 1,000 total reps', icon: '🔄', category: 'volume', xpReward: 200, condition: { type: 'totalReps', value: 1000 } },
  // Strength
  { id: 'pushup_pro', name: 'Pushup Pro', description: 'Do 50 pushups in one workout', icon: '💪', category: 'strength', xpReward: 150, condition: { type: 'singleWorkoutReps', exerciseId: 'pushup_standard', value: 50 } },
  { id: 'squat_king', name: 'Squat Royalty', description: 'Do 100 squats in one day', icon: '🦵', category: 'strength', xpReward: 150, condition: { type: 'dailyReps', exerciseId: 'squat_bodyweight', value: 100 } },
  { id: 'plank_master', name: 'Plank Master', description: 'Hold a plank for 3 minutes', icon: '🧘', category: 'strength', xpReward: 200, condition: { type: 'timedExercise', exerciseId: 'plank_standard', value: 180 } },
  // Time of day
  { id: 'early_bird', name: 'Early Bird', description: 'Complete 10 morning workouts', icon: '🌅', category: 'time', xpReward: 100, condition: { type: 'morningWorkouts', value: 10 } },
  { id: 'night_owl', name: 'Night Owl', description: 'Complete 10 evening workouts', icon: '🌙', category: 'time', xpReward: 100, condition: { type: 'eveningWorkouts', value: 10 } },
  { id: 'hour_of_power', name: 'Hour of Power', description: 'Complete a 60-minute workout', icon: '⏰', category: 'time', xpReward: 100, condition: { type: 'singleWorkoutDuration', value: 60 } },
  { id: 'ten_hours', name: 'Time Investor', description: 'Log 10 total hours of training', icon: '📈', category: 'time', xpReward: 200, condition: { type: 'totalMinutes', value: 600 } },
  // Journey
  { id: 'program_week1', name: 'Week One Done', description: 'Complete your first week of training', icon: '🌱', category: 'journey', xpReward: 100, condition: { type: 'weeksCompleted', value: 1 } },
  { id: 'program_month1', name: 'One Month In', description: 'Complete one month of training', icon: '📅', category: 'journey', xpReward: 300, condition: { type: 'weeksCompleted', value: 4 } },
  { id: 'journey_complete', name: 'Journey Complete', description: 'Finish a 12-week program', icon: '🏆', category: 'journey', xpReward: 1000, condition: { type: 'weeksCompleted', value: 12 } },
  // Special
  { id: 'comeback_kid', name: 'Comeback Kid', description: 'Return after missing 7+ days', icon: '🦅', category: 'special', xpReward: 100, condition: { type: 'returnAfterBreak', value: 7 } },
  { id: 'variety_pack', name: 'Variety Pack', description: 'Try 5 different workout styles', icon: '🎨', category: 'special', xpReward: 150, condition: { type: 'uniqueWorkoutStyles', value: 5 } },
];

export const levelSystem = {
  levels: [
    { level: 1, xpRequired: 0, title: 'Newcomer' },
    { level: 2, xpRequired: 100, title: 'Beginner' },
    { level: 3, xpRequired: 300, title: 'Regular' },
    { level: 4, xpRequired: 600, title: 'Committed' },
    { level: 5, xpRequired: 1000, title: 'Dedicated' },
    { level: 6, xpRequired: 1500, title: 'Consistent' },
    { level: 7, xpRequired: 2200, title: 'Driven' },
    { level: 8, xpRequired: 3000, title: 'Athlete' },
    { level: 9, xpRequired: 4000, title: 'Performer' },
    { level: 10, xpRequired: 5000, title: 'Elite' },
    { level: 15, xpRequired: 10000, title: 'Champion' },
    { level: 20, xpRequired: 18000, title: 'Legend' },
  ],
  calculateXP: (workout) => {
    let xp = 0;
    xp += (workout.durationMinutes || 0) * 2;
    xp += (workout.exercisesCompleted || 0) * 10;
    if (workout.completedFully) xp += 50;
    if (workout.personalRecord) xp += 100;
    return xp;
  },
  getLevelForXP: (totalXP) => {
    const levels = [
      { level: 1, xpRequired: 0, title: 'Newcomer' },
      { level: 2, xpRequired: 100, title: 'Beginner' },
      { level: 3, xpRequired: 300, title: 'Regular' },
      { level: 4, xpRequired: 600, title: 'Committed' },
      { level: 5, xpRequired: 1000, title: 'Dedicated' },
      { level: 6, xpRequired: 1500, title: 'Consistent' },
      { level: 7, xpRequired: 2200, title: 'Driven' },
      { level: 8, xpRequired: 3000, title: 'Athlete' },
      { level: 9, xpRequired: 4000, title: 'Performer' },
      { level: 10, xpRequired: 5000, title: 'Elite' },
    ];
    let current = levels[0];
    for (const lvl of levels) {
      if (totalXP >= lvl.xpRequired) current = lvl;
      else break;
    }
    const nextLevel = levels.find((l) => l.xpRequired > totalXP);
    return {
      ...current,
      nextLevel: nextLevel || null,
      xpToNext: nextLevel ? nextLevel.xpRequired - totalXP : 0,
      progressPercent: nextLevel
        ? ((totalXP - current.xpRequired) / (nextLevel.xpRequired - current.xpRequired)) * 100
        : 100,
    };
  },
};

export const streakRewards = [
  { days: 3, reward: 'Bronze Flame', xp: 50, icon: '🔥' },
  { days: 7, reward: 'Silver Flame', xp: 100, icon: '🔥' },
  { days: 14, reward: 'Gold Flame', xp: 200, icon: '💛' },
  { days: 30, reward: 'Platinum Flame', xp: 500, icon: '💜' },
  { days: 60, reward: 'Diamond Flame', xp: 1000, icon: '💎' },
  { days: 100, reward: 'Legendary Flame', xp: 2000, icon: '👑' },
];

export const dummyUser = {
  id: 'user_001',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  fitnessLevel: 'intermediate',
  goals: [{ id: 'build_muscle', priority: 1 }, { id: 'lose_weight', priority: 2 }],
  schedule: { daysPerWeek: 4, selectedDays: ['mon', 'wed', 'fri', 'sat'], sessionDuration: 45, preferredTime: 'morning' },
  equipment: ['dumbbells', 'pull_up_bar', 'bench'],
  workoutLocation: 'home',
  injuries: [],
  preferences: { lowImpact: false, quietWorkouts: false, noFloorExercises: false },
  workoutStyle: 'strength',
  gender: 'male',
  age: 28,
  height: { value: 178, unit: 'cm' },
  currentWeight: { value: 82, unit: 'kg' },
  targetWeight: { value: 78, unit: 'kg' },
  bmi: 25.9,
  stats: {
    totalWorkouts: 47,
    totalMinutes: 1410,
    currentStreak: 12,
    longestStreak: 18,
    totalCaloriesBurned: 14200,
    joinDate: '2024-01-15',
    lastWorkoutDate: new Date().toISOString(),
  },
  xp: 1850,
  unlockedAchievements: ['first_workout', 'ten_workouts', 'week_warrior', 'early_bird'],
};

export const dummyWorkoutHistory = [
  { id: 'h1', date: new Date(Date.now() - 86400000 * 1).toISOString(), workoutName: 'Upper Body Power', workoutType: 'strength', durationMinutes: 45, totalVolume: 4200, exerciseCount: 7, estimatedCalories: 280, completed: true },
  { id: 'h2', date: new Date(Date.now() - 86400000 * 2).toISOString(), workoutName: 'Leg Day', workoutType: 'strength', durationMinutes: 50, totalVolume: 5100, exerciseCount: 7, estimatedCalories: 340, completed: true },
  { id: 'h3', date: new Date(Date.now() - 86400000 * 3).toISOString(), workoutName: 'Full Body HIIT', workoutType: 'hiit', durationMinutes: 30, totalVolume: 0, exerciseCount: 8, estimatedCalories: 380, completed: true },
  { id: 'h4', date: new Date(Date.now() - 86400000 * 5).toISOString(), workoutName: 'Push Day', workoutType: 'strength', durationMinutes: 45, totalVolume: 3800, exerciseCount: 6, estimatedCalories: 260, completed: true },
  { id: 'h5', date: new Date(Date.now() - 86400000 * 6).toISOString(), workoutName: 'Pull Day', workoutType: 'strength', durationMinutes: 40, totalVolume: 3600, exerciseCount: 6, estimatedCalories: 240, completed: false },
];
