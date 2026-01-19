# Manual Personal Best Feature - UI Design

**Date:** 2026-01-19
**Feature:** Manual Personal Best Entry
**Designer:** UI Designer Agent

---

## 1. Executive Summary

Design a beautiful, intuitive UI that allows users to manually add personal best entries to their gym tracking app. The feature integrates seamlessly with the existing PersonalBests component while maintaining the app's dark theme aesthetic and mobile-first approach.

---

## 2. Design Goals

### User Experience Goals
- **Minimal friction**: Add a PR in under 10 seconds
- **Intuitive discovery**: Users should immediately understand how to add entries
- **Error prevention**: Guide users to valid inputs
- **Visual harmony**: Blend naturally with existing design system
- **Mobile-optimized**: Touch-friendly targets, smooth interactions

### Technical Goals
- Follow existing design patterns (gradients, rounded corners, spacing)
- Use only Tailwind CSS for styling
- Maintain modular component architecture
- Integrate with Redux store patterns
- Support accessibility standards

---

## 3. Visual Design System Analysis

### Current PersonalBests Component
- **Container**: Gradient background `from-neutral-900 to-neutral-800` (dark mode: `from-neutral-950 to-neutral-900`)
- **Border radius**: `rounded-2xl` (20px)
- **Padding**: `p-6` (1.5rem)
- **Header**: Small uppercase text, `text-neutral-400`, tracking-wider
- **List items**: Flex layout, white text, bottom borders `border-neutral-700/50`
- **Weight display**: Semibold font, right-aligned

