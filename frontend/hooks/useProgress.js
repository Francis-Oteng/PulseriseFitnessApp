import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateStreak } from '../utils/calculations';
import { achievements, levelSystem, streakRewards } from '../data/achievements';

const HISTORY_KEY = 'pulserise_workout_history';
const STATS_KEY = 'pulserise_user_stats';

export const useProgress = (userId) => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalWorkouts: 0, totalMinutes: 0, currentStreak: 0, longestStreak: 0, totalCaloriesBurned: 0, xp: 0 });
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [rawHistory, rawStats, rawAch] = await Promise.all([
        AsyncStorage.getItem(HISTORY_KEY),
        AsyncStorage.getItem(STATS_KEY),
        AsyncStorage.getItem(`pulserise_achievements_${userId}`),
      ]);
      if (rawHistory) setHistory(JSON.parse(rawHistory));
      if (rawStats) setStats(JSON.parse(rawStats));
      if (rawAch) setUnlockedAchievements(JSON.parse(rawAch));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const saveWorkout = useCallback(async (workout) => {
    const newHistory = [workout, ...history].slice(0, 100);
    const streak = calculateStreak(newHistory);
    const xpEarned = levelSystem.calculateXP(workout);

    const newStats = {
      ...stats,
      totalWorkouts: stats.totalWorkouts + 1,
      totalMinutes: stats.totalMinutes + (workout.durationMinutes || 0),
      currentStreak: streak,
      longestStreak: Math.max(stats.longestStreak, streak),
      totalCaloriesBurned: stats.totalCaloriesBurned + (workout.estimatedCalories || 0),
      xp: (stats.xp || 0) + xpEarned,
    };

    // Check for new achievements
    const newlyUnlocked = achievements.filter((ach) => {
      if (unlockedAchievements.includes(ach.id)) return false;
      const { type, value } = ach.condition;
      if (type === 'totalWorkouts') return newStats.totalWorkouts >= value;
      if (type === 'streak') return newStats.currentStreak >= value;
      if (type === 'totalMinutes') return newStats.totalMinutes >= value;
      return false;
    });

    const allAchievements = [...unlockedAchievements, ...newlyUnlocked.map((a) => a.id)];

    await Promise.all([
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory)),
      AsyncStorage.setItem(STATS_KEY, JSON.stringify(newStats)),
      AsyncStorage.setItem(`pulserise_achievements_${userId}`, JSON.stringify(allAchievements)),
    ]);

    setHistory(newHistory);
    setStats(newStats);
    setUnlockedAchievements(allAchievements);

    return { xpEarned, newAchievements: newlyUnlocked };
  }, [history, stats, unlockedAchievements, userId]);

  const levelInfo = levelSystem.getLevelForXP(stats.xp || 0);

  return { history, stats, unlockedAchievements, loading, saveWorkout, levelInfo };
};
