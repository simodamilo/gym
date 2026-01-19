# Personal Best Tracking Toggle - UI Design Recommendation

**Date**: 2026-01-19
**Feature**: Personal Best Tracking Toggle for Exercise Catalog
**Designer**: UI Designer Agent

## Executive Summary

After analyzing the current Exercise Catalog page design and the existing Personal Bests feature, I recommend a **dual-indicator approach**: a visible star badge on each exercise card combined with a menu toggle option. This provides both immediate visual feedback and accessible control, optimizing for mobile-first interaction.

## Current State Analysis

### Exercise Card Structure
- **Layout**: Horizontal card with icon, name, and three-dot menu
- **Styling**: Rounded corners (rounded-2xl), elevated background, subtle shadows
- **Interaction**: Hover effects, dropdown menu with Edit/Delete
- **Visual Hierarchy**: Clear left-to-right flow (icon → name → actions)

### Design System Elements
- **Colors**: CSS custom properties (--brand-primary, --accent-teal, etc.)
- **Spacing**: Consistent padding (p-4) and gaps (gap-3, gap-4)
- **Icons**: Ant Design icons (AppstoreOutlined, MoreOutlined, etc.)
- **Shadows**: Layered shadow system (--shadow-sm to --shadow-xl)
- **Dark Mode**: Full support via CSS variables

### Existing Personal Bests System
- Personal bests are calculated and displayed on the Profile page
- Currently shows exercise name and max weight (kg)
- Automatically tracks all exercises (no opt-in/opt-out mechanism currently)

## Design Recommendation

### Approach: Dual-Indicator Pattern

**Primary Visual Indicator**: Star Badge (Always Visible)
**Secondary Control**: Menu Toggle Option (Accessible via three-dot menu)

### Why This Approach?

1. **Discoverability**: Visible star badge immediately communicates tracking status
2. **Efficiency**: Quick visual scan to see which exercises are tracked
3. **Accessibility**: Multiple interaction points (tap badge or use menu)
4. **Mobile-Optimized**: Large tap target (badge), familiar pattern (star = favorite/important)
5. **Non-Intrusive**: Doesn't clutter the card or disrupt existing layout
6. **Reversible**: Easy to toggle on/off with clear visual feedback

## Detailed Design Specifications

### 1. Visual Indicator: Star Badge

**Position**: Between exercise icon and name (left side of card)

**States**:
- **Tracked (Active)**: Filled star, accent color
- **Not Tracked (Inactive)**: Outlined star, tertiary color

**Icon**: Use Ant Design's `StarFilled` and `StarOutlined`

**Styling**:
```tsx
// Active (tracked)
<StarFilled className="text-[var(--accent-teal)] text-lg" />

// Inactive (not tracked)
<StarOutlined className="text-[var(--text-tertiary)] text-lg hover:text-[var(--accent-teal)] transition-colors" />
```

**Interaction**:
- Tap/click star to toggle tracking status
- Immediate visual feedback (fill/unfill animation)
- Subtle scale animation on toggle (0.9 → 1.1 → 1.0)
- Optional haptic feedback on mobile

**Accessibility**:
- Aria-label: "Toggle personal best tracking"
- Role: "button"
- Aria-pressed: true/false based on state

### 2. Menu Toggle Option

**Position**: Add as first item in existing dropdown menu (before Edit)

**Label**: "Track Personal Best" or "Remove from Personal Bests"

**Icon**: `StarFilled` (tracked) or `StarOutlined` (not tracked)

**Styling**:
```tsx
{
    key: "toggle-pb",
    label: exercise.trackedForPersonalBest
        ? "Remove from Personal Bests"
        : "Track Personal Best",
    icon: exercise.trackedForPersonalBest
        ? <StarFilled className="text-[var(--accent-teal)]" />
        : <StarOutlined />,
    onClick: () => handleTogglePersonalBest(exercise)
}
```

**Benefits**:
- Provides context and explicit action label
- Accessible for users who prefer menu navigation
- Consistent with existing Edit/Delete pattern

### 3. Updated Card Layout

**Visual Structure**:
```
[Exercise Icon] [Star Badge] [Exercise Name]                    [Three-dot Menu]
    48x48         20x20        Flex-1                              32x32
```

