import { Exercise, WorkoutTemplate } from "./types";

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

// ── Phase 1: PPLPPL ────────────────────────────────────────────────

const PHASE1_TEMPLATES: WorkoutTemplate[] = [
  {
    id: "p1_push_a",
    name: "Push A",
    label: "Strength + Upper Focus",
    emoji: "💪",
    muscleGroup: "push",
    source: "phase1",
    isBuiltIn: true,
    exercises: [
      ex("p1_incline_press", "Incline Press", 4, 6, 8, 1, 2, "compound_heavy"),
      ex("p1_machine_chest", "Machine Chest Press", 3, 8, 10, 1, 2, "compound_medium"),
      ex("p1_seated_db_ohp", "Seated DB Shoulder Press", 3, 8, 10, 1, 2, "compound_medium"),
      ex("p1_lateral_raise_a", "Lateral Raise", 4, 12, 15, 1, 1, "isolation"),
      ex("p1_tricep_pushdown_a", "Tricep Pushdown", 3, 10, 12, 1, 2, "isolation"),
      ex("p1_overhead_ext_a", "Overhead Tricep Extension", 3, 10, 12, 1, 1, "isolation"),
    ],
  },
  {
    id: "p1_push_b",
    name: "Push B",
    label: "Hypertrophy + Cable",
    emoji: "🔥",
    muscleGroup: "push",
    source: "phase1",
    isBuiltIn: true,
    exercises: [
      ex("p1_incline_db", "Incline DB Press", 3, 8, 12, 1, 2, "compound_medium"),
      ex("p1_cable_fly", "Cable Fly (High to Low)", 3, 12, 15, 0, 1, "isolation"),
      ex("p1_machine_chest_light", "Machine Chest Press (light)", 3, 10, 12, 1, 2, "compound_medium"),
      ex("p1_db_ohp_b", "DB Shoulder Press", 3, 10, 12, 1, 2, "compound_medium"),
      ex("p1_lateral_raise_b", "Lateral Raise", 4, 12, 15, 0, 1, "isolation"),
      ex("p1_tricep_pushdown_b", "Tricep Pushdown", 3, 12, 15, 1, 1, "isolation"),
    ],
  },
  {
    id: "p1_pull_a",
    name: "Pull A",
    label: "Strength + Thickness",
    emoji: "🏋️",
    muscleGroup: "pull",
    source: "phase1",
    isBuiltIn: true,
    exercises: [
      ex("p1_lat_pulldown_a", "Lat Pulldown / Pull Up", 4, 6, 10, 1, 2, "compound_heavy"),
      ex("p1_barbell_row_a", "Barbell Row", 4, 6, 10, 1, 2, "compound_heavy"),
      ex("p1_seated_cable_row", "Seated Cable Row", 3, 8, 12, 1, 2, "compound_medium"),
      ex("p1_face_pull_a", "Face Pull", 3, 12, 15, 1, 1, "isolation"),
      ex("p1_barbell_curl", "Barbell Curl", 3, 10, 12, 1, 2, "isolation"),
    ],
  },
  {
    id: "p1_pull_b",
    name: "Pull B",
    label: "Width + Detail",
    emoji: "💪",
    muscleGroup: "pull",
    source: "phase1",
    isBuiltIn: true,
    exercises: [
      ex("p1_lat_pulldown_wide", "Lat Pulldown (wide)", 4, 10, 12, 1, 2, "compound_medium"),
      ex("p1_chest_row", "Chest Supported Row", 3, 10, 12, 1, 2, "compound_medium"),
      ex("p1_straight_arm_pd", "Straight Arm Pulldown", 3, 12, 15, 1, 1, "isolation"),
      ex("p1_face_pull_b", "Face Pull", 3, 12, 15, 1, 1, "isolation"),
      ex("p1_hammer_curl", "Hammer Curl", 3, 10, 12, 1, 2, "isolation"),
    ],
  },
  {
    id: "p1_legs_a",
    name: "Legs A",
    label: "Heavy",
    emoji: "🦵",
    muscleGroup: "legs",
    source: "phase1",
    isBuiltIn: true,
    exercises: [
      ex("p1_squat", "Squat", 4, 5, 8, 1, 2, "compound_heavy"),
      ex("p1_rdl", "Romanian Deadlift", 3, 8, 10, 1, 2, "compound_heavy"),
      ex("p1_leg_press_a", "Leg Press", 3, 10, 12, 1, 2, "compound_medium"),
      ex("p1_leg_curl_a", "Leg Curl", 3, 10, 12, 1, 1, "isolation"),
      ex("p1_calf_raise_a", "Calf Raise", 4, 12, 20, 0, 1, "high_rep"),
    ],
  },
  {
    id: "p1_legs_b",
    name: "Legs B",
    label: "Volume",
    emoji: "🏃",
    muscleGroup: "legs",
    source: "phase1",
    isBuiltIn: true,
    exercises: [
      ex("p1_leg_press_b", "Leg Press", 4, 10, 12, 1, 2, "compound_medium"),
      ex("p1_bulgarian", "Bulgarian Split Squat", 3, 10, 12, 1, 2, "compound_medium"),
      ex("p1_leg_ext", "Leg Extension", 3, 12, 15, 1, 1, "isolation"),
      ex("p1_leg_curl_b", "Leg Curl", 3, 12, 15, 1, 1, "isolation"),
      ex("p1_calf_raise_b", "Calf Raise", 4, 15, 20, 0, 1, "high_rep"),
    ],
  },
];

