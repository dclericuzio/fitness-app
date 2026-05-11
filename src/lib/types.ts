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

export interface WorkoutTemplate {
  id: string;
  name: string;
  label: string;
  emoji: string;
  muscleGroup: MuscleGroup;
  exercises: Exercise[];
}

export interface ProgramDay {
  day: number;
  workoutId: string; // references WorkoutTemplate.id
}

export interface Program {
  id: string;
  name: string;
  subtitle: string;
  days: ProgramDay[];
  startDate: string; // ISO date
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
  programId: string;
  day: number;
  workoutId: string;
  date: string; // ISO date
  startedAt: string | null; // ISO datetime
  finishedAt: string | null; // ISO datetime
  exercises: ExerciseLog[];
  notes: string;
  extras: string[];
  completed: boolean;
}

export interface RunActivity {
  id: string;
  stravaId: number | null;
  name: string;
  date: string; // ISO datetime
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
  date: string; // ISO date YYYY-MM-DD
  supplementId: string;
  taken: boolean;
  checkedAt: string | null; // ISO datetime
}

export interface RestTimerDefaults {
  compound_heavy: number; // seconds
  compound_medium: number;
  isolation: number;
  high_rep: number;
}

export interface UserSettings {
  restTimerDefaults: RestTimerDefaults;
  stravaAccessToken: string | null;
  stravaRefreshToken: string | null;
  stravaExpiresAt: number | null;
  stravaAthleteId: number | null;
  supplements: Supplement[];
}
