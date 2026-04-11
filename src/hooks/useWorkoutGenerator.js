import { useState, useCallback } from 'react';
import { generateWorkoutPlan } from '../services/workoutGenerator';

export const useWorkoutGenerator = () => {
  const [plan, setPlan] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async (userProfile) => {
    setGenerating(true);
    setError(null);
    try {
      // Simulate AI processing delay
      await new Promise((r) => setTimeout(r, 2500));
      const generated = generateWorkoutPlan(userProfile);
      setPlan(generated);
      return generated;
    } catch (err) {
      setError(err.message || 'Failed to generate workout plan');
      return null;
    } finally {
      setGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPlan(null);
    setError(null);
  }, []);

  return { plan, generating, error, generate, reset };
};
