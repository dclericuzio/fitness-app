"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Activity,
  Heart,
  Mountain,
  Clock,
  RefreshCw,
  Link2,
  Calendar,
} from "lucide-react";
import {
  cn,
  formatDistance,
  formatPace,
  formatDuration,
  toISODate,
} from "@/lib/utils";
import { getRunActivities, getSettings } from "@/lib/store";
import { RunActivity } from "@/lib/types";

export default function RunLog() {
  const [activities, setActivities] = useState<RunActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"list" | "weekly">("list");

  useEffect(() => {
    setActivities(
      getRunActivities().sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  }, []);

  const settings = getSettings();
  const isConnected = !!settings.stravaAccessToken;

  const handleSync = useCallback(async () => {
    if (!isConnected) {
      window.location.href = "/api/strava";
      return;
    }
    setLoading(true);
    try {
      const s = getSettings();
      const res = await fetch("/api/strava/sync", {
        headers: {
          "x-strava-access-token": s.stravaAccessToken ?? "",
          "x-strava-refresh-token": s.stravaRefreshToken ?? "",
          "x-strava-expires-at": s.stravaExpiresAt?.toString() ?? "",
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.activities) {
          const { saveRunActivities, updateSettings: us } = await import("@/lib/store");
          saveRunActivities(data.activities);
          if (data.newToken) {
            us({
              stravaAccessToken: data.newToken.accessToken,
              stravaRefreshToken: data.newToken.refreshToken,
              stravaExpiresAt: data.newToken.expiresAt,
            });
          }
        }
        setActivities(
          getRunActivities().sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      }
    } catch {
      // handle error silently
    }
    setLoading(false);
  }, [isConnected]);

  const weeklyStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeek = activities.filter(
      (a) => new Date(a.date) >= startOfWeek
    );

    return {
      runs: thisWeek.length,
      totalKm: thisWeek.reduce((sum, a) => sum + a.distanceMeters / 1000, 0),
      totalTime: thisWeek.reduce((sum, a) => sum + a.movingTimeSeconds, 0),
      avgPace:
        thisWeek.length > 0
          ? thisWeek.reduce((sum, a) => sum + a.averagePaceSecondsPerKm, 0) /
            thisWeek.length
          : 0,
    };
  }, [activities]);

  const monthlyCalendar = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const runDates = new Set(
      activities
        .filter((a) => {
          const d = new Date(a.date);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .map((a) => new Date(a.date).getDate())
    );
    return { daysInMonth, runDates, month, year };
  }, [activities]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Running</h1>
        <button
          onClick={handleSync}
          disabled={loading}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all",
            isConnected
              ? "bg-[#FC4C02]/20 text-[#FC4C02]"
              : "bg-[#FC4C02] text-white"
          )}
        >
          {loading ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : isConnected ? (
            <RefreshCw size={14} />
          ) : (
            <Link2 size={14} />
          )}
          {isConnected ? "Sync Strava" : "Connect Strava"}
        </button>
      </div>

      {/* Weekly stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Runs", value: weeklyStats.runs.toString() },
          { label: "Distance", value: `${weeklyStats.totalKm.toFixed(1)} km` },
          {
            label: "Time",
            value: weeklyStats.totalTime > 0 ? formatDuration(weeklyStats.totalTime) : "—",
          },
          {
            label: "Avg Pace",
            value:
              weeklyStats.avgPace > 0
                ? `${formatPace(weeklyStats.avgPace)}/km`
                : "—",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-card p-3 text-center"
          >
            <div className="text-lg font-bold">{stat.value}</div>
            <div className="text-[10px] text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Calendar heatmap */}
      <div className="rounded-xl bg-card p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted">
          <Calendar size={14} />
          {new Date(monthlyCalendar.year, monthlyCalendar.month).toLocaleDateString(
            "en-US",
            { month: "long", year: "numeric" }
          )}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-center text-[10px] text-muted">
              {d}
            </div>
          ))}
          {Array.from({ length: new Date(monthlyCalendar.year, monthlyCalendar.month, 1).getDay() }).map(
            (_, i) => (
              <div key={`empty-${i}`} />
            )
          )}
          {Array.from({ length: monthlyCalendar.daysInMonth }).map((_, i) => {
            const day = i + 1;
            const hasRun = monthlyCalendar.runDates.has(day);
            const isToday = day === new Date().getDate();
            return (
              <div
                key={day}
                className={cn(
                  "flex h-8 items-center justify-center rounded-md text-xs",
                  hasRun && "bg-success/20 text-success font-semibold",
                  isToday && !hasRun && "border border-primary/50",
                  !hasRun && !isToday && "text-muted/50"
                )}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity list */}
      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="rounded-xl bg-card p-8 text-center text-muted">
            <Activity size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No runs yet</p>
            <p className="text-xs">
              {isConnected
                ? "Tap Sync to pull your Strava activities"
                : "Connect Strava to see your runs here"}
            </p>
          </div>
        ) : (
          activities.map((run) => {
            const d = new Date(run.date);
            return (
              <div
                key={run.id}
                className="rounded-xl border-l-4 border-l-[#FC4C02] bg-card p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">{run.name}</span>
                  <span className="text-xs text-muted">
                    {d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <span className="flex items-center gap-1 font-medium">
                    <Activity size={12} className="text-[#FC4C02]" />
                    {formatDistance(run.distanceMeters)} km
                  </span>
                  <span className="flex items-center gap-1 text-muted">
                    <Clock size={12} />
                    {formatDuration(run.movingTimeSeconds)}
                  </span>
                  <span className="flex items-center gap-1 text-muted">
                    ⏱ {formatPace(run.averagePaceSecondsPerKm)}/km
                  </span>
                  {run.averageHeartRate && (
                    <span className="flex items-center gap-1 text-muted">
                      <Heart size={12} className="text-danger" />
                      {Math.round(run.averageHeartRate)} bpm
                    </span>
                  )}
                  {run.totalElevationGain > 0 && (
                    <span className="flex items-center gap-1 text-muted">
                      <Mountain size={12} />+
                      {Math.round(run.totalElevationGain)}m
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