**Code Structure**:
```tsx
<div className="flex items-center gap-4 flex-1">
    {/* Exercise Icon */}
    <div className="w-10 h-10 bg-[var(--brand-primary-light)] rounded-lg flex items-center justify-center flex-shrink-0">
        <AppstoreOutlined className="text-[var(--brand-primary)] text-lg" />
    </div>

    {/* Star Badge Toggle */}
    <button
        onClick={(e) => {
            e.stopPropagation();
            handleTogglePersonalBest(exercise);
        }}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-[var(--bg-secondary)] rounded-lg transition-all active:scale-95"
        aria-label={`${exercise.trackedForPersonalBest ? 'Remove from' : 'Add to'} personal bests`}
        aria-pressed={exercise.trackedForPersonalBest}
    >
        {exercise.trackedForPersonalBest ? (
            <StarFilled className="text-[var(--accent-teal)] text-lg" />
        ) : (
            <StarOutlined className="text-[var(--text-tertiary)] text-lg hover:text-[var(--accent-teal)] transition-colors" />
        )}
    </button>

    {/* Exercise Name */}
    <div className="font-semibold text-[var(--text-primary)] flex-1">
        {exercise.name}
    </div>
</div>
```

### 4. Micro-Interactions & Animations

**Star Toggle Animation**:
```tsx
// Using Framer Motion (already in stack)
<motion.div
    whileTap={{ scale: 0.9 }}
    animate={{ scale: exercise.trackedForPersonalBest ? [1, 1.2, 1] : 1 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
>
    {/* Star icon */}
</motion.div>
```

**Color Transition**:
- Duration: 200ms
- Easing: ease-in-out
- Property: color

**Feedback**:
- On toggle: Brief notification toast (optional)
- Message: "Added to Personal Bests" / "Removed from Personal Bests"
- Position: Bottom center (above bottom bar)
- Duration: 2 seconds
- Auto-dismiss

### 5. Visual Feedback System

**Success State**:
- Star fills with accent-teal color
- Subtle scale animation
- Optional: Small sparkle effect around star (can use CSS keyframes)

**Error State**:
- Red shake animation if toggle fails
- Error toast notification
- Star returns to previous state

**Loading State** (during API call):
- Star icon opacity: 50%
- Spinning animation on star
- Disable interaction during loading

## Alternative Designs Considered

### Option A: Toggle Switch (Rejected)
**Why rejected**:
- Takes up too much horizontal space on mobile
- Less intuitive for this use case (not an on/off setting)
- Disrupts visual hierarchy of card

### Option B: Checkbox (Rejected)
**Why rejected**:
- Checkboxes imply selection/bulk actions
- Not semantically correct for tracking preference
- Less visually appealing

### Option C: Badge/Pill Label (Rejected)
**Why rejected**:
- Read-only appearance (not clearly interactive)
- Takes up more space than star icon
- Less familiar interaction pattern

### Option D: Star Badge Only (No Menu) (Rejected)
**Why rejected**:
- Some users prefer explicit menu actions
- Loses discoverability for users who don't try tapping the star
- Menu option provides helpful context

## Data Model Changes Required

### Update ExerciseCatalog Type

**File**: `src/store/exercisesCatalog/types.ts`

```typescript
export interface ExerciseCatalog {
    id: string;
    name: string;
    category: string;
    description?: string;
    created_at?: number;
    trackedForPersonalBest?: boolean; // NEW FIELD
}
```

### Backend Schema (Supabase)

**Table**: `exercises_catalog`
**New Column**: `tracked_for_personal_best` (boolean, default: true)

**Migration**:
```sql
ALTER TABLE exercises_catalog
ADD COLUMN tracked_for_personal_best BOOLEAN DEFAULT true;

-- Optional: Create index for filtering
CREATE INDEX idx_exercises_tracked_pb
ON exercises_catalog(tracked_for_personal_best)
WHERE tracked_for_personal_best = true;
```

### Redux Action

**New Action**: `togglePersonalBestTracking`

```typescript
export const togglePersonalBestTracking = createAsyncThunk(
    'exercisesCatalog/togglePersonalBestTracking',
    async ({ exerciseId, tracked }: { exerciseId: string; tracked: boolean }) => {
        const { error } = await supabase
            .from('exercises_catalog')
            .update({ tracked_for_personal_best: tracked })
            .eq('id', exerciseId);

        if (error) throw error;

        return { exerciseId, tracked };
    }
);
```

## Implementation Files

### Files to Modify:
1. `src/pages/exercises/Exercises.tsx` - Add star badge and toggle handler
2. `src/store/exercisesCatalog/types.ts` - Add trackedForPersonalBest field
3. `src/store/exercisesCatalog/exercisesCatalog.action.ts` - Add toggle action
4. `src/store/exercisesCatalog/exercisesCatalog.reducer.ts` - Handle toggle action
5. `src/store/personalBests/personalBests.actions.ts` - Filter by tracked exercises

