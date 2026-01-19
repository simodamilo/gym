# Personal Best Tracking Toggle - Design Documentation

**Date**: 2026-01-19
**Feature**: Exercise Personal Best Tracking Toggle
**Status**: Design Complete - Awaiting Approval
**Designer**: UI Designer Agent

## Overview

This folder contains comprehensive UI/UX design documentation for adding personal best tracking controls to the Exercise Catalog page. The feature allows users to selectively track which exercises should be included in their personal bests calculations.

## Documents in This Folder

### 1. Main Design Recommendation
**File**: `2026-01-19-personal-best-tracking-ui-design.md`

Comprehensive design recommendation covering:
- Current state analysis
- Design approach selection (dual-indicator pattern)
- Detailed rationale for all design decisions
- Alternative designs considered
- Data model changes required
- Accessibility considerations
- Performance implications
- User flow and testing scenarios

**Read this first** for the overall design strategy and decision rationale.

### 2. Component Specification
**File**: `2026-01-19-personal-best-toggle-component-spec.md`

Technical implementation specifications including:
- Complete component code (PersonalBestToggle.tsx)
- Redux integration (actions, reducers, selectors)
- Updated Exercise Card implementation
- Handler functions and error handling
- Animation specifications
- Accessibility checklist
- Testing scenarios
- Performance optimization strategies

**Use this** for implementation with copy-paste ready code examples.

### 3. Visual Mockups
**File**: `2026-01-19-visual-mockups.md`

Detailed visual reference including:
- ASCII art mockups of all states
- Before/after comparisons
- Animation sequence frames
- Color specifications (light and dark mode)
- Spacing and layout measurements
- Touch target specifications
- Accessibility annotations
- Error state visualizations

**Reference this** during implementation for pixel-perfect design accuracy.

## Design Summary

### Recommended Approach: Dual-Indicator Pattern

**Primary Visual Indicator**: Star badge button (always visible on card)
- StarFilled (tracked) in teal color
- StarOutlined (not tracked) in gray
- Positioned between exercise icon and name
- Tappable with immediate visual feedback

**Secondary Control**: Menu toggle option (in existing three-dot menu)
- First item in dropdown menu
- Provides explicit action label
- Consistent with Edit/Delete pattern

### Key Design Decisions

1. **Star Icon**: Universal symbol for favorites/important items
2. **Teal Color**: Consistent with category headers, stands out from brand blue
3. **Position**: Between icon and name for easy vertical scanning
4. **Dual Access**: Star badge AND menu option for maximum discoverability
5. **Animations**: Satisfying scale bounce on activation, smooth transitions

### Visual Impact

```
BEFORE:
┌────────────────────────────────────────┐
│  💪  Bench Press                   ⋮  │
└────────────────────────────────────────┘

AFTER:
┌────────────────────────────────────────┐
│  💪  ★  Bench Press                ⋮  │
└────────────────────────────────────────┘
     ↑
   Clear visual indicator
```

## Implementation Checklist

### Backend Changes
- [ ] Add `tracked_for_personal_best` column to `exercises_catalog` table (boolean, default: true)
- [ ] Create database migration
- [ ] Add index for filtering (optional, for performance)

### Frontend Changes

#### Type Definitions
- [ ] Update `ExerciseCatalog` interface to include `trackedForPersonalBest?: boolean`

#### Redux Store
- [ ] Add `togglePersonalBestTracking` action to `exercisesCatalog.action.ts`
- [ ] Update reducer to handle toggle action
- [ ] Update personal bests filtering to respect tracking preference

#### Components
- [ ] Create `PersonalBestToggle.tsx` component
- [ ] Update `Exercises.tsx` to integrate star badge
- [ ] Add `handleTogglePersonalBest` handler function
- [ ] Update dropdown menu with toggle menu item

#### Testing
- [ ] Test all visual states (default, hover, active, loading, error)
- [ ] Test animations and transitions
- [ ] Test keyboard navigation and accessibility
- [ ] Test dark mode appearance
- [ ] Verify personal bests filtering logic
- [ ] Test error handling and rollback

## Technical Requirements

### Dependencies (Already Available)
- React 19
- Framer Motion (for animations)
- Ant Design (StarFilled, StarOutlined icons)
- Redux Toolkit (for state management)
- Tailwind CSS (for styling)

### No New Dependencies Needed
All required tools are already in the stack.

## Design Principles Applied

1. **Mobile-First**: Large touch targets, thumb-friendly positioning
2. **Visual Clarity**: Clear states, immediate feedback
3. **Accessibility**: Keyboard navigation, screen reader support, WCAG AA compliance
4. **Consistency**: Matches existing design system and patterns
5. **Performance**: Optimistic updates, minimal rerenders
6. **User Delight**: Smooth animations, satisfying interactions

## Files to Create/Modify

### New Files (1)
```
src/pages/exercises/components/PersonalBestToggle.tsx
```