### Design Tokens (from tailwind.config.ts)
- **Primary colors**: Blue gradient (#1677ff to #0958d9)
- **Accent purple**: #722ed1
- **Accent success**: #52c41a
- **Neutral scale**: 50-950 with 900 as primary dark background
- **Border radius**: 2xl = 20px, xl = 16px, lg = 12px
- **Spacing**: 1-20 scale (0.25rem to 5rem)
- **Transitions**: fast (150ms), normal (250ms), slow (350ms)

### CSS Variables (from index.css)
- **Dark mode backgrounds**: --bg-primary (#1f1f1f), --bg-elevated (#262626)
- **Brand primary**: --brand-primary (#4096ff in dark mode)
- **Text colors**: --text-primary (#fafafa), --text-secondary (#d9d9d9)
- **Shadows**: --shadow-sm to --shadow-xl with dark mode variants

---

## 4. Design Solution

### 4.1 Interaction Pattern: Floating Action Button + Modal

**Rationale**:
- FAB is mobile-friendly and doesn't clutter the card
- Modal provides focused input experience
- Follows Material Design patterns familiar to users
- Existing CustomModal component can be leveraged

### 4.2 Component Architecture

```
PersonalBests (Enhanced)
├── PersonalBestsHeader (New)
│   ├── Title (Existing)
│   └── AddButton (New - Icon button with gradient border)
├── PersonalBestsList (Extracted)
│   └── PersonalBestItem (Extracted)
└── AddPersonalBestModal (New)
    ├── ExerciseSelector (Using ExerciseSelects)
    ├── WeightInput (New)
    └── ActionButtons (Using CustomModal pattern)
```

### 4.3 Visual Specifications

#### Add Button Design
**Position**: Top-right of PersonalBests card, aligned with header
**Size**: 40x40px (10 units) - large touch target
**Style**:
- Icon: Plus symbol (+) in white
- Background: Gradient border effect matching existing IconButton pattern
- Gradient: `from-brand-primary to-accent-purple` (matches app theme)
- Border radius: `rounded-full`
- Hover state: Scale 1.05, glow effect
- Active state: Scale 0.95

```css
Container: w-10 h-10 min-w-10 rounded-full
Background: gradient border (conic-gradient pattern from IconButton)
Inner: bg-neutral-900/90 with white plus icon
Transition: duration-300 ease-out
```

#### Modal Design
**Layout**: Center modal overlay with backdrop blur
**Size**:
- Mobile: 90vw max-width, auto height
- Desktop: 480px max-width

**Structure**:
```
┌─────────────────────────────────────┐
│  🏋️ Add Personal Best               │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ Select Category ▼           │  │
│  └─────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ Select Exercise ▼           │  │
│  └─────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ Weight (kg)                 │  │
│  │ [    125.5     ]            │  │
│  └─────────────────────────────┘  │
│                                     │
│  ┌──────────┬─────────────────┐   │
│  │ Cancel   │   Save PR   💪  │   │
│  └──────────┴─────────────────┘   │
└─────────────────────────────────────┘
```

**Visual Specs**:
- **Background**: `var(--bg-elevated)` with `rounded-2xl`
- **Backdrop**: `blur(8px)` with `rgba(0,0,0,0.7)` overlay
- **Padding**: `p-6` (24px)
- **Gap between elements**: `gap-5` (20px)
- **Icon**: Trophy or barbell icon at top (32px, accent color)

#### Weight Input Field
**Design**: Custom number input with increment/decrement buttons

```
┌─────────────────────────────────────┐
│ Weight (kg)                         │
│ ┌───┬─────────────────────┬───┐   │
│ │ - │      125.5 kg      │ + │   │
│ └───┴─────────────────────┴───┘   │
└─────────────────────────────────────┘
```

**Specs**:
- **Container**: `rounded-xl bg-bg-tertiary border border-border-light`
- **Input**: Large text (text-2xl), center-aligned, font-semibold
- **Buttons**: 48x48px touch targets, neutral-700 background
- **Icons**: Minus/Plus in neutral-400
- **Increment**: 0.5kg steps (long press for 5kg steps)
- **Validation**: Min 0.5kg, Max 999kg, 1 decimal place

#### Success Feedback
**Animation**: Confetti burst or success checkmark animation
**Toast**: "Personal best added! 💪" with success color
**List update**: Smooth insertion animation, highlight new entry

### 4.4 States & Interactions

#### Add Button States
1. **Default**: Gradient border, neutral inner
2. **Hover**: Scale 1.05, brighter gradient
3. **Active**: Scale 0.95
4. **Loading**: Spinning icon
5. **Disabled**: Opacity 50%, no hover effect

#### Modal States
1. **Initial**: Empty selects, weight input at 0
2. **Exercise selected**: Weight input enabled, focused
3. **Valid input**: Save button enabled (gradient from success green)
4. **Invalid input**: Save button disabled, subtle error hint
5. **Submitting**: Loading spinner in save button, inputs disabled
6. **Error**: Red border on invalid fields, error message below

#### List Item States (Enhanced)
1. **Default**: White text, subtle border
2. **New item**: Green glow animation (2s fade out)
3. **Manual entry**: Small badge "Manual" in purple
4. **From workout**: Default appearance

### 4.5 Responsive Behavior

**Mobile (< 640px)**
- Modal width: 90vw
- Font sizes: Slightly reduced
- Touch targets: Minimum 44x44px
- Keyboard: Numeric keyboard for weight input
- Button text: "Save" instead of "Save PR"

**Tablet (640px - 1024px)**
- Modal width: 480px
- Standard sizing

**Desktop (> 1024px)**
- Modal width: 520px
- Larger text
- Hover states more pronounced

### 4.6 Accessibility

- **Keyboard navigation**: Tab order, Enter to submit, Esc to close
- **Screen readers**: ARIA labels on all inputs, role announcements
- **Focus management**: Auto-focus on category select, trap focus in modal
- **Color contrast**: WCAG AA compliance (4.5:1 for text)
- **Touch targets**: Minimum 44x44px for all interactive elements
- **Error messaging**: Clear, specific, associated with fields

---

## 5. Component Specifications

### 5.1 AddPersonalBestModal Component

**Props Interface**:
```typescript
interface AddPersonalBestModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (exerciseId: string, weight: number) => void;
  isLoading?: boolean;
}
```

**State**:
```typescript
const [selectedExerciseId, setSelectedExerciseId] = useState<string>();
const [weight, setWeight] = useState<number>(0);
const [errors, setErrors] = useState<{exercise?: string, weight?: string}>({});
```

**Validation Rules**:
- Exercise: Required
- Weight: Required, min 0.5kg, max 999kg, max 1 decimal place

**File Location**: `src/pages/profile/components/AddPersonalBestModal.tsx`

---

### 5.2 WeightInput Component

**Props Interface**:
```typescript
interface WeightInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
}
```

**Features**:
- Increment/decrement buttons
- Direct number input
- Keyboard support (arrow keys)
- Touch-friendly
- Format display with "kg" suffix

**File Location**: `src/components/weightInput/WeightInput.tsx`

---

### 5.3 PersonalBests Component (Enhanced)

**Changes**:
1. Add header with add button
2. Extract list rendering to separate component
3. Add visual indicator for manual entries
4. Handle modal state
5. Dispatch save action to Redux

**New Props**: None (state managed internally)

**File Location**: `src/pages/profile/components/PersonalBests.tsx` (modified)

---

## 6. User Flow

```
1. User views Personal Bests card
   ↓
2. Taps (+) button in top-right
   ↓
3. Modal opens with backdrop blur
   ↓
4. User selects category from dropdown
   ↓
5. Exercise dropdown populates
   ↓
6. User selects exercise
   ↓
7. Weight input becomes enabled and focused
   ↓
8. User enters weight (keyboard or +/- buttons)
   ↓
9. User taps "Save PR" button
   ↓
10. Loading state shows
   ↓
11. Success: Modal closes, confetti animation, entry appears in list
    Error: Error message shows, user can correct and retry
```

**Edge Cases**:
- Duplicate exercise: Update existing PR if new weight is higher, show "Updated!" instead of "Added!"
- Network error: Show error toast, keep modal open, allow retry
- Empty state: Show helpful prompt "Add your first PR!"

---

## 7. Animation Specifications

### Modal Entrance
- **Type**: Scale + fade
- **Duration**: 250ms
- **Easing**: cubic-bezier(0.34, 1.56, 0.64, 1) (spring)
- **Transform**: scale(0.9) → scale(1)
- **Opacity**: 0 → 1

### Modal Exit
- **Type**: Scale + fade
- **Duration**: 200ms
- **Easing**: ease-out
- **Transform**: scale(1) → scale(0.95)
- **Opacity**: 1 → 0

### Button Press
- **Duration**: 150ms
- **Transform**: scale(1) → scale(0.95) → scale(1)

### New Item Highlight
- **Type**: Glow pulse
- **Duration**: 2000ms
- **Colors**: transparent → rgba(82, 196, 26, 0.2) → transparent
- **Iterations**: 2

### Success Confetti (Optional)
- **Library**: canvas-confetti or CSS-based particles
- **Duration**: 1500ms
- **Particle count**: 50
- **Colors**: Brand primary, accent purple, success green

---

## 8. Redux Integration

### New Action
**File**: `src/store/personalBests/personalBests.actions.ts`

```typescript
const addManualPersonalBest = createAsyncThunk(
  "personalBests/addManualPersonalBest",
  async (payload: { exerciseId: string; weight: number }, thunkAPI) => {
    // Save to Supabase (new table or flag in existing)
    // Return updated personal best entry
  }
);
```

### State Update
The reducer will:
1. Add new entry to personalBests array
2. Sort by weight descending
3. Update or replace if exercise already exists

---

## 9. Implementation Phases

### Phase 1: Core Components
1. Create WeightInput component
2. Create AddPersonalBestModal component
3. Add Redux action for manual entries

### Phase 2: Integration
1. Enhance PersonalBests component with add button
2. Wire up modal state management
3. Connect to Redux action

### Phase 3: Polish
1. Add animations and transitions
2. Implement success feedback
3. Add manual entry badge
4. Accessibility testing

### Phase 4: Testing & Refinement
1. Mobile device testing
2. Edge case handling
3. Performance optimization
4. User feedback integration

---

## 10. Design Assets Needed

### Icons
- **Plus icon**: For add button (from existing icon library)
- **Trophy/Barbell icon**: For modal header (optional)
- **Minus/Plus icons**: For weight increment buttons

### Colors (from existing palette)
- **Primary gradient**: #1677ff → #722ed1
- **Success**: #52c41a
- **Accent purple**: #722ed1
- **Neutral backgrounds**: #1f1f1f, #262626, #434343

### Typography
- **Header**: text-sm uppercase tracking-wider (neutral-400)
- **Modal title**: text-xl font-semibold (text-primary)
- **Weight value**: text-2xl font-semibold (text-primary)
- **Labels**: text-sm (text-secondary)

---

## 11. Success Metrics

### User Experience
- **Task completion time**: < 10 seconds average
- **Error rate**: < 5% invalid submissions
- **Feature discovery**: > 70% of users find add button within first session

### Technical
- **Modal load time**: < 100ms
- **Animation frame rate**: 60fps
- **Accessibility score**: WCAG AA compliance

---

## 12. Future Enhancements

1. **Edit existing PRs**: Long-press on entry to edit or delete
2. **PR history**: Track multiple PRs over time with date stamps
3. **Notes field**: Add context (e.g., "Competition PR")
4. **Photo attachment**: Add proof/celebration photos
5. **PR comparison**: Compare current vs. last PR
6. **Goal setting**: Set target PRs with progress tracking
7. **Social sharing**: Share PR achievements

---

## 13. Open Questions

1. **Data persistence**: Should manual PRs be stored separately or flagged in existing structure?
2. **Duplicate handling**: Override or keep both manual and workout-derived PRs?
3. **Deletion**: Should users be able to delete manual entries?
4. **Date tracking**: Should we track when manual PRs were added?
5. **Units**: Support for lbs in addition to kg?

---

## 14. Design Decisions Log

| Decision | Rationale | Date |
|----------|-----------|------|
| Modal over inline form | Focused experience, mobile-friendly | 2026-01-19 |
| FAB pattern for add button | Minimal UI clutter, discoverable | 2026-01-19 |
| Custom weight input | Better UX than native number input | 2026-01-19 |
| Gradient button borders | Consistency with existing IconButton | 2026-01-19 |
| Success confetti optional | Performance consideration, can be feature flag | 2026-01-19 |

---

## 15. Handoff Notes for Development

### Critical Implementation Details
1. **Use ExerciseSelects component** for category/exercise selection (already built)
2. **Reuse CustomModal styling patterns** for consistent modal appearance
3. **Follow IconButton gradient border pattern** for add button
4. **Weight validation must match backend constraints**
5. **Use Framer Motion** for animations (already in use)

### Testing Checklist
- [ ] Add button appears on all screen sizes
- [ ] Modal opens and closes smoothly
- [ ] Exercise selection works with existing catalog
- [ ] Weight input accepts valid values only
- [ ] Save action triggers Redux thunk
- [ ] New entry appears in list immediately
- [ ] Duplicate exercise updates existing PR
- [ ] Error states display correctly
- [ ] Keyboard navigation works
- [ ] Screen reader announces all interactions
- [ ] Touch targets meet 44x44px minimum
- [ ] Animations run at 60fps

### Files to Create
1. `src/components/weightInput/WeightInput.tsx`
2. `src/pages/profile/components/AddPersonalBestModal.tsx`

### Files to Modify
1. `src/pages/profile/components/PersonalBests.tsx`
2. `src/store/personalBests/personalBests.actions.ts`
3. `src/store/personalBests/personalBests.reducer.ts`
4. `src/store/personalBests/types.ts` (if adding manual flag)

---

## Appendix: Visual Mockups (Text Description)

### A1: PersonalBests Card with Add Button
```
╔═══════════════════════════════════════════════╗
║ PERSONAL BESTS                        [ + ]   ║
║                                               ║
║  Bench Press              125.5 kg           ║
║  ─────────────────────────────────────────   ║
║  Squat                    180.0 kg  [M]      ║
║  ─────────────────────────────────────────   ║
║  Deadlift                 200.0 kg           ║
╚═══════════════════════════════════════════════╝

[+] = Gradient border circle button
[M] = Small purple badge indicating manual entry
```

### A2: Add Personal Best Modal
```
╔═══════════════════════════════════════════════╗
║                    🏋️                         ║
║             Add Personal Best                 ║
║                                               ║
║  ┌─────────────────────────────────────┐    ║
║  │ Select Category              ▼     │    ║
║  └─────────────────────────────────────┘    ║
║                                               ║
║  ┌─────────────────────────────────────┐    ║
║  │ Select Exercise              ▼     │    ║
║  └─────────────────────────────────────┘    ║
║                                               ║
║  Weight (kg)                                  ║
║  ┌───┬─────────────────────────┬───┐        ║
║  │ - │       125.5 kg         │ + │        ║
║  └───┴─────────────────────────┴───┘        ║
║                                               ║
║  ┌─────────────┬───────────────────┐        ║
║  │   Cancel    │   Save PR     💪  │        ║
║  └─────────────┴───────────────────┘        ║
╚═══════════════════════════════════════════════╝
```

---

**End of Design Document**
