# Training session progression (weight + reps history)

Date: 2026-08-05
Status: **implemented** (migration not yet run against Supabase)

## Problem

The plan and the record are the same object.

`day_exercise_sets` holds `reps` (target, free text), `weight` (current) and `base_weight` (initial).
Every training the user overwrites `weight` in place, so each session destroys the previous one.
The only trace that a session happened is `days.counter` (how many times) and `days.last_workout`
(when, last time) — set in `CurrentExercisesList.handleStartClick`.

Consequences:

- Weight progression is limited to two points: `base_weight` and `weight`.
- **Reps progression does not exist at all.** `day_exercise_sets.reps` is a prescription
  (`"8-10"`, `"Max"`, seconds), never a record of what was performed.
- Personal bests are computed by scanning the *plan* (`personalBests.actions.ts` walks
  `days -> day_exercises -> day_exercise_sets`), so a PR disappears the moment the user
  lowers the weight in the plan.

## Decision

Keep `workout -> day -> day_exercise -> day_exercise_sets` exactly as it is and demote it to what
it already is: **the template / prescription**. Add an append-only log beside it.

Rejected alternative: versioning `day_exercise_sets` itself (soft-delete + `valid_from`). It makes
every existing read path filter on validity, and the plan legitimately changes for reasons unrelated
to training (reordering, renaming, adding a set) which would pollute the history.

### New tables

```
day_sessions
  id              uuid pk
  user_id         uuid   -> auth.users
  workout_id      uuid   -> workouts
  day_id          uuid   -> days
  session_number  int          -- 1st, 2nd, 3rd training of this day
  started_at      timestamptz
  completed_at    timestamptz  -- nullable, set when the user leaves/finishes
  notes           text

session_sets
  id               uuid pk
  session_id       uuid -> day_sessions (cascade)
  day_exercise_id  uuid -> day_exercises (cascade)
  set_number       int
  weight           numeric   -- actual performed
  reps             int       -- actual performed, nullable
  reps_raw         text      -- exactly what the user typed, always kept
  target_reps      text      -- snapshot of the plan's prescription at that moment
  reps_type        text      -- snapshot: reps | time | max | custom
```

### Why these columns

**`day_exercise_id`, not `set_id`.** Sets are added, removed and renumbered over time
(`addSet`/`removeSet` in `ExerciseContent.tsx`). Pointing history at a set row means history breaks
on delete, or silently re-points when the plan is edited. The pair
`(day_exercise_id, set_number)` is the stable identity for a logged set.

**`reps` + `reps_raw`.** Charting reps needs a number, but `reps_type` guarantees we won't always
get one:

| `reps_type` | plan value means | logged value means | chartable |
|---|---|---|---|
| `reps` | target reps, often a range `"8-10"` | reps actually performed | yes |
| `time` | seconds to hold | seconds actually held | yes (as seconds) |
| `max` | literally `"Max"` | reps achieved — the whole point | yes |
| `custom` | free text | free text | no, table only |

So: parse into `reps` when possible, always persist `reps_raw`, and chart only rows where
`reps` is non-null.

**`reps_type` and `target_reps` are snapshotted per session.** An exercise can be switched from
`reps` to `time` later; without the snapshot every historical row silently changes meaning.

### Pre-fill rule (as requested)

On starting a session, `session_sets` rows are seeded from:

- `weight` <- `day_exercise_sets.weight` (already "last performed", see write-back below)
- `reps`  <- **the previous session's actual reps** for the same
  `(day_exercise_id, set_number)`, *not* the plan's target

Rationale: the user wants last session's `8` pre-filled, not the plan's `"8-10"`. On the first ever
session there is no prior, so reps starts empty with `target_reps` shown as placeholder.

### Write-back

On save, the session row is authoritative, **and** `day_exercise_sets.weight` is updated to the
performed weight. This is a deliberate denormalised "last performed" cache: it keeps every existing
read path (current workout, history, exercise card) working unchanged and makes the log purely
additive. `day_exercise_sets.reps` is *not* written back — it stays the target.

### Fields that become derived

