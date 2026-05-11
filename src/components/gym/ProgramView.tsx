"use client";

import { useState, useMemo } from "react";
import { cn, toISODate, addDays, daysBetween } from "@/lib/utils";
import { PROGRAM, getWorkoutTemplate } from "@/lib/programs";
import { getSessions } from "@/lib/store";
import { MuscleGroup } from "@/lib/types";
import WorkoutCard from "./WorkoutCard";

const filterColors: Record<string, string> = {
  push: "text-push",
  pull: "text-pull",
  legs: "text-legs",
  upper: "text-upper",
  lower: "text-lower",
  rest: "text-rest",
};

export default function ProgramView() {
  const [filter, setFilter] = useState<MuscleGroup | "all">("all");

  const program = PROGRAM;
  const sessions = useMemo(() => getSessions(), []);

  const completedCount = sessions.filter(
    (s) => s.programId === program.id && s.completed
  ).length;

  const workoutDays = program.days.filter((d) => {
    const wt = getWorkoutTemplate(program.id, d.workoutId);
    return wt && wt.muscleGroup !== "rest";
  }).length;

  const restDays = program.days.length - workoutDays;

  const completedWorkouts = sessions.filter((s) => {
    if (s.programId !== program.id || !s.completed) return false;
    const wt = getWorkoutTemplate(program.id, s.workoutId);
    return wt && wt.muscleGroup !== "rest";
  }).length;

  const completedRests = completedCount - completedWorkouts;

  const pct = Math.round(
    (completedCount / program.days.length) * 100
  );

  const today = new Date();
  const startDate = new Date(program.startDate);
  const todayDayNumber = daysBetween(startDate, today) + 1;

  const muscleGroups = useMemo(() => {
    const groups = new Set<MuscleGroup>();
    program.days.forEach((d) => {
      const wt = getWorkoutTemplate(program.id, d.workoutId);
      if (wt) groups.add(wt.muscleGroup);
    });
    return Array.from(groups);
  }, [program]);

  const filteredDays = useMemo(() => {
    if (filter === "all") return program.days;
    return program.days.filter((d) => {
      const wt = getWorkoutTemplate(program.id, d.workoutId);
      return wt && wt.muscleGroup === filter;
    });
  }, [program, filter]);

  const formatDateRange = () => {
    const start = new Date(program.startDate);
    const end = addDays(start, program.days.length - 1);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `${fmt(start)} – ${fmt(end)}`;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-wider text-muted">
          {formatDateRange()}
        </p>
        <h1 className="text-2xl font-bold">{program.name}</h1>
        <p className="text-sm text-muted">{program.subtitle}</p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            {completedWorkouts} / {workoutDays} workouts · {completedRests} /{" "}
            {restDays} rest
          </span>
          <span className="font-bold text-foreground">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>
            {completedCount} / {program.days.length} days logged
          </span>
          {todayDayNumber >= 1 &&
            todayDayNumber <= program.days.length && (
              <span>· Day {todayDayNumber} today</span>
            )}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {muscleGroups.map((g) => (
          <button
            key={g}
            onClick={() => setFilter(filter === g ? "all" : g)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all capitalize",
              filter === g
                ? "bg-white/20 text-foreground"
                : cn("border border-white/10", filterColors[g] ?? "text-muted")
            )}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Day cards */}
      <div className="space-y-3">
        {filteredDays.map((d) => {
          const wt = getWorkoutTemplate(program.id, d.workoutId);
          if (!wt) return null;
          return (
            <WorkoutCard
              key={`${program.id}-${d.day}`}
              program={program}
              dayNumber={d.day}
              workout={wt}
              isToday={d.day === todayDayNumber}
            />
          );
        })}
      </div>
    </div>
  );
}
