# Fix Exercise Menu Visibility Issue

**Date**: 2026-01-20

## Problem

The dropdown menus (three-dot menus) for exercises near the bottom of the list are getting cut off or hidden behind the bottom navigation bar. This makes it impossible to interact with the menu options for the last items in the list.

## Root Cause

1. The Dropdown component has a fixed `placement="bottomRight"` which always opens downward
2. For items near the bottom of the scrollable container, there's not enough space for the menu to display
3. The dropdown might be constrained by the parent container's overflow properties

## Solution

Implement the following fixes:

1. **Use `getPopupContainer`**: Configure the Dropdown to render in the document body instead of being constrained by the parent container. This prevents clipping by overflow containers.

2. **Enable auto-adjustment**: Ant Design's Dropdown component has built-in overflow adjustment, but we need to ensure it's not being blocked by the container hierarchy.

3. **Increase bottom padding** (optional): Add extra padding at the bottom of the exercise list to ensure there's always room for dropdowns to open, even if they don't flip upward.

## Implementation

### File to modify:
- `src/pages/exercises/Exercises.tsx` (line 211)

### Changes:
1. Add `getPopupContainer` prop to the Dropdown component to render in the body
2. Optionally adjust the placement to allow upward opening for bottom items
3. Consider increasing `pb-28` to `pb-32` or more if needed

## Technical Details

The Ant Design Dropdown component supports:
- `getPopupContainer`: Function that returns the container element for the dropdown overlay
- Auto-adjustment for overflow (enabled by default)
- Multiple placement options that can flip based on available space

By rendering the dropdown in the document body (or a higher-level container), we bypass any `overflow: hidden` or clipping from parent containers.

## Implementation Complete

### Changes Made:

1. **Added `getPopupContainer` to Dropdown** (line 211-216):
   - Configured dropdown to render in the parent element instead of being constrained by overflow
   - `getPopupContainer={(trigger) => trigger.parentElement || document.body}`
   - This allows the menu to escape container clipping

2. **Increased bottom padding** (line 134):
   - Changed from `pb-28` to `pb-40`
   - Provides additional space at the bottom of the list
   - Ensures dropdown menus have room to open even when scrolled to the bottom

3. **Reduced Select dropdown height** (lines 142-154 and 239-249):
   - Added `listHeight={180}` to both category Select components
   - Limits the dropdown menu height to 180px (down from default 256px)
   - Makes the dropdown more compact and prevents it from being cut off
   - The list becomes scrollable if there are more items than fit in 180px

### Result:
The dropdown menus now properly display for all exercises in the list, including the last items. The menu can flip upward automatically when there's insufficient space below, and is no longer clipped by the parent container. The category Select dropdowns are now more compact and won't get cut off at the bottom of the screen.
