"use client";

import { useState, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn, formatDate, addDays } from "@/lib/utils";
import { Program, WorkoutTemplate, MuscleGroup } from "@/lib/types";
import { getSession, toggleSessionComplete } from "@/lib/store";
import ExerciseLogger from "./ExerciseLogger";

const groupColors: Record<MuscleGroup, string> = {
  push: "border-l-push",
  pull: "border-l-pull",
  legs: "border-l-legs",
  upper: "border-l-upper",
  lower: "border-l-lower",
  rest: "border-l-rest",
};

const groupBg: Record<MuscleGroup, string> = {
  push: "bg-push/5",
  pull: "bg-pull/5",
  legs: "bg-legs/5",
  upper: "bg-upper/5",
  lower: "bg-lower/5",
  rest: "bg-rest/5",
};

interface WorkoutCardProps {
  program: Program;
  dayNumber: number;
  workout: WorkoutTemplate;
  isToday: boolean;
}

export default function WorkoutCard({
  program,
  dayNumber,
  workout,
  isToday,
}: WorkoutCardProps) {
  const dateForDay = addDays(new Date(program.startDate), dayNumber - 1);
  const dateStr = dateForDay.toISOString().split("T")[0];
  const session = getSession(program.id, dayNumber);
  const [completed, setCompleted] = useState(session?.completed ?? false);
  const [expanded, setExpanded] = useState(false);

  const handleToggleComplete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const newVal = toggleSessionComplete(
        program.id,
        dayNumber,
        workout.id,
        dateStr
      );
      setCompleted(newVal);
    },
    [program.id, dayNumber, workout.id, dateStr]
  );

  const isRest = workout.muscleGroup === "rest";

  return (
    <div className="relative">
      {isToday && (
        <div className="mb-1 text-xs font-semibold text-primary">Today</div>
      )}
      <div
        className={cn(
          "rounded-xl border-l-4 transition-all",
          groupColors[workout.muscleGroup],
          groupBg[workout.muscleGroup],
          "bg-card",
          completed && "opacity-60"
        )}
      >
        <div
          className="flex cursor-pointer items-center gap-3 p-4"
          onClick={() => !isRest && setExpanded(!expanded)}
        >
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
              completed ? "bg-success/20 text-success" : "bg-white/10 text-muted"
            )}
          >
            {dayNumber}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {workout.emoji} {workout.name}
              </span>
              {workout.label && (
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted">
                  {workout.label}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted">
              Day {dayNumber}/{program.days.length} ·{" "}
              {formatDate(dateForDay)}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={handleToggleComplete}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                completed
                  ? "border-success bg-success/20 text-success"
                  : "border-white/20 text-transparent hover:border-white/40"
              )}
            >
              <Check size={16} strokeWidth={3} />
            </button>
            {!isRest && (
              <ChevronDown
                size={16}
                className={cn(
                  "text-muted transition-transform",
                  expanded && "rotate-180"
                )}
              />
            )}
          </div>
        </div>

        {expanded && !isRest && (
          <div className="border-t border-white/5 px-4 pb-4 pt-3">
            <ExerciseLogger
              programId={program.id}
              dayNumber={dayNumber}
              workoutId={workout.id}
              dateStr={dateStr}
              workout={workout}
            />
          </div>
        )}
      </div>
    </div>
  );
}
