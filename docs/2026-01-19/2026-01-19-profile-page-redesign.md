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
