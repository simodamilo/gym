# Bottom Navigation Bar - Active State Visual Design

**Date**: 2026-01-19
**Task**: Fix missing visual distinction for active/selected state in bottom navigation bar

## Problem Analysis

The bottom navigation bar currently has logic to track the active state (lines 28-40 in BottomBar.tsx), but the visual design doesn't provide enough distinction between active and inactive states.

Current styling:
- **Active state**: `bg-bg-secondary` background + `text-brand-primary` color
- **Inactive state**: `bg-transparent` background + `text-text-tertiary` color

Looking at the reference image, the visual difference is minimal due to:
1. The `bg-bg-secondary` color is very subtle against the `bg-bg-elevated/95` container background
2. The text/icon color change from tertiary gray to brand primary exists but needs more emphasis
3. No additional visual indicators (underline, glow, scale, etc.)

## Design Solution

I will enhance the active state visual design with the following improvements:

### 1. Stronger Color Contrast
- Keep the `text-brand-primary` for active icons and labels
- Keep `text-text-tertiary` for inactive items
- Add a more prominent background treatment

### 2. Visual Indicator Options (will implement the most suitable one)

**Option A - Subtle Glow/Shadow** (RECOMMENDED)
- Add a subtle box-shadow with brand color glow on active items
- Slightly increase icon size for active state
- Keep the rounded background with better contrast

**Option B - Bottom Indicator**
- Add a small indicator bar at the bottom of active items
- Similar to Material Design bottom navigation pattern

**Option C - Background Pill**
- Use a more prominent background color for active state
- Potentially add a subtle gradient

I will implement **Option A** as it:
- Matches the modern, elevated design system already in use
- Works well with the existing framer-motion animations
- Maintains accessibility with clear contrast
- Aligns with the glassmorphic design language (backdrop-blur, elevated surfaces)

### 3. Implementation Details

**File to modify**: `C:\Users\simod\Desktop\Projects\gym\src\components\navigation\BottomBar.tsx`

**Changes**:
1. Update the active state classes on line 92:
   - Add a more visible background color or gradient
   - Add shadow/glow effect using Tailwind classes
   - Increase icon scale slightly

2. Enhance transition smoothness (line 96-97):
   - Add transition for background and shadow
   - Ensure smooth animation between states

**Specific Tailwind Classes to Use**:
- Background: `bg-brand-primary/10` or `bg-gradient-to-br from-brand-primary/15 to-brand-primary/5`
- Shadow: `shadow-[0_0_12px_rgba(22,119,255,0.25)]` for brand glow
- Icon size: Increase from `text-xl` to `text-2xl` for active state
- Transition: Add `transition-all duration-200` to smooth all property changes

### 4. Accessibility Considerations

- Ensure color contrast meets WCAG 2.1 AA standards (4.5:1 for text)
- The brand primary color (#1677ff in light mode, #4096ff in dark mode) already has good contrast
- The visual glow/shadow adds additional non-color-based differentiation
- Screen readers will still rely on aria-current or similar attributes (to be verified in routing)

### 5. Testing Checklist

After implementation:
- [ ] Visual distinction is immediately clear in both light and dark modes
- [ ] Animation transitions smoothly between states
- [ ] Active state is visible in the reference scenario (appears to be dark mode)
- [ ] No performance issues with shadow rendering
- [ ] Hover and tap animations still work correctly with framer-motion
- [ ] Responsive behavior maintained

## Files to Modify

1. `C:\Users\simod\Desktop\Projects\gym\src\components\navigation\BottomBar.tsx`
   - Lines 92-98: Update active state styling
   - Enhance visual distinction while maintaining existing animation logic

## Design System Alignment

The solution will use:
- Existing CSS variables: `--brand-primary`, `--text-tertiary`, `--bg-elevated`
- Tailwind utility classes only (no CSS modules or inline styles)
- Framer-motion animations already in place
- Design tokens from tailwind.config.ts

## Implementation Approach

1. Modify the motion.div className on line 92-93
2. Adjust icon and text styling on lines 96-97
3. Test visual appearance in both light and dark modes
4. Verify smooth transitions and animations
