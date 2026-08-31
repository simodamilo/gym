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
