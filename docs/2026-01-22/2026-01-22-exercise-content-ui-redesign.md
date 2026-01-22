# ExerciseContent UI Redesign

**Date**: 2026-01-22
**Component**: `src/pages/workouts/components/exerciseContent/ExerciseContent.tsx`
**Status**: Awaiting Approval

## Problem Analysis

Based on the screenshot reference and current code review, the ExerciseContent component has several visual design issues:

### Current Issues

1. **Poor Color Contrast**
   - Input fields use `--bg-elevated` (#262626 in dark mode) which is too dark
   - Set number badges (e.g., "1") and input content blend into dark backgrounds
   - The addon prefixes ("Kg", "Rest") are hard to read against dark backgrounds
   - Text inputs have insufficient contrast ratio (fails WCAG AA)

2. **Lack of Visual Hierarchy**
   - All sections use similar background colors (`--bg-elevated`)
   - No clear separation between sets container, Initial/Rest section, and notes
   - Everything appears at the same visual weight

3. **Input Field Visibility**
   - Current inputs: dark text on dark background with subtle borders
   - Set number addons blend in with input fields
   - "Add a note" textarea is barely visible (same dark background)

4. **Initial & Rest Section**
   - "Initial" button and "Rest" input use identical styling
   - No visual distinction between informational button vs. editable input
   - Section lacks prominence

5. **General UX Issues**
   - Cramped spacing between elements
   - Insufficient touch targets for mobile
   - Hard to scan and identify different sections quickly

## Design Solution

### Color & Contrast Improvements

1. **Input Fields - Enhanced Visibility**
   - Use lighter background for inputs: `--bg-primary` (#1f1f1f) instead of `--bg-elevated`
   - Increase border opacity and weight
   - Make addon backgrounds more distinct with `--bg-tertiary` (#434343)
   - Ensure text meets WCAG AA contrast (4.5:1 minimum)

2. **Sets Container - Card Elevation**
   - Keep rounded-xl design but add stronger border
   - Use subtle shadow for depth: `shadow-sm`
   - Maintain `--bg-elevated` background to separate from page background

3. **Initial & Rest Section - Visual Distinction**
   - Make "Initial" button more prominent with accent color hint
   - Add icon to "Initial" tooltip button for clarity
   - Ensure "Rest" input stands out as editable field

4. **Notes Textarea - Improved Discoverability**
   - Add placeholder visibility with better contrast
   - Use focus states with brand color
   - Add subtle background differentiation

### Visual Hierarchy Enhancements

1. **Spacing System**
   - Increase gap between major sections from `gap-3` (12px) to `gap-4` (16px)
   - Add more padding within the sets container
   - Ensure minimum 44px touch targets for interactive elements

2. **Section Differentiation**
   - Sets container: Elevated card with border and shadow
   - Initial/Rest: Horizontal layout with distinct button and input styling
   - Notes: Lighter background with focus ring
   - Action buttons: Clear visual separation with proper spacing

3. **Typography Scale**
   - Maintain 14px (text-sm) for inputs to prevent iOS zoom
   - Use font-medium for labels and addons
   - Ensure proper line-height for readability

### Interaction States

1. **Focus States**
   - Brand color ring for all interactive inputs
   - Smooth transitions (200ms)
   - Clear visual feedback

2. **Disabled States**
   - Maintain 30% opacity for disabled buttons
   - Show cursor-not-allowed
   - Reduce interaction affordance

3. **Hover States**
   - Subtle background color shift for buttons
   - Border color change for inputs
   - Consistent duration-200 transitions

## Implementation Plan

### Files to Modify

1. **ExerciseContent.tsx** (Primary file)
   - Update Tailwind classes for all input components
   - Adjust spacing and layout
   - Enhance button and input styling
   - Add focus and hover states

2. **input.scss** (Ant Design overrides)
   - Customize Input and Select component styles
   - Ensure addon backgrounds meet contrast requirements
   - Style focus rings and borders

### Specific Changes

#### 1. Sets Container (Lines 232-301)
```tsx
// Before:
className="flex flex-col gap-3 rounded-xl p-4 bg-[var(--bg-elevated)] border border-[var(--border-light)]"

// After:
className="flex flex-col gap-4 rounded-xl p-5 bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm"
```

#### 2. Input Fields
- Add custom classes for better contrast
- Update addon styling in SCSS
- Ensure proper focus states

#### 3. Initial & Rest Section (Lines 304-347)
- Enhance "Initial" button with icon and better styling
- Improve "Rest" input visibility
- Add proper spacing and alignment

#### 4. Notes Textarea (Lines 350-368)
- Lighter background for better visibility
- Enhanced placeholder contrast
- Add focus ring styles

#### 5. Component-wide Spacing
- Increase outer container gap from `gap-5` to `gap-6`
- Add more breathing room between sections

### Ant Design SCSS Customization

Create enhanced styles for inputs in `input.scss`:

```scss
// Enhanced input addon styling
.ant-input-group-addon {
  background-color: var(--bg-tertiary) !important;
  border-color: var(--border-default) !important;
  color: var(--text-primary) !important;
  font-weight: 500;
}

// Input field contrast
.ant-input {
  background-color: var(--bg-primary) !important;
  border-color: var(--border-default) !important;
  color: var(--text-primary) !important;
}

// Focus states
.ant-input:focus,
.ant-input-focused {
  border-color: var(--brand-primary) !important;
  box-shadow: 0 0 0 2px rgba(var(--brand-primary-rgb), 0.1) !important;
}
```

## Accessibility Considerations

1. **WCAG AA Compliance**
   - All text meets 4.5:1 contrast ratio minimum
   - Interactive elements have 3:1 contrast
   - Focus indicators are clearly visible

2. **Touch Targets**
   - Minimum 44x44px for all interactive elements
   - Adequate spacing between touch targets

3. **Keyboard Navigation**
   - Proper focus ring visibility
   - Logical tab order maintained

4. **Screen Reader Support**
   - Maintain semantic HTML structure
   - Preserve aria-labels and roles

## Testing Checklist

- [ ] Verify contrast ratios using browser dev tools
- [ ] Test all interaction states (hover, focus, disabled)
- [ ] Validate on mobile viewport (touch targets)
- [ ] Test with keyboard navigation
- [ ] Verify in draft, current, and history modes
- [ ] Check dark mode appearance
- [ ] Validate against design system consistency

## Expected Outcomes

1. **Improved Readability**
   - Clear distinction between interactive and static elements
   - Easy to scan and identify different sections
   - Better text-to-background contrast

2. **Enhanced Visual Hierarchy**
   - Sets stand out as primary content
   - Supporting elements (Initial, Rest, Notes) are clearly secondary
   - Action buttons have proper visual weight

3. **Better UX**
   - More intuitive interaction affordances
   - Larger touch targets for mobile
   - Smoother, more polished feel

4. **WCAG Compliance**
   - Meets AA level for contrast
   - Accessible to users with visual impairments
   - Improved keyboard navigation visibility

## Notes

- All changes use only Tailwind CSS classes (no inline styles or CSS modules)
- Maintains existing functionality and props interface
- Compatible with all three modes: draft, current, and history
- Follows the existing design system color variables
- Uses Ant Design components with custom SCSS overrides
