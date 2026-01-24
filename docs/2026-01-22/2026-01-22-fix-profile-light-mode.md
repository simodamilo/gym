# Fix Profile Page Light Mode Support

**Date:** 2026-01-22
**Task:** Fix profile page components to properly support both light and dark modes

## Problem Statement

The profile page components are using hardcoded dark mode colors that don't adapt to light mode, making them difficult to read and visually inconsistent with the rest of the application.

### Current Issues

1. **ProfileHeader.tsx**
   - Hardcoded `from-neutral-900 to-neutral-800` gradient (only shows dark variant)
   - Text hardcoded to `text-white`
   - Border using `border-white/20`
   - Button using `text-white hover:bg-white/10`

2. **WorkoutStatsCard.tsx**
   - Hardcoded `from-neutral-900 to-neutral-800` gradient
   - Text colors: `text-neutral-400` and `text-white`

3. **BodyWeightChart.tsx**
   - Hardcoded `from-neutral-900 to-neutral-800` gradient
   - Text colors: `text-white` for title and weight
   - Button: `text-white hover:bg-white/10`
   - Chart axis colors: hardcoded `#6B7280`
   - Chart tooltip: `bg-black/90 text-white`
   - Green accent works but needs verification

4. **PersonalBests.tsx**
   - Hardcoded `from-neutral-900 to-neutral-800` gradient
   - Text colors: `text-neutral-400`, `text-white`, `text-neutral-500`, `text-red-500`
   - Border: `border-neutral-700/50`
   - Badge: `bg-purple-500/20 text-purple-400` (may work but needs verification)

## Solution Approach

### Design System Usage

The application already has a comprehensive CSS variable system defined in `src/index.css`:

