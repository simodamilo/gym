# Personal Best Toggle - Component Specification

**Date**: 2026-01-19
**Component**: PersonalBestToggle
**Related Document**: 2026-01-19-personal-best-tracking-ui-design.md

## Component Architecture

### Component Breakdown

1. **PersonalBestToggle** (New Component)
   - Standalone star badge button
   - Handles toggle logic
   - Manages animation states

2. **Exercise Card** (Modified)
   - Integrates PersonalBestToggle
   - Updates dropdown menu
   - Manages exercise state

## PersonalBestToggle Component

### File Location
`src/pages/exercises/components/PersonalBestToggle.tsx`

### Component Code

```tsx
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface PersonalBestToggleProps {
    exerciseId: string;
    exerciseName: string;
    isTracked: boolean;
    onToggle: (exerciseId: string, isTracked: boolean) => Promise<void>;
    disabled?: boolean;
}

export const PersonalBestToggle = ({
    exerciseId,
    exerciseName,
    isTracked,
    onToggle,
    disabled = false
}: PersonalBestToggleProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click events

        if (isLoading || disabled) return;

        setIsLoading(true);
        setIsAnimating(true);

        try {
            await onToggle(exerciseId, !isTracked);
        } catch (error) {
            console.error('Failed to toggle personal best tracking:', error);
            // Error handling will be managed by parent component
        } finally {
            setIsLoading(false);
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    const ariaLabel = isTracked
        ? `Remove ${exerciseName} from personal bests`
        : `Add ${exerciseName} to personal bests`;

    return (
        <motion.button
            onClick={handleToggle}
            disabled={isLoading || disabled}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-[var(--bg-secondary)] rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={ariaLabel}
            aria-pressed={isTracked}
            role="button"
            whileTap={{ scale: 0.9 }}
            animate={{
                scale: isAnimating && isTracked ? [1, 1.2, 1] : 1,
            }}
            transition={{
                duration: 0.3,
                ease: 'easeOut',
            }}
        >
            {isTracked ? (
                <StarFilled
                    className="text-[var(--accent-teal)] text-lg transition-all"
                    style={{
                        opacity: isLoading ? 0.5 : 1,
                        filter: isLoading ? 'blur(0.5px)' : 'none',
                    }}
                />
            ) : (
                <StarOutlined
                    className="text-[var(--text-tertiary)] hover:text-[var(--accent-teal)] text-lg transition-all"
                    style={{
                        opacity: isLoading ? 0.5 : 1,
                        filter: isLoading ? 'blur(0.5px)' : 'none',
                    }}
                />
            )}
        </motion.button>
    );
};
```

## Updated Exercise Card

### Modified Section in Exercises.tsx

```tsx
// Inside the exercise card mapping (lines 166-190)

{categoryExercises.map((exercise: ExerciseCatalog) => (
    <div
        key={exercise.id}
        className="bg-[var(--bg-elevated)] rounded-2xl shadow-[var(--shadow-sm)] flex items-center justify-between p-4 hover:shadow-[var(--shadow-md)] transition-shadow border border-[var(--border-light)]"
    >
        {/* Left side: Icon + Star Badge + Exercise Info */}
        <div className="flex items-center gap-3 flex-1">
            {/* Exercise Icon */}
            <div className="w-10 h-10 bg-[var(--brand-primary-light)] rounded-lg flex items-center justify-center flex-shrink-0">
                <AppstoreOutlined className="text-[var(--brand-primary)] text-lg" />
            </div>

            {/* Personal Best Toggle - NEW */}
            <PersonalBestToggle
                exerciseId={exercise.id}
                exerciseName={exercise.name}
                isTracked={exercise.trackedForPersonalBest ?? true}
                onToggle={handleTogglePersonalBest}
            />

            {/* Exercise Name */}
            <div className="font-semibold text-[var(--text-primary)] flex-1">
                {exercise.name}
            </div>
        </div>

        {/* Right side: Three-dot Menu */}
        <Dropdown menu={getDropdownMenu(exercise)} trigger={["click"]} placement="bottomRight">
            <button className="w-8 h-8 flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
                <MoreOutlined className="text-lg" />
            </button>
        </Dropdown>
    </div>
))}
```

## Updated Dropdown Menu

### Modified getDropdownMenu Function

