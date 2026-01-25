# Apply Superset Visual Grouping to Current and History Flows

**Date:** 2026-01-25
**Task:** Apply the same superset grouping fix from CreateExercisesList to CurrentExercisesList and HistoryExercisesList

## Context

Yesterday (2026-01-24), we fixed the superset visual grouping in the create flow. When exercises are marked as "superset with next exercise", they now appear in a single accordion item showing both exercises together, rather than separate accordion items.

Reference: `docs\2026-01-24\2026-01-24-fix-superset-grouping.md`

## Current State

The fix was only applied to:
- ✅ **CreateExercisesList** (`src/pages/workouts/create/components/CreateExercisesList.component.tsx`)

The fix is still needed in:
- ❌ **CurrentExercisesList** (`src/pages/workouts/current/components/CurrentExercisesList.tsx`)
- ❌ **HistoryExercisesList** (`src/pages/workouts/history/components/HistoryExercisesList.tsx`)

## Problem

Both CurrentExercisesList and HistoryExercisesList have the same issue that was fixed in CreateExercisesList:

### Current Behavior (lines 163-174 in CurrentExercisesList, lines 86-97 in HistoryExercisesList)
```typescript
{groupLinkedItems(mutableDayExercises).map((group) => {
    const renderedItems = group.map((exercise) => renderItem(exercise));
    const groupKey = group.map((g) => g.id).join("-");

    return (
        <SortableItem key={groupKey} id={group[0].id.toString()}>
            <div className="history-exercises-collapse">
                <Collapse accordion items={renderedItems} ... />
            </div>
        </SortableItem>
    );
})}
```

This creates multiple accordion items within a single Collapse (one per exercise), even though they're grouped.

### Expected Behavior

For supersets (groups with 2+ exercises):
- Single accordion item showing "Exercise 1 + Exercise 2"
- "Superset" subtitle
- All exercises rendered vertically with dividers between them

For single exercises:
- Normal rendering as before

## Solution Approach

Apply the exact same fix that was implemented in CreateExercisesList:

### 1. Add `renderSuperset` Function

Add a new function to render superset groups (after the `renderItem` function):

```typescript
const renderSuperset = (group: DayExercise[]) => {
    const groupKey = group.map(g => g.id).join('-');
    return {
        key: groupKey,
        label: (
            <div className="flex items-center justify-between w-full gap-4">
                <div className="flex-1 flex flex-col gap-1">
                    <span className="text-base font-semibold text-[var(--text-primary)]">
                        {group.map(ex => ex.exercise?.name || t('workouts.exercises.new_exercise_title')).join(' + ')}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">Superset</span>
                </div>
            </div>
        ),
        children: (
            <div className="flex flex-col gap-6">
                {group.map((exercise, index) => (
                    <div key={exercise.id}>
                        {index > 0 && <div className="border-t border-[var(--border-color)] my-4" />}
                        <ExerciseContent
                            dayId={dayId!}
                            exerciseId={exercise.id}
                            dayExercise={exercise}
                            saveExercises={saveExercises}
                            deleteExercise={deleteExercise}
                            {/* isCurrent or isHistory prop based on component */}
                        />
                    </div>
                ))}
            </div>
        ),
    };
};
```

### 2. Update Rendering Logic

Replace the current mapping logic with conditional rendering:

```typescript
{groupLinkedItems(mutableDayExercises).map((group) => {
    const item = group.length > 1 ? renderSuperset(group) : renderItem(group[0]);
    const groupKey = group.map((g) => g.id).join("-");

    return (
        <SortableItem key={groupKey} id={group[0].id.toString()}>
            <div className="history-exercises-collapse">
                <Collapse
                    accordion
                    items={[item]}
                    activeKey={activeKey}
                    onChange={(key) => setActiveKey(Array.isArray(key) ? key[0] : key)}
                    bordered={false}
                />
            </div>
        </SortableItem>
    );
})}
```

## Files to Modify

1. **CurrentExercisesList.tsx** (`src/pages/workouts/current/components/CurrentExercisesList.tsx`)
   - Add `renderSuperset` function after `renderItem` (after line 128)
   - Update rendering logic (lines 163-174)
   - Props to pass to ExerciseContent: `isCurrent`, `saveExercises`, `deleteExercise`

