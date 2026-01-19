# Profile Page Redesign

**Date:** 2026-01-19
**Task:** Update profile page following the design reference image

## Requirements

Based on the design image and user specifications:

### 1. Top Section (User Info + Stats)
- **User Avatar:** Keep existing avatar (left side)
- **User Name:** Display user name/email
- **Premium Athlete Badge:** Add "PREMIUM ATHLETE" badge below user name
- **Settings Icon:** Add gear/settings icon in top right corner
- **Stats Card:** Show only **Total Workouts** count (remove streak and total volume)
  - Format: Single stat card with workout count
  - Source: Count from `history.workouts` array length

### 2. Body Weight Progression Chart
- Keep existing chart implementation (already working)
- Style updates to match design:
  - Dark card background with rounded corners
  - Green line chart (#00FF94 or similar)
  - Show current weight value on top right (e.g., "74.3 kg")
  - Clean axis labels (months abbreviated)
  - Edit button to add/update weight

### 3. Personal Bests Section
- Add new "PERSONAL BESTS" section
- Display list of exercises with their 1RM values
- Example format:
  - Back Squat: 126.0 kg
  - Deadlift: 146.0 kg
  - Bench Press: 95.0 kg
- **Note:** Personal best calculation logic doesn't exist yet (will implement later)
- For now, show placeholder/empty state or mock data

### 4. Settings Modal/Drawer
Clicking the settings icon should open a settings interface with:
- **Language Switcher:** Toggle between available languages
- **Theme Switcher:** Toggle between light/dark mode
- **Sign Out Button:** Keep existing sign out functionality

### 5. Sections NOT Needed
- Account section (Training History, Achievements, Notifications)
- Streak counter
- Total volume counter

### 6. Bottom Bar
- No changes needed (keep current implementation)

## Implementation Approach

### Phase 1: Component Structure Updates
1. **Restructure Profile.tsx:**
   - Split into smaller components for maintainability:
     - `ProfileHeader.tsx` - User info, avatar, settings icon
     - `WorkoutStatsCard.tsx` - Workout count display
     - `BodyWeightChart.tsx` - Extract chart to separate component
     - `PersonalBests.tsx` - New component for 1RM display
     - `SettingsModal.tsx` - New settings interface

2. **Create components folder:**
   - `src/pages/profile/components/`

### Phase 2: Data Integration
1. **Workout Count:**
   - Use `historySelectors.getHistoryWorkouts` to get workouts array
   - Display `workouts.length` as total workout count

2. **Body Weight Data:**
   - Already implemented, just needs styling updates

3. **Personal Bests:**
   - Create placeholder component
   - Add TODO/stub for future 1RM calculation logic
   - Mock data for visual reference

### Phase 3: Settings Functionality
1. **Theme Switching:**
   - Check if theme context/state exists
   - If not, create theme context using React Context API
   - Store theme preference in localStorage
   - Apply CSS variables or Tailwind dark mode class

2. **Language Switching:**
   - Leverage existing i18next configuration
   - Add language options (currently only English exists)
   - Create language selector component
   - Store language preference using i18next's built-in persistence

### Phase 4: Styling (Tailwind Only)
Apply design styles matching the reference image:
- Dark theme with proper contrast
- Green accent color (#00FF94 or similar)
- Card-based layout with rounded corners
- Proper spacing and typography hierarchy
- Smooth transitions and hover states

### Phase 5: i18n Updates
Add missing translation keys:
- `profile.workouts_count`
- `profile.personal_bests_title`
- `profile.settings_title`
- `profile.settings.language`
- `profile.settings.theme`
- `profile.settings.dark_mode`
- `profile.settings.light_mode`
- `profile.premium_athlete`

## Files to be Modified

1. **src/pages/profile/Profile.tsx** - Main component restructure
2. **src/utils/i18n/en.json** - Add new translation keys
3. **New files:**
   - `src/pages/profile/components/ProfileHeader.tsx`
   - `src/pages/profile/components/WorkoutStatsCard.tsx`
   - `src/pages/profile/components/BodyWeightChart.tsx`
   - `src/pages/profile/components/PersonalBests.tsx`
   - `src/pages/profile/components/SettingsModal.tsx`
   - `src/context/ThemeContext.tsx` (if doesn't exist)

## Architectural Decisions

### Component Modularity
Following the codebase pattern of splitting complex components into smaller, focused modules. This improves maintainability and reusability.

### Theme Management
Using React Context API for theme management:
- Lightweight solution for simple theme toggling
- Integrates well with Tailwind's dark mode
- Persists user preference in localStorage
- Can be extended later if needed

### Styling Approach
Strict adherence to Tailwind CSS only (no CSS modules, inline styles, or other approaches) as per project guidelines.

### Personal Bests
Implementing UI placeholder now, logic later:
- Allows for design validation first
- Separates UI work from complex calculation logic
- Can be filled in with real data once 1RM calculation is implemented

## Trade-offs

1. **Mock Data for Personal Bests:**
   - Pro: Allows full UI implementation and user feedback
   - Con: Not functional until 1RM logic is built
   - Decision: Acceptable for this phase

2. **Component Splitting:**
   - Pro: Better modularity and testability
   - Con: More files to maintain
   - Decision: Follows project standards, worth it

3. **Theme Context vs Global State:**
   - Pro (Context): Simple, lightweight, sufficient for theme only
   - Con: Not in Redux (where other app state lives)
   - Decision: Theme is UI-only concern, Context is appropriate

## Next Steps After Approval

1. Create component structure
2. Implement ProfileHeader with settings icon
3. Build WorkoutStatsCard with workout count
4. Extract and style BodyWeightChart
5. Create PersonalBests placeholder component
6. Implement SettingsModal with language and theme toggles
7. Set up ThemeContext and integrate with app
8. Update translations
9. Test theme switching and language switching
10. Verify responsive design on mobile devices

## Questions for User

None at this time - requirements are clear. Will proceed with implementation once approved.

---

## Implementation Complete

### What Was Implemented

1. **Component Structure:**
   - Created modular components in `src/pages/profile/components/`:
     - `ProfileHeader.tsx` - User avatar, name, premium badge, and settings icon
     - `WorkoutStatsCard.tsx` - Displays total workout count from history
     - `BodyWeightChart.tsx` - Green-styled chart with current weight display
     - `PersonalBests.tsx` - Mock data for 1RM display (ready for real logic later)
     - `SettingsModal.tsx` - Language and theme switching with sign out

2. **Theme Management:**
   - Utilized existing `ThemeProvider` from `src/theme/ThemeProvider.tsx`
   - Theme toggle integrated into settings modal
   - Dark/light mode fully functional with localStorage persistence

3. **Multi-language Support:**
   - Added Spanish translations (`es.json`)
   - Updated English translations with new keys
   - Configured i18next to support language switching
   - Language preference persisted automatically

4. **Data Integration:**
   - Workout count from `historySelectors.getHistoryWorkouts`
   - Body weight data from existing `progressHistory` store
   - History workouts fetched on profile page mount

5. **Styling:**
   - All styling done with Tailwind CSS (no CSS modules or inline styles)
   - Dark theme optimized with gradient backgrounds
   - Green accent color (#10B981) for charts and highlights
   - Rounded corners and modern card-based layout

### Files Modified:
- `src/pages/profile/Profile.tsx` - Refactored to use new components
- `src/utils/i18n/en.json` - Added new translation keys
- `src/utils/i18n/i18n.ts` - Added Spanish language support

### Files Created:
- `src/pages/profile/components/ProfileHeader.tsx`
- `src/pages/profile/components/WorkoutStatsCard.tsx`
- `src/pages/profile/components/BodyWeightChart.tsx`
- `src/pages/profile/components/PersonalBests.tsx`
- `src/pages/profile/components/SettingsModal.tsx`
- `src/utils/i18n/es.json`

### Build Status:
✅ TypeScript compilation successful
✅ Vite build successful
✅ No new linting errors introduced

### Ready for Testing:
The profile page is now fully functional with:
- Modern, dark-themed design matching the reference image
- Working theme switcher (light/dark mode)
- Working language switcher (English/Spanish)
- Total workout count display
- Body weight progression chart with current weight
- Personal bests section (with mock data, ready for real logic)
- Settings modal with sign out functionality

---

## Personal Bests Feature Implementation

**Date:** 2026-01-19
**Task:** Implement real data for Personal Bests section using database queries

### Requirements

Replace the mock data in PersonalBests component with actual data:
- Fetch the highest weight for each exercise from workout history
- Group weights by exercise and take the maximum value
- Minimize data retrieval and API calls for optimal performance

### Database Schema Analysis

Based on the existing Supabase schema:
```
workouts
  └─ days
      └─ day_exercises
          ├─ exercises_catalog (exercise info)
          └─ day_exercise_sets (contains weight field)
```

### Implementation Approach

#### Option 1: Use Existing Redux History Data (NOT RECOMMENDED)
- **Pros:** No additional API call
- **Cons:**
  - Loads all workout history data (inefficient)
  - Must process all data on frontend
  - History might not be loaded if user hasn't viewed history yet

#### Option 2: Optimized Database Query (RECOMMENDED)
Create a specialized query that:
- Only fetches exercise IDs, names, and weights from archived workouts
- Uses Supabase's query capabilities to filter and select minimal fields
- Processes data on frontend to find max weight per exercise

**This approach is optimal because:**
- Minimal data transfer (only exercise info + weights, not full workout structure)
- Single API call
- Works independently of existing Redux state
- Can be cached/memoized in Redux store for reuse

### Implementation Plan

#### 1. Create Redux Store Slice for Personal Bests

**New Redux slice:** `src/store/personalBests/`

Files structure:
```
src/store/personalBests/
  ├── personalBests.actions.ts   - Async thunk for fetching data
  ├── personalBests.reducer.ts   - State management
  ├── personalBests.selectors.ts - Memoized selectors
  └── types.ts                   - TypeScript interfaces
```

**Types:**
```typescript
interface PersonalBest {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number;
  category: string;
}

interface PersonalBestsState {
  personalBests: PersonalBest[];
  isLoading: boolean;
  isError: boolean;
}
```

#### 2. Create Optimized Supabase Query

**Query strategy:**
```typescript
// Fetch only necessary data from archived workouts
const { data } = await supabase
  .from("workouts")
  .select(`
    days (
      day_exercises (
        exercises_catalog (
          id,
          name,
          category
        ),
        day_exercise_sets (
          weight
        )
      )
    )
  `)
  .eq("status", "archived");
```

**Frontend processing:**
1. Flatten the nested structure
2. Group by exercise ID
3. Find maximum weight for each exercise
4. Sort by weight (descending) or alphabetically

#### 3. Update PersonalBests Component

Replace mock data with:
- Use Redux selector to get personal bests
- Display loading state while fetching
- Show empty state if no data
- Handle errors gracefully

#### 4. Integrate with Profile Page

Update `Profile.tsx`:
- Dispatch `fetchPersonalBests()` action on mount (alongside existing fetches)
- Pass loading/error states to PersonalBests component

### Data Flow

1. User navigates to profile page
2. `Profile.tsx` dispatches `fetchPersonalBests()` thunk
3. Thunk queries Supabase for exercise data with weights
4. Response is processed:
   - Extract all exercise-weight pairs
   - Group by exercise ID
   - Calculate max weight per exercise
5. Results stored in Redux `personalBests` slice
6. PersonalBests component reads from Redux selector
7. UI updates with real data

### Optimization Strategies

1. **Minimal Data Fetching:**
   - Only select required fields (exercise info + weights)
   - Filter by archived workouts only
   - No unnecessary joins

2. **Frontend Processing:**
   - Group and aggregate on client side (faster than complex SQL aggregations)
   - Use efficient data structures (Map for O(1) lookups)

3. **Caching:**
   - Store results in Redux for session duration
   - Avoid refetching on every profile visit
   - Can add "refresh" button if needed

4. **Performance:**
   - Use memoized selectors to prevent unnecessary re-renders
   - Process data once in thunk, not in component

### Files to be Modified/Created

**New files:**
- `src/store/personalBests/personalBests.actions.ts`
- `src/store/personalBests/personalBests.reducer.ts`
- `src/store/personalBests/personalBests.selectors.ts`
- `src/store/personalBests/types.ts`

**Modified files:**
- `src/store/index.ts` - Add personalBests reducer
- `src/pages/profile/Profile.tsx` - Dispatch fetch action
- `src/pages/profile/components/PersonalBests.tsx` - Connect to Redux

### Edge Cases to Handle

1. **No workout history:** Show empty state
2. **Exercises with no weight:** Filter out (only show exercises with tracked weights)
3. **Tied weights:** Show most recent or all exercises with same weight
4. **Loading state:** Show skeleton or spinner
5. **Error state:** Show error message with retry option

### Example Data Processing

```typescript
// Input: Nested workout structure from Supabase
// Output: Array of personal bests

function processPersonalBests(workouts: WorkoutResponse[]): PersonalBest[] {
  const exerciseWeights = new Map<string, {
    name: string,
    category: string,
    maxWeight: number
  }>();

  workouts.forEach(workout => {
    workout.days.forEach(day => {
      day.day_exercises.forEach(dayEx => {
        const exerciseId = dayEx.exercises_catalog.id;
        const exerciseName = dayEx.exercises_catalog.name;
        const category = dayEx.exercises_catalog.category;

        dayEx.day_exercise_sets.forEach(set => {
          if (set.weight) {
            const current = exerciseWeights.get(exerciseId);
            if (!current || set.weight > current.maxWeight) {
              exerciseWeights.set(exerciseId, {
                name: exerciseName,
                category,
                maxWeight: set.weight
              });
            }
          }
        });
      });
    });
  });

  return Array.from(exerciseWeights.entries()).map(([id, data]) => ({
    exerciseId: id,
    exerciseName: data.name,
    maxWeight: data.maxWeight,
    category: data.category
  }));
}
```

### Testing Checklist

- [ ] Verify correct data fetching from Supabase
- [ ] Confirm max weight calculation is accurate
- [ ] Test with empty workout history
- [ ] Test with exercises that have no weights
- [ ] Test loading states
- [ ] Test error handling
- [ ] Verify Redux state updates correctly
- [ ] Check component renders with real data

### Next Steps After Approval

1. Create personalBests Redux slice with types
2. Implement fetchPersonalBests thunk with optimized query
3. Add reducer logic for loading/success/error states
4. Create memoized selectors
5. Update store configuration to include new reducer
6. Connect PersonalBests component to Redux
7. Update Profile.tsx to dispatch fetch action
8. Test with real data
9. Handle edge cases and loading states

---

## Personal Bests Implementation Complete

**Implementation Date:** 2026-01-19

### What Was Implemented

1. **Redux Store Slice Created** - `src/store/personalBests/`
   - `types.ts` - TypeScript interfaces for PersonalBest and state
   - `personalBests.actions.ts` - Async thunk with optimized Supabase query
   - `personalBests.reducer.ts` - State management for loading/success/error
   - `personalBests.selectors.ts` - Memoized selectors for accessing data

2. **Optimized Data Fetching**
   - Single Supabase query fetches only necessary fields:
     - Exercise IDs, names, and categories
     - Weight values from sets
     - Filters by archived workouts only
   - Data processing happens on frontend:
     - Groups weights by exercise ID using Map for O(1) lookups
     - Finds maximum weight for each exercise
     - Sorts results by weight descending

3. **Component Updates**
   - `PersonalBests.tsx` now uses Redux data instead of mock data
   - Added loading state display
   - Added error state handling
   - Shows empty state when no data available
   - Displays exercise name and max weight in kg

4. **Integration**
   - `Profile.tsx` dispatches `fetchPersonalBests()` on mount
   - Reducer integrated into store configuration
   - Data loads alongside progress history and workout history

5. **Translation Updates**
   - Added `profile.loading` translation key
   - Added `profile.error_loading_personal_bests` translation key
   - Updated both English and Spanish translations

### Files Created

- `src/store/personalBests/types.ts`
- `src/store/personalBests/personalBests.actions.ts`
- `src/store/personalBests/personalBests.reducer.ts`
- `src/store/personalBests/personalBests.selectors.ts`

### Files Modified

- `src/store/reducer.config.ts` - Added personalBests reducer to store
- `src/pages/profile/Profile.tsx` - Added fetchPersonalBests dispatch
- `src/pages/profile/components/PersonalBests.tsx` - Connected to Redux
- `src/utils/i18n/en.json` - Added translation keys
- `src/utils/i18n/es.json` - Added Spanish translations

### Technical Details

**Query Optimization:**
```typescript
// Only fetches exercise info and weights
const { data } = await supabase
  .from("workouts")
  .select(`
    days (
      day_exercises (
        exercises_catalog (id, name, category),
        day_exercise_sets (weight)
      )
    )
  `)
  .eq("status", "archived");
```

**Data Processing:**
- Uses Map for efficient O(1) lookups when grouping by exercise
- Runtime checks for data validity (handles missing or null weights)
- Type-safe processing with proper TypeScript handling
- Sorts by weight descending for easy viewing

**Performance:**
- Single API call on profile page load
- Results cached in Redux for session duration
- Memoized selectors prevent unnecessary re-renders
- Minimal data transfer (only necessary fields)

### Edge Cases Handled

- No workout history: Shows empty state message
- Exercises with no weights: Filtered out during processing
- Loading state: Shows loading message while fetching
- Error state: Shows error message if fetch fails
- Null/undefined weights: Skipped with runtime checks

### Build Status

✅ TypeScript compilation successful
✅ Vite build successful (7.06s)
✅ No linting errors
✅ Translation keys added for both languages

### Ready for Testing

The personal bests feature is now fully functional:
- Real data fetched from Supabase
- Displays highest weight for each exercise
- Handles all edge cases gracefully
- Optimized for minimal data transfer and API calls
- Sorted by weight for easy viewing of top lifts
