import {
  WorkoutSession,
  WorkoutTemplate,
  RunActivity,
  SupplementLog,
  UserSettings,
  Supplement,
  SetLog,
  ExerciseLog,
  ThemeMode,
} from "./types";
import { generateId, toISODate } from "./utils";
import { getTemplateById } from "./programs";

const KEYS = {
  sessions: "dc_workout_sessions",
  customTemplates: "dc_custom_templates",
  runs: "dc_run_activities",
  supplementLogs: "dc_supplement_logs",
  settings: "dc_user_settings",
  theme: "dc_theme",
} as const;

const DEFAULT_SUPPLEMENTS: Supplement[] = [
  { id: "d3k2", name: "D3K2", timeOfDay: "morning", emoji: "☀️" },
  { id: "magnesium", name: "Magnesium", timeOfDay: "evening", emoji: "🌙" },
  { id: "omega3", name: "Omega-3", timeOfDay: "morning", emoji: "🐟" },
  { id: "whey", name: "Whey Iso", timeOfDay: "post_workout", emoji: "💪" },
];

const DEFAULT_SETTINGS: UserSettings = {
  restTimerDefaults: {
    compound_heavy: 180,
    compound_medium: 120,
    isolation: 90,
    high_rep: 60,
  },
  stravaAccessToken: null,
  stravaRefreshToken: null,
  stravaExpiresAt: null,
  stravaAthleteId: null,
  supplements: DEFAULT_SUPPLEMENTS,
  theme: "dark",
};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full
  }
}

// ── Settings ────────────────────────────────────────────────────────

export function getSettings(): UserSettings {
  return getItem(KEYS.settings, DEFAULT_SETTINGS);
}

export function updateSettings(partial: Partial<UserSettings>): UserSettings {
  const current = getSettings();
  const updated = { ...current, ...partial };
  setItem(KEYS.settings, updated);
  return updated;
}

export function getTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem(KEYS.theme) as ThemeMode) ?? "dark";
}

export function setTheme(mode: ThemeMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.theme, mode);
}

// ── Custom Templates ────────────────────────────────────────────────

export function getCustomTemplates(): WorkoutTemplate[] {
  return getItem<WorkoutTemplate[]>(KEYS.customTemplates, []);
}

export function saveCustomTemplate(template: WorkoutTemplate): void {
  const templates = getCustomTemplates();
  const idx = templates.findIndex((t) => t.id === template.id);
  if (idx >= 0) {
    templates[idx] = template;
  } else {
    templates.push(template);
  }
  setItem(KEYS.customTemplates, templates);
}

export function deleteCustomTemplate(id: string): void {
  const templates = getCustomTemplates().filter((t) => t.id !== id);
  setItem(KEYS.customTemplates, templates);
}

// ── Workout Sessions (date-keyed) ───────────────────────────────────

export function getSessions(): WorkoutSession[] {
  return getItem<WorkoutSession[]>(KEYS.sessions, []);
}

export function getSessionByDate(date: string): WorkoutSession | undefined {
  return getSessions().find((s) => s.date === date);
}

export function createSession(
  date: string,
  templateId: string
): WorkoutSession {
  const existing = getSessionByDate(date);
  if (existing) return existing;

  const customs = getCustomTemplates();
  const template = getTemplateById(templateId, customs);
  const exercises: ExerciseLog[] =
    template?.exercises.map((ex) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: Array.from({ length: ex.sets }, (_, i) => ({
        setNumber: i + 1,
        targetRepsMin: ex.repsMin,
        targetRepsMax: ex.repsMax,
        weightKg: null,
        actualReps: null,
        completed: false,
      })),
    })) ?? [];

  const session: WorkoutSession = {
    id: generateId(),
    date,
    workoutTemplateId: templateId,
    startedAt: null,
    finishedAt: null,
    exercises,
    notes: "",
    completed: false,
  };

  const sessions = getSessions();
  sessions.push(session);
  setItem(KEYS.sessions, sessions);
  return session;
}

