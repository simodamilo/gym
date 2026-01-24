# Personal Best Exercise Selection

**Date**: 2026-01-19

## Overview
Update the personal best tracking to allow users to choose which exercises should be displayed in the profile page, rather than showing all exercises with weights.

## Current State
- All exercises with weights are automatically shown in personal bests
- No way to filter or select which exercises to track

## Proposed Changes

### 1. Database Schema
Add a new field to the exercise catalog to track if an exercise should be shown in personal bests:
- Add `show_in_personal_best` boolean field (default: false for weighted exercises, null for bodyweight)

### 2. Exercise Catalog Page Updates
Add UI controls to toggle personal best tracking per exercise:

**UI Design Decision:**
- Add trophy icon badge next to exercise icon (visible when tracked)
- Add "Track in Personal Bests" menu item in three-dot dropdown
- Trophy icon in accent color when enabled, hidden when disabled
- Immediate visual feedback on toggle

**Implementation:**
- Update dropdown menu to include toggle option
- Add trophy icon component with conditional rendering
- Use TrophyOutlined icon from Ant Design
- Add smooth transition for icon appearance

### 3. Profile Page Updates
Filter personal bests to only show exercises marked with `show_in_personal_best = true`

### 4. Redux State Updates
- Update `ExerciseCatalog` type to include `showInPersonalBest` field
- Update actions to handle toggling this setting
- Update mappers to handle the new field

## Files to Modify

### Types & State
- `src/store/exercisesCatalog/types.ts` - Add field to ExerciseCatalog interface
- `src/store/exercisesCatalog/exercisesCatalog.mapper.ts` - Map new field

### Actions
- `src/store/exercisesCatalog/exercisesCatalog.actions.ts` - Add toggle action

### UI Components
- `src/pages/exercises/Exercises.tsx` - Add toggle control
- `src/pages/profile/Profile.tsx` - Filter exercises by showInPersonalBest

### Database
- Supabase migration to add `show_in_personal_best` column

## Implementation Approach

1. Design UI with ui-designer agent
2. Update database schema
3. Update TypeScript types
4. Update mapper
5. Create toggle action
6. Update Exercise Catalog UI
7. Update Profile page filtering logic
8. Test the feature

## Implementation Complete

### Changes Made

1. **Database Schema** ✓
   - Created SQL migration file: `migration-add-show-in-personal-best.sql`
   - Adds `show_in_personal_best` boolean column (default: false)

2. **TypeScript Types** ✓
   - Updated `ExerciseCatalog` interface to include `show_in_personal_best?: boolean`

3. **Redux Actions** ✓
   - Created `togglePersonalBest` action to update exercise tracking status
   - Updated reducer to handle the new action

4. **Exercise Catalog UI** ✓
   - Added "Track in Personal Bests" menu item in three-dot dropdown
   - Shows CheckOutlined icon when tracked, TrophyOutlined when not
   - Added trophy badge on exercise icon when tracked (teal circle badge)
   - Immediate visual feedback on toggle

5. **Personal Bests Query** ✓
   - Updated `fetchPersonalBests` to filter by `show_in_personal_best = true`
   - Added client-side filtering in `processPersonalBests` function
   - Uses Supabase `!inner` join to ensure proper filtering

## Testing Required
- Run SQL migration in Supabase
- Toggle exercises on/off in the catalog
- Verify trophy badge appears/disappears
- Check that profile page only shows selected exercises
- Test with multiple exercises

## Notes
- Default behavior: All existing exercises will have `show_in_personal_best = false`
- Users must manually enable exercises they want to track
- Future enhancement: Bulk selection UI for enabling multiple exercises at once
