# Invert the progression modal order

## Request
The progression table in the exercise progression modal listed sessions from newest to
oldest. It should read the other way: oldest first, newest last.

## Implementation
`groupBySession` (`progression.utils.ts`) already returns sessions sorted oldest first, with
`ordinal` assigned in that order. `ExerciseProgressionTable` was the only place flipping it,
via `[...sessions].reverse()` in the `<tbody>`.

Change: render `sessions` directly instead of the reversed copy, and update the component
doc comment that justified the newest-first choice.

Affected file:
- `src/pages/workouts/components/exerciseContent/progression/ExerciseProgressionTable.tsx`

No changes to the store, mapper, or the utils — the underlying order was already ascending,
so the ordinals (#1, #2, …) now run top-to-bottom in ascending order too.
