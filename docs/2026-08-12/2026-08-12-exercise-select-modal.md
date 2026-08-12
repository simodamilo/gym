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

## Fix: scroll chaining out of the dropdown

Scrolling the options inside the modal moved both the list and the page behind
it. The dropdown is portalled to the body, so once its list reached either end
the gesture chained through to whichever ancestor could still scroll — and this
app scrolls inner `overflow-y-auto` containers, which antd's body-scroll lock
does not cover.

`src/styles/antd/select.scss` (new, imported from `styles/antd/index.scss`)
sets `overscroll-behavior: contain` on the dropdown's scrolling holder, reached
through the `exercise-select-popup` class that `ExerciseSelects` now puts on
both popups. The same property is set on `.ant-modal-content` for gestures that
start in the modal body rather than in the list.

This lives in the antd override stylesheet because it targets antd's internal
DOM (`.rc-virtual-list-holder`), which Tailwind utilities cannot reach.

## Fix 2: replacing the selects inside the modal

Containing the overscroll was not enough — the page behind still moved and the
dropdown itself scrolled poorly on touch. The cause is structural rather than
stylistic: antd portals the dropdown to the body and scrolls it with a
virtualised list.

`ExercisePicker` (new) replaces the two selects inside the modal with category
chips over a plain list of exercises, rendered inline and scrolled natively.
No portal, no virtual list. Tapping the selected exercise again deselects it,
which replaces the old `allowClear`; switching category clears a selection that
belonged to the previous one and resets the list to the top.

## Fix 3: the same for the personal best modal

`AddPersonalBestModal` had the identical problem, so it now uses
`ExercisePicker` too. The picker gained an `isReadOnly` prop, which that modal
sets while a save is in flight — the selects it replaced had one.

That left `ExerciseSelects` with no callers, so it is deleted, and with it
`styles/antd/select.scss`: the `overscroll-behavior` rules from the first fix
existed only for the dropdowns that component portalled, and no antd dropdown
is rendered inside a modal any more.

## i18n

`workouts.exercises.select_exercise` added to `en.json`, `it.json`, `es.json`.
