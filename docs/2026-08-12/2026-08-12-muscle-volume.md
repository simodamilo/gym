# Muscle volume per workout and per day

## Goal

Show how much volume each muscle receives, at two levels:

- **Workout level** — summed across all days of the workout.
- **Day level** — for a single day.

Surfaced as an icon in the page header; clicking it opens a panel listing every
muscle with its volume.

Available in the draft builder, the current workout, and history.

## Metric

**Total sets per muscle.** A muscle's volume is the number of sets belonging to
exercises in that category.

Why sets rather than tonnage (sets x reps x kg): in a draft the weight is
usually not set yet and reps are frequently prescribed as a range (`"8-10"`),
which `parseReps` (`src/utils/reps.ts:20`) deliberately refuses to reduce to a
number. Tonnage would be blank or misleading exactly where this feature is most
useful. Set count is always computable and is the standard unit for judging
whether a program is balanced.

## "Muscle" = exercise category

There is no muscle field in the schema. `ExerciseCatalog.category` is the only
grouping available: `chest`, `back`, `biceps`, `triceps`, `shoulders`, `legs`,
`abs`, `extra` (`src/utils/constants.ts`). One category per exercise, and no
secondary-muscle attribution — an exercise contributes all of its sets to its
single category. This is a known simplification: a bench press contributes
nothing to triceps here.

Categories with zero sets are omitted from the list.

`extra`, `abs` and `legs` are excluded outright: their sets count towards
neither their own row nor the total. A day made up only of those exercises
shows the empty state.

## Implementation

### 1. Calculation — `src/utils/volume.ts` (new)

Pure functions, no Redux coupling, unit-testable:

```ts
export interface MuscleVolume { category: string; sets: number; }

// Sets per category for one day's exercises, sorted by sets desc then label.
export const getMuscleVolume = (dayExercises: DayExercise[]): MuscleVolume[]

// Same shape, aggregated across days — used for the workout-level view.
export const getWorkoutMuscleVolume = (days: Day[]): MuscleVolume[]
```

Exercises with no `exercise` or no `category` are skipped. `sets.length` is the
count; `repsType: "custom"` exercises still count their sets.

### 2. UI — `src/components/muscleVolume/` (new)

- `MuscleVolumeButton.tsx` — the `IconButton` (Ant Design `PieChartOutlined`)
  that opens the panel. Props: `days` (workout level) or `dayExercises` (day
  level), plus a `title`.
- `MuscleVolumeList.tsx` — the rows themselves: muscle label (translated),
  set count, and a proportional bar so the balance is readable at a glance.
  Total sets shown as a footer row.

Rendered inside the existing `CustomModal` so it matches every other overlay in
the app. Empty case reuses `EmptyState`.

Tailwind only, existing `var(--*)` theme tokens, consistent with `ItemCard`.

### 3. Placement

Workout level — header icon row, next to the existing icons:
- `src/pages/workouts/create/CreateWorkout.component.tsx`
- `src/pages/workouts/current/Current.tsx`
- `src/pages/workouts/history/components/HistoryWorkout.component.tsx`

Day level — header of each day's exercise list:
- `src/pages/workouts/create/components/CreateExercisesList.component.tsx`
- `src/pages/workouts/current/components/CurrentExercisesList.tsx`
- `src/pages/workouts/history/components/HistoryExercisesList.tsx`

All six read from data already in the store; no new queries, no schema change,
no new Redux slice.

### 4. i18n

New `workouts.volume.*` keys (title, per-muscle labels, `sets` unit, total,
empty state) added to `en.json`, `it.json`, `es.json`. Muscle labels are
translated from the category value rather than reusing the hardcoded English
`label` in `constants.ts`.

## Changes made during implementation

`CustomModal` had no read-only variant — it always rendered a Cancel/OK pair,
which is wrong for an informational panel. Two additions:

- a `hideCancel` prop, so only the dismiss button is shown;
- an `info` modal type (chart icon, brand-coloured button, "Close" label),
  alongside the existing `delete` / `edit` / `publish` / `confirm`.

Both are additive; every existing call site is unaffected.

Placement detail: `Current.tsx` had no header row at all, so a right-aligned
row was added above the day cards to hold the icon. The other five pages had an
existing header the icon slots into.

## Trade-offs

- **No secondary muscles.** Requires a schema change to do properly; out of
  scope. If wanted later, the calculation is isolated in one file.
- **Sets are counted as prescribed, not as performed.** In history this means a
  skipped set still counts, since there is no per-set completion flag.
- **`extra`, `abs` and `legs` are excluded** from the breakdown and from the
  total, so the total is a partial one by design.
