# ExerciseContent Component Redesign

**Date**: 2026-01-17
**Task**: Redesign ExerciseContent component to match established design system with dark theme support

## Current Issues

1. Hardcoded background color `bg-[#ededed]` (light gray) - doesn't support dark theme
2. Mix of inline styles and Tailwind classes
3. Hardcoded border color `border-[#EDEDED]`
4. No visual hierarchy or polish
5. Basic styling without proper spacing
6. Ant Design components not properly styled for dark theme
7. No spacing between collapsed exercise items in parent Collapse component

## Design Requirements

### Remove All Hardcoded Colors
- Replace `bg-[#ededed]` with CSS variables
- Replace `border-[#EDEDED]` with CSS variables
- Remove all inline color styles

### Apply Dark Theme Properly
Use CSS variables from `src/index.css`:
- `var(--bg-primary)` - #1f1f1f (dark) / #ffffff (light)
- `var(--bg-secondary)` - #262626 (dark) / #fafafa (light)
- `var(--bg-tertiary)` - #434343 (dark) / #f5f5f5 (light)
- `var(--bg-elevated)` - #262626 (dark) / #ffffff (light)
- `var(--text-primary)` - #fafafa (dark) / #262626 (light)
- `var(--text-secondary)` - #d9d9d9 (dark) / #595959 (light)
- `var(--text-tertiary)` - #8c8c8c (both modes)
- `var(--border-light)` - #434343 (dark) / #f0f0f0 (light)
- `var(--border-default)` - #595959 (dark) / #d9d9d9 (light)

### Visual Hierarchy Improvements

1. **Card-based sections** for better organization:
   - Sets section: Use elevated card with proper shadows
   - Rest time & initial weight: Group in a row
   - Notes: Standalone section

2. **Spacing**:
   - Outer container: `gap-4` (already in place)
   - Sets container: `gap-2` between set inputs
   - Actions row: `gap-2` between buttons

3. **Borders & Shadows**:
   - Use `var(--shadow-sm)` for subtle elevation
   - Rounded corners: `rounded-lg` for cards
   - Border: `border border-[var(--border-light)]`

### Component Styling

1. **Checkbox** (Superset):
   - Already using Ant Design component
   - Add proper text color via inline style

2. **ExerciseSelects**:
   - Already a custom component
   - Should inherit dark theme styling

3. **Sets Section** (the gray box):
   - Replace `bg-[#ededed]` with `bg-[var(--bg-elevated)]`
   - Add shadow: `shadow-sm`
   - Add border: `border border-[var(--border-light)]`
   - Increase border radius: `rounded-lg`

4. **Select** (Reps Type):
   - Uses Ant Design Select
   - Should inherit theme from SCSS

5. **Input** components:
   - Uses Ant Design Input
   - Should inherit theme from SCSS
   - Remove hardcoded font size, use SCSS override

6. **TextArea**:
   - Uses Ant Design TextArea
   - Should inherit theme from SCSS

7. **Tooltip** (Initial weight):
   - Replace `border-[#EDEDED]` with `border-[var(--border-light)]`
   - Add text color: `style={{ color: 'var(--text-secondary)' }}`

8. **InfoCircleOutlined**:
   - Add color: `style={{ color: 'var(--text-tertiary)' }}`

9. **IconButton & Button**:
   - Already using custom components with proper styling
   - No changes needed

### Spacing Between Exercises in Collapse

In `CreateExercisesList.component.tsx`:
- Wrap each Collapse in a container with margin-bottom
- Use `mb-3` or `mb-4` for consistent spacing
- Apply to both drag mode and normal mode

## Implementation Plan

### 1. Update ExerciseContent.tsx

**Changes to make**:

1. Line 156-158: Checkbox - add text color
2. Line 173: Sets container - replace hardcoded bg with CSS variables and add shadow/border
3. Line 275: Tooltip container - replace hardcoded border with CSS variable
4. Line 296: InfoCircleOutlined - add color

### 2. Update CreateExercisesList.component.tsx

**Changes to make**:

1. Lines 227-236: Wrap SortableItem Collapse in a container with `mb-3`
2. Lines 248-256: Wrap SortableItem Collapse in a container with `mb-3`

### 3. Enhance Ant Design Dark Theme Support (if needed)

Check if `src/styles/antd/input.scss` needs updates for:
- Input background colors
- Select background colors
- TextArea background colors
- Addon background colors

## Expected Outcome

- Fully dark theme compatible ExerciseContent component
- No hardcoded colors anywhere
- Proper visual hierarchy with card-based sections
- Consistent spacing between exercise items in the list
- Polished appearance matching IconButton/Button design language
- Better contrast and readability in both light and dark modes

## Files to Modify

1. `src/pages/workouts/components/exerciseContent/ExerciseContent.tsx` - Main redesign
2. `src/pages/workouts/create/CreateExercisesList.component.tsx` - Add spacing
3. `src/styles/antd/input.scss` - Enhance dark theme support (if needed)

## Design Tokens Used

- Background: `--bg-elevated`, `--bg-tertiary`
- Text: `--text-primary`, `--text-secondary`, `--text-tertiary`
- Border: `--border-light`, `--border-default`
- Shadow: `--shadow-sm`
- Brand: `--brand-primary` (for any accent colors)
