"use client";

import { useEffect, useState } from "react";

export default function AutoSeed() {
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem("dc_workout_sessions");
    const parsed = existing ? JSON.parse(existing) : [];
    if (parsed.length > 0) return;

    setSeeding(true);
    fetch("/api/seed")
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("dc_workout_sessions", JSON.stringify(data.sessions));
        window.location.reload();
      })
      .catch(() => setSeeding(false));
  }, []);

  if (!seeding) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        <p className="text-sm text-muted">Loading workout history...</p>
      </div>
    </div>
  );
}
