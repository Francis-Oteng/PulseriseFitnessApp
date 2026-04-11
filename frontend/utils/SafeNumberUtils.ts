/**
 * SafeNumberUtils - Utility functions for safe number operations.
 * Prevents NaN, Infinity, and other edge cases in numeric computations.
 */

/**
 * Safely parses a value as a number, returning a default if the result is invalid.
 */
export function safeParseNumber(value: unknown, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue;
  const parsed = Number(value);
  if (!isFinite(parsed) || isNaN(parsed)) return defaultValue;
  return parsed;
}

/**
 * Clamps a number between min and max values.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(safeParseNumber(value, min), min), max);
}

/**
 * Formats seconds into MM:SS display format.
 */
export function formatTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(safeParseNumber(totalSeconds, 0)));
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

/**
 * Formats seconds into a human-readable duration string.
 */
export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(safeParseNumber(totalSeconds, 0)));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

/**
 * Calculates BMI safely.
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const weight = safeParseNumber(weightKg, 0);
  const height = safeParseNumber(heightCm, 0);
  if (height <= 0 || weight <= 0) return 0;
  const heightM = height / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

/**
 * Returns a BMI category label.
 */
export function getBMICategory(bmi: number): string {
  const value = safeParseNumber(bmi, 0);
  if (value < 18.5) return 'Underweight';
  if (value < 25) return 'Normal weight';
  if (value < 30) return 'Overweight';
  return 'Obese';
}

/**
 * Calculates percentage safely, avoiding division by zero.
 */
export function safePercentage(part: number, total: number): number {
  const p = safeParseNumber(part, 0);
  const t = safeParseNumber(total, 0);
  if (t <= 0) return 0;
  return clamp((p / t) * 100, 0, 100);
}
