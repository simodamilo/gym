# Scope exercise progression to the current workout

## Problem

Inside the collapse of a training exercise, the progression section shows sessions from
old workouts. `fetchProgressionForExercise` (`src/store/sessions/sessions.actions.ts`)
resolves the exercise by catalog id only:

1. `day_exercises` -> all rows with `exercises_catalog_id = exerciseId`, with no workout
   filter, so day exercises belonging to previous workouts are included.
2. `session_sets` -> every set for those day exercise ids.

The user should only see the progression of the workout currently being viewed, for that
specific exercise.

## Approach

Scope the query by workout. `day_sessions` already stores `workout_id`, so the filter can
be applied with an inner join on the existing `session_sets` query instead of an extra
round trip.

### Store (`src/store/sessions`)

- `fetchProgressionForExercise` takes `{ exerciseId, workoutId }` instead of a bare string.
- The `session_sets` select becomes `day_sessions!inner (id, session_number, started_at)`
  with `.eq("day_sessions.workout_id", workoutId)`.
- `progressionByExercise` is keyed by `` `${exerciseId}:${workoutId}` `` so progressions of
  the same exercise in different workouts do not overwrite each other in cache.
- `getProgressionForExercise(state, exerciseId, workoutId)` uses the same composite key.

### Components

- `ExerciseProgression` gains a `workoutId` prop; it only fetches when both ids are present.
- `ExerciseContent` gains a `workoutId` prop and forwards it.
- The three call sites pass the workout id they already hold in Redux:
  - `current/components/CurrentExercisesList.tsx` (`currentSelectors.getCurrentWorkout`)
  - `create/components/CreateExercisesList.component.tsx` (draft workout)
  - `history/components/HistoryExercisesList.tsx` (history workout)

## Trade-offs

- Filtering on `day_sessions.workout_id` rather than restricting the `day_exercises` lookup
  keeps it to a single query and stays correct when a workout is duplicated (new day
  exercise rows, sessions carry their own workout id).
- Progression for the same exercise across *different* workouts is deliberately no longer
  merged; each workout shows its own history, which is what was asked for.

## Implementation notes

- The composite cache key lives in a small dedicated module,
  `src/store/sessions/progression.key.ts`, so reducer and selectors share one definition.
- `FetchProgressionPayload` (`src/store/sessions/types.ts`) replaces the bare `string` thunk
  argument, and the fulfilled payload spreads it back so the reducer has both ids.
- `ExerciseProgression` only dispatches when both `exerciseId` and `workoutId` are present.
- Confirmed with the user: the progression covers **all days of the current workout**, not
  only the day being viewed.
- Verified with `tsc --noEmit` and ESLint on the touched files: both clean.

## Follow-up: the `#N` shown per session

`#N` was `day_sessions.session_number`, allocated per *day* in `startSession`
(`(previous?.session_number ?? 0) + 1`). It therefore means "the Nth training of this day",
not "the Nth time this exercise was performed", and starts above 1 whenever:

- the backfill in `migration-training-sessions.sql` created a synthetic session for the day
  that carried no set for this exercise (no `base_weight`), or
- the exercise was added to a day that had already been trained.

`ProgressionSession` now carries an `ordinal`, assigned after the oldest-first sort, and the
table renders that. `sessionNumber` is kept on the type as the stored day-training number but
is no longer displayed.

Because the ordinal is computed over the sessions actually returned, it stays consistent with
the workout scoping above: the first entry shown is always `#1`.

## Follow-up: implicit session start, and the progression layout

### Saving before pressing "start workout"

Already worked — `saveExercises` opens a session implicitly on the first edit — but the check
for "has today started" read `days.last_workout`, a denormalised cache refreshed by a second
round trip. Two problems followed:

- it was stale exactly when it mattered, right after an implicit start, so two exercises
  autosaving seconds apart could each open a session and split one training in two;
- a failed start returned silently and looked like a successful save.

`useTrainingSession` (`src/pages/workouts/current/hooks/useTrainingSession.ts`) now owns this.
`isStarted` comes from the new `getSessionStartedToday` selector, i.e. from `day_sessions`
rather than from a column phase 2 will drop. An in-flight start is held in a ref so concurrent
callers await the same one; it is kept after resolving (the sessions list only catches up on
the next fetch) and cleared only on failure. A failed start now raises a notification —
`session_start_failed`, added to en/it/es.

Not fixed: a training crossing midnight still splits in two. Identifying a training by calendar
date is the root cause, and closing it needs an explicit completion (`completed_at` is never
written today). Documented in the selector.

### Progression layout

The card list was replaced with an aligned table, so reading *down* a column compares the same
set across trainings. Chosen by the user over a sparkline and a headline-top-set layout; a
computed delta (estimated 1RM or volume) was considered and explicitly rejected — only data
already recorded is shown, nothing derived.

Columns are the union of set numbers across sessions, so a skipped or later-added set still
lines up and a missing one reads as a gap. The unit sits in the header, falling back to
per-cell when an exercise changed reps type mid-history. Backfilled sessions have no reps, so
those cells show the weight alone.

`hasChartableReps` / `hasChartableWeight` remain unused; kept at the user's request.
