"use client";

import React, { createContext, useContext } from "react";
import { useRestTimer } from "./hooks";

type TimerContextType = ReturnType<typeof useRestTimer>;

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const timer = useRestTimer();
  return (
    <TimerContext.Provider value={timer}>{children}</TimerContext.Provider>
  );
}

export function useTimer(): TimerContextType {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used within TimerProvider");
  return ctx;
}
