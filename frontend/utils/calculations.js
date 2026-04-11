// BMI, calorie, and fitness calculations

export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
};

export const getBMICategory = (bmi) => {
  if (!bmi) return null;
  if (bmi < 18.5) return { label: 'Underweight', color: '#3B82F6' };
  if (bmi < 25) return { label: 'Normal', color: '#10B981' };
  if (bmi < 30) return { label: 'Overweight', color: '#F59E0B' };
  return { label: 'Obese', color: '#EF4444' };
};

export const cmToFeetInches = (cm) => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches, display: `${feet}'${inches}"` };
};

export const feetInchesToCm = (feet, inches) => Math.round((feet * 12 + inches) * 2.54);

export const kgToLbs = (kg) => parseFloat((kg * 2.20462).toFixed(1));
export const lbsToKg = (lbs) => parseFloat((lbs / 2.20462).toFixed(1));

export const estimateCalories = (durationMinutes, fitnessLevel, style) => {
  const baseMET = { hiit: 10, strength: 5, circuit: 8, bodyweight: 6, mixed: 7 }[style] || 6;
  const levelMult = { beginner: 0.85, intermediate: 1.0, advanced: 1.15 }[fitnessLevel] || 1.0;
  // Assume average 70kg bodyweight for estimation
  return Math.round((baseMET * 70 * (durationMinutes / 60)) * levelMult);
};

export const calculateWorkoutVolume = (exercises) =>
  exercises.reduce((total, ex) => {
    if (ex.type === 'reps') return total + (ex.sets || 0) * (ex.reps || 0);
    return total;
  }, 0);

export const getProgressPercentage = (current, target) => {
  if (!target || target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
};

export const subtractDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

export const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

export const calculateStreak = (workoutHistory) => {
  if (!workoutHistory || workoutHistory.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const checkDate = subtractDays(today, i);
    const hadWorkout = workoutHistory.some(
      (w) => w.completed && isSameDay(new Date(w.date), checkDate)
    );
    if (hadWorkout) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
};

export const getWeeksSince = (dateString) => {
  const start = new Date(dateString);
  const now = new Date();
  const diffMs = now - start;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
};