### New Dependencies:
- None (all icons and animations already available)

## Accessibility Considerations

1. **Keyboard Navigation**:
   - Star badge is focusable via tab
   - Enter/Space to toggle
   - Focus visible state with outline

2. **Screen Readers**:
   - Clear aria-labels
   - Announce state changes
   - Role="button" for interactive star

3. **Color Contrast**:
   - Accent-teal passes WCAG AA for both light/dark modes
   - Inactive star uses tertiary color (still visible)

4. **Touch Targets**:
   - Star badge: 32x32px minimum (meets 44x44 with padding)
   - Clear tap area with hover background

## Performance Considerations

1. **Optimistic Updates**: Update UI immediately, rollback on error
2. **Debouncing**: Prevent rapid toggle spam (500ms debounce)
3. **Lazy Loading**: Personal bests recalculated only when needed
4. **Caching**: Cache tracked status in Redux (no refetch needed)

## Design Tokens

### New Color Variables (if needed):
```css
/* Already exists and perfect for this use case */
--accent-teal: #2DD4BF; /* Light mode */
--accent-teal: #5EEAD4; /* Dark mode */
```

### Icon Sizes:
- Star badge: 18px (text-lg in Tailwind)
- Menu icon: 14px (default Ant Design size)

### Animation Timings:
- Toggle transition: 200ms
- Scale animation: 300ms
- Toast duration: 2000ms

## User Flow

1. **Discovery**: User opens Exercise Catalog
2. **Recognition**: Sees star badges on some exercises
3. **Exploration**: Taps star or three-dot menu
4. **Action**: Toggles personal best tracking
5. **Feedback**: Star fills/unfills with animation
6. **Confirmation**: Optional toast notification
7. **Verification**: Personal Bests page updates accordingly

## Testing Scenarios

1. Toggle star from unfilled to filled
2. Toggle star from filled to unfilled
3. Toggle via dropdown menu
4. Verify API call succeeds
5. Verify optimistic update rollback on error
6. Test keyboard navigation
7. Test screen reader announcements
8. Test dark mode appearance
9. Test rapid toggle spam (debouncing)
10. Verify Personal Bests page filters correctly

## Future Enhancements

1. **Bulk Toggle**: Select multiple exercises to toggle at once
2. **Smart Suggestions**: Suggest exercises to track based on workout frequency
3. **Category Badges**: Show count of tracked exercises per category
4. **Filter**: Add filter option to show only tracked exercises
5. **Onboarding**: Tooltip on first visit explaining the feature

## Design Rationale

This design prioritizes:
- **Mobile-first interaction**: Large tap targets, familiar patterns
- **Visual clarity**: Immediate feedback, clear states
- **Accessibility**: Multiple interaction methods, proper ARIA labels
- **Consistency**: Matches existing design patterns (icons, colors, spacing)
- **Performance**: Optimistic updates, minimal rerenders
- **User delight**: Smooth animations, satisfying interactions

The star icon is universally recognized as "favorite" or "important", making it semantically appropriate for tracking personal bests (exercises important enough to track max weight).

## Design Mockup (Text Description)

**Inactive State**:
```
┌────────────────────────────────────────────────────┐
│  [💪]  [☆]  Bench Press                        [⋮] │
│  icon  star  exercise name                     menu │
└────────────────────────────────────────────────────┘
```

**Active State**:
```
┌────────────────────────────────────────────────────┐
│  [💪]  [★]  Bench Press                        [⋮] │
│  icon  star  exercise name                     menu │
│         (teal)                                      │
└────────────────────────────────────────────────────┘
```

**Dropdown Menu**:
```
┌─────────────────────────────────┐
│  ★  Remove from Personal Bests  │ (if tracked)
│  ✏️  Edit                        │
│  🗑️  Delete                      │
└─────────────────────────────────┘

OR

┌─────────────────────────────────┐
│  ☆  Track Personal Best         │ (if not tracked)
│  ✏️  Edit                        │
│  🗑️  Delete                      │
└─────────────────────────────────┘
```

## Conclusion

This design solution provides an intuitive, accessible, and visually pleasing way for users to control which exercises are tracked in their personal bests. The dual-indicator approach (star badge + menu option) maximizes discoverability while maintaining the clean, modern aesthetic of the current design.

The implementation is straightforward, requires minimal backend changes, and leverages existing design patterns and components from the codebase.

**Recommendation**: Proceed with implementation using the dual-indicator pattern with star badge as primary visual indicator.