```tsx
// Update the getDropdownMenu function (lines 87-109)

const getDropdownMenu = (exercise: ExerciseCatalog): MenuProps => ({
    items: [
        // NEW: Personal Best Toggle Menu Item
        {
            key: 'toggle-pb',
            label: exercise.trackedForPersonalBest
                ? 'Remove from Personal Bests'
                : 'Track Personal Best',
            icon: exercise.trackedForPersonalBest ? (
                <StarFilled className="text-[var(--accent-teal)]" />
            ) : (
                <StarOutlined />
            ),
            onClick: () => handleTogglePersonalBest(exercise.id, !exercise.trackedForPersonalBest),
        },
        // Separator for visual grouping
        {
            type: 'divider',
        },
        {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => {
                setIsEditExerciseModalOpen(true);
                setSelectedExercise(exercise);
            },
        },
        {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
                setIsDeleteExerciseModalOpen(true);
                setSelectedExercise(exercise);
            },
        },
    ],
});
```

## Handler Function

### Add to Exercises.tsx

```tsx
// Add this handler function in the Exercises component (around line 68)

const handleTogglePersonalBest = async (exerciseId: string, isTracked: boolean) => {
    try {
        await dispatch(
            exercisesCatalogActions.togglePersonalBestTracking({
                exerciseId,
                tracked: isTracked,
            })
        ).unwrap();

        // Optional: Show success notification
        // You could use Ant Design's message component here
        // message.success(isTracked ? 'Added to Personal Bests' : 'Removed from Personal Bests');
    } catch (error) {
        console.error('Failed to toggle personal best tracking:', error);
        // Optional: Show error notification
        // message.error('Failed to update personal best tracking. Please try again.');
    }
};
```

## Redux Integration

### Update exercisesCatalog.action.ts

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

// Add this new action
export const togglePersonalBestTracking = createAsyncThunk(
    'exercisesCatalog/togglePersonalBestTracking',
    async ({ exerciseId, tracked }: { exerciseId: string; tracked: boolean }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('exercises_catalog')
                .update({ tracked_for_personal_best: tracked })
                .eq('id', exerciseId)
                .select()
                .single();

            if (error) throw error;

            return { exerciseId, tracked };
        } catch (error) {
            console.error('Error toggling personal best tracking:', error);
            return rejectWithValue(error);
        }
    }
);

// Add to the exported actions
export const exercisesCatalogActions = {
    // ... existing actions
    togglePersonalBestTracking,
};
```

### Update exercisesCatalog.reducer.ts

```typescript
import { togglePersonalBestTracking } from './exercisesCatalog.action';