### Modified Files (5)
```
src/pages/exercises/Exercises.tsx
src/store/exercisesCatalog/types.ts
src/store/exercisesCatalog/exercisesCatalog.action.ts
src/store/exercisesCatalog/exercisesCatalog.reducer.ts
src/store/personalBests/personalBests.actions.ts
```

## Accessibility Features

- ✓ Keyboard accessible (tab, enter, space)
- ✓ Screen reader friendly (proper ARIA labels)
- ✓ Focus visible states
- ✓ Color contrast compliant (WCAG AA)
- ✓ Touch targets meet minimum 44x44px
- ✓ Multiple interaction methods (badge + menu)

## Design System Compliance

### Colors Used
- `--accent-teal`: Active star badge (#2DD4BF light, #5EEAD4 dark)
- `--text-tertiary`: Inactive star (#9a9a9a light, #8c8c8c dark)
- `--bg-secondary`: Hover background
- `--brand-primary-light`: Exercise icon background

### Spacing
- `gap-3` (12px): Between elements
- `p-4` (16px): Card padding
- `w-8 h-8` (32px): Star button size

### Components
- Ant Design Dropdown (existing)
- Ant Design Icons: StarFilled, StarOutlined (existing)
- Framer Motion animations (existing)

## Animation Specifications

### Toggle Animation
- **Duration**: 300ms
- **Easing**: easeOut
- **Keyframes**: scale [1, 1.2, 1] (bounce effect)
- **Trigger**: On toggle to tracked state

### Color Transition
- **Duration**: 200ms
- **Easing**: ease-in-out
- **Properties**: color, opacity

### Tap Feedback
- **Scale**: 0.9 (whileTap)
- **Duration**: Instant (native feel)

## Next Steps

### 1. Review and Approval
- [ ] Review main design document
- [ ] Review visual mockups
- [ ] Provide feedback or approve design
- [ ] Confirm implementation approach

### 2. Implementation Planning
- [ ] Estimate implementation time
- [ ] Plan database migration
- [ ] Coordinate with backend (if separate team)
- [ ] Schedule development sprint

### 3. Development
- [ ] Backend: Database schema changes
- [ ] Frontend: Component development
- [ ] Integration: Connect UI to Redux/API
- [ ] Testing: All scenarios and states

### 4. Quality Assurance
- [ ] Visual QA (match mockups)
- [ ] Functional testing
- [ ] Accessibility audit
- [ ] Cross-browser/device testing
- [ ] Performance testing

### 5. Deployment
- [ ] Staging deployment
- [ ] User acceptance testing
- [ ] Production deployment
- [ ] Monitor for issues

## Questions for Product Team

Before implementation begins, consider:

1. **Default State**: Should all existing exercises be tracked by default, or untracked?
   - Recommendation: Default to `true` (tracked) to maintain current behavior

2. **Bulk Actions**: Do we want bulk toggle functionality in v1 or save for v2?
   - Recommendation: V2 feature (keep v1 simple)

3. **Onboarding**: Should we show a tooltip or walkthrough on first use?
   - Recommendation: Simple tooltip on first star tap

4. **Notifications**: Toast notifications for every toggle, or silent updates?
   - Recommendation: Silent updates (cleaner UX), toast only on errors

5. **Migration**: How to handle exercises created before this feature?
   - Recommendation: Default all existing to `tracked: true`

## Success Metrics

Post-implementation, track:
- % of users who discover and use the toggle
- Average number of exercises tracked per user
- Reduction in "irrelevant" personal bests
- User feedback on feature usefulness
- Accessibility compliance audit results

## Design Files

All design specifications are in markdown format for easy version control and review. No external design tools (Figma, Sketch) required for this feature as the design system is well-established.

For pixel-perfect implementation, reference:
- Component spec for exact code
- Visual mockups for exact measurements and states
- Main design doc for rationale and context

## Contact

For questions about this design:
- Design decisions: Reference main design document
- Implementation details: Reference component specification
- Visual specifications: Reference visual mockups document

## Version History

- **v1.0** (2026-01-19): Initial design documentation
  - Dual-indicator approach
  - Complete component specification
  - Visual mockups for all states
  - Accessibility considerations
  - Implementation checklist

## Related Features

This design integrates with:
- **Personal Bests** (Profile page): Will filter based on tracking preference
- **Exercise Catalog**: Core integration point
- **Workout System**: Uses exercises that may be tracked
- **Progress Tracking**: Connects to personal best calculations

## Design Philosophy

This feature exemplifies:
- **User Control**: Give users control over their data
- **Visual Communication**: Make states immediately visible
- **Progressive Disclosure**: Simple by default, powerful when needed
- **Consistency**: Leverage existing patterns and design system
- **Accessibility**: Design for all users from the start

---

**Ready to proceed?** Review the three documents, provide feedback, and approve to begin implementation.

The design is comprehensive, well-reasoned, and ready for development. All technical specifications, visual references, and implementation details are documented and ready to use.
