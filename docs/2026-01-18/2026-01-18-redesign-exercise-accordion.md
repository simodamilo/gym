# Redesign Exercise Accordion Content - Modern & Minimal UI

**Date:** 2026-01-18
**Component:** `CreateExercisesList` / `ExerciseContent`
**Type:** UI Redesign

## Objective

Redesign the accordion content in the CreateExercisesList component with a modern, minimal aesthetic while maintaining all existing functionality.

## Current State Analysis

### Visual Issues Identified
1. **Heavy borders and backgrounds**: The current design uses prominent borders and elevated backgrounds that create visual clutter
2. **Inconsistent spacing**: Gaps between elements are not harmonious (mix of 2, 3, 4 spacing units)
3. **Flat hierarchy**: All elements have similar visual weight, making it hard to scan
4. **Dense layout**: Components feel cramped, especially the reps type selector with +/- buttons
5. **Button styling**: Delete and Save buttons lack visual distinction

### Current Features (Must Maintain)
- Accordion expand/collapse
- "Superset with next exercise" checkbox
- Exercise name input (dual select: category + exercise)
- "Select the type of reps" dropdown with +/- controls
- Dynamic set inputs based on reps type
- Initial/Rest/Add tabs section
- Note input field (TextArea)
- Delete and Save buttons
- Drag handle icon when in reorder mode

## Proposed Redesign

### Design Principles
1. **Breathing Room**: Increase spacing for better readability
2. **Subtle Hierarchy**: Use subtle visual cues (font weight, size, color) instead of heavy borders
3. **Cleaner Inputs**: Remove unnecessary borders, use minimal backgrounds
4. **Better Grouping**: Visual grouping of related elements
5. **Refined Interactions**: Smoother hover states and transitions

### Visual Changes

#### 1. Superset Checkbox
- Move to top with better spacing
- Lighter font weight for secondary information
- More subtle checkbox styling

#### 2. Exercise Selects
- Remove individual backgrounds
- Cleaner dropdown appearance
- Better placeholder text styling

#### 3. Reps Type Section
**Current**: Border box with dropdown + +/- buttons side by side
**New**:
- Remove heavy border, use subtle background
- Better visual separation between dropdown and controls
- Larger touch targets for +/- buttons
- Rounded corners for modern feel
- Icon-only buttons with hover states

#### 4. Sets Input Section
- Cleaner input styling with less visual weight
- Better alignment between set number and input
- Consistent spacing between sets
- Subtle hover states

#### 5. Rest/Initial Section
**Current**: Horizontal layout with Initial tooltip + Rest input
**New**:
- Maintain horizontal layout but improve spacing
- Better visual balance
- Cleaner input styling
- More prominent tooltip hint

#### 6. Notes TextArea
- Less prominent border
- Better placeholder styling
- Consistent with overall minimal aesthetic

#### 7. Action Buttons
**Current**: Small delete icon + full width save button
**New**:
- Better visual hierarchy (delete = subtle, save = prominent)
- Improved spacing between buttons
- Clear primary/secondary distinction

### Technical Implementation

#### Files to Modify
1. `src/pages/workouts/components/exerciseContent/ExerciseContent.tsx`
   - Update component JSX structure
   - Refine Tailwind classes for spacing and layout
   - Improve visual hierarchy with subtle changes

2. `src/styles/antd/collapse.scss` (possibly)
   - May need minor adjustments to accordion content padding

#### CSS/Styling Changes
- Use Tailwind utility classes for spacing: `gap-3`, `gap-4`, `gap-5`, `gap-6`
- Leverage CSS custom properties: `var(--bg-secondary)`, `var(--text-secondary)`, etc.
- Add subtle hover states: `hover:bg-bg-secondary`, `hover:border-border-default`
- Use consistent border radius: `rounded-lg`, `rounded-md`
- Improve shadow usage: `shadow-sm` for subtle elevation

#### Component Structure Changes
- Better semantic grouping with wrapper divs
- Improved flex layouts for better alignment
- Consistent padding/margin patterns
- Better responsive behavior

### Design Tokens to Use
From `src/index.css`:
- Background: `var(--bg-primary)`, `var(--bg-secondary)`, `var(--bg-elevated)`
- Text: `var(--text-primary)`, `var(--text-secondary)`, `var(--text-tertiary)`
- Border: `var(--border-light)`, `var(--border-default)`
- Brand: `var(--brand-primary)`, `var(--brand-primary-hover)`
- Shadows: `var(--shadow-sm)`, `var(--shadow-md)`

### Key Improvements
1. **Reduced visual noise**: Less borders, cleaner backgrounds
2. **Better spacing rhythm**: Consistent 4px/8px/12px/16px/24px spacing scale
3. **Improved readability**: Better font sizes and weights
4. **Smoother interactions**: Subtle hover states and transitions
5. **Modern aesthetic**: Rounded corners, subtle shadows, clean lines
6. **Dark mode ready**: Using CSS custom properties ensures compatibility

## Implementation Plan

1. Update `ExerciseContent.tsx` component
2. Test all functionality remains intact
3. Verify visual consistency across light/dark modes
4. Test on mobile and desktop viewports
5. Ensure accessibility (focus states, touch targets)

## Success Criteria

- All existing functionality works exactly as before
- Visual design is cleaner and more modern
- Spacing is consistent and harmonious
- Component feels less cluttered
- Better visual hierarchy guides user attention
- Maintains design system consistency
- Works in both light and dark modes
- No performance regressions
