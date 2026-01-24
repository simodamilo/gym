# Fix Superset Visual Grouping in CreateExercisesList

**Date:** 2026-01-24
**Task:** Fix the superset grouping display in CreateExercisesList component

## Problem

When the "superset with next exercise" checkbox is checked, exercises should be visually grouped together in a single accordion item. Currently, the `groupLinkedItems` function correctly identifies exercise groups, but the rendering logic still creates separate accordion items for each exercise.

### Current Behavior
- Exercise 1 (with "superset with next" checked) → Separate accordion item
- Exercise 2 (linked to previous) → Separate accordion item below

### Expected Behavior
- Exercise 1 + Exercise 2 → Single accordion item showing both exercises as a superset

## Root Cause

In `CreateExercisesList.component.tsx` (lines 200-211), the code maps over groups and renders a `Collapse` with multiple items:

```typescript
{groupLinkedItems(mutableDayExercises).map((group) => {
    const renderedItems = group.map((exercise) => renderItem(exercise));
    // ...
    return (
        <Collapse accordion items={renderedItems} ... />
    );
})}
```

Even though exercises are grouped together, each exercise still gets its own accordion item within the Collapse. The `accordion` prop ensures only one item is open at a time, but they're still separate items.

## Solution Approach

### 1. Modify Rendering Logic
For groups with multiple exercises (supersets):
- Create a SINGLE accordion item
- The label should indicate it's a superset (e.g., "Exercise 1 + Exercise 2" or show superset indicator)
- The content should render ALL ExerciseContent components for exercises in the group vertically

For groups with a single exercise:
- Render normally as before

### 2. Affected Files
- `src/pages/workouts/create/components/CreateExercisesList.component.tsx`
  - Update the rendering logic in lines 200-211
  - Modify or create a new render function for superset groups

### 3. Implementation Details

Create a new render function for superset groups:
```typescript
const renderSuperset = (group: DayExercise[]) => {
    return {
        key: group.map(g => g.id).join('-'),
        label: (
            <div className="flex items-center justify-between w-full gap-4">
                <div className="flex-1 flex flex-col gap-1">
                    <span className="text-base font-semibold text-[var(--text-primary)]">
                        {group.map(ex => ex.exercise?.name || t('workouts.exercises.new_exercise_title')).join(' + ')}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">Superset</span>
                </div>
                {isDragEnable && <HolderOutlined ... />}
            </div>
        ),
        children: (
            <div className="flex flex-col gap-6">
                {group.map((exercise, index) => (
                    <div key={exercise.id}>
                        {index > 0 && <Divider className="my-2" />}
                        <ExerciseContent
                            dayId={dayId!}
                            exerciseId={exercise.id}
                            dayExercise={exercise}
                            saveExercises={saveExercises}
                            deleteExercise={deleteExercise}
                            isDraft
                            isNew={!exercise.exercise?.name}
                        />
                    </div>
                ))}
            </div>
        ),
    };
};
```

Then update the mapping logic:
```typescript
{groupLinkedItems(mutableDayExercises).map((group) => {
    const item = group.length > 1
        ? renderSuperset(group)
        : renderItem(group[0]);
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

### 4. Additional Considerations

- **Drag and drop behavior**: When dragging a superset, the entire group should move together (already handled by using `group[0].id`)
- **Active key management**: The active key should use the combined group key for supersets
- **Checkbox behavior**: The "superset with next" checkbox should only show for exercises that aren't the last in a superset group (already handled in ExerciseContent)

## Implementation Summary

### Changes Made

**File: `src/pages/workouts/create/components/CreateExercisesList.component.tsx`**

1. **Added `renderSuperset` function** (after `renderItem` function):
   - Creates a single accordion item for exercise groups (supersets)
   - Label shows all exercise names joined with " + " (e.g., "Chest + Chest")
   - Displays "Superset" subtitle below exercise names
   - Renders all ExerciseContent components vertically with dividers between them
   - Uses combined group key (all exercise IDs joined with "-")

2. **Updated rendering logic** (lines 200-211):
   - Changed from mapping all exercises to separate items to using conditional rendering
   - Groups with 1 exercise: use `renderItem(group[0])`
   - Groups with 2+ exercises: use `renderSuperset(group)`
   - Each Collapse now receives a single item array `[item]` instead of multiple items

### Key Implementation Details

- **Dividers**: Used custom divider with `border-t border-[var(--border-color)] my-4` instead of Ant Design Divider to maintain consistency with Tailwind-only styling rule
- **Group key**: Combined all exercise IDs with "-" to create unique keys for superset items
- **Active key management**: Unchanged - works with both single exercise keys and grouped keys
- **Drag behavior**: Uses first exercise ID in group (`group[0].id`) as sortable ID, ensuring entire superset moves together

## Testing Checklist

- [ ] Single exercises render normally
- [ ] Two exercises linked as superset render as single accordion item
- [ ] Three or more exercises linked render as single accordion item
- [ ] Superset label shows all exercise names joined with " + "
- [ ] "Superset" subtitle appears below exercise names
- [ ] All exercises in superset are editable
- [ ] Delete functionality works for individual exercises in superset
- [ ] Drag and drop works correctly with supersets (entire group moves)
- [ ] "Superset with next" checkbox properly links/unlinks exercises
- [ ] Visual dividers appear between exercises within a superset
