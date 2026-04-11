import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateBMI } from '../utils/calculations';

const USER_KEY = 'pulserise_user_profile';

const defaultProfile = {
  id: null,
  name: '',
  email: '',
  gender: null,
  age: null,
  height: { value: 170, unit: 'cm' },
  currentWeight: { value: 70, unit: 'kg' },
  targetWeight: null,
  bmi: null,
  fitnessLevel: null,
  goals: [],
  schedule: { daysPerWeek: 3, selectedDays: ['mon', 'wed', 'fri'], sessionDuration: 30, preferredTime: 'flexible' },
  equipment: [],
  workoutLocation: 'home',
  injuries: [],
  preferences: { lowImpact: false, quietWorkouts: false, noFloorExercises: false },
  workoutStyle: null,
  onboardingComplete: false,
};

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(USER_KEY)
      .then((raw) => { if (raw) setProfile(JSON.parse(raw)); })
      .finally(() => setLoading(false));
  }, []);

  const updateProfile = async (updates) => {
    const updated = { ...profile, ...updates };
    // Recalculate BMI when weight/height change
    if (updates.currentWeight || updates.height) {
      const heightCm = updated.height.unit === 'cm' ? updated.height.value : updated.height.value * 2.54;
      const weightKg = updated.currentWeight.unit === 'kg' ? updated.currentWeight.value : updated.currentWeight.value / 2.20462;
      updated.bmi = calculateBMI(weightKg, heightCm);
    }
    setProfile(updated);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
    return updated;
  };

  const clearProfile = async () => {
    setProfile(defaultProfile);
    await AsyncStorage.removeItem(USER_KEY);
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, clearProfile, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

export default UserContext;
