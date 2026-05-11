"use client";

import { useState, useCallback, useEffect } from "react";
import { Plus, TrendingUp, TrendingDown, Minus, History } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createOrGetSession,
  updateSession,
  getLastSessionForExercise,
  getSettings,
} from "@/lib/store";
import { WorkoutTemplate, SetLog, WorkoutSession } from "@/lib/types";
import { useTimer } from "@/lib/timer-context";

interface ExerciseLoggerProps {
  programId: string;
  dayNumber: number;
  workoutId: string;
  dateStr: string;
  workout: WorkoutTemplate;
}

export default function ExerciseLogger({
  programId,
  dayNumber,
  workoutId,
  dateStr,
  workout,
}: ExerciseLoggerProps) {
  const [session, setSession] = useState<WorkoutSession>(() =>
    createOrGetSession(programId, dayNumber, workoutId, dateStr)
  );
  const timer = useTimer();

  const persist = useCallback(
    (updated: WorkoutSession) => {
      setSession(updated);
      updateSession(updated.id, () => updated);
    },
    []
  );

  const handleSetChange = useCallback(
    (exIdx: number, setIdx: number, field: "weightKg" | "actualReps", value: number | null) => {
      setSession((prev) => {
        const updated = { ...prev, exercises: prev.exercises.map((ex, ei) => {
          if (ei !== exIdx) return ex;
          return { ...ex, sets: ex.sets.map((s, si) => {
            if (si !== setIdx) return s;
            return { ...s, [field]: value };
          })};
        })};
        updateSession(updated.id, () => updated);
        return updated;
      });
    },
    []
  );

  const handleSetComplete = useCallback(
    (exIdx: number, setIdx: number) => {
      setSession((prev) => {
        const exercise = prev.exercises[exIdx];
        const set = exercise.sets[setIdx];
        const newCompleted = !set.completed;

        const updated = { ...prev, exercises: prev.exercises.map((ex, ei) => {
          if (ei !== exIdx) return ex;
          return { ...ex, sets: ex.sets.map((s, si) => {
            if (si !== setIdx) return s;
            return { ...s, completed: newCompleted };
          })};
        })};

        updateSession(updated.id, () => updated);

        if (newCompleted) {
          const template = workout.exercises[exIdx];
          if (template) {
            const settings = getSettings();
            const restTime = settings.restTimerDefaults[template.category];
            timer.start(restTime);
          }
        }

        return updated;
      });
    },
    [workout.exercises, timer]
  );

  const handleAddSet = useCallback(
    (exIdx: number) => {
      setSession((prev) => {
        const exercise = prev.exercises[exIdx];
        const lastSet = exercise.sets[exercise.sets.length - 1];
        const newSet: SetLog = {
          setNumber: exercise.sets.length + 1,
          targetRepsMin: lastSet?.targetRepsMin ?? 8,
          targetRepsMax: lastSet?.targetRepsMax ?? 12,
          weightKg: lastSet?.weightKg ?? null,
          actualReps: null,
          completed: false,
        };
        const updated = { ...prev, exercises: prev.exercises.map((ex, ei) => {
          if (ei !== exIdx) return ex;
          return { ...ex, sets: [...ex.sets, newSet] };
        })};
        updateSession(updated.id, () => updated);
        return updated;
      });
    },
    []
  );

  const handleNotesChange = useCallback(
    (notes: string) => {
      const updated = { ...session, notes };
      persist(updated);
    },
    [session, persist]
  );

  return (
    <div className="space-y-4">
      {session.exercises.map((exerciseLog, exIdx) => {
        const template = workout.exercises[exIdx];
        const lastSession = getLastSessionForExercise(
          exerciseLog.exerciseId,
          session.id
        );

        const currentVolume = exerciseLog.sets
          .filter((s) => s.completed && s.weightKg && s.actualReps)
          .reduce((sum, s) => sum + (s.weightKg ?? 0) * (s.actualReps ?? 0), 0);
        const lastVolume = lastSession
          ? lastSession
              .filter((s) => s.completed && s.weightKg && s.actualReps)
              .reduce((sum, s) => sum + (s.weightKg ?? 0) * (s.actualReps ?? 0), 0)
          : 0;

        return (
          <div key={exerciseLog.exerciseId} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold">
                  {exerciseLog.exerciseName}
                </span>
                {template && (
                  <span className="ml-2 text-xs text-muted">
                    {template.sets}×{template.repsMin}–{template.repsMax} RIR{" "}
                    {template.rirMin}–{template.rirMax}
                  </span>
                )}
              </div>
              {lastVolume > 0 && currentVolume > 0 && (
                <div className="flex items-center gap-1">
                  {currentVolume > lastVolume ? (
                    <TrendingUp size={14} className="text-success" />
                  ) : currentVolume < lastVolume ? (
                    <TrendingDown size={14} className="text-danger" />
                  ) : (
                    <Minus size={14} className="text-muted" />
                  )}
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-lg border border-white/5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-muted">
                    <th className="w-10 py-2 text-center font-medium">Set</th>
                    <th className="py-2 text-center font-medium">Target</th>
                    <th className="py-2 text-center font-medium">kg</th>
                    <th className="py-2 text-center font-medium">Reps</th>
                    <th className="w-12 py-2 text-center font-medium">✓</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciseLog.sets.map((set, setIdx) => {
                    const lastSet = lastSession?.[setIdx];
                    return (
                      <tr
                        key={set.setNumber}
                        className={cn(
                          "border-b border-white/5 transition-colors",
                          set.completed && "bg-success/5"
                        )}
                      >
                        <td className="py-2 text-center font-mono text-muted">
                          {set.setNumber}
                        </td>
                        <td className="py-2 text-center text-muted">
                          {set.targetRepsMin}–{set.targetRepsMax}
                        </td>
                        <td className="py-2 text-center">
                          <input
                            type="number"
                            inputMode="decimal"
                            placeholder={lastSet?.weightKg?.toString() ?? "—"}
                            value={set.weightKg ?? ""}
                            onChange={(e) =>
                              handleSetChange(
                                exIdx,
                                setIdx,
                                "weightKg",
                                e.target.value ? parseFloat(e.target.value) : null
                              )
                            }
                            className="w-14 rounded bg-white/10 px-2 py-1.5 text-center text-sm font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                          />
                        </td>
                        <td className="py-2 text-center">
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder={lastSet?.actualReps?.toString() ?? "—"}
                            value={set.actualReps ?? ""}
                            onChange={(e) =>
                              handleSetChange(
                                exIdx,
                                setIdx,
                                "actualReps",
                                e.target.value ? parseInt(e.target.value) : null
                              )
                            }
                            className="w-14 rounded bg-white/10 px-2 py-1.5 text-center text-sm font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                          />
                        </td>
                        <td className="py-2 text-center">
                          <button
                            onClick={() => handleSetComplete(exIdx, setIdx)}
                            className={cn(
                              "mx-auto flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all",
                              set.completed
                                ? "border-success bg-success text-white"
                                : "border-white/20"
                            )}
                          >
                            {set.completed && (
                              <svg width="12" height="12" viewBox="0 0 12 12">
                                <path
                                  d="M2 6l3 3 5-5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => handleAddSet(exIdx)}
              className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-foreground"
            >
              <Plus size={12} /> Add Set
            </button>

            {lastSession && lastSession.some((s) => s.weightKg !== null) && (
              <div className="flex items-center gap-1.5 text-[10px] text-muted">
                <History size={10} />
                Last:{" "}
                {lastSession
                  .filter((s) => s.weightKg !== null)
                  .map((s) => `${s.weightKg}/${s.actualReps ?? "?"}`)
                  .join(", ")}
              </div>
            )}
          </div>
        );
      })}

      <div className="pt-2">
        <label className="mb-1 block text-xs text-muted">Notes</label>
        <textarea
          placeholder="How it felt, extra sets, abs, cardio…"
          value={session.notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted/50 outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}
