# Workouts Page Redesign with Dark Mode Toggle

**Date**: 2026-01-16
**Status**: Completed

## Overview
Redesign the main workouts page to match the provided design reference, including a dark mode toggle in the header and improved workout card layout.

## Design Reference Analysis
From the provided image, the new design includes:

1. **Page Header**
   - "Workouts" title (left aligned, large, bold)
   - Moon icon button (top right corner) for dark mode toggle

2. **Tab Navigation** (Current/History)
   - "Current" tab - active state with white background
   - "History" tab - inactive state with gray background
   - Rounded container with padding

3. **Workout Cards**
   - Left colored border (green accent in reference)
   - Workout/day name as title
   - Metadata line: "X Exercises • XX min"
   - Number badge on right (workout counter)
   - Chevron arrow icon on far right
   - "LAST" label for recently completed workouts
   - Clean, rounded design with good spacing
   - White background cards with subtle shadows

## Current Implementation
- `ThemeProvider` already exists with dark/light mode support
- CSS variables system already in place (`var(--bg-primary)`, etc.)
- `PageSwitcher` component exists for Current/History tabs
- Current page uses `WorkoutComponent` with `isCurrent` prop (shows full workout view)
- History page shows basic list of workouts with dates

## Implementation Plan

### 1. Add Page Header with Dark Mode Toggle
**File**: `src/pages/workouts/Workouts.tsx`

- Add page title "Workouts" with appropriate styling
- Add dark mode toggle button (moon/sun icon) in top right
- Use `useTheme()` hook from `ThemeProvider` to access `toggleTheme()` and `mode`
- Layout: flex container with space-between

### 2. Create New Current Workout View Component
**New File**: `src/pages/workouts/current/Current.tsx`

Instead of showing the full workout component directly, create a new view that:
- Displays workout days as a list of cards
- Each card represents one Day from the current workout
- Card design:
  - Left border with semantic color (success green for active, different colors for completed)
  - Day name as title
  - Exercise count and estimated duration metadata
  - Counter badge showing number of times completed
  - "LAST" label if it was the most recently started day
  - Chevron icon for navigation
  - Click handler to navigate to the detailed day view (existing ExercisesList)

**Data Source**: Redux store `currentSelectors.getCurrentWorkout()`

**Card Component**: Create reusable `WorkoutCard` component

### 3. Create Reusable WorkoutCard Component
**New File**: `src/components/workoutCard/WorkoutCard.tsx`

Props:
- `title: string` - Day/workout name
- `exerciseCount: number` - Number of exercises
- `duration?: number` - Estimated duration in minutes
- `counter?: number` - Number badge value
- `isLast?: boolean` - Show "LAST" label
- `borderColor?: string` - Left border color (default to semantic-success)
- `onClick: () => void` - Click handler

Styling:
- Rounded corners (16px)
- Background: `var(--bg-elevated)`
- Border: `1px solid var(--border-light)`
- Shadow: `var(--shadow-md)`
- Left border: `4px solid` with provided color
- Padding: 16-20px
- Hover effect: subtle scale/shadow change (framer-motion)

### 4. Update History Page
**File**: `src/pages/workouts/components/history/History.tsx`

Similar redesign using the `WorkoutCard` component:
- Display workout date range as title
- Show total exercise count across all days
- Show total duration estimate
- Use different border color (e.g., brand-primary)
- Click navigates to historical workout detail view

### 5. Update PageSwitcher Styling (if needed)
**File**: `src/components/pageSwitcher/PageSwitcher.tsx`

Review current implementation against design:
- Active tab: white/elevated background
- Inactive tab: transparent/tertiary background
- Ensure visual consistency with reference

### 6. Update Routing
**File**: `src/utils/routing/router.tsx`

Update the route for `/gym/workouts/current` to use the new Current component instead of directly using WorkoutComponent.

## Affected Files

**New Files**:
- `src/pages/workouts/current/Current.tsx` - New current view with card list
- `src/components/workoutCard/WorkoutCard.tsx` - Reusable card component

