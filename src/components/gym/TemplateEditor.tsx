"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus, Trash2, X, Save } from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { WorkoutTemplate, Exercise, MuscleGroup, ExerciseCategory } from "@/lib/types";
import { getCustomTemplates } from "@/lib/store";

const MUSCLE_GROUPS: { value: MuscleGroup; label: string }[] = [
  { value: "push", label: "Push" },
  { value: "pull", label: "Pull" },
  { value: "legs", label: "Legs" },
  { value: "upper", label: "Upper" },
  { value: "lower", label: "Lower" },
];

const EMOJIS = ["💪", "🔥", "🏋️", "🦵", "🏃", "✨", "⚡", "🎯", "💥", "🧘"];

interface TemplateEditorProps {
  initial?: WorkoutTemplate;
  onSave: (t: WorkoutTemplate) => void;
  onCancel: () => void;
}

export default function TemplateEditor({ initial, onSave, onCancel }: TemplateEditorProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? "💪");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>(initial?.muscleGroup ?? "push");
  const [exercises, setExercises] = useState<Exercise[]>(initial?.exercises ?? []);

  const isCustomSource = initial?.source && initial.source !== "phase1" && initial.source !== "phase2";
  const [category, setCategory] = useState(isCustomSource ? initial.source : "my_workouts");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  const existingCategories = useMemo(() => {
    const customs = getCustomTemplates();
    const cats = new Set(customs.map((t) => t.source));
    cats.add("my_workouts");
    return Array.from(cats).sort();
  }, []);

  const categoryLabels: Record<string, string> = {
    my_workouts: "My Workouts",
  };

  const addExercise = useCallback(() => {
    setExercises((prev) => [
      ...prev,
      {
        id: `custom_${generateId()}`,
        name: "",
        sets: 3,
        repsMin: 8,
        repsMax: 12,
        rirMin: 1,
        rirMax: 2,
        category: "compound_medium" as ExerciseCategory,
      },
    ]);
  }, []);

  const updateExercise = useCallback(
    (idx: number, field: string, value: string | number) => {
      setExercises((prev) =>
        prev.map((ex, i) => (i === idx ? { ...ex, [field]: value } : ex))
      );
    },
    []
  );

  const removeExercise = useCallback((idx: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleSave = () => {
    if (!name.trim() || exercises.filter((e) => e.name.trim()).length === 0) return;

    let finalCategory = category;
    if (showNewCategory && newCategory.trim()) {
      finalCategory = newCategory.trim().toLowerCase().replace(/\s+/g, "_");
    }

    const template: WorkoutTemplate = {
      id: initial?.id ?? `custom_${generateId()}`,
      name: name.trim(),
      label: label.trim(),
      emoji,
      muscleGroup,
      exercises: exercises.filter((e) => e.name.trim()),
      source: finalCategory,
      isBuiltIn: false,
    };
    onSave(template);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">
          {initial ? "Edit Workout" : "New Workout"}
        </h3>
        <button onClick={onCancel} className="rounded-full p-2 text-muted active:bg-muted/10">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-muted">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Full Body Friday"
            className="w-full rounded-lg border border-card-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Label (optional)</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Strength + Hypertrophy"
            className="w-full rounded-lg border border-card-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Category selector */}
        <div>
          <label className="mb-2 block text-xs text-muted">Category</label>
          {showNewCategory ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Phase 3, Bulk Program"
                className="flex-1 rounded-lg border border-card-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowNewCategory(false);
                  setNewCategory("");
                }}
                className="rounded-lg bg-muted/10 px-3 py-2 text-xs text-muted"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {existingCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    category === cat
                      ? "bg-primary/20 text-primary ring-1 ring-primary"
                      : "bg-muted/10 text-muted"
                  )}
                >
                  {categoryLabels[cat] ?? cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
              <button
                onClick={() => setShowNewCategory(true)}
                className="flex items-center gap-1 rounded-lg border border-dashed border-card-border px-3 py-2 text-sm text-muted transition-colors hover:border-primary hover:text-primary"
              >
                <Plus size={12} /> New
              </button>
            </div>
          )}
        </div>

        {/* Muscle group */}
        <div>
          <label className="mb-2 block text-xs text-muted">Muscle Group</label>
          <div className="flex flex-wrap gap-2">
            {MUSCLE_GROUPS.map((g) => (
              <button
                key={g.value}
                onClick={() => setMuscleGroup(g.value)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  muscleGroup === g.value
                    ? "bg-primary/20 text-primary ring-1 ring-primary"
                    : "bg-muted/10 text-muted"
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Emoji */}
        <div>
          <label className="mb-2 block text-xs text-muted">Emoji</label>
          <div className="flex flex-wrap gap-1.5">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-all",
                  emoji === e ? "bg-primary/20 ring-1 ring-primary" : "bg-muted/10"
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs text-muted">
          Exercises ({exercises.length})
        </label>
        <div className="space-y-2">
          {exercises.map((ex, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 rounded-lg border border-card-border bg-card p-3"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  type="text"
                  value={ex.name}
                  onChange={(e) => updateExercise(idx, "name", e.target.value)}
                  placeholder="Exercise name"
                  className="w-full rounded bg-muted/10 px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex gap-2 text-xs">
                  <label className="flex items-center gap-1">
                    Sets
                    <input
                      type="number"
                      value={ex.sets}
                      onChange={(e) => updateExercise(idx, "sets", parseInt(e.target.value) || 1)}
                      className="w-10 rounded bg-muted/10 px-1 py-1 text-center outline-none"
                    />
                  </label>
                  <label className="flex items-center gap-1">
                    Reps
                    <input
                      type="number"
                      value={ex.repsMin}
                      onChange={(e) => updateExercise(idx, "repsMin", parseInt(e.target.value) || 1)}
                      className="w-10 rounded bg-muted/10 px-1 py-1 text-center outline-none"
                    />
                    -
                    <input
                      type="number"
                      value={ex.repsMax}
                      onChange={(e) => updateExercise(idx, "repsMax", parseInt(e.target.value) || 1)}
                      className="w-10 rounded bg-muted/10 px-1 py-1 text-center outline-none"
                    />
                  </label>
                </div>
              </div>
              <button
                onClick={() => removeExercise(idx)}
                className="mt-1 shrink-0 text-muted transition-colors hover:text-danger"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addExercise}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-card-border py-2.5 text-xs text-muted transition-colors hover:border-primary hover:text-primary"
        >
          <Plus size={14} /> Add Exercise
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={!name.trim() || exercises.filter((e) => e.name.trim()).length === 0}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-40"
      >
        <Save size={16} />
        {initial ? "Save Changes" : "Create Workout"}
      </button>
    </div>
  );
}