export function updateSession(
  sessionId: string,
  updater: (s: WorkoutSession) => WorkoutSession
): void {
  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx >= 0) {
    sessions[idx] = updater(sessions[idx]);
    setItem(KEYS.sessions, sessions);
  }
}

export function deleteSession(date: string): void {
  const sessions = getSessions().filter((s) => s.date !== date);
  setItem(KEYS.sessions, sessions);
}

export function assignWorkoutToDate(date: string, templateId: string): WorkoutSession {
  deleteSession(date);
  return createSession(date, templateId);
}

export function toggleSessionComplete(date: string): boolean {
  const session = getSessionByDate(date);
  if (!session) return false;
  const newCompleted = !session.completed;
  updateSession(session.id, (s) => ({
    ...s,
    completed: newCompleted,
    finishedAt: newCompleted ? new Date().toISOString() : null,
  }));
  return newCompleted;
}

export function getLastSessionForExercise(
  exerciseId: string,
  excludeSessionId: string
): SetLog[] | null {
  const sessions = getSessions()
    .filter((s) => s.completed && s.id !== excludeSessionId)
    .sort(
      (a, b) =>
        new Date(b.finishedAt ?? b.date).getTime() -
        new Date(a.finishedAt ?? a.date).getTime()
    );

  for (const session of sessions) {
    const exerciseLog = session.exercises.find(
      (e) => e.exerciseId === exerciseId
    );
    if (exerciseLog && exerciseLog.sets.some((s) => s.weightKg !== null)) {
      return exerciseLog.sets;
    }
  }
  return null;
}

export function getSessionsForMonth(
  year: number,
  month: number
): WorkoutSession[] {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  return getSessions().filter((s) => s.date.startsWith(prefix));
}

// ── Run Activities ──────────────────────────────────────────────────

export function getRunActivities(): RunActivity[] {
  return getItem<RunActivity[]>(KEYS.runs, []);
}

export function saveRunActivities(activities: RunActivity[]): void {
  const existing = getRunActivities();
  const existingIds = new Set(existing.map((a) => a.stravaId));
  const newOnes = activities.filter((a) => !existingIds.has(a.stravaId));
  setItem(KEYS.runs, [...existing, ...newOnes]);
}

// ── Supplement Logs ─────────────────────────────────────────────────

export function getSupplementLogs(): SupplementLog[] {
  return getItem<SupplementLog[]>(KEYS.supplementLogs, []);
}

export function toggleSupplement(
  supplementId: string,
  date: string
): boolean {
  const logs = getSupplementLogs();
  const idx = logs.findIndex(
    (l) => l.supplementId === supplementId && l.date === date
  );
  if (idx >= 0) {
    const wasTaken = logs[idx].taken;
    logs[idx] = {
      ...logs[idx],
      taken: !wasTaken,
      checkedAt: !wasTaken ? new Date().toISOString() : null,
    };
    setItem(KEYS.supplementLogs, logs);
    return !wasTaken;
  }
  logs.push({
    date,
    supplementId,
    taken: true,
    checkedAt: new Date().toISOString(),
  });
  setItem(KEYS.supplementLogs, logs);
  return true;
}

export function getSupplementLogsForDate(date: string): SupplementLog[] {
  return getSupplementLogs().filter((l) => l.date === date);
}

export function getSupplementStreak(): number {
  const settings = getSettings();
  const supplementIds = settings.supplements.map((s) => s.id);
  const logs = getSupplementLogs();
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = toISODate(d);
    const dayLogs = logs.filter((l) => l.date === dateStr && l.taken);
    const allTaken = supplementIds.every((id) =>
      dayLogs.some((l) => l.supplementId === id)
    );
    if (allTaken) {
      streak++;
    } else {
      if (i === 0) continue;
      break;
    }
  }
  return streak;
}