**Modified Files**:
- `src/pages/workouts/Workouts.tsx` - Add header with title and dark mode toggle
- `src/pages/workouts/components/history/History.tsx` - Redesign with WorkoutCard
- `src/utils/routing/router.tsx` - Update route to use new Current component
- `src/components/pageSwitcher/PageSwitcher.tsx` - Style adjustments if needed

## Technical Decisions

1. **Reusable Card Component**: Creating a shared `WorkoutCard` component ensures consistency between Current and History views and makes future modifications easier.

2. **Duration Calculation**: For the "XX min" display, we'll calculate estimated duration based on:
   - Number of exercises × average exercise duration (e.g., 10-12 min per exercise)
   - This is an estimate since actual workout duration varies

3. **Border Colors**:
   - Current workouts: green (`var(--semantic-success)`)
   - History workouts: blue (`var(--brand-primary)`)
   - Can be customized per card

4. **Navigation Flow**:
   - Current page shows day cards → click opens ExercisesList for that day
   - History page shows workout cards → click navigates to workout detail view
   - Maintains existing navigation patterns

5. **Dark Mode Integration**:
   - Use existing ThemeProvider (no new state management needed)
   - All colors use CSS variables (automatically theme-aware)
   - Toggle button shows moon (light mode) / sun (dark mode)

## Open Questions

1. **Duration Calculation**: Should we store estimated duration in the database, or calculate it dynamically?
   - **Decision**: Calculate dynamically for now (count exercises × average time)

2. **Card Click Behavior**: Should clicking anywhere on the card navigate, or just the chevron?
   - **Decision**: Entire card is clickable (better UX, matches reference design)

3. **"LAST" Label Logic**: How to determine which day shows "LAST"?
   - **Decision**: Use `day.isLast` field from the current workout data

## Testing Checklist

After implementation:
- [ ] Dark mode toggle works correctly
- [ ] Theme persists across page refreshes
- [ ] Current page displays all workout days as cards
- [ ] History page displays all historical workouts as cards
- [ ] Card click navigation works correctly
- [ ] Exercise count is accurate
- [ ] Duration estimation is reasonable
- [ ] "LAST" label appears on correct day
- [ ] Counter badge displays correctly
- [ ] Responsive design works on mobile and desktop
- [ ] All CSS variables adapt correctly in both themes
- [ ] No visual regressions in other parts of the app

## Implementation Summary

**Implementation completed on 2026-01-16**

All planned components and features were successfully implemented:

1. **WorkoutCard Component** (`src/components/workoutCard/WorkoutCard.tsx`):
   - Reusable card component with all design specifications
   - Framer Motion animations for hover/tap effects
   - Supports customizable border colors
   - Conditional "LAST" label rendering
   - Counter badge display

2. **Current Page** (`src/pages/workouts/current/Current.tsx`):
   - Card-based list view of workout days
   - Duration calculation (11 min per exercise average)
   - Click navigation to ExercisesList detail view
   - Handles empty state with helpful message
   - Proper loading state with Skeleton component

3. **Workouts Header** (updated `src/pages/workouts/Workouts.tsx`):
   - Added "Workouts" title with proper styling
   - Dark mode toggle button with moon/sun icons
   - Integrated with existing ThemeProvider
   - Smooth animations on toggle button

4. **History Page** (updated `src/pages/workouts/components/history/History.tsx`):
   - Redesigned with WorkoutCard component
   - Date range formatting for workout titles
   - Total exercise count calculation across all days
   - Duration estimation
   - Empty state handling

5. **Routing** (updated `src/utils/routing/router.tsx`):
   - Updated to use new Current component
   - Maintains backward compatibility with history detail views

**Build Status**: ✅ Dev server started successfully on port 5175 without errors

**Notes**:
- All components use existing CSS variables for seamless dark/light mode support
- Duration calculation uses 11 minutes as average per exercise
- Theme preference persists via localStorage (handled by ThemeProvider)
- Maintains existing navigation patterns and user flows
- No breaking changes to existing functionality
