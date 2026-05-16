# Fix null exercises_catalog crash in draft mapper

## Problem
`getDraftWorkoutDataMapper` crashes with `Cannot read properties of null (reading 'id')`
when a `day_exercise` has a `null` `exercises_catalog` (deleted row or RLS hides it
after a manual DB edit).

## What we implement
Make the draft mapper null-safe: when `exercises_catalog` is missing, set
`exercise` to `undefined` instead of crashing the whole workout load.

## Affected files
- `src/store/draft/draft.mapper.ts`

## Notes
The downstream `Workout`/`DayExercise` type already treats `exercise` as optional
(`dayExercise.exercise!` is used with a non-null assertion in actions). UI may need
to guard against a missing exercise, but the immediate goal is to stop the crash.
