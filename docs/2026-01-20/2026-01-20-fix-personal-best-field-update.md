# Fix Personal Best Tracking Issues

**Date:** 2026-01-20
**Issues:**
1. Manual personal best entries not updating `show_in_personal_best` field in UI
2. Toggling off personal best tracking doesn't update profile page or delete manual PRs
**Status:** ✅ Fixed

---

## Problem 1: Adding Manual Personal Best Doesn't Update UI

When users add a manual personal best through the UI, the `exercises_catalog` table's `show_in_personal_best` field is updated in the database, but the Redux state is not refreshed. This causes the UI to display stale data, making it appear as if the field was never updated.

## Problem 2: Toggling Off Personal Best Tracking

When users toggle off `show_in_personal_best` for an exercise in the exercises catalog:
1. The personal bests display in the profile page is not refreshed, so the exercise still appears in the list
2. Manual personal bests for that exercise should be preserved in the database but filtered out from display

## Root Causes

### Issue 1: Adding Manual Personal Best

In `src/store/personalBests/personalBests.actions.ts`, the `addManualPersonalBest` thunk:

1. ✅ Updates the database correctly (lines 293-301)
2. ✅ Inserts the manual personal best record
3. ❌ Does NOT refresh the exercises catalog Redux state

The exercises catalog state remains stale, so any UI components that depend on `show_in_personal_best` display outdated information.

### Issue 2: Toggling Off Personal Best Tracking

In `src/store/exercisesCatalog/exercisesCatalog.action.ts`, the `togglePersonalBest` thunk:

1. ✅ Updates the `exercises_catalog` table
2. ❌ Does NOT refresh the personal bests Redux state
3. ❌ Manual PRs are not filtered by `show_in_personal_best` when fetching

This causes the UI to show stale data, and manual personal bests appear even when tracking is disabled.

## Affected Code

### Issue 1: `addManualPersonalBest`

**File:** `src/store/personalBests/personalBests.actions.ts`
**Function:** `addManualPersonalBest` (lines 280-350)

Current flow:
```typescript
// Update the exercise to be tracked in personal bests
const { error: updateError } = await supabase
    .from("exercises_catalog")
    .update({ show_in_personal_best: true })
    .eq("id", payload.exerciseId);

if (updateError) {
    throw new Error(updateError.message || "Error updating exercise catalog");
}

// Insert manual PR...
// ❌ Missing: Refresh exercises catalog state
```

### Issue 2: `togglePersonalBest`

**File:** `src/store/exercisesCatalog/exercisesCatalog.action.ts`
**Function:** `togglePersonalBest` (lines 46-86)

Current flow:
```typescript
const { data, error } = await supabase
    .from("exercises_catalog")
    .update({ show_in_personal_best: payload.showInPersonalBest })
    .eq("id", payload.id)
    .select();

// ❌ Missing: Refresh personal bests state
```

Additionally, in `src/store/personalBests/personalBests.actions.ts`, the manual PR queries don't filter by `show_in_personal_best`, so disabled exercises still appear in the display.

## Solutions

### Solution 1: Refresh Exercises Catalog After Adding Manual PR

After successfully adding the manual personal best, dispatch the `fetchExercisesCatalog` action to refresh the Redux state with the updated database values.

**File:** `src/store/personalBests/personalBests.actions.ts`

```typescript
import { exercisesCatalogActions } from "../exercisesCatalog/exercisesCatalog.action";

// In addManualPersonalBest, after successful insert:
// Refresh exercises catalog to update show_in_personal_best field in state
await thunkAPI.dispatch(exercisesCatalogActions.fetchExercisesCatalog());
```

### Solution 2: Filter Manual PRs and Refresh State When Toggling

**Design Decision:** Instead of deleting manual personal bests when toggling off tracking, we preserve them in the database but filter them out when displaying. This way, if the user toggles tracking back on, their manual PR data is not lost.

**Implementation:**

1. **Update togglePersonalBest to refresh state**

**File:** `src/store/exercisesCatalog/exercisesCatalog.action.ts`

```typescript
import { personalBestsActions } from "../personalBests/personalBests.actions";

// In togglePersonalBest, after updating exercises_catalog:
// Refresh personal bests state to reflect the changes
// Manual PRs are kept in the database but filtered out by show_in_personal_best
await thunkAPI.dispatch(personalBestsActions.fetchPersonalBests());
```

2. **Update manual PR queries to filter by show_in_personal_best**

**File:** `src/store/personalBests/personalBests.actions.ts`

```typescript
// In fetchPersonalBests - manual PRs query:
const manualPRsPromise = supabase
    .from("manual_personal_bests")
    .select(`
        id,
        exercise_id,
        weight,
        created_at,
        exercises_catalog!inner (
            id,
            name,
            category,
            show_in_personal_best
        )
    `)
    .eq("exercises_catalog.show_in_personal_best", true);

// In fetchManualPersonalBests - same filter:
.eq("exercises_catalog.show_in_personal_best", true)
```

This approach ensures:
- Manual PRs are preserved in the database
- Only exercises with `show_in_personal_best = true` are displayed
- Toggling tracking back on restores the manual PR without data loss

## Testing Plan

### Issue 1: Adding Manual Personal Best
1. Add a manual personal best for an exercise with `show_in_personal_best = false`
2. Verify that the `show_in_personal_best` field is now `true` in the exercises catalog Redux state
3. Check that the exercise catalog UI shows the trophy badge
4. Test with exercises that already have `show_in_personal_best = true`

### Issue 2: Toggling Off Personal Best Tracking
1. Add a manual personal best for an exercise
2. Verify the exercise appears in the personal bests list on the profile page
3. Go to the exercises catalog and toggle off personal best tracking for that exercise
4. Verify the exercise is immediately removed from the personal bests list
5. Check the database to ensure the manual personal best record is STILL THERE (preserved)
6. Toggle tracking back on and verify the exercise reappears WITH the manual PR intact
7. Test toggling off for exercises with only workout-derived PRs (no manual PRs)

## Implementation Complete

**Changes made:**

### Issue 1: Adding Manual Personal Best
1. Added import for `exercisesCatalogActions` in `personalBests.actions.ts:4`
2. Added dispatch call to refresh exercises catalog after successful manual PR addition in `personalBests.actions.ts:335`

### Issue 2: Toggling Off Personal Best Tracking
1. Added import for `personalBestsActions` in `exercisesCatalog.action.ts:4`
2. Added dispatch call to refresh personal bests state in `exercisesCatalog.action.ts:18`
3. Updated `fetchPersonalBests` manual PRs query to filter by `show_in_personal_best` in `personalBests.actions.ts:162`
4. Updated `fetchManualPersonalBests` query to filter by `show_in_personal_best` in `personalBests.actions.ts:246`

## Success Criteria

### Issue 1
- [x] After adding a manual personal best, the exercises catalog Redux state is updated
- [x] The `show_in_personal_best` field is `true` for the exercise in Redux state
- [x] UI components correctly reflect the updated value

### Issue 2
- [x] When toggling off personal best tracking, manual PRs are preserved in the database
- [x] Personal bests list on profile page is immediately refreshed
- [x] Exercise is removed from personal bests display
- [x] Manual PR queries filter by `show_in_personal_best` field
- [x] Toggling tracking back on restores the manual PR without data loss

### General
- [x] No regression in existing functionality

---

**Implementation Complete** ✅
