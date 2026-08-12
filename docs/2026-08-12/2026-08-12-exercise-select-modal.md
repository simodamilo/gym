# Exercise selection behind a modal

## Goal

In the draft builder, an exercise card showed the category and exercise selects
inline, which took up most of the card before any sets were visible. Replace
them with a single button that opens a modal containing the same two selects.

## Implementation

New `src/components/exerciseSelects/ExerciseSelectsModal.tsx`:

- A full-width button showing the currently selected exercise name, or a
  "Select exercise" placeholder in muted text when nothing is chosen yet.
- Clicking it opens a `CustomModal` (`type="edit"`, Save/Cancel) wrapping the
  existing `ExerciseSelects`.

`ExerciseSelects` itself is unchanged and still used inline by
`AddPersonalBestModal`, where it already sits inside a modal.

`ExerciseContent` (draft mode only) now renders `ExerciseSelectsModal` in place
of `ExerciseSelects`; the `onChange` contract is identical, so nothing else in
that component changed.

### Staged selection

The choice is held in local state while the modal is open and only reported via
`onChange` on confirm. Cancelling restores the previous value.

This matters because the selects clear the exercise when the category changes:
without staging, opening the modal, changing category and cancelling would have
wiped an already-configured exercise from the card.

## i18n

`workouts.exercises.select_exercise` added to `en.json`, `it.json`, `es.json`.