| Field | Becomes |
|---|---|
| `day_exercise_sets.base_weight` | first session's weight |
| `days.counter` | `count(*)` over `day_sessions` |
| `days.last_workout` | `max(started_at)` over `day_sessions` |

None are dropped in this change. They keep being written so a rollback is possible; a follow-up
migration removes them once the new code is proven live (same two-phase pattern as
`migration-global-exercise-catalog.sql`).

The "save as base weight" flow (`currentActions.saveBaseWeight`, the confirm modal in
`CurrentExercisesList.tsx:40`) becomes meaningless and is removed from the UI.

## Backfill, and what is lost

`migration-training-sessions.sql` synthesises at most **two** sessions per exercise from existing
data: session 1 from `base_weight`, session N from `weight` (skipped when they are equal or null).
Everything between them is unrecoverable, and **no reps history can be reconstructed** because reps
was never recorded. Reps progression starts from zero on migration day for every user. This is
stated up front because it is not fixable later.

## Implementation plan

### 1. Database — `docs/2026-08-05/migration-training-sessions.sql`

Two tables above, RLS policies per command (`auth.uid() = user_id`, session_sets via the parent
session), indexes on `(day_id, session_number)` and `(day_exercise_id)`, and the backfill.

### 2. New store slice — `src/store/sessions/`

Following the existing slice pattern exactly:

- `types.ts` — `DaySession`, `SessionSet`, payload types, response types
- `sessions.mapper.ts` — snake_case -> camelCase, plus the `reps_raw` -> `reps` parse
- `sessions.actions.ts` — `startSession`, `updateSessionSet`, `completeSession`,
  `fetchSessionsForDay`, `fetchProgressionForExercise`
- `sessions.reducer.ts`, `sessions.selectors.ts`
- registered in `reducer.config.ts`, cleared by `RESET_STORE`

Reps parsing lives in `src/utils/reps.ts` (`parseReps(raw, repsType): number | null`) so the mapper
and the chart share one implementation.

### 3. Session lifecycle — `src/pages/workouts/current/components/CurrentExercisesList.tsx`

`handleStartClick` currently only stamps the day. It becomes: create a `day_sessions` row + seed
`session_sets`, *and* keep the existing `days` update for the derived-field compatibility window.
The implicit start inside `saveExercises` (line 84) is preserved.

### 4. The invasive bit — `src/pages/workouts/components/exerciseContent/ExerciseContent.tsx`

`updateSet` (line 112) writes the plan today. It must branch on mode:

- `isDraft` -> unchanged, writes `day_exercise_sets` (the plan)
- `isCurrent` -> writes `session_sets` for the active session; weight additionally writes back to
  `day_exercise_sets.weight`
- `isHistory` -> read-only, unchanged

The component is already polymorphic on these props, so this is the natural seam — but it is the
single most delicate edit in the change. The reps `Input` (line 260) stops being read-only for
`repsType === "max"` in current mode: logging the reps achieved is exactly what `max` is for.

### 5. Progression UI

New `ExerciseProgression` component under
`src/pages/workouts/components/exerciseContent/`, opened from the exercise card:

- a table of sessions (date, per-set weight x reps) — always available, the only view for `custom`
- a Recharts line chart of weight and reps over sessions — only when `reps` is non-null

Per the dataviz guidance, the chart is added only where it is actually readable; `custom` and
mixed-type exercises fall back to the table.

### 6. Personal bests — `src/store/personalBests/personalBests.actions.ts`

Recomputed as `max(weight)` over `session_sets` instead of walking the plan. This removes the
`any[]` nested-scan (`PersonalBestsWorkoutResponse`) and fixes the bug where lowering a plan weight
erases a PR. Manual PRs are untouched.

### 7. i18n

New keys in `en.json` / `it.json` / `es.json` for the progression view. Run the `translations`
skill at the end.

## Rollout order

1. Run the migration (safe against currently deployed code — additive only).
2. Ship the app change.
3. Later, a phase-2 migration drops `base_weight` / `days.counter` / `days.last_workout`.

## Decisions taken (approved 2026-08-05)