**Light Mode Variables:**
- Backgrounds: `--bg-elevated` (#ffffff), `--bg-primary` (#f5f5f7), `--bg-secondary` (#e8e8ed), `--bg-tertiary` (#d1d1d6)
- Text: `--text-primary` (#1a1a1a), `--text-secondary` (#6b6b6b), `--text-tertiary` (#9a9a9a)
- Borders: `--border-light` (#e0e0e5), `--border-default` (#c7c7cc), `--border-strong` (#8e8e93)
- Semantic: `--semantic-success` (#52c41a)
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`

**Dark Mode Variables:**
- Backgrounds: `--bg-elevated` (#262626), `--bg-primary` (#1f1f1f), `--bg-secondary` (#262626), `--bg-tertiary` (#434343)
- Text: `--text-primary` (#fafafa), `--text-secondary` (#d9d9d9), `--text-tertiary` (#8c8c8c)
- Borders: `--border-light` (#434343), `--border-default` (#595959), `--border-strong` (#8c8c8c)
- Semantic: `--semantic-success` (#73d13d)
- Shadows: automatically adjusted

### Implementation Strategy

Replace hardcoded colors with either:
1. **CSS Variables** (preferred): `bg-[var(--bg-elevated)]`, `text-[var(--text-primary)]`
2. **Tailwind Dark Mode Classes**: `bg-white dark:bg-neutral-900`, `text-neutral-900 dark:text-white`

For this task, I'll use **CSS variables** to maintain consistency with the existing codebase (see `ItemCard.tsx` as reference).

### Color Mapping

| Current (Dark Only) | Light Mode | Dark Mode | Implementation |
|-------------------|-----------|-----------|---------------|
| `from-neutral-900 to-neutral-800` | `bg-[var(--bg-elevated)]` | Automatic | CSS var |
| `text-white` | `text-[var(--text-primary)]` | Automatic | CSS var |
| `text-neutral-400` | `text-[var(--text-secondary)]` | Automatic | CSS var |
| `text-neutral-500` | `text-[var(--text-tertiary)]` | Automatic | CSS var |
| `border-white/20` | `border-[var(--border-light)]` | Automatic | CSS var |
| `border-neutral-700/50` | `border-[var(--border-default)]` | Automatic | CSS var |
| Chart axis `#6B7280` | JS: `var(--text-tertiary)` | Automatic | Computed style |
| Tooltip `bg-black/90` | `bg-[var(--bg-elevated)]` | Automatic | CSS var |
| Buttons `text-white` | `text-[var(--text-primary)]` | Automatic | CSS var |
| Buttons `hover:bg-white/10` | `hover:bg-[var(--bg-tertiary)]` | Automatic | CSS var |

### Chart Color Adaptation

For Recharts components:
- Read CSS variable values using `getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary')`
- Pass these as props to axis and tooltip components
- Ensure tooltip background uses `var(--bg-elevated)` with proper border

### Files to Modify

1. **ProfileHeader.tsx**
   - Replace gradient with `bg-[var(--bg-elevated)]`
   - Replace text colors with `text-[var(--text-primary)]`
   - Update border to `border-[var(--border-light)]`
   - Fix button colors

2. **WorkoutStatsCard.tsx**
   - Replace gradient with `bg-[var(--bg-elevated)]`
   - Replace text colors with appropriate CSS variables
   - Add subtle shadow: `shadow-var-md`

3. **BodyWeightChart.tsx**
   - Replace gradient with `bg-[var(--bg-elevated)]`
   - Update all text colors
   - Compute axis colors from CSS variables
   - Fix tooltip styling
   - Fix button colors

4. **PersonalBests.tsx**
   - Replace gradient with `bg-[var(--bg-elevated)]`
   - Update all text colors
   - Fix border colors
   - Verify badge colors work in both modes

## Design Specifications

### Visual Hierarchy (Both Modes)

1. **Card Backgrounds:** Clean, elevated surfaces that stand out from the page background
   - Light: Pure white cards on light gray background
   - Dark: Dark gray cards on darker background

2. **Text Hierarchy:**
   - Primary text (titles, values): High contrast, most readable
   - Secondary text (labels): Medium contrast
   - Tertiary text (hints, disabled): Low contrast

3. **Interactive Elements:**
   - Clear hover states
   - Consistent button styling
   - Proper focus indicators

4. **Borders and Dividers:**
   - Subtle but visible in both modes
   - Consistent thickness and opacity

### Accessibility Requirements

- Maintain WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Ensure all interactive elements have visible focus states
- Verify chart readability in both modes
- Test with screen readers (semantic HTML)

### Brand Consistency

- Keep green accent (#10B981 light / #73d13d dark) for success states
- Maintain purple gradient for add button
- Preserve visual weight and spacing
- Consistent border radius (rounded-2xl = 20px)

## Testing Checklist

After implementation, verify:

- [ ] All text is readable in light mode
- [ ] All text is readable in dark mode
- [ ] Cards have proper elevation/depth in both modes
- [ ] Charts display correctly in both modes
- [ ] Hover states work in both modes
- [ ] Borders are visible but subtle in both modes
- [ ] No hardcoded dark colors remain
- [ ] Consistent with rest of application design
- [ ] Smooth transitions when switching modes
- [ ] Touch targets are adequate (minimum 44x44px)

## Expected Outcome

Profile page components will seamlessly adapt between light and dark modes, maintaining visual consistency with the rest of the application while ensuring excellent readability and accessibility in both modes.

## Implementation Summary

All four profile components have been successfully updated to support both light and dark modes:

### 1. ProfileHeader.tsx
- **Background**: Changed from hardcoded gradient to `bg-[var(--bg-elevated)]` with `shadow-var-md`
- **Avatar border**: Updated to `border-[var(--border-light)]`
- **Username text**: Changed to `text-[var(--text-primary)]`
- **Settings button**: Updated to `text-[var(--text-primary)]` with `hover:bg-[var(--bg-tertiary)]`

### 2. WorkoutStatsCard.tsx
- **Background**: Changed from hardcoded gradient to `bg-[var(--bg-elevated)]` with `shadow-var-md`
- **Label text**: Changed to `text-[var(--text-secondary)]`
- **Count text**: Changed to `text-[var(--text-primary)]`

### 3. BodyWeightChart.tsx
- **Background**: Changed from hardcoded gradient to `bg-[var(--bg-elevated)]` with `shadow-var-md`
- **Title text**: Changed to `text-[var(--semantic-success)]`
- **Weight text**: Changed to `text-[var(--text-primary)]`
- **Edit button**: Updated to `text-[var(--text-primary)]` with `hover:bg-[var(--bg-tertiary)]`
- **Chart axis colors**: Dynamically computed from `--text-tertiary` CSS variable using `getComputedStyle()`
- **Chart line**: Uses `var(--semantic-success)` for adaptive green color
- **Tooltip**: Dynamically styled using `--bg-elevated`, `--text-primary`, and `--border-default` CSS variables
- **Theme observer**: Added MutationObserver to update chart colors when theme changes

### 4. PersonalBests.tsx
- **Background**: Changed from hardcoded gradient to `bg-[var(--bg-elevated)]` with `shadow-var-md`
- **Header text**: Changed to `text-[var(--text-secondary)]`
- **Loading/Empty text**: Changed to `text-[var(--text-tertiary)]`
- **Exercise names**: Changed to `text-[var(--text-primary)]`
- **Weight values**: Changed to `text-[var(--text-primary)]`
- **Borders**: Updated to `border-[var(--border-default)]`
- **Add button gradient**: Kept as-is (purple/blue gradient works in both modes)
- **Manual badge**: Kept as-is (purple badge works in both modes)

### Technical Details

All components now use the CSS variable system defined in `src/index.css` which provides:
- **Light mode**: White elevated cards, dark text, subtle borders
- **Dark mode**: Dark gray elevated cards, light text, stronger borders
- **Shadows**: Adaptive shadow system that works in both modes
- **Semantic colors**: Green success color that adapts to both modes

The BodyWeightChart component includes a sophisticated color computation system that:
1. Reads CSS variables on mount
2. Watches for theme changes using MutationObserver
3. Updates Recharts components dynamically
4. Ensures tooltips and axes always match the current theme

### Important: Tailwind Arbitrary Value Syntax

**Key Learning**: The correct approach is to use Tailwind's arbitrary value syntax with CSS variables, matching the pattern used in `ItemCard.tsx`:

- `bg-[var(--bg-elevated)]` for backgrounds
- `text-[var(--text-primary)]` for primary text
- `text-[var(--text-secondary)]` for secondary text
- `text-[var(--text-tertiary)]` for tertiary text
- `border-[var(--border-light)]` for light borders
- `border-[var(--border-default)]` for default borders
- `hover:bg-[var(--bg-tertiary)]` for hover states
- `text-[var(--semantic-success)]` for success color

While the Tailwind config defines color names like `'bg-elevated': 'var(--bg-elevated)'`, these don't work as utility classes (e.g., `bg-bg-elevated` doesn't work). Instead, we use the arbitrary value syntax `[var(--variable-name)]` which Tailwind supports natively.

## Additional Task: Fix Accordion Components Light Mode

### Problem
All accordion (Collapse) components were showing gray backgrounds in light mode instead of white card-style backgrounds.

### Solution
Created a unified `.history-exercises-collapse` CSS class in `src/styles/antd/collapse.scss` that applies card styling to all accordions:

- Individual items styled as cards with `var(--bg-elevated)` background
- Proper borders using `var(--border-default)`
- 16px border radius for rounded corners
- 12px margin between items
- Seamless content integration with top border separator
- Hover effects using `var(--bg-secondary)`

### Files Updated

1. **src/styles/antd/collapse.scss** - Added `.history-exercises-collapse` styles
2. **src/pages/workouts/history/components/HistoryExercisesList.tsx** - Added className
3. **src/pages/workouts/current/components/CurrentExercisesList.tsx** - Added className
4. **src/pages/workouts/create/components/CreateExercisesList.component.tsx** - Added className (2 instances)

All accordion components now display as white cards in light mode and dark cards in dark mode, properly adapting to the theme.
