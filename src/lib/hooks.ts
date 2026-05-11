"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useLocalState<T>(key: string, fallback: T) {
  const [state, setState] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, [key]);

  const set = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [key]
  );

  return [state, set, loaded] as const;
}

export function useRestTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [targetSeconds, setTargetSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback((durationSeconds: number) => {
    setTargetSeconds(durationSeconds);
    setSeconds(durationSeconds);
    setRunning(true);
    startTimeRef.current = Date.now();

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, durationSeconds - elapsed);
      setSeconds(Math.ceil(remaining));

      if (remaining <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRunning(false);
        try {
          if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
        } catch {
          // vibration not supported
        }
      }
    }, 250);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setSeconds(0);
  }, []);

  const addTime = useCallback(
    (extraSeconds: number) => {
      if (!running) return;
      const newTarget = targetSeconds + extraSeconds;
      setTargetSeconds(newTarget);
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, newTarget - elapsed);
      setSeconds(Math.ceil(remaining));
    },
    [running, targetSeconds]
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { seconds, running, targetSeconds, start, stop, addTime };
}