// ── Phase 2: PPLRULP ───────────────────────────────────────────────

const PHASE2_TEMPLATES: WorkoutTemplate[] = [
  {
    id: "p2_push",
    name: "Push",
    label: "Aesthetic",
    emoji: "💪",
    muscleGroup: "push",
    source: "phase2",
    isBuiltIn: true,
    note: "+ Easy Run 3-5K + Heavy Abs",
    exercises: [
      ex("p2_bench", "Bench Press", 4, 5, 8, 1, 2, "compound_heavy"),
      ex("p2_incline_db", "Incline DB Press", 3, 8, 10, 1, 2, "compound_medium"),
      ex("p2_ohp", "Overhead Press", 3, 6, 8, 1, 2, "compound_heavy"),
      ex("p2_cable_lateral", "Cable Lateral Raise", 4, 12, 15, 0, 1, "isolation"),
      ex("p2_lateral_slow", "Lateral Raise (slow)", 2, 15, 20, 0, 1, "isolation"),
      ex("p2_overhead_ext", "Overhead Triceps Extension", 3, 10, 12, 0, 1, "isolation"),
      ex("p2_pushdown", "Triceps Pushdown", 3, 12, 12, 0, 1, "isolation"),
      ex("p2_ab_wheel", "Ab Wheel Rollout", 3, 10, 12, 0, 1, "isolation"),
      ex("p2_hanging_leg", "Hanging Leg Raise", 3, 12, 15, 0, 1, "isolation"),
    ],
  },
  {
    id: "p2_pull",
    name: "Pull",
    label: "Aesthetic + Tempo",
    emoji: "🏋️",
    muscleGroup: "pull",
    source: "phase2",
    isBuiltIn: true,
    note: "+ Tempo Run 4K + Light Abs",
    exercises: [
      ex("p2_barbell_row", "Barbell Row", 4, 6, 8, 1, 2, "compound_heavy"),
      ex("p2_lat_pulldown", "Lat Pulldown", 3, 8, 10, 1, 2, "compound_medium"),
      ex("p2_seated_row", "Seated Row", 3, 10, 12, 1, 2, "compound_medium"),
      ex("p2_face_pull", "Face Pull", 4, 12, 15, 0, 1, "isolation"),
      ex("p2_incline_curl", "Incline DB Curl", 3, 10, 12, 0, 1, "isolation"),
      ex("p2_hammer_curl", "Hammer Curl", 3, 10, 12, 0, 1, "isolation"),
      ex("p2_cable_crunch", "Cable Crunch", 3, 12, 15, 0, 1, "isolation"),
    ],
  },
  {
    id: "p2_legs",
    name: "Legs",
    label: "Heavy",
    emoji: "🦵",
    muscleGroup: "legs",
    source: "phase2",
    isBuiltIn: true,
    exercises: [
      ex("p2_vsquat", "V-Squat", 4, 6, 10, 1, 2, "compound_heavy"),
      ex("p2_leg_press", "Leg Press", 3, 10, 12, 1, 2, "compound_medium"),
      ex("p2_leg_curl", "Leg Curl", 3, 10, 12, 1, 1, "isolation"),
      ex("p2_leg_ext", "Leg Extension", 3, 12, 15, 0, 1, "isolation"),
      ex("p2_calf_raise", "Calf Raise", 4, 12, 15, 0, 1, "high_rep"),
    ],
  },
  {
    id: "p2_upper",
    name: "Upper",
    label: "Pump / Shape",
    emoji: "✨",
    muscleGroup: "upper",
    source: "phase2",
    isBuiltIn: true,
    note: "+ Easy Run 3-5K + Medium Abs",
    exercises: [
      ex("p2_incline_db_u", "Incline DB Press", 3, 10, 12, 1, 2, "compound_medium"),
      ex("p2_pullup", "Pull-up / Assisted", 3, 8, 10, 1, 2, "compound_heavy"),
      ex("p2_machine_chest", "Machine Chest Press", 3, 12, 12, 1, 2, "compound_medium"),
      ex("p2_single_arm_row", "Single Arm Row", 3, 12, 12, 1, 2, "compound_medium"),
      ex("p2_cable_lat_u", "Cable Lateral Raise", 4, 15, 15, 0, 1, "isolation"),
      ex("p2_rear_delt", "Rear Delt Fly", 3, 12, 15, 0, 1, "isolation"),
      ex("p2_preacher_curl", "Preacher Curl", 3, 10, 12, 0, 1, "isolation"),
      ex("p2_overhead_ext_u", "Overhead Triceps Extension", 3, 10, 12, 0, 1, "isolation"),
      ex("p2_decline_crunch", "Decline Crunch", 3, 12, 15, 0, 1, "isolation"),
      ex("p2_leg_raises", "Leg Raises", 3, 12, 15, 0, 1, "isolation"),
    ],
  },
  {
    id: "p2_lower",
    name: "Lower",
    label: "Light + Cardio",
    emoji: "🏃",
    muscleGroup: "lower",
    source: "phase2",
    isBuiltIn: true,
    note: "+ Interval Run (1min fast + 2min slow x4-6)",
    exercises: [
      ex("p2_rdl", "Romanian Deadlift", 3, 6, 8, 1, 2, "compound_heavy"),
      ex("p2_leg_curl_l", "Leg Curl", 3, 10, 12, 1, 1, "isolation"),
      ex("p2_hip_thrust", "Hip Thrust", 3, 8, 12, 1, 2, "compound_medium"),
      ex("p2_calf_raise_l", "Calf Raise", 3, 12, 15, 0, 1, "high_rep"),
    ],
  },
];

export const BUILT_IN_TEMPLATES: WorkoutTemplate[] = [
  ...PHASE1_TEMPLATES,
  ...PHASE2_TEMPLATES,
];

export function getTemplateById(
  id: string,
  customTemplates: WorkoutTemplate[] = []
): WorkoutTemplate | undefined {
  return (
    BUILT_IN_TEMPLATES.find((t) => t.id === id) ??
    customTemplates.find((t) => t.id === id)
  );
}

export function getAllTemplates(
  customTemplates: WorkoutTemplate[] = []
): WorkoutTemplate[] {
  return [...customTemplates, ...BUILT_IN_TEMPLATES];
}
