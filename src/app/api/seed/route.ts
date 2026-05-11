import { NextResponse } from "next/server";

function mkEx(list: Array<{ id: string; name: string; sets: number; min: number; max: number }>, done: boolean) {
  return list.map((ex) => ({
    exerciseId: ex.id,
    exerciseName: ex.name,
    sets: Array.from({ length: ex.sets }, (_, i) => ({
      setNumber: i + 1,
      targetRepsMin: ex.min,
      targetRepsMax: ex.max,
      weightKg: null,
      actualReps: null,
      completed: done,
    })),
  }));
}

export async function GET() {
  const p1pa = [
    { id: "p1_incline_press", name: "Incline Press", sets: 4, min: 6, max: 8 },
    { id: "p1_machine_chest", name: "Machine Chest Press", sets: 3, min: 8, max: 10 },
    { id: "p1_seated_db_ohp", name: "Seated DB Shoulder Press", sets: 3, min: 8, max: 10 },
    { id: "p1_lateral_raise_a", name: "Lateral Raise", sets: 4, min: 12, max: 15 },
    { id: "p1_tricep_pushdown_a", name: "Tricep Pushdown", sets: 3, min: 10, max: 12 },
    { id: "p1_overhead_ext_a", name: "Overhead Tricep Extension", sets: 3, min: 10, max: 12 },
  ];
  const p1pb = [
    { id: "p1_incline_db", name: "Incline DB Press", sets: 3, min: 8, max: 12 },
    { id: "p1_cable_fly", name: "Cable Fly (High to Low)", sets: 3, min: 12, max: 15 },
    { id: "p1_machine_chest_light", name: "Machine Chest Press (light)", sets: 3, min: 10, max: 12 },
    { id: "p1_db_ohp_b", name: "DB Shoulder Press", sets: 3, min: 10, max: 12 },
    { id: "p1_lateral_raise_b", name: "Lateral Raise", sets: 4, min: 12, max: 15 },
    { id: "p1_tricep_pushdown_b", name: "Tricep Pushdown", sets: 3, min: 12, max: 15 },
  ];
  const p1pla = [
    { id: "p1_lat_pulldown_a", name: "Lat Pulldown / Pull Up", sets: 4, min: 6, max: 10 },
    { id: "p1_barbell_row_a", name: "Barbell Row", sets: 4, min: 6, max: 10 },
    { id: "p1_seated_cable_row", name: "Seated Cable Row", sets: 3, min: 8, max: 12 },
    { id: "p1_face_pull_a", name: "Face Pull", sets: 3, min: 12, max: 15 },
    { id: "p1_barbell_curl", name: "Barbell Curl", sets: 3, min: 10, max: 12 },
  ];
  const p1plb = [
    { id: "p1_lat_pulldown_wide", name: "Lat Pulldown (wide)", sets: 4, min: 10, max: 12 },
    { id: "p1_chest_row", name: "Chest Supported Row", sets: 3, min: 10, max: 12 },
    { id: "p1_straight_arm_pd", name: "Straight Arm Pulldown", sets: 3, min: 12, max: 15 },
    { id: "p1_face_pull_b", name: "Face Pull", sets: 3, min: 12, max: 15 },
    { id: "p1_hammer_curl", name: "Hammer Curl", sets: 3, min: 10, max: 12 },
  ];
  const p1la = [
    { id: "p1_squat", name: "Squat", sets: 4, min: 5, max: 8 },
    { id: "p1_rdl", name: "Romanian Deadlift", sets: 3, min: 8, max: 10 },
    { id: "p1_leg_press_a", name: "Leg Press", sets: 3, min: 10, max: 12 },
    { id: "p1_leg_curl_a", name: "Leg Curl", sets: 3, min: 10, max: 12 },
    { id: "p1_calf_raise_a", name: "Calf Raise", sets: 4, min: 12, max: 20 },
  ];
  const p1lb = [
    { id: "p1_leg_press_b", name: "Leg Press", sets: 4, min: 10, max: 12 },
    { id: "p1_bulgarian", name: "Bulgarian Split Squat", sets: 3, min: 10, max: 12 },
    { id: "p1_leg_ext", name: "Leg Extension", sets: 3, min: 12, max: 15 },
    { id: "p1_leg_curl_b", name: "Leg Curl", sets: 3, min: 12, max: 15 },
    { id: "p1_calf_raise_b", name: "Calf Raise", sets: 4, min: 15, max: 20 },
  ];
  const p2push = [
    { id: "p2_bench", name: "Bench Press", sets: 4, min: 5, max: 8 },
    { id: "p2_incline_db", name: "Incline DB Press", sets: 3, min: 8, max: 10 },
    { id: "p2_ohp", name: "Overhead Press", sets: 3, min: 6, max: 8 },
    { id: "p2_cable_lateral", name: "Cable Lateral Raise", sets: 4, min: 12, max: 15 },
    { id: "p2_lateral_slow", name: "Lateral Raise (slow)", sets: 2, min: 15, max: 20 },
    { id: "p2_overhead_ext", name: "Overhead Triceps Extension", sets: 3, min: 10, max: 12 },
    { id: "p2_pushdown", name: "Triceps Pushdown", sets: 3, min: 12, max: 12 },
    { id: "p2_ab_wheel", name: "Ab Wheel Rollout", sets: 3, min: 10, max: 12 },
    { id: "p2_hanging_leg", name: "Hanging Leg Raise", sets: 3, min: 12, max: 15 },
  ];
  const p2pull = [
    { id: "p2_barbell_row", name: "Barbell Row", sets: 4, min: 6, max: 8 },
    { id: "p2_lat_pulldown", name: "Lat Pulldown", sets: 3, min: 8, max: 10 },
    { id: "p2_seated_row", name: "Seated Row", sets: 3, min: 10, max: 12 },
    { id: "p2_face_pull", name: "Face Pull", sets: 4, min: 12, max: 15 },
    { id: "p2_incline_curl", name: "Incline DB Curl", sets: 3, min: 10, max: 12 },
    { id: "p2_hammer_curl", name: "Hammer Curl", sets: 3, min: 10, max: 12 },
    { id: "p2_cable_crunch", name: "Cable Crunch", sets: 3, min: 12, max: 15 },
  ];
  const p2legs = [
    { id: "p2_vsquat", name: "V-Squat", sets: 4, min: 6, max: 10 },
    { id: "p2_leg_press", name: "Leg Press", sets: 3, min: 10, max: 12 },
    { id: "p2_leg_curl", name: "Leg Curl", sets: 3, min: 10, max: 12 },
    { id: "p2_leg_ext", name: "Leg Extension", sets: 3, min: 12, max: 15 },
    { id: "p2_calf_raise", name: "Calf Raise", sets: 4, min: 12, max: 15 },
  ];
  const p2upper = [
    { id: "p2_incline_db_u", name: "Incline DB Press", sets: 3, min: 10, max: 12 },
    { id: "p2_pullup", name: "Pull-up / Assisted", sets: 3, min: 8, max: 10 },
    { id: "p2_machine_chest", name: "Machine Chest Press", sets: 3, min: 12, max: 12 },
    { id: "p2_single_arm_row", name: "Single Arm Row", sets: 3, min: 12, max: 12 },
    { id: "p2_cable_lat_u", name: "Cable Lateral Raise", sets: 4, min: 15, max: 15 },
    { id: "p2_rear_delt", name: "Rear Delt Fly", sets: 3, min: 12, max: 15 },
    { id: "p2_preacher_curl", name: "Preacher Curl", sets: 3, min: 10, max: 12 },
    { id: "p2_overhead_ext_u", name: "Overhead Triceps Extension", sets: 3, min: 10, max: 12 },
    { id: "p2_decline_crunch", name: "Decline Crunch", sets: 3, min: 12, max: 15 },
    { id: "p2_leg_raises", name: "Leg Raises", sets: 3, min: 12, max: 15 },
  ];
  const p2lower = [
    { id: "p2_rdl", name: "Romanian Deadlift", sets: 3, min: 6, max: 8 },
    { id: "p2_leg_curl_l", name: "Leg Curl", sets: 3, min: 10, max: 12 },
    { id: "p2_hip_thrust", name: "Hip Thrust", sets: 3, min: 8, max: 12 },
    { id: "p2_calf_raise_l", name: "Calf Raise", sets: 3, min: 12, max: 15 },
  ];

  const t: Record<string, typeof p1pa> = {
    p1_push_a: p1pa, p1_push_b: p1pb, p1_pull_a: p1pla, p1_pull_b: p1plb,
    p1_legs_a: p1la, p1_legs_b: p1lb, p2_push: p2push, p2_pull: p2pull,
    p2_legs: p2legs, p2_upper: p2upper, p2_lower: p2lower,
  };

  type Day = { date: string; tid: string; notes: string; done: boolean };
  const days: Day[] = [
    // Phase 1 (Mar 25 - Apr 23) - all done
    { date: "2026-03-25", tid: "p1_legs_a", notes: "Plank 1 min 3 set. Cardio treadmill 15 mins", done: true },
    { date: "2026-03-26", tid: "p1_push_b", notes: "Plank 1 min 3 set. Cardio walk back to office from benhil mrt", done: true },
    { date: "2026-03-27", tid: "p1_pull_b", notes: "Plank 1 min 3 set. Cardio walk back from ftl benhil to office", done: true },
    { date: "2026-03-28", tid: "p1_legs_b", notes: "Plank 1 min 3 set. Cardio 15 mins treadmill", done: true },
    { date: "2026-03-30", tid: "p1_push_a", notes: "Plank 1 min 3 set. Treadmill 15 mins", done: true },
    { date: "2026-03-31", tid: "p1_pull_a", notes: "Plank 1 min 3 set. Cardio 15 mins", done: true },
    { date: "2026-04-01", tid: "p1_legs_a", notes: "Plank 1m20s 3 sets, Leg raise 15 reps 3 sets. Cardio treadmill 15 mins", done: true },
    { date: "2026-04-02", tid: "p1_push_b", notes: "Plank 1m20s 3 sets, Leg raise 15 reps 3 sets. Cardio 15 menit", done: true },
    { date: "2026-04-03", tid: "p1_pull_b", notes: "Plank 1m20s 3 sets, Leg raise 15 reps 3 sets. Cardio 15 mins", done: true },
    { date: "2026-04-04", tid: "p1_legs_b", notes: "Plank 1 min 3 sets, Leg raise 15 3 sets, Russian twist 20 3 sets. Cardio 15 mins", done: true },
    { date: "2026-04-06", tid: "p1_push_a", notes: "Plank 1 min 3 sets, Leg raise 15 3 sets, Russian twist 20 reps 3 sets. Cardio lari balik apart", done: true },
    { date: "2026-04-07", tid: "p1_pull_a", notes: "Plank 1 min 3 sets, Leg raise 15 3 sets, Russian twist 20 3 sets. 7k cardio", done: true },
    { date: "2026-04-08", tid: "p1_legs_a", notes: "Plank 1 min 3 sets, Leg raise 15 3 sets, Russian twist 20 3 sets. Cardio 15 mins", done: true },
    { date: "2026-04-09", tid: "p1_push_b", notes: "Plank 1 min 3 sets, Leg raise 15 reps 3 sets, Russian twist 20 3 sets. Cycling 15 mins", done: true },
    { date: "2026-04-10", tid: "p1_pull_b", notes: "Plank 1 min 3 sets, Leg raise 15 reps 3 sets, Russian 20 3 sets. Walk home from gym", done: true },
    { date: "2026-04-11", tid: "p1_legs_b", notes: "Leg raise angkat hips 15 reps 3 sets, Heel touch 20 3 sets. Cardio 3K", done: true },
    { date: "2026-04-13", tid: "p1_push_a", notes: "Plank 1 min 3 sets, Legraise 12 x crunch 12 3 sets. Cardio 15mins treadmill", done: true },
    { date: "2026-04-14", tid: "p1_pull_a", notes: "Hanging leg raise 15 reps 3 sets, Heel touch 20 3 sets, Crunch 20 3 sets. Walk home from office", done: true },
    { date: "2026-04-15", tid: "p1_legs_a", notes: "Roller abs 12 3 sets, Crunch machine 12 3 sets. Cycling 20 mins", done: true },
    { date: "2026-04-16", tid: "p1_push_b", notes: "Crunch 20 3 sets, Heel touch 20 3 sets. 5k pace 6:32 yessir", done: true },
    { date: "2026-04-17", tid: "p1_pull_b", notes: "Plank 1 min 3 sets, Roller abs 12 3 sets. 5k mega kuningan", done: true },
    { date: "2026-04-18", tid: "p1_legs_b", notes: "Leg raise 12 3 sets, Roller abs 12 3 sets. Walk with pilus", done: true },
    { date: "2026-04-20", tid: "p1_push_a", notes: "Reverse crunch 15 3 sets, Heel touch 20 3 sets. 5k zone 2, jaga heart rage 125-155", done: true },
    { date: "2026-04-21", tid: "p1_pull_a", notes: "Roller abs 12 3 sets, Crunch 20 3 set. 5k tempo run", done: true },
    { date: "2026-04-22", tid: "p1_legs_a", notes: "Abdominal 15 3 sets. Rest lari, ke angke papi cath bday", done: true },
    { date: "2026-04-23", tid: "p1_push_b", notes: "Plank 1 min 3 sets, Crunch 20 3 sets. 5k easy run", done: true },
    // Phase 2 past (Apr 24 - May 10) - all done
    { date: "2026-04-24", tid: "p2_upper", notes: "Easy Run 3-5K HR 135-150 bpm", done: true },
    { date: "2026-04-25", tid: "p2_lower", notes: "Interval Run 4-6 rounds 1min fast + 2min slow", done: true },
    { date: "2026-04-27", tid: "p2_push", notes: "Easy Run 3-5K HR 135-150 bpm", done: true },
    { date: "2026-04-28", tid: "p2_pull", notes: "Tempo Run 4K total HR 150-165 bpm", done: true },
    { date: "2026-04-29", tid: "p2_legs", notes: "Recovery walk/run pace 9, 5k", done: true },
    { date: "2026-05-01", tid: "p2_upper", notes: "Easy Run 3-5K HR 135-150 bpm", done: true },
    { date: "2026-05-02", tid: "p2_lower", notes: "Interval Run 4-6 rounds 1min fast + 2min slow", done: true },
    { date: "2026-05-04", tid: "p2_push", notes: "Easy Run 3-5K HR 135-150 bpm", done: true },
    { date: "2026-05-05", tid: "p2_pull", notes: "Tempo Run 4K total HR 150-165 bpm", done: true },
    { date: "2026-05-06", tid: "p2_legs", notes: "", done: true },
    { date: "2026-05-08", tid: "p2_upper", notes: "Today no run, kemarin uda run", done: true },
    { date: "2026-05-09", tid: "p2_lower", notes: "Interval Run 4-6 rounds 1min fast + 2min slow", done: true },
    // Phase 2 today + planned (May 11 - May 25) - not done
    { date: "2026-05-11", tid: "p2_push", notes: "", done: false },
    { date: "2026-05-12", tid: "p2_pull", notes: "", done: false },
    { date: "2026-05-13", tid: "p2_legs", notes: "", done: false },
    { date: "2026-05-15", tid: "p2_upper", notes: "", done: false },
    { date: "2026-05-16", tid: "p2_lower", notes: "", done: false },
    { date: "2026-05-18", tid: "p2_push", notes: "", done: false },
    { date: "2026-05-19", tid: "p2_pull", notes: "", done: false },
    { date: "2026-05-20", tid: "p2_legs", notes: "", done: false },
    { date: "2026-05-22", tid: "p2_upper", notes: "", done: false },
    { date: "2026-05-23", tid: "p2_lower", notes: "", done: false },
    { date: "2026-05-25", tid: "p2_push", notes: "", done: false },
  ];

  let c = 0;
  const sessions = days.map((d) => {
    c++;
    return {
      id: `seed_${d.date}_${c}`,
      date: d.date,
      workoutTemplateId: d.tid,
      startedAt: d.done ? `${d.date}T07:00:00.000Z` : null,
      finishedAt: d.done ? `${d.date}T08:30:00.000Z` : null,
      exercises: mkEx(t[d.tid], d.done),
      notes: d.notes,
      completed: d.done,
    };
  });

  return NextResponse.json({ sessions });
}
