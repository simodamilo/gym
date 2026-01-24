# Update CreateWorkout Component Styling

**Date:** 2026-01-17

## Overview
Update the CreateWorkout component to match the styling of the Current component for visual consistency across the application.

## Current State

### Layout Structure
The Workouts page uses a parent-child layout:
- **Workouts.tsx** (parent): Provides `px-4` padding for all child routes via the Outlet container
- **Current.tsx** (child): No padding, relies on parent's `px-4` padding
- **CreateWorkout.tsx** (child): Currently has `p-4` padding, which adds unnecessary double padding

### CreateWorkout Component
- Located at: `src/pages/workouts/create/CreateWorkout.component.tsx`
- Renders inside Workouts component's `<Outlet />` (line 63 in Workouts.tsx)
- Currently has `p-4` padding on the container
- The parent Workouts already provides `px-4` padding, creating double horizontal padding

### Current Component (Reference)
- Located at: `src/pages/workouts/current/Current.tsx`
- Container has NO padding: `className="flex flex-col gap-3 pb-28 hide-scrollbar overflow-auto"`
- Relies on parent Workouts component for horizontal padding
- Clean, consistent spacing

## Problem

CreateWorkout has `p-4` padding, but since it renders inside the Workouts component which already provides `px-4` padding, this creates:
- Double horizontal padding (parent's `px-4` + component's `p-4`)
- Inconsistent layout compared to Current component
- Unnecessary vertical padding that doesn't match the design

## Proposed Changes

### File: `src/pages/workouts/create/CreateWorkout.component.tsx`

**Line 139** - Update container div className:
- Remove ALL padding from the container
- Change from: `className={`w-full h-full max-h-full md:w-3xl flex flex-col gap-2 justify-between p-4`}`
- Change to: `className={`w-full h-full max-h-full md:w-3xl flex flex-col gap-2 justify-between`}`

This change will:
- Remove double padding by relying on parent's `px-4`
- Match the Current component's approach
- Create visual consistency across all workout pages
- Maintain all existing functionality

## Why This Approach

- **Parent-child pattern:** Child components should not add padding when parent provides it
- **Consistency:** Matches the Current component's pattern
- **Clean layout:** Eliminates double padding issue
- **No breaking changes:** Only affects spacing, all functionality remains intact

## Testing Considerations

After implementation, verify:
1. CreateWorkout page has consistent horizontal padding with Current page
2. No double padding on the sides
3. All buttons (add, upload, move) are properly positioned
4. Day cards align properly
5. Mobile and desktop views look correct
6. Compare side-by-side with Current page for consistency