1. **Session granularity** — one `day_sessions` row per day started, i.e. an entire training.
2. **Same day twice** — `isAlreadyStarted` keeps no-opping a second start on the same calendar day.
3. **Editing past sessions** — read-only. Correcting a mistyped weight is a follow-up.

## What changed during implementation

- **`Set.targetReps` added** (`src/store/draft/types.ts`). In current mode `set.reps` is overlaid
  with the *performed* value from the active session so the bound input never changes shape, and
  `targetReps` carries the plan's prescription into the placeholder. Without this the component
  would have needed two parallel set shapes.
- **Stale-selector fix in `saveExercises`.** A save that implicitly opens a session cannot read the
  new id from the selector — the fetch has not landed yet — so `handleStartClick` returns the id
  from the thunk and the save uses that.
- **`max` reps are now editable in current mode.** Previously `readOnly`; logging the reps achieved
  is precisely what that reps type is for.
- **`currentActions.saveBaseWeight` deleted** along with its confirm modal and the
  `confirm_save_base` / `initial` translation keys. The "Initial" tooltip in the exercise card is
  replaced by the **Progression** button that opens the new view. `base_weight` is still written by
  `draftActions` and still read on the type, so phase 2 can drop it cleanly.
- **Progression lives under**
  `src/pages/workouts/components/exerciseContent/progression/`: `ExerciseProgression` (container +
  fetch), `ExerciseProgressionTable`, `progression.utils.ts`.
- **The chart was built, then removed on request.** It plotted the heaviest set per session with
  weight and reps on separate axes. `ExerciseProgressionChart.tsx` is deleted; `groupBySession`
  still computes `topWeight` / `topReps` and `progression.utils.ts` still exports
  `hasChartableWeight` / `hasChartableReps`, which are currently unused but are exactly what a
  reinstated chart needs. Delete them if the chart is not coming back.
- **`parseReps` rejects ranges** (`"8-10"`). A range is a prescription; if it survives into a log it
  means nothing was actually recorded, so there is nothing to chart. `reps_raw` still keeps it.
- **`PersonalBestsWorkoutResponse` removed.** The nested `any[]` plan scan is gone; PRs are now a
  flat `max(weight)` over `session_sets`.

### Set row redesigned (second review)

`addonAfter` was still ambiguous — antd renders addons as bordered, field-height blocks sharing the
input's bounding box, so the target read as "another number glued to the field" rather than as
reference information. The row is now a four-column grid:

```
 SET  TARGET   REPS              KG
 (1)   8-10   [ 9          ]   [ 80      kg ]
```

The organising rule: **the boxed treatment is reserved for editable values**. Set number and target
are flat text with no border; performed reps and weight are boxed with border, elevated fill and
shadow. History mode drops the boxes via a class ternary, so the same DOM degrades to four columns
of flat text with identical alignment.

Static labels are hoisted into a header rendered **once per exercise** (`SetRowHeader`), not per
set — ~18px once instead of ~32px on every row, which is what buys the target its own column
without growing a 5-set exercise. Shared grid template and input classes live in
`setRow.styles.ts` so the header and rows cannot drift apart.

Details worth keeping:
- Inputs are `h-11` (44px, WCAG 2.5.5) at 16px text — below 16px iOS Safari zooms on focus.
- `tabular-nums` everywhere numeric, so digits don't shift width while typing.
- The target uses `--text-secondary`, never `--text-tertiary`: tertiary computes to ~2.8:1 on
  `--bg-elevated` in light mode and fails AA.
- The set badge uses `--bg-tertiary`, not the spec's `--bg-secondary`, because in dark mode
  `--bg-secondary` and `--bg-elevated` are both `#262626` and the badge would vanish.
