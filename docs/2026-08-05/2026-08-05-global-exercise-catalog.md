# Global Exercise Catalog

**Date:** 2026-08-05
**Status:** Implemented (app code). Migrations written, not yet run.

## Deploy order

1. Run `migration-global-exercise-catalog.sql` (safe before the code ships — the old column
   is left in place).
2. Deploy the app.
3. Verify personal bests, then run `migration-drop-show-in-personal-best.sql`.

## Goal

Turn `exercises_catalog` from a per-user table into a **shared global catalog**, while still
letting each user add their own private exercises.

## Current behaviour

- `exercises_catalog` is scoped per user by RLS in Supabase. The client never filters by
  `user_id` — every query in `exercisesCatalog.action.ts` is unscoped and relies entirely on
  the DB policies.
- `show_in_personal_best` is a **boolean column on the exercise row**. It is a per-user
  preference (which exercises appear in the PR list) that only works today because each row
  has exactly one owner.
- `manual_personal_bests` is a separate table with its own `user_id` + RLS. **Unaffected by
  this change.**

## Decisions taken

1. **Write access:** global base catalog is read-only; users can add their own private
   exercises on top. (`user_id` stays as a nullable column: `NULL` = global, set = personal.)
2. **PR toggle:** moves to a new per-user table. It is *not* merged into
   `manual_personal_bests` — that table means "user typed in a PR weight" (`weight` is
   `NOT NULL`), whereas the flag must also cover exercises with no PR at all. `fetchPersonalBests`
   reads three independent sources (workout-derived PRs, manual PRs, and *tracked exercises with
   no PR yet* at `personalBests.actions.ts:166`), all filtered by this flag. Overloading the
   manual table would require a nullable `weight` and would break the `isManual` inference at
   line 201.
3. **UI:** one list as today, with a "Custom" badge on personal exercises.

## Database migration

Schema confirmed 2026-08-05:

| column | type | nullable |
|---|---|---|
| id | text | NO |
| name | text | NO |
| created_at | numeric | YES |
| category | text | NO |
| description | text | YES |
| user_id | uuid | **YES** |
| show_in_personal_best | boolean | YES |

Existing policy: a single `"Only you own data"` for `ALL` with `qual = (user_id = auth.uid())`.

`docs/2026-08-05/migration-global-exercise-catalog.sql`:

1. **No `ALTER COLUMN` needed** — `user_id` is already nullable. `NULL` = global exercise,
   non-null = that user's private exercise.
2. Replace the single `ALL` policy with four per-command policies. This is mandatory, not
   cosmetic: under `ALL` with `user_id = auth.uid()`, a global row evaluates
   `NULL = auth.uid()` → NULL → not true, so **global rows would be invisible to everyone**.
   - `DROP POLICY "Only you own data"`
   - SELECT: `USING (user_id IS NULL OR user_id = auth.uid())`
   - INSERT: `WITH CHECK (user_id = auth.uid())` — cannot create global rows from the app
   - UPDATE / DELETE: `USING (user_id = auth.uid())` — global rows immutable from the app
3. New table `user_exercise_prefs`:
   - `user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
   - `exercise_id TEXT NOT NULL REFERENCES exercises_catalog(id) ON DELETE CASCADE`
   - `show_in_personal_best BOOLEAN NOT NULL DEFAULT false`
   - `UNIQUE(user_id, exercise_id)`, RLS scoped to `auth.uid() = user_id`
4. Backfill `user_exercise_prefs` from existing `exercises_catalog.show_in_personal_best`
   values so no user loses their current PR list.
5. Promote the seed exercises to global (`UPDATE exercises_catalog SET user_id = NULL WHERE ...`)
   — **selection criteria to be agreed with the user**, since dedup across users may be needed.
6. Drop `exercises_catalog.show_in_personal_best` **only after** the app change ships.

## Application changes

### `src/store/exercisesCatalog/`
- `types.ts`: `ExerciseCatalog` gains `user_id?: string | null`; `show_in_personal_best`
  is now derived from the prefs table rather than the row. Add an `isCustom` helper.
- `exercisesCatalog.action.ts`:
  - `fetchExercisesCatalog` — also fetch `user_exercise_prefs` and merge the flag in.
  - `addExercise` — set `user_id` from the session so new rows are private.
  - `updateExercise` / `deleteExercise` — guard against global rows (the RLS will reject
    them anyway; fail fast with a clear message instead of a silent no-op).
  - `togglePersonalBest` — upsert into `user_exercise_prefs` instead of updating the catalog row.
- `exercisesCatalog.mapper.ts` — merge prefs into the catalog rows.

### `src/store/personalBests/personalBests.actions.ts`
The ~8 `.eq("exercises_catalog.show_in_personal_best", true)` filters (lines 99, 144, 163,
169, 290, and the embedded selects) must become joins/filters against `user_exercise_prefs`.
This is the largest and riskiest part of the change. Approach: fetch the user's enabled
exercise ids once, then filter with `.in("exercise_id", enabledIds)`.

### `src/pages/exercises/Exercises.tsx` (333 lines)
- "Custom" badge on rows where `user_id` is set.
- Hide edit/delete actions on global exercises (lines ~126, 295, 322).
- Keep the trophy toggle on **all** exercises — it now writes per-user prefs.
- The file is already near the size limit in CLAUDE.md; extract the row/actions into a
  subcomponent while touching it.

## Risks / trade-offs

- **Step 6 is destructive.** Dropping the column must happen only after the new code is
  deployed, otherwise in-flight clients lose their PR filter. Two-phase deploy.
- The personalBests query rewrite is the main source of regression risk — it touches every
  PR surface.
- Duplicate exercises are likely: if several users each created "Bench Press", promoting to
  global needs a dedup + repoint of `day_exercises.exercises_catalog_id`. **Needs a decision.**

## Open questions — resolved

1. ~~Which exercises become global, and is dedup needed?~~ **Single user today**, so all
   existing rows are promoted to global and no dedup / `day_exercises` repointing is required.
2. ~~Is this a single-user app?~~ Yes, confirmed 2026-08-05.
