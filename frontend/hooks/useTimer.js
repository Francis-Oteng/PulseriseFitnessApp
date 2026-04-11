import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialSeconds = 0, onComplete = null) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
    setIsRunning(false);
    clear();
  }, []);

  const reset = useCallback((newSeconds) => {
    clear();
    setSeconds(newSeconds !== undefined ? newSeconds : initialSeconds);
    setIsRunning(false);
    setIsPaused(false);
  }, [initialSeconds]);

  const skip = useCallback(() => {
    clear();
    setSeconds(0);
    setIsRunning(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clear();
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clear;
  }, [isRunning, isPaused, onComplete]);

  return { seconds, isRunning, isPaused, start, pause, reset, skip };
};

// Stopwatch (counts up)
export const useStopwatch = () => {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setElapsed(0); };

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else if (ref.current) {
      clearInterval(ref.current);
    }
    return () => clearInterval(ref.current);
  }, [running]);

  return { elapsed, running, start, pause, reset };
};
