"use client";

import { useState } from "react";

export default function SeedPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [count, setCount] = useState(0);

  const handleSeed = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/seed");
      const data = await res.json();
      const raw = localStorage.getItem("dc_workout_sessions");
      const existing = raw ? JSON.parse(raw) : [];
      const dates = new Set(existing.map((s: { date: string }) => s.date));
      const fresh = data.sessions.filter((s: { date: string }) => !dates.has(s.date));
      const merged = [...existing, ...fresh];
      localStorage.setItem("dc_workout_sessions", JSON.stringify(merged));
      setCount(fresh.length);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-2xl font-bold">Seed Data</h1>
      <p className="text-sm text-muted">
        Import your Phase 1 + Phase 2 workout history and planned sessions.
      </p>

      {status === "idle" && (
        <button
          onClick={handleSeed}
          className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white transition-all active:scale-95"
        >
          Import Workout Data
        </button>
      )}

      {status === "loading" && (
        <div className="flex items-center gap-2 text-muted">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Loading...
        </div>
      )}

      {status === "done" && (
        <div className="space-y-3">
          <div className="text-lg font-bold text-success">
            {count > 0 ? `${count} sessions imported!` : "Already up to date!"}
          </div>
          <a
            href="/gym"
            className="inline-block rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white transition-all active:scale-95"
          >
            Go to Gym
          </a>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-3">
          <div className="text-danger">Something went wrong</div>
          <button
            onClick={handleSeed}
            className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