// Add to the extraReducers builder
.addCase(togglePersonalBestTracking.pending, (state) => {
    state.isLoading = true;
    state.isError = false;
})
.addCase(togglePersonalBestTracking.fulfilled, (state, action) => {
    state.isLoading = false;
    const { exerciseId, tracked } = action.payload;
    const exercise = state.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
        exercise.trackedForPersonalBest = tracked;
    }
})
.addCase(togglePersonalBestTracking.rejected, (state) => {
    state.isLoading = false;
    state.isError = true;
});
```

## Visual States Reference

### State Matrix

| State | Star Icon | Color | Opacity | Cursor | Animation |
|-------|-----------|-------|---------|--------|-----------|
| Not Tracked - Default | StarOutlined | text-tertiary | 1.0 | pointer | none |
| Not Tracked - Hover | StarOutlined | accent-teal | 1.0 | pointer | none |
| Tracked - Default | StarFilled | accent-teal | 1.0 | pointer | scale on change |
| Tracked - Hover | StarFilled | accent-teal | 1.0 | pointer | none |
| Loading | Current icon | Current color | 0.5 | not-allowed | blur |
| Disabled | Current icon | Current color | 0.5 | not-allowed | none |

## Spacing & Layout

### Card Layout (Updated)

```
┌─────────────────────────────────────────────────────────┐
│  [Icon]  [Star]  [Exercise Name........................] [Menu] │
│  40x40   32x32   flex-1                                 32x32 │
│                                                               │
│  gap-3   gap-3                                                │
└─────────────────────────────────────────────────────────┘
```

### Measurements

- **Card padding**: 16px (p-4)
- **Elements gap**: 12px (gap-3)
- **Icon container**: 40x40px (w-10 h-10)
- **Star button**: 32x32px (w-8 h-8)
- **Menu button**: 32x32px (w-8 h-8)
- **Icon sizes**: 18px (text-lg)

## Responsive Behavior

### Mobile (Default)
- All elements visible
- Touch-optimized tap targets (minimum 32x32px)
- Star badge clearly visible

### Tablet (md: breakpoint)
- Same as mobile
- Potentially larger tap targets if needed

### Desktop
- Hover states active
- Mouse cursor changes
- Tooltips can be added (optional)

## Animation Specifications

### Toggle Animation
```typescript
// Framer Motion config
{
    scale: [1, 1.2, 1],
    duration: 0.3,
    ease: 'easeOut'
}
```

### Color Transition
```css
transition: all 200ms ease-in-out
```

### Tap Feedback
```typescript
whileTap={{ scale: 0.9 }}
```

## Accessibility Checklist

- [ ] Star button is keyboard accessible (tab navigation)
- [ ] Enter/Space keys trigger toggle
- [ ] Aria-label describes current state and action
- [ ] Aria-pressed indicates toggle state
- [ ] Focus visible state (outline on focus)
- [ ] Screen reader announces state changes
- [ ] Color contrast passes WCAG AA
- [ ] Touch target minimum 32x32px
- [ ] Disabled state communicated to assistive tech
- [ ] Loading state announced to screen readers

## Testing Scenarios

### Functional Tests
1. Click star badge → toggles from unfilled to filled
2. Click filled star → toggles to unfilled
3. Use menu option → same result as clicking star
4. Rapid clicking → debounced properly
5. Error case → rollback to previous state
6. Page refresh → state persists from database

### Visual Tests
1. Star appears in correct position
2. Colors match design system
3. Animations smooth and performant
4. Dark mode colors correct
5. Hover states work
6. Loading state visible

### Accessibility Tests
1. Keyboard navigation works
2. Screen reader announces correctly
3. Focus visible
4. Contrast sufficient
5. Touch targets adequate

## Performance Considerations

1. **Optimistic Updates**: Update UI before API response
2. **Debouncing**: Prevent multiple rapid toggles (500ms)
3. **Error Rollback**: Revert UI if API fails
4. **No Unnecessary Rerenders**: Use React.memo if needed
5. **Animation Performance**: Use GPU-accelerated transforms

## Error Handling

```typescript
// Example error handling in component
try {
    await onToggle(exerciseId, !isTracked);
} catch (error) {
    // UI automatically reverts via Redux state
    // Optional: show toast notification
    console.error('Toggle failed:', error);
}
```

## Future Enhancements

1. **Tooltip**: Add tooltip explaining feature on first visit
2. **Batch Toggle**: Select multiple exercises
3. **Undo Action**: Toast with undo button
4. **Sparkle Effect**: Add subtle particle animation on toggle
5. **Sound Feedback**: Optional audio cue on toggle

## Implementation Checklist

- [ ] Create PersonalBestToggle component
- [ ] Update ExerciseCatalog type definition
- [ ] Add togglePersonalBestTracking Redux action
- [ ] Update reducer to handle toggle action
- [ ] Modify Exercises.tsx to include star badge
- [ ] Update dropdown menu with toggle option
- [ ] Add handler function for toggle
- [ ] Test all states (loading, error, success)
- [ ] Verify animations work smoothly
- [ ] Test accessibility features
- [ ] Update personal bests filtering logic
- [ ] Test dark mode appearance
- [ ] Add database migration for new field

## Design Tokens Used

```css
/* Colors */
--accent-teal: #2DD4BF (light mode)
--accent-teal: #5EEAD4 (dark mode)
--text-tertiary: #9a9a9a (light mode)
--text-tertiary: #8c8c8c (dark mode)
--bg-secondary: #e8e8ed (light mode)
--bg-secondary: #262626 (dark mode)

/* Shadows */
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.12)

/* Spacing */
gap-3: 0.75rem (12px)
gap-4: 1rem (16px)
p-4: 1rem (16px)

/* Sizing */
w-8: 2rem (32px)
h-8: 2rem (32px)
text-lg: 1.125rem (18px)
```

## Code Organization

```
src/
├── pages/
│   └── exercises/
│       ├── Exercises.tsx (modified)
│       └── components/
│           └── PersonalBestToggle.tsx (new)
├── store/
│   ├── exercisesCatalog/
│   │   ├── exercisesCatalog.action.ts (modified)
│   │   ├── exercisesCatalog.reducer.ts (modified)
│   │   └── types.ts (modified)
│   └── personalBests/
│       └── personalBests.actions.ts (modified - add filtering)
```

This component specification provides everything needed for a clean, maintainable implementation of the personal best tracking toggle feature.
