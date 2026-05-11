"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Dumbbell,
  Activity,
  ChevronRight,
  Flame,
  Calendar,
  Plus,
} from "lucide-react";
import {
  cn,
  formatDateFull,
  toISODate,
  formatDistance,
  formatPace,
  formatDuration,
  daysBetween,
} from "@/lib/utils";
import { getTemplateById } from "@/lib/programs";
import {
  getSettings,
  getSessions,
  getSessionByDate,
  getRunActivities,
  getSupplementLogsForDate,
  getSupplementStreak,
  getCustomTemplates,
} from "@/lib/store";

export default function DashboardView() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const today = new Date();
  const todayStr = toISODate(today);
  const settings = getSettings();
  const customTemplates = useMemo(() => getCustomTemplates(), []);

  const todaySession = useMemo(() => getSessionByDate(todayStr), [todayStr]);
  const todayTemplate = useMemo(
    () =>
      todaySession
        ? getTemplateById(todaySession.workoutTemplateId, customTemplates)
        : undefined,
    [todaySession, customTemplates]
  );

  const sessions = useMemo(() => getSessions(), []);

  const startOfWeek = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const weekGymCount = useMemo(() => {
    return sessions.filter((s) => {
      if (!s.completed) return false;
      const sessionDate = new Date(s.date + "T12:00:00");
      return sessionDate >= startOfWeek;
    }).length;
  }, [sessions, startOfWeek]);

  const runs = useMemo(
    () =>
      getRunActivities().sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    []
  );
  const lastRun = runs[0];
  const weekRuns = useMemo(
    () => runs.filter((r) => new Date(r.date) >= startOfWeek),
    [runs, startOfWeek]
  );
  const weekKm = weekRuns.reduce((s, r) => s + r.distanceMeters / 1000, 0);

  const todayLogs = useMemo(
    () => getSupplementLogsForDate(todayStr),
    [todayStr]
  );
  const takenCount = settings.supplements.filter((s) =>
    todayLogs.some((l) => l.supplementId === s.id && l.taken)
  ).length;
  const streak = useMemo(() => getSupplementStreak(), []);

  const daysAgo = lastRun ? daysBetween(new Date(lastRun.date), today) : null;

  if (!mounted) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted">{formatDateFull(today)}</p>
        <h1 className="text-2xl font-bold">DC Fitness</h1>
      </div>

      {/* Today's workout */}
      <Link href="/gym" className="block">
        <div
          className={cn(
            "rounded-2xl border border-card-border bg-card p-5 transition-all active:scale-[0.98]",
            todaySession?.completed && "opacity-60"
          )}
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Today&apos;s Workout
            </span>
            <ChevronRight size={16} className="text-muted" />
          </div>
          {todayTemplate ? (
            <div className="flex items-center gap-3">
              <div className="text-3xl">{todayTemplate.emoji}</div>
              <div>
                <div className="text-lg font-bold">
                  {todayTemplate.name}
                  {todayTemplate.label && (
                    <span className="ml-2 text-sm font-normal text-muted">
                      {todayTemplate.label}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted">
                  {todayTemplate.exercises.length} exercises
                  {todaySession?.completed && " · Done"}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-muted">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-dashed border-muted/30">
                <Plus size={20} />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">No workout planned</div>
                <div className="text-xs">Tap to pick one</div>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Supplement status */}
      <Link href="/stack" className="block">
        <div className="rounded-2xl border border-card-border bg-card p-5 transition-all active:scale-[0.98]">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Stack
            </span>
            <div className="flex items-center gap-2">
              {streak > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-orange">
                  <Flame size={12} />
                  {streak}d
                </span>
              )}
              <ChevronRight size={16} className="text-muted" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "text-lg font-bold",
                takenCount === settings.supplements.length
                  ? "text-success"
                  : "text-foreground"
              )}
            >
              {takenCount}/{settings.supplements.length}
            </span>
            {takenCount < settings.supplements.length && (
              <span className="text-xs text-muted">
                {settings.supplements
                  .filter(
                    (s) => !todayLogs.some((l) => l.supplementId === s.id && l.taken)
                  )
                  .map((s) => s.name)
                  .join(", ")}{" "}
                remaining
              </span>
            )}
            {takenCount === settings.supplements.length && (
              <span className="text-xs text-success">All done!</span>
            )}
          </div>
        </div>
      </Link>

      {/* Last run */}
      <Link href="/run" className="block">
        <div className="rounded-2xl border border-card-border bg-card p-5 transition-all active:scale-[0.98]">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Last Run
            </span>
            <div className="flex items-center gap-2">
              {daysAgo !== null && (
                <span className="text-xs text-muted">
                  {daysAgo === 0 ? "today" : daysAgo === 1 ? "yesterday" : `${daysAgo}d ago`}
                </span>
              )}
              <ChevronRight size={16} className="text-muted" />
            </div>
          </div>
          {lastRun ? (
            <div className="flex items-center gap-4 text-sm">
              <span className="font-bold">{formatDistance(lastRun.distanceMeters)} km</span>
              <span className="text-muted">{formatPace(lastRun.averagePaceSecondsPerKm)}/km</span>
              <span className="text-muted">{formatDuration(lastRun.movingTimeSeconds)}</span>
            </div>
          ) : (
            <div className="text-sm text-muted">Connect Strava to see your runs</div>
          )}
        </div>
      </Link>

      {/* Weekly summary */}
      <div className="rounded-2xl border border-card-border bg-card p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted">
          <Calendar size={12} />
          This Week
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Dumbbell size={14} className="text-primary" />
            <span className="text-sm font-bold">{weekGymCount} workouts</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-orange" />
            <span className="text-sm font-bold">
              {weekKm > 0 ? `${weekKm.toFixed(1)} km` : "No runs"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
