# Personal Best Toggle - Visual Mockups

**Date**: 2026-01-19
**Feature**: Personal Best Tracking Toggle
**Document Type**: Visual Design Reference

## Exercise Card - Visual States

### Default State (Exercise Not Tracked)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌────┐  ┌────┐                                        ┌────┐ │
│   │ 💪 │  │ ☆  │  Bench Press                          │ ⋮  │ │
│   │    │  │    │  [font-semibold, text-primary]        │    │ │
│   └────┘  └────┘                                        └────┘ │
│   40x40   32x32                                         32x32  │
│   [icon]  [star]  [exercise name]                      [menu]  │
│                                                                 │
│   Colors:                                                       │
│   - Icon bg: --brand-primary-light (#e6f4ff)                   │
│   - Icon: --brand-primary (#1677ff)                            │
│   - Star: --text-tertiary (#9a9a9a) ← GRAY/INACTIVE           │
│   - Text: --text-primary (#1a1a1a)                            │
│   - Card: --bg-elevated (#ffffff)                              │
│   - Border: --border-light (#e0e0e5)                           │
│   - Shadow: --shadow-sm (subtle)                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tracked State (Exercise Being Tracked)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌────┐  ┌────┐                                        ┌────┐ │
│   │ 💪 │  │ ★  │  Bench Press                          │ ⋮  │ │
│   │    │  │    │  [font-semibold, text-primary]        │    │ │
│   └────┘  └────┘                                        └────┘ │
│   40x40   32x32                                         32x32  │
│                                                                 │
│   Colors:                                                       │
│   - Star: --accent-teal (#2DD4BF) ← FILLED, TEAL COLOR        │
│   - Animation: Scale [1 → 1.2 → 1] on toggle (300ms)          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Hover State (Not Tracked)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌────┐  ┌────┐                                        ┌────┐ │
│   │ 💪 │  │ ☆  │  Bench Press                          │ ⋮  │ │
│   │    │  │ ↑  │  [font-semibold, text-primary]        │    │ │
│   └────┘  └────┘                                        └────┘ │
│           [hover bg]                                            │
│                                                                 │
│   Hover Effects:                                                │
│   - Star bg: --bg-secondary (#e8e8ed)                          │
│   - Star color: --accent-teal (#2DD4BF) ← PREVIEW TEAL        │
│   - Border radius: 8px (rounded-lg)                            │
│   - Transition: all 200ms ease-in-out                          │
│   - Cursor: pointer                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Loading State

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌────┐  ┌────┐                                        ┌────┐ │
│   │ 💪 │  │ ◐  │  Bench Press                          │ ⋮  │ │
│   │    │  │ ↻  │  [font-semibold, text-primary]        │    │ │
│   └────┘  └────┘                                        └────┘ │
│                                                                 │
│   Loading Effects:                                              │
│   - Star opacity: 0.5                                           │
│   - Blur: 0.5px                                                 │
│   - Cursor: not-allowed                                         │
│   - Button disabled                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Disabled State

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌────┐  ┌────┐                                        ┌────┐ │
│   │ 💪 │  │ ☆  │  Bench Press                          │ ⋮  │ │
│   │    │  │    │  [font-semibold, text-primary]        │    │ │
│   └────┘  └────┘                                        └────┘ │
│           [dimmed]                                              │
│                                                                 │
│   Disabled Effects:                                             │
│   - Opacity: 0.5                                                │
│   - Cursor: not-allowed                                         │
│   - No hover effects                                            │
│   - No click events                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Dropdown Menu - Visual States

### Menu with Exercise NOT Tracked

```
┌─────────────────────────────────────┐
│                                     │
│  ☆  Track Personal Best            │ ← NEW ITEM
│                                     │
│  ─────────────────────────────────  │ ← DIVIDER
│                                     │
│  ✏️  Edit                           │
│                                     │
│  🗑️  Delete                         │
│     [text-red/danger]               │
│                                     │
└─────────────────────────────────────┘

Menu Item Styling:
- Icon: StarOutlined (16px)
- Text: "Track Personal Best"
- Padding: 12px 16px
- Hover: bg-hover (#f5f5f5)
- Font: 14px, regular
```

### Menu with Exercise TRACKED

```
┌─────────────────────────────────────┐
│                                     │
│  ★  Remove from Personal Bests     │ ← NEW ITEM
│     [icon in --accent-teal]         │
│                                     │
│  ─────────────────────────────────  │ ← DIVIDER
│                                     │
│  ✏️  Edit                           │
│                                     │
│  🗑️  Delete                         │
│     [text-red/danger]               │
│                                     │
└─────────────────────────────────────┘

Menu Item Styling:
- Icon: StarFilled (16px, --accent-teal)
- Text: "Remove from Personal Bests"
- Visual indicator that it's currently tracked
```

## Full Page Context

### Exercise Catalog Page with Mixed States

```
┌─────────────────────────────────────────────────────────────────┐
│  Exercises                                                      │
│  [text-3xl, font-bold]                                          │
│                                                                 │
│  ┌────────────────────────────────────────────────┐             │
│  │ 🔽  Category Filter (Select)                  │             │
│  └────────────────────────────────────────────────┘             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  CHEST                                                          │
│  [text-sm, font-bold, uppercase, --accent-teal]                 │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  💪  ★  Bench Press                                    ⋮ │  │ ← TRACKED
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  💪  ☆  Incline Bench Press                           ⋮ │  │ ← NOT TRACKED
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  💪  ★  Dumbbell Flyes                                 ⋮ │  │ ← TRACKED
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  BACK                                                           │
│  [text-sm, font-bold, uppercase, --accent-teal]                 │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  💪  ★  Deadlift                                       ⋮ │  │ ← TRACKED
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  💪  ☆  Pull-ups                                       ⋮ │  │ ← NOT TRACKED
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Visual Hierarchy:
1. Page title (largest, bold)
2. Filter controls (secondary)
3. Category headers (uppercase, teal, smaller)
4. Exercise cards (clean, elevated, white)
5. Star badges (visual scanability)
6. Actions (subtle, right-aligned)
```

## Animation Sequence

### Toggle from Unfilled to Filled

```
Frame 1 (0ms):          Frame 2 (100ms):        Frame 3 (300ms):
┌────┐                  ┌────┐                  ┌────┐
│ ☆  │                  │ ★  │                  │ ★  │
│    │                  │  ↑ │                  │    │
└────┘                  └────┘                  └────┘
scale: 1.0              scale: 1.2              scale: 1.0
color: tertiary         color: teal             color: teal
opacity: 1.0            opacity: 1.0            opacity: 1.0

Tap feedback:
- Frame 1: Normal state
- Frame 2 (on tap): Scale 0.9 (whileTap)
- Frame 3 (release): Animate to filled state with scale bounce
```

### Toggle from Filled to Unfilled

```
Frame 1 (0ms):          Frame 2 (300ms):
┌────┐                  ┌────┐
│ ★  │                  │ ☆  │
│  ↓ │                  │    │
└────┘                  └────┘
scale: 1.0              scale: 1.0
color: teal             color: tertiary
opacity: 1.0            opacity: 1.0

No bounce animation (only on activation)
Simple color/icon transition (200ms)
```

## Dark Mode Variations

### Dark Mode - Not Tracked

```
┌─────────────────────────────────────────────────────────────────┐
│   [DARK MODE]                                                   │
│                                                                 │
│   ┌────┐  ┌────┐                                        ┌────┐ │
│   │ 💪 │  │ ☆  │  Bench Press                          │ ⋮  │ │
│   └────┘  └────┘                                        └────┘ │
│                                                                 │
│   Colors:                                                       │
│   - Card bg: --bg-elevated (#262626)                           │
│   - Border: --border-light (#434343)                           │
│   - Star: --text-tertiary (#8c8c8c) ← GRAY                    │
│   - Text: --text-primary (#fafafa)                            │
│   - Shadow: darker, less prominent                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Dark Mode - Tracked

```
┌─────────────────────────────────────────────────────────────────┐
│   [DARK MODE]                                                   │
│                                                                 │
│   ┌────┐  ┌────┐                                        ┌────┐ │
│   │ 💪 │  │ ★  │  Bench Press                          │ ⋮  │ │
│   └────┘  └────┘                                        └────┘ │
│                                                                 │
│   Colors:                                                       │
│   - Star: --accent-teal (#5EEAD4) ← BRIGHTER TEAL             │
│   - Stands out clearly against dark background                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Color Specifications

### Light Mode Colors

| Element | State | CSS Variable | Hex | Usage |
|---------|-------|--------------|-----|-------|
| Star | Not Tracked | --text-tertiary | #9a9a9a | Default inactive |
| Star | Tracked | --accent-teal | #2DD4BF | Active/tracked |
| Star | Hover (not tracked) | --accent-teal | #2DD4BF | Preview state |
| Star bg | Hover | --bg-secondary | #e8e8ed | Hover background |
| Card bg | Default | --bg-elevated | #ffffff | Card background |
| Card border | Default | --border-light | #e0e0e5 | Subtle border |

### Dark Mode Colors

| Element | State | CSS Variable | Hex | Usage |
|---------|-------|--------------|-----|-------|
| Star | Not Tracked | --text-tertiary | #8c8c8c | Default inactive |
| Star | Tracked | --accent-teal | #5EEAD4 | Active/tracked (brighter) |
| Star | Hover (not tracked) | --accent-teal | #5EEAD4 | Preview state |
| Star bg | Hover | --bg-secondary | #262626 | Hover background |
| Card bg | Default | --bg-elevated | #262626 | Card background |
| Card border | Default | --border-light | #434343 | Visible border |

## Spacing Specifications

### Card Internal Spacing

```
┌─────────────────────────────────────────────────────────────────┐
│ ← 16px →                                                        │
│                                                                 │
│    Icon     Star     Exercise Name                        Menu │
│   ↕ 16px  ↕ 16px   ↕ 16px                               ↕ 16px│
│    ↔ 12px  ↔ 12px                                              │
│                                                                 │
│ ← 16px →                                                        │
└─────────────────────────────────────────────────────────────────┘

Measurements:
- Card padding: 16px (p-4)
- Gap between icon and star: 12px (gap-3)
- Gap between star and text: 12px (gap-3)
- Vertical padding: 16px
```

### Category Section Spacing

```
CHEST ← Category header
  ↕ 12px (gap-3)
┌────────────────────┐
│  Exercise Card 1   │
└────────────────────┘
  ↕ 12px (gap-3)
┌────────────────────┐
│  Exercise Card 2   │
└────────────────────┘
  ↕ 24px (gap-6)
BACK ← Next category
```

## Touch Target Specifications

### Minimum Touch Targets (Mobile)

```
Star Button:
┌─────────────────┐
│                 │
│    ┌────┐       │
│    │ ★  │       │  Actual visible: 32x32px
│    └────┘       │  Touch target: 44x44px (with padding)
│                 │
└─────────────────┘

Calculation:
- Button size: 32x32px (w-8 h-8)
- Padding: 6px on all sides
- Total touch area: 44x44px ✓ WCAG AAA
```

## Accessibility Annotations

### Screen Reader Announcements

```
State: Not Tracked
───────────────────
ARIA: "Add Bench Press to personal bests, button, not pressed"

User Action: Tap/Click
────────────────────────
ARIA: "Adding to personal bests..."

State: Tracked
──────────────
ARIA: "Remove Bench Press from personal bests, button, pressed"

Menu Item:
──────────
When tracked: "Remove from Personal Bests, menu item, has popup"
When not tracked: "Track Personal Best, menu item, has popup"
```

### Keyboard Navigation

```
Tab Order:
1. Category filter dropdown
2. Exercise card 1 - Star button
3. Exercise card 1 - Menu button
4. Exercise card 2 - Star button
5. Exercise card 2 - Menu button
... etc

Focus Styles:
┌─────────────────────┐
│  ┌────┐             │
│  │ ★  │ ← Blue outline (--brand-primary)
│  └────┘    2px solid, 2px offset
│            Clearly visible
└─────────────────────┘
```

## Error States

### Toggle Failed (Network Error)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌────┐  ┌────┐                                        ┌────┐ │
│   │ 💪 │  │ ✗  │  Bench Press                          │ ⋮  │ │
│   │    │  │ ⚠️ │  [font-semibold, text-primary]        │    │ │
│   └────┘  └────┘                                        └────┘ │
│           [shake animation]                                     │
│                                                                 │
│   Error Indication:                                             │
│   - Brief red flash on star                                     │
│   - Shake animation (2px left/right, 3 times)                  │
│   - Reverts to previous state                                  │
│   - Optional toast: "Failed to update. Please try again."      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Comparison: Before vs After

### Before (Current Design)

```
┌───────────────────────────────────────────────────────────┐
│  💪  Bench Press                                      ⋮  │
│                                                           │
│  [No indication of personal best tracking]                │
└───────────────────────────────────────────────────────────┘

Issues:
- No way to control tracking
- No visibility into which exercises are tracked
- Users don't know personal bests exist
```

### After (New Design)

```
┌───────────────────────────────────────────────────────────┐
│  💪  ★  Bench Press                                   ⋮  │
│                                                           │
│  Clear visual indicator: ★ = tracked for personal bests  │
│  User can toggle on/off                                   │
│  Immediate feedback                                       │
└───────────────────────────────────────────────────────────┘

Benefits:
+ Clear visual communication
+ User control and flexibility
+ Discoverable feature
+ Minimal space usage
+ Familiar interaction pattern
```

## Design Rationale Summary

### Why Star Icon?
- Universal symbol for "favorite" or "important"
- Minimal space usage
- Clear filled/unfilled states
- Familiar to users from other apps
- Works well at small sizes

### Why Teal Color?
- Already used for category headers (consistency)
- Stands out from primary blue (brand)
- Good contrast in light and dark modes
- Associated with achievement/progress
- Not red (danger) or yellow (warning)

### Why Dual Indicators (Star + Menu)?
- Star: Quick visual scan, fast interaction
- Menu: Explicit action, helpful context
- Accommodates different user preferences
- Increases discoverability
- Provides redundancy for accessibility

### Why Between Icon and Name?
- Visual flow: Icon → Badge → Name
- Badge acts as metadata for the exercise
- Doesn't interrupt reading the name
- Consistent position across all cards
- Easy to scan vertically

## Print-Friendly Reference

```
PERSONAL BEST TOGGLE - QUICK REFERENCE
═══════════════════════════════════════

Icon: StarOutlined / StarFilled (Ant Design)
Size: 18px (text-lg)
Button: 32x32px (w-8 h-8)
Touch target: 44x44px (with padding)

Colors:
- Inactive: --text-tertiary (#9a9a9a light, #8c8c8c dark)
- Active: --accent-teal (#2DD4BF light, #5EEAD4 dark)
- Hover bg: --bg-secondary

Animation:
- Toggle: scale [1, 1.2, 1] over 300ms
- Transition: all 200ms ease-in-out
- Tap: scale 0.9

States: Default | Hover | Active | Loading | Disabled | Error
```

This visual reference provides comprehensive mockups and specifications for implementing the personal best tracking toggle feature with pixel-perfect accuracy.