2. **HistoryExercisesList.tsx** (`src/pages/workouts/history/components/HistoryExercisesList.tsx`)
   - Add `renderSuperset` function after `renderItem` (after line 65)
   - Update rendering logic (lines 86-97)
   - Props to pass to ExerciseContent: `isHistory` (no save/delete functions needed)

## Differences Between Components

### CurrentExercisesList
- Has `saveExercises` and `deleteExercise` functions
- Passes `isCurrent` prop to ExerciseContent
- Uses `mutableDayExercises` state

### HistoryExercisesList
- No save/delete functions (read-only)
- Passes `isHistory` prop to ExerciseContent
- Uses `day?.dayExercises` from selector

### CreateExercisesList (reference)
- Has drag & drop functionality
- Has `isDragEnable` state
- Shows drag handle icon in superset label when drag is enabled
- Passes `isDraft` prop to ExerciseContent

## Implementation Notes

- Use Tailwind for dividers: `<div className="border-t border-[var(--border-color)] my-4" />`
- Join exercise names with " + " for superset label
- Use the same translation key for exercise names: `t('workouts.exercises.new_exercise_title')`
- Maintain the same key structure using combined group IDs
- No drag handle icons needed in current/history (only in create flow)

## Implementation Summary

### Changes Made

**File 1: `src/pages/workouts/current/components/CurrentExercisesList.tsx`**

1. **Added `renderSuperset` function** (after line 128):
   - Creates a single accordion item for exercise groups (supersets)
   - Label shows all exercise names joined with " + "
   - Displays "Superset" subtitle below exercise names
   - Renders all ExerciseContent components vertically with dividers between them
   - Passes `isCurrent`, `saveExercises`, and `deleteExercise` props to each ExerciseContent
   - Uses combined group key (all exercise IDs joined with "-")

2. **Updated rendering logic** (lines 161-174):
   - Changed from mapping all exercises to separate items to using conditional rendering
   - Groups with 1 exercise: use `renderItem(group[0])`
   - Groups with 2+ exercises: use `renderSuperset(group)`
   - Each Collapse now receives a single item array `[item]` instead of multiple items

**File 2: `src/pages/workouts/history/components/HistoryExercisesList.tsx`**

1. **Added `renderSuperset` function** (after line 65):
   - Creates a single accordion item for exercise groups (supersets)
   - Label shows all exercise names joined with " + "
   - Displays "Superset" subtitle below exercise names
   - Renders all ExerciseContent components vertically with dividers between them
   - Passes `isHistory` prop only (no save/delete functions for read-only view)
   - Uses combined group key (all exercise IDs joined with "-")
   - Uses `t('components.item_card.exercise_singular')` for missing exercise names (consistent with existing pattern)

2. **Updated rendering logic** (lines 84-97):
   - Changed from mapping all exercises to separate items to using conditional rendering
   - Groups with 1 exercise: use `renderItem(group[0])`
   - Groups with 2+ exercises: use `renderSuperset(group)`
   - Each Collapse now receives a single item array `[item]` instead of multiple items

### Key Implementation Details

- **Dividers**: Used Tailwind classes `border-t border-[var(--border-color)] my-4` for consistency
- **Group key**: Combined all exercise IDs with "-" to create unique keys for superset items
- **Active key management**: Unchanged - works with both single exercise keys and grouped keys
- **Translation keys**:
  - CurrentExercisesList uses `t('workouts.exercises.new_exercise_title')`
  - HistoryExercisesList uses `t('components.item_card.exercise_singular')` (matching existing pattern)

## Testing Checklist

### CurrentExercisesList
- [ ] Single exercises render normally
- [ ] Two exercises linked as superset render as single accordion item
- [ ] Superset label shows exercise names joined with " + "
- [ ] "Superset" subtitle appears
- [ ] All exercises in superset are editable
- [ ] Delete functionality works for individual exercises
- [ ] Save functionality works correctly

### HistoryExercisesList
- [ ] Single exercises render normally
- [ ] Two exercises linked as superset render as single accordion item
- [ ] Superset label shows exercise names joined with " + "
- [ ] "Superset" subtitle appears
- [ ] Historical data displays correctly (read-only)
- [ ] No edit/delete buttons appear (as expected for history)
