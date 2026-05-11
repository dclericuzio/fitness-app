"use client";

import { useTimer } from "@/lib/timer-context";
import { formatTimer } from "@/lib/utils";
import { Timer, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RestTimerPill() {
  const { seconds, running, stop, addTime } = useTimer();

  if (!running && seconds === 0) return null;

  const isFinished = !running && seconds === 0;
  const isLow = seconds <= 10 && running;

  return (
    <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 animate-slide-up">
      <div
        className={cn(
          "flex items-center gap-3 rounded-full px-5 py-3 shadow-2xl",
          "border border-card-border bg-card",
          isLow && "animate-pulse-ring"
        )}
      >
        <Timer size={18} className={cn(isLow ? "text-danger" : "text-primary")} />
        <span
          className={cn(
            "font-mono text-lg font-bold tabular-nums",
            isLow ? "text-danger" : "text-foreground"
          )}
        >
          {isFinished ? "Done!" : formatTimer(seconds)}
        </span>
        {running && (
          <button
            onClick={() => addTime(30)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors active:bg-white/20"
            title="Add 30s"
          >
            <Plus size={14} />
          </button>
        )}
        <button
          onClick={stop}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors active:bg-white/20"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