- Weight unit moved from `addonBefore` to `suffix`, so the eye lands on the number before the unit.
- The set number badge is `aria-hidden` (duplicated in each input's `aria-label`), and the target is
  linked with `aria-describedby` so it is announced as a description after the value, not as the
  label.

### Wrong-session write (final check)

`getActiveSession` returns the newest session with no `completed_at`, and **nothing ever dispatches
`completeSession`**, so every session stays open indefinitely. `saveExercises` took the session id
straight from that selector, so on a new training day the first edit made *before* pressing Start
was written into the previous session — silently corrupting a past entry rather than opening a new
one.

Whether today has started now comes from `isAlreadyStarted()` (the day's `last_workout`), which is
the same signal the Start button uses. When today has started the id comes from the selector; when
it has not, a session is opened and its id comes back from the thunk.

Left as-is, deliberately: `completeSession` is wired through the actions/reducer but never
dispatched, so sessions have no end. Nothing depends on it now that session choice is driven by
`last_workout`, but it is the natural hook if an explicit "finish workout" action is ever added.
`hasChartableWeight` / `hasChartableReps` are likewise unused, kept for a reinstated chart.

### `custom` reps type withdrawn (fourth review)

`custom` is removed from `RepsTypes`, so it can no longer be selected for a new or edited exercise.

It is **not** deleted from the codebase. Exercises created while it existed still have
`reps_type = 'custom'` and their content lives in `custom_type`, which no other view renders — if
the branch were removed those exercises would display as blank. The textarea is therefore kept but
made read-only: legacy content stays readable, nothing new can be written to it.

The `custom` arm in `parseReps` and the `RepsType` union also stay, for the same reason.

Full removal (dropping the branch, the `customType` field, and the `custom_type` column) is safe
only once `SELECT count(*) FROM day_exercises WHERE reps_type = 'custom'` returns 0.

### `time` and `max` have no separate weight (third review)

The four-column grid assumed every exercise has reps *and* a weight. It doesn't: only `repsType`
= `reps` does. For `time` the performed value is seconds and for `max` it is the reps achieved,
and **both have always been stored in the weight column**, with `getAddon()` relabelling the unit.
The redesign therefore rendered an empty duplicate input and the header "SECS" twice for timed
exercises.

`hasSeparateWeight(repsType)` now gates this: `reps` keeps four columns, `time` and `max` collapse
to three (set / target / value), with the value column carrying its own unit label and taking over
the `aria-describedby` link to the target. `getSetGrid(repsType)` returns the matching template so
the header and rows stay aligned.

Same assumption was wrong in the progression table, which hardcoded "Kg" — it now uses
`getValueUnitKey(repsType)` (`reps` → kg, `time` → secs, `max` → reps). The old `getRepsUnitKey`
helper was unused and is replaced by it.

Not addressed: a weighted plank or a weighted max-reps set has nowhere to record its load. That
limitation predates this work.

### Target reps stay visible (fixed after first review)

The target was first rendered as the reps input's `placeholder`. That only works on the very first
session: from the second onward the field is pre-filled with the previous session's reps, so the
placeholder never renders and the user permanently loses sight of what they planned.

It now sits in `addonAfter`, always visible next to the number performed, and the reps/weight
columns are 50/50 instead of 40/60 to fit a range like `8-10`. The data was never at risk — the
plan's target is written back untouched and snapshotted into `session_sets.target_reps` — this was
purely a display defect.

Related hardening: the write-back now skips any set whose `targetReps` is undefined instead of
upserting it, so the prescription can never be blanked by a save.

### Schema correction (found while running the migration)

The "all ids are uuid" assumption was wrong. `workouts.id`, `days.id`, `days.workout_id`,
`day_exercises.id`, `day_exercises.day_id`, `day_exercise_sets.id` and
`day_exercise_sets.day_exercise_id` are all **TEXT** — the client generates them with `uuidv4()`
and they are stored as text. `day_sessions.id`, `.workout_id`, `.day_id` and `session_sets.id`,
`.session_id`, `.day_exercise_id` are TEXT accordingly, defaulting to `uuid_generate_v4()::text`.
`user_id` stays UUID, since `auth.users.id` is UUID.

The backfill's date expressions also cast through `::text` and branch on whether the value is all
digits, because `days.created_at` may be a timestamp while `days.last_workout` is an epoch in
milliseconds, and the storage type of each was not established.

### Verification

`tsc --noEmit` clean, `npm run build` succeeds, `npm run lint` unchanged from baseline
(22 pre-existing errors, none in the new files).
