"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Check, Flame, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn, toISODate } from "@/lib/utils";
import {
  getSettings,
  getSupplementLogsForDate,
  toggleSupplement,
  getSupplementStreak,
  getSupplementLogs,
} from "@/lib/store";
import { Supplement, SupplementLog, SupplementTime } from "@/lib/types";

const timeLabels: Record<SupplementTime, string> = {
  morning: "morning",
  post_workout: "post-workout",
  evening: "evening",
};

const timeOrder: Record<SupplementTime, number> = {
  morning: 0,
  post_workout: 1,
  evening: 2,
};

export default function StackTracker() {
  const [date, setDate] = useState(() => toISODate(new Date()));
  const [logs, setLogs] = useState<SupplementLog[]>([]);
  const [streak, setStreak] = useState(0);
  const settings = getSettings();

  useEffect(() => {
    setLogs(getSupplementLogsForDate(date));
    setStreak(getSupplementStreak());
  }, [date]);

  const supplements = useMemo(
    () =>
      [...settings.supplements].sort(
        (a, b) => timeOrder[a.timeOfDay] - timeOrder[b.timeOfDay]
      ),
    [settings.supplements]
  );

  const handleToggle = useCallback(
    (supplementId: string) => {
      toggleSupplement(supplementId, date);
      setLogs(getSupplementLogsForDate(date));
      setStreak(getSupplementStreak());
    },
    [date]
  );

  const takenCount = supplements.filter((s) =>
    logs.some((l) => l.supplementId === s.id && l.taken)
  ).length;

  const isToday = date === toISODate(new Date());

  const navigateDate = (delta: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(toISODate(d));
  };

  // Calendar view
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const calendarData = useMemo(() => {
    const allLogs = getSupplementLogs();
    const daysInMonth = new Date(
      calMonth.year,
      calMonth.month + 1,
      0
    ).getDate();
    const firstDow = new Date(calMonth.year, calMonth.month, 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${calMonth.year}-${String(calMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayLogs = allLogs.filter((l) => l.date === dateStr && l.taken);
      const allTaken =
        dayLogs.length >= supplements.length &&
        supplements.every((s) =>
          dayLogs.some((l) => l.supplementId === s.id)
        );
      const partial = dayLogs.length > 0 && !allTaken;
      return { day, allTaken, partial };
    });

    return { days, firstDow, daysInMonth };
  }, [calMonth, supplements]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stack</h1>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-orange-500/20 px-3 py-1 text-sm font-semibold text-orange-400">
            <Flame size={16} />
            {streak} day{streak !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Date nav */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => navigateDate(-1)}
          className="rounded-full p-2 transition-colors active:bg-white/10"
        >
          <ChevronLeft size={18} className="text-muted" />
        </button>
        <button
          onClick={() => setDate(toISODate(new Date()))}
          className={cn(
            "text-sm font-medium",
            isToday ? "text-primary" : "text-foreground"
          )}
        >
          {isToday
            ? "Today"
            : new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
        </button>
        <button
          onClick={() => navigateDate(1)}
          className="rounded-full p-2 transition-colors active:bg-white/10"
        >
          <ChevronRight size={18} className="text-muted" />
        </button>
      </div>

      {/* Supplement checklist */}
      <div className="rounded-xl bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-muted">
            Today&apos;s Stack
          </span>
          <span
            className={cn(
              "text-sm font-bold",
              takenCount === supplements.length
                ? "text-success"
                : "text-foreground"
            )}
          >
            {takenCount}/{supplements.length}
          </span>
        </div>

        <div className="space-y-2">
          {supplements.map((supp) => {
            const taken = logs.some(
              (l) => l.supplementId === supp.id && l.taken
            );
            return (
              <button
                key={supp.id}
                onClick={() => handleToggle(supp.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all active:scale-[0.98]",
                  taken ? "bg-success/10" : "bg-white/5"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    taken
                      ? "border-success bg-success text-white"
                      : "border-white/20"
                  )}
                >
                  {taken && <Check size={14} strokeWidth={3} />}
                </div>
                <span className="text-lg">{supp.emoji}</span>
                <span
                  className={cn(
                    "flex-1 text-left text-sm font-medium",
                    taken && "line-through opacity-60"
                  )}
                >
                  {supp.name}
                </span>
                <span className="text-xs text-muted">
                  {timeLabels[supp.timeOfDay]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-xl bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() =>
              setCalMonth((prev) => {
                const d = new Date(prev.year, prev.month - 1);
                return { year: d.getFullYear(), month: d.getMonth() };
              })
            }
            className="p-1"
          >
            <ChevronLeft size={16} className="text-muted" />
          </button>
          <span className="text-sm font-medium text-muted">
            <Calendar size={14} className="mr-1.5 inline" />
            {new Date(calMonth.year, calMonth.month).toLocaleDateString(
              "en-US",
              { month: "long", year: "numeric" }
            )}
          </span>
          <button
            onClick={() =>
              setCalMonth((prev) => {
                const d = new Date(prev.year, prev.month + 1);
                return { year: d.getFullYear(), month: d.getMonth() };
              })
            }
            className="p-1"
          >
            <ChevronRight size={16} className="text-muted" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-center text-[10px] text-muted">
              {d}
            </div>
          ))}
          {Array.from({ length: calendarData.firstDow }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {calendarData.days.map(({ day, allTaken, partial }) => {
            const todayNum = new Date().getDate();
            const isCurrentMonth =
              calMonth.year === new Date().getFullYear() &&
              calMonth.month === new Date().getMonth();
            const isTodayCell = isCurrentMonth && day === todayNum;
            return (
              <div
                key={day}
                className={cn(
                  "flex h-8 items-center justify-center rounded-md text-xs",
                  allTaken && "bg-success/20 text-success font-semibold",
                  partial && "bg-yellow-500/20 text-yellow-400",
                  isTodayCell && !allTaken && !partial && "border border-primary/50",
                  !allTaken && !partial && !isTodayCell && "text-muted/50"
                )}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
