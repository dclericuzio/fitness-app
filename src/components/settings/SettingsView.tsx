"use client";

import { useState, useCallback } from "react";
import {
  Timer,
  Link2,
  LinkIcon,
  Pill,
  Plus,
  Trash2,
  Download,
  Upload,
  Sun,
  Moon,
  Monitor,
  Palette,
} from "lucide-react";
import { cn, formatTimer } from "@/lib/utils";
import { getSettings, updateSettings } from "@/lib/store";
import { ExerciseCategory, Supplement, SupplementTime, ThemeMode } from "@/lib/types";
import { useTheme } from "@/lib/theme-context";

const categoryLabels: Record<ExerciseCategory, string> = {
  compound_heavy: "Compound Heavy",
  compound_medium: "Compound Medium",
  isolation: "Isolation",
  high_rep: "High Rep",
};

const timeOptions: { value: SupplementTime; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "post_workout", label: "Post-workout" },
  { value: "evening", label: "Evening" },
];

const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function SettingsView() {
  const [settings, setSettingsState] = useState(getSettings);
  const [showAddSupplement, setShowAddSupplement] = useState(false);
  const [newSupp, setNewSupp] = useState({ name: "", timeOfDay: "morning" as SupplementTime, emoji: "💊" });
  const { theme, setTheme } = useTheme();

  const handleTimerChange = useCallback(
    (cat: ExerciseCategory, seconds: number) => {
      const updated = updateSettings({
        restTimerDefaults: { ...settings.restTimerDefaults, [cat]: seconds },
      });
      setSettingsState(updated);
    },
    [settings]
  );

  const handleDisconnectStrava = useCallback(() => {
    const updated = updateSettings({
      stravaAccessToken: null,
      stravaRefreshToken: null,
      stravaExpiresAt: null,
      stravaAthleteId: null,
    });
    setSettingsState(updated);
  }, []);

  const handleAddSupplement = useCallback(() => {
    if (!newSupp.name.trim()) return;
    const supp: Supplement = {
      id: newSupp.name.toLowerCase().replace(/\s+/g, "_"),
      name: newSupp.name.trim(),
      timeOfDay: newSupp.timeOfDay,
      emoji: newSupp.emoji || "💊",
    };
    const updated = updateSettings({
      supplements: [...settings.supplements, supp],
    });
    setSettingsState(updated);
    setNewSupp({ name: "", timeOfDay: "morning", emoji: "💊" });
    setShowAddSupplement(false);
  }, [newSupp, settings.supplements]);

  const handleRemoveSupplement = useCallback(
    (id: string) => {
      const updated = updateSettings({
        supplements: settings.supplements.filter((s) => s.id !== id),
      });
      setSettingsState(updated);
    },
    [settings.supplements]
  );

  const handleExport = useCallback(() => {
    const data: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("dc_")) data[key] = localStorage.getItem(key);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dc-fitness-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          Object.entries(data).forEach(([key, value]) => {
            if (typeof value === "string") localStorage.setItem(key, value);
          });
          setSettingsState(getSettings());
          alert("Data restored successfully!");
        } catch {
          alert("Failed to restore data. Invalid file.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Theme */}
      <section className="rounded-xl border border-card-border bg-card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Palette size={16} className="text-primary" />
          Theme
        </h2>
        <div className="flex gap-2">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
                  theme === opt.value
                    ? "bg-primary/20 text-primary ring-1 ring-primary"
                    : "bg-muted/10 text-muted"
                )}
              >
                <Icon size={14} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Strava */}
      <section className="rounded-xl border border-card-border bg-card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <LinkIcon size={16} className="text-orange" />
          Strava
        </h2>
        {settings.stravaAccessToken ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-success">Connected</span>
            <button onClick={handleDisconnectStrava} className="text-xs text-danger">
              Disconnect
            </button>
          </div>
        ) : (
          <a
            href="/api/strava"
            className="flex items-center gap-2 rounded-lg bg-[#FC4C02] px-4 py-2.5 text-sm font-medium text-white transition-all active:scale-95"
          >
            <Link2 size={16} />
            Connect Strava
          </a>
        )}
      </section>

      {/* Rest Timer */}
      <section className="rounded-xl border border-card-border bg-card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Timer size={16} className="text-primary" />
          Rest Timer Defaults
        </h2>
        <div className="space-y-3">
          {(Object.entries(categoryLabels) as [ExerciseCategory, string][]).map(
            ([cat, label]) => {
              const secs = settings.restTimerDefaults[cat];
              return (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-sm">{label}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTimerChange(cat, Math.max(15, secs - 15))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/10 text-sm font-bold active:bg-muted/20"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-mono text-sm font-semibold">
                      {formatTimer(secs)}
                    </span>
                    <button
                      onClick={() => handleTimerChange(cat, Math.min(600, secs + 15))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/10 text-sm font-bold active:bg-muted/20"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* Supplements */}
      <section className="rounded-xl border border-card-border bg-card p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Pill size={16} className="text-success" />
          Supplements
        </h2>
        <div className="space-y-2">
          {settings.supplements.map((supp) => (
            <div key={supp.id} className="flex items-center justify-between rounded-lg bg-muted/5 px-3 py-2">
              <div className="flex items-center gap-2">
                <span>{supp.emoji}</span>
                <span className="text-sm">{supp.name}</span>
                <span className="text-xs text-muted">{supp.timeOfDay.replace("_", "-")}</span>
              </div>
              <button
                onClick={() => handleRemoveSupplement(supp.id)}
                className="p-1 text-muted transition-colors hover:text-danger"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {showAddSupplement ? (
            <div className="space-y-2 rounded-lg border border-card-border p-3">
              <input
                type="text"
                placeholder="Name"
                value={newSupp.name}
                onChange={(e) => setNewSupp({ ...newSupp, name: e.target.value })}
                className="w-full rounded-lg bg-muted/10 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Emoji"
                  value={newSupp.emoji}
                  onChange={(e) => setNewSupp({ ...newSupp, emoji: e.target.value })}
                  className="w-16 rounded-lg bg-muted/10 px-3 py-2 text-center text-sm outline-none focus:ring-1 focus:ring-primary"
                />
                <select
                  value={newSupp.timeOfDay}
                  onChange={(e) => setNewSupp({ ...newSupp, timeOfDay: e.target.value as SupplementTime })}
                  className="flex-1 rounded-lg bg-muted/10 px-3 py-2 text-sm outline-none"
                >
                  {timeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddSupplement}
                  className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddSupplement(false)}
                  className="rounded-lg bg-muted/10 px-3 py-2 text-sm text-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddSupplement(true)}
              className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-card-border py-2 text-xs text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <Plus size={12} /> Add Supplement
            </button>
          )}
        </div>
      </section>

      {/* Data */}
      <section className="rounded-xl border border-card-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold">Data</h2>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-muted/10 py-2.5 text-sm font-medium transition-all active:bg-muted/20"
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={handleImport}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-muted/10 py-2.5 text-sm font-medium transition-all active:bg-muted/20"
          >
            <Upload size={14} /> Import
          </button>
        </div>
      </section>

      <p className="text-center text-xs text-muted">All data stored locally on this device</p>
    </div>
  );
}
