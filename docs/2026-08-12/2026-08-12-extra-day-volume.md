# Extra days counted separately in the volume totals

## Goal

A workout can include an extra day that is not always trained. Its sets should
not disappear from the breakdown, but they should not be mixed into the regular
volume either. Every row and the total therefore show the regular figure with
the extra contribution in parentheses:

```
Chest      12 (+3)
Back       14
Shoulders   6 (+2)
———————————————
Total      32 (+5)
```

Any number of days can be flagged as extra; their sets are summed into the
parenthesised figure.

## Database

`is_last` marks the last trained day, so it cannot be reused. A new column is
needed on `days`. There is no migrations folder in the repo, so this has to be
run once in the Supabase SQL editor:

```sql
alter table days
    add column is_extra boolean not null default false;
```

Everything else follows automatically: publishing a draft only flips the
workout's `status`, so the same day rows carry `is_extra` into the current
workout and then into history.

## Implementation

### 1. Plumbing the flag

- `src/store/draft/types.ts` — `isExtra?: boolean` on `Day`, `is_extra?: boolean`
  on `UpsertDayPayload` and `DayResponse`.
- `src/store/draft/draft.mapper.ts` — map `is_extra` to `isExtra`. This mapper
  is shared by the draft, current and history reducers, so one change covers
  all three.
- `draft.actions.ts`, `current.actions.ts`, `history.actions.ts` — add
  `is_extra` to the three `select` lists.
- `CreateWorkout.component.tsx` — both existing `upsertDay` calls (reorder and
  edit) send whole rows, so both must include `is_extra` or a reorder would
  silently reset the flag.

### 2. Marking a day

In the draft builder's `ItemCard`, a toggle next to the existing edit/delete
buttons flags the day. A flagged day carries an `EXTRA` badge, styled like the
existing `LAST` badge so the state is visible without opening anything.

The toggle is draft-only: the composition of a published workout is not edited.

### 3. Calculation

`src/utils/volume.ts` — `MuscleVolume` gains `extraSets`:

```ts
export interface MuscleVolume { category: string; sets: number; extraSets: number; }
```

`getWorkoutMuscleVolume` routes each day's sets into `sets` or `extraSets`
based on `day.isExtra`. A muscle trained only on an extra day appears with
`sets: 0` and its extra count, rather than being dropped.

`getMuscleVolume` (day level) is unchanged in meaning: a single day is either
extra or not, so its own breakdown stays a plain count and nothing is shown in
parentheses.

`getTotalSets` returns both figures.

### 4. Display

`MuscleVolumeList` appends ` (+n)` to a row when `extraSets > 0`, in the muted
secondary colour, and does the same on the total row. The proportional bar
shows the regular volume as the filled part with the extra stacked on it in a
lighter shade, so the parenthesised figure is also visible in the bar.

### 5. i18n

`components.muscle_volume.extra_hint` (a short line explaining the parentheses)
and `components.item_card.extra_badge`, in `en.json`, `it.json`, `es.json`.

## Notes from implementation

The SQL was run before implementing, so the column exists.

The toggle ended up as a star icon button in the card's action row (filled and
brand-coloured when set, outlined when not), with an `EXTRA` badge next to the
day's exercise count. `handleDayUpdate` gained a `TOGGLE_EXTRA` type; unlike
`DELETE` and `UPDATE` it does not open a modal, it upserts straight away.

`toggleExtraDay` resends `name`, `order`, `counter` and `is_last` alongside the
flipped `is_extra`, because the upsert writes the whole row.

Bars are scaled to the fullest muscle including its extra sets, so no bar
overflows its track; the extra portion is stacked at 40% opacity of the same
brand colour.

## Trade-offs

- **The exclusion of `extra`, `abs` and `legs` categories stays as is.** It is
  unrelated to extra *days* despite the shared word.
- **Sorting** stays driven by the regular set count, so a muscle trained only on
  an extra day sorts last. Its bar still shows the extra volume.
- **Until the SQL is run**, `is_extra` does not exist and the queries selecting
  it would fail, so the column must be added before this ships.
