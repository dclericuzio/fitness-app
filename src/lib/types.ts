export type MuscleGroup = "push" | "pull" | "legs" | "upper" | "lower" | "rest";

export type ExerciseCategory = "compound_heavy" | "compound_medium" | "isolation" | "high_rep";

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  rirMin: number;
  rirMax: number;
  category: ExerciseCategory;
}

export type TemplateSource = "phase1" | "phase2" | "custom";

export interface WorkoutTemplate {
  id: string;
  name: string;
  label: string;
  emoji: string;
  muscleGroup: MuscleGroup;
  exercises: Exercise[];
  source: TemplateSource;
  isBuiltIn: boolean;
  note?: string;
}

export interface SetLog {
  setNumber: number;
  targetRepsMin: number;
  targetRepsMax: number;
  weightKg: number | null;
  actualReps: number | null;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  workoutTemplateId: string;
  startedAt: string | null;
  finishedAt: string | null;
  exercises: ExerciseLog[];
  notes: string;
  completed: boolean;
}

export interface RunActivity {
  id: string;
  stravaId: number | null;
  name: string;
  date: string;
  distanceMeters: number;
  movingTimeSeconds: number;
  elapsedTimeSeconds: number;
  averagePaceSecondsPerKm: number;
  averageHeartRate: number | null;
  maxHeartRate: number | null;
  totalElevationGain: number;
  mapPolyline: string | null;
}

export type SupplementTime = "morning" | "post_workout" | "evening";

export interface Supplement {
  id: string;
  name: string;
  timeOfDay: SupplementTime;
  emoji: string;
}

export interface SupplementLog {
  date: string;
  supplementId: string;
  taken: boolean;
  checkedAt: string | null;
}

export interface RestTimerDefaults {
  compound_heavy: number;
  compound_medium: number;
  isolation: number;
  high_rep: number;
}

export type ThemeMode = "dark" | "light" | "system";

export interface UserSettings {
  restTimerDefaults: RestTimerDefaults;
  stravaAccessToken: string | null;
  stravaRefreshToken: string | null;
  stravaExpiresAt: number | null;
  stravaAthleteId: number | null;
  supplements: Supplement[];
  theme: ThemeMode;
}
