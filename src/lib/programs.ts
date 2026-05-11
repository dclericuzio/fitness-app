import { Exercise, Program, WorkoutTemplate } from "./types";

function ex(
  id: string,
  name: string,
  sets: number,
  repsMin: number,
  repsMax: number,
  rirMin: number,
  rirMax: number,
  category: Exercise["category"] = "compound_medium"
): Exercise {
  return { id, name, sets, repsMin, repsMax, rirMin, rirMax, category };
}

export const WORKOUTS: WorkoutTemplate[] = [
  {
    id: "push",
    name: "Push",
    label: "Aesthetic",
    emoji: "💪",
    muscleGroup: "push",
    exercises: [
      ex("incline_bench", "Incline Bench Press", 4, 8, 10, 1, 2, "compound_heavy"),
      ex("db_ohp", "DB Shoulder Press", 3, 8, 12, 1, 2, "compound_medium"),
      ex("cable_fly", "Cable Fly", 3, 12, 15, 0, 1, "isolation"),
      ex("lateral_raise", "Lateral Raise", 4, 12, 15, 0, 1, "isolation"),
      ex("rope_pushdown", "Rope Pushdown", 3, 10, 15, 0, 1, "isolation"),
    ],
  },
  {
    id: "pull",
    name: "Pull",
    label: "Aesthetic + Tempo",
    emoji: "🏋️",
    muscleGroup: "pull",
    exercises: [
      ex("pullup", "Pull-up", 4, 6, 10, 1, 2, "compound_heavy"),
      ex("cable_row", "Seated Cable Row (Tempo)", 3, 10, 12, 1, 2, "compound_medium"),
      ex("single_arm_pulldown", "Single Arm Pulldown", 3, 10, 12, 0, 1, "isolation"),
      ex("rear_delt_fly", "Rear Delt Fly", 3, 12, 15, 0, 1, "isolation"),
      ex("incline_curl", "Incline DB Curl", 3, 10, 12, 0, 1, "isolation"),
    ],
  },
  {
    id: "legs",
    name: "Legs",
    label: "Heavy",
    emoji: "🦵",
    muscleGroup: "legs",
    exercises: [
      ex("squat", "Squat", 4, 5, 8, 1, 2, "compound_heavy"),
      ex("rdl", "Romanian Deadlift", 3, 8, 10, 1, 2, "compound_heavy"),
      ex("hack_squat", "Hack Squat", 3, 10, 12, 1, 2, "compound_medium"),
      ex("leg_curl", "Leg Curl", 3, 10, 12, 1, 1, "isolation"),
      ex("calf_raise", "Calf Raise", 4, 12, 20, 0, 1, "high_rep"),
    ],
  },
  {
    id: "upper",
    name: "Upper",
    label: "Pump / Shape",
    emoji: "✨",
    muscleGroup: "upper",
    exercises: [
      ex("smith_incline", "Smith Incline Press", 3, 10, 12, 1, 2, "compound_medium"),
      ex("machine_row", "Machine Row", 3, 10, 12, 1, 2, "compound_medium"),
      ex("cable_lateral", "Cable Lateral Raise", 3, 12, 15, 0, 1, "isolation"),
      ex("cable_curl", "Cable Curl", 3, 10, 15, 0, 1, "isolation"),
      ex("overhead_ext", "Overhead Tricep Extension", 3, 10, 15, 0, 1, "isolation"),
    ],
  },
  {
    id: "lower",
    name: "Lower",
    label: "Light + Cardio",
    emoji: "🏃",
    muscleGroup: "lower",
    exercises: [
      ex("goblet_squat", "Goblet Squat", 3, 12, 15, 1, 2, "compound_medium"),
      ex("walking_lunge", "Walking Lunge", 3, 12, 15, 1, 2, "compound_medium"),
      ex("leg_ext", "Leg Extension", 3, 15, 20, 0, 1, "high_rep"),
      ex("seated_curl", "Seated Leg Curl", 3, 12, 15, 0, 1, "isolation"),
      ex("stairmaster", "Stairmaster", 1, 15, 15, 0, 0, "high_rep"),
    ],
  },
  {
    id: "rest",
    name: "Rest",
    label: "",
    emoji: "😴",
    muscleGroup: "rest",
    exercises: [],
  },
];

const daySequence = [
  "upper", "lower", "rest", "push", "pull", "legs", "rest",
  "upper", "lower", "rest", "push", "pull", "legs", "rest",
  "upper", "lower", "rest", "push", "pull", "legs", "rest",
  "upper", "lower", "rest", "push", "pull", "legs", "rest",
  "upper", "lower",
];

export const PROGRAM: Program = {
  id: "dc_program",
  name: "DC Program",
  subtitle: "PPLRULP · 30 Days",
  startDate: "2026-04-24",
  days: daySequence.map((wid, i) => ({ day: i + 1, workoutId: wid })),
};

export function getWorkoutTemplate(
  _programId: string,
  workoutId: string
): WorkoutTemplate | undefined {
  return WORKOUTS.find((w) => w.id === workoutId);
}
