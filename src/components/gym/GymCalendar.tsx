"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  X,
  Trash2,
  RefreshCw,
  Pencil,
} from "lucide-react";
import { cn, toISODate, formatDateFull } from "@/lib/utils";
import { BUILT_IN_TEMPLATES, getTemplateById } from "@/lib/programs";
import {
  getSessionsForMonth,
  getSessionByDate,
  assignWorkoutToDate,
  deleteSession,
  toggleSessionComplete,
  getCustomTemplates,
  saveCustomTemplate,
  getSessions,
} from "@/lib/store";
import { WorkoutTemplate, WorkoutSession, MuscleGroup } from "@/lib/types";
import ExerciseLogger from "./ExerciseLogger";
import TemplateEditor from "./TemplateEditor";

const groupColors: Record<MuscleGroup, string> = {
  push: "bg-push",
  pull: "bg-pull",
  legs: "bg-legs",
  upper: "bg-upper",
  lower: "bg-lower",
  rest: "bg-rest",
};

const groupBorder: Record<MuscleGroup, string> = {
  push: "border-l-push",
  pull: "border-l-pull",
  legs: "border-l-legs",
  upper: "border-l-upper",
  lower: "border-l-lower",
  rest: "border-l-rest",
};

export default function GymCalendar() {
  const [calMonth, setCalMonth] = useState(() => ({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  }));
  const [selectedDate, setSelectedDate] = useState<string>(toISODate(new Date()));
  const [showPicker, setShowPicker] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const customTemplates = useMemo(() => getCustomTemplates(), [refreshKey]);
  const allTemplates = useMemo(
    () => [...customTemplates, ...BUILT_IN_TEMPLATES],
    [customTemplates]
  );

  const monthSessions = useMemo(
    () => getSessionsForMonth(calMonth.year, calMonth.month),
    [calMonth, refreshKey]
  );

  const selectedSession = useMemo(
    () => getSessionByDate(selectedDate),
    [selectedDate, refreshKey]
  );

  const selectedTemplate = useMemo(
    () =>
      selectedSession
        ? getTemplateById(selectedSession.workoutTemplateId, customTemplates)
        : undefined,
    [selectedSession, customTemplates]
  );

  const calendarData = useMemo(() => {
    const daysInMonth = new Date(calMonth.year, calMonth.month + 1, 0).getDate();
    const firstDow = new Date(calMonth.year, calMonth.month, 1).getDay();
    const sessionMap = new Map<number, WorkoutSession>();
    monthSessions.forEach((s) => {
      const day = parseInt(s.date.split("-")[2]);
      sessionMap.set(day, s);
    });
    return { daysInMonth, firstDow, sessionMap };
  }, [calMonth, monthSessions]);

  const todayStr = toISODate(new Date());
  const isToday = selectedDate === todayStr;

  const handlePickTemplate = useCallback(
    (template: WorkoutTemplate) => {
      assignWorkoutToDate(selectedDate, template.id);
      setShowPicker(false);
      refresh();
    },
    [selectedDate, refresh]
  );

  const handleRemoveWorkout = useCallback(() => {
    deleteSession(selectedDate);
    refresh();
  }, [selectedDate, refresh]);

  const handleToggleComplete = useCallback(() => {
    toggleSessionComplete(selectedDate);
    refresh();
  }, [selectedDate, refresh]);

  const handleSwapWorkout = useCallback(() => {
    setShowPicker(true);
  }, []);

  const handleSaveCustomTemplate = useCallback(
    (template: WorkoutTemplate) => {
      saveCustomTemplate(template);
      setShowEditor(false);
      setEditingTemplate(undefined);
      refresh();
    },
    [refresh]
  );

  const handleSessionUpdate = useCallback(
    (_updated: WorkoutSession) => {
      refresh();
    },
    [refresh]
  );

  const prevMonth = () =>
    setCalMonth((p) => {
      const d = new Date(p.year, p.month - 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  const nextMonth = () =>
    setCalMonth((p) => {
      const d = new Date(p.year, p.month + 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  // Phase grouping for template picker
  const phase1 = BUILT_IN_TEMPLATES.filter((t) => t.source === "phase1");
  const phase2 = BUILT_IN_TEMPLATES.filter((t) => t.source === "phase2");

  if (showEditor) {
    return (
      <TemplateEditor
        initial={editingTemplate}
        onSave={handleSaveCustomTemplate}
        onCancel={() => {
          setShowEditor(false);
          setEditingTemplate(undefined);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gym</h1>

      {/* Month Calendar */}
      <div className="rounded-xl border border-card-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={prevMonth} className="rounded-full p-1.5 active:bg-muted/10">
            <ChevronLeft size={18} className="text-muted" />
          </button>
          <span className="text-sm font-semibold">
            {new Date(calMonth.year, calMonth.month).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button onClick={nextMonth} className="rounded-full p-1.5 active:bg-muted/10">
            <ChevronRight size={18} className="text-muted" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-medium text-muted">{d}</div>
          ))}
          {Array.from({ length: calendarData.firstDow }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${calMonth.year}-${String(calMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const session = calendarData.sessionMap.get(day);
            const hasWorkout = !!session;
            const isDone = session?.completed ?? false;
            const isPlanned = hasWorkout && !isDone;
            const isSelected = dateStr === selectedDate;
            const isTodayCell = dateStr === todayStr;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                className={cn(
                  "relative flex h-10 items-center justify-center rounded-lg text-xs transition-all",
                  isDone && !isSelected && "bg-success/20 text-success font-semibold",
                  isSelected && "ring-2 ring-primary font-bold",
                  isSelected && isDone && "bg-success/20 text-success",
                  isSelected && !isDone && "bg-primary/10",
                  isTodayCell && !isSelected && "ring-1 ring-primary/50",
                  !isSelected && !isTodayCell && !isDone && "hover:bg-muted/10"
                )}
              >
                <span>{day}</span>
                {isPlanned && (
                  <div className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-orange" />
                )}
              </button>
            );
          })}
        </div>
        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-success/20" />
            <span>Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="relative flex h-3 w-3 items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-orange" />
            </div>
            <span>Planned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded ring-1 ring-primary/50" />
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Day Sheet */}
      <div className="rounded-xl border border-card-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-muted">
              {isToday ? "Today" : formatDateFull(new Date(selectedDate + "T12:00:00"))}
            </div>
            {selectedTemplate && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-lg font-bold">
                  {selectedTemplate.emoji} {selectedTemplate.name}
                </span>
                {selectedTemplate.label && (
                  <span className="rounded-md bg-muted/10 px-2 py-0.5 text-[10px] font-medium text-muted">
                    {selectedTemplate.label}
                  </span>
                )}
              </div>
            )}
          </div>
          {selectedSession && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleComplete}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                  selectedSession.completed
                    ? "border-success bg-success/20 text-success"
                    : "border-muted/30 text-transparent hover:border-muted/50"
                )}
              >
                <Check size={16} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>

        {selectedTemplate?.note && (
          <div className="mb-3 rounded-lg bg-orange/10 px-3 py-2 text-xs text-orange">
            {selectedTemplate.note}
          </div>
        )}

        {selectedSession && selectedTemplate ? (
          <>
            <ExerciseLogger
              session={selectedSession}
              workout={selectedTemplate}
              onUpdate={handleSessionUpdate}
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSwapWorkout}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-card-border py-2 text-xs text-muted transition-colors hover:text-foreground"
              >
                <RefreshCw size={12} /> Swap
              </button>
              <button
                onClick={handleRemoveWorkout}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-card-border py-2 text-xs text-danger transition-colors"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </>
        ) : showPicker ? (
          <TemplatePicker
            phase1={phase1}
            phase2={phase2}
            custom={customTemplates}
            onPick={handlePickTemplate}
            onNewTemplate={() => {
              setShowPicker(false);
              setShowEditor(true);
            }}
            onClose={() => setShowPicker(false)}
          />
        ) : (
          <button
            onClick={() => setShowPicker(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 py-8 text-sm font-medium text-primary transition-all hover:border-primary/60 hover:bg-primary/5"
          >
            <Plus size={18} />
            Pick a Workout
          </button>
        )}
      </div>
    </div>
  );
}

// ── Template Picker ─────────────────────────────────────────────────

function formatCategoryTitle(source: string): string {
  if (source === "my_workouts") return "My Workouts";
  return source.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function TemplatePicker({
  phase1,
  phase2,
  custom,
  onPick,
  onNewTemplate,
  onClose,
}: {
  phase1: WorkoutTemplate[];
  phase2: WorkoutTemplate[];
  custom: WorkoutTemplate[];
  onPick: (t: WorkoutTemplate) => void;
  onNewTemplate: () => void;
  onClose: () => void;
}) {
  const [preview, setPreview] = useState<WorkoutTemplate | null>(null);

  const customGroups = useMemo(() => {
    const groups = new Map<string, WorkoutTemplate[]>();
    custom.forEach((t) => {
      const key = t.source;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(t);
    });
    return groups;
  }, [custom]);

  if (preview) {
    return (
      <TemplatePreview
        template={preview}
        onSelect={() => onPick(preview)}
        onBack={() => setPreview(null)}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Pick a Workout</span>
        <button onClick={onClose} className="text-muted">
          <X size={16} />
        </button>
      </div>

      {Array.from(customGroups.entries()).map(([source, templates]) => (
        <TemplateSection
          key={source}
          title={formatCategoryTitle(source)}
          templates={templates}
          onTap={setPreview}
        />
      ))}
      <TemplateSection title="Phase 1 -- PPLPPL" templates={phase1} onTap={setPreview} />
      <TemplateSection title="Phase 2 -- PPLRULP" templates={phase2} onTap={setPreview} />

      <button
        onClick={onNewTemplate}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-card-border py-3 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-primary"
      >
        <Plus size={14} /> Create New Workout
      </button>
    </div>
  );
}

function TemplatePreview({
  template,
  onSelect,
  onBack,
}: {
  template: WorkoutTemplate;
  onSelect: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted active:bg-muted/10"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              {template.emoji} {template.name}
            </span>
            {template.label && (
              <span className="rounded-md bg-muted/10 px-2 py-0.5 text-[10px] font-medium text-muted">
                {template.label}
              </span>
            )}
          </div>
          <div className="text-xs text-muted">
            {template.exercises.length} exercises
            {template.source !== "custom" && ` · ${template.source === "phase1" ? "Phase 1" : "Phase 2"}`}
          </div>
        </div>
      </div>

      {template.note && (
        <div className="rounded-lg bg-orange/10 px-3 py-2 text-xs text-orange">
          {template.note}
        </div>
      )}

      <div className="space-y-1.5">
        {template.exercises.map((ex, i) => (
          <div
            key={ex.id}
            className="flex items-center justify-between rounded-lg bg-muted/5 px-3 py-2.5"
          >
            <span className="text-sm">{ex.name}</span>
            <span className="text-xs text-muted">
              {ex.sets}x{ex.repsMin}-{ex.repsMax}
              {(ex.rirMin > 0 || ex.rirMax > 0) && ` RIR ${ex.rirMin}-${ex.rirMax}`}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onSelect}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-all active:scale-[0.98]"
      >
        <Check size={16} />
        Select This Workout
      </button>
    </div>
  );
}

function TemplateSection({
  title,
  templates,
  onTap,
}: {
  title: string;
  templates: WorkoutTemplate[];
  onTap: (t: WorkoutTemplate) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
        {title}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onTap(t)}
            className={cn(
              "rounded-lg border-l-4 bg-muted/5 p-3 text-left transition-all active:scale-[0.97]",
              groupBorder[t.muscleGroup]
            )}
          >
            <div className="text-sm font-semibold">
              {t.emoji} {t.name}
            </div>
            {t.label && (
              <div className="mt-0.5 text-[10px] text-muted">{t.label}</div>
            )}
            <div className="mt-1 text-[10px] text-muted">
              {t.exercises.length} exercises
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
