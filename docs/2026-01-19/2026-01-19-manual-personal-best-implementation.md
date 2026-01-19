# Manual Personal Best Feature - Implementation Plan

**Date:** 2026-01-19
**Feature:** Manual Personal Best Entry
**Status:** Implementation Ready

---

## User Decisions

1. **Duplicate Handling:** Manual PR overrides if higher - show only the highest weight regardless of source
2. **Edit/Delete:** Users can edit and delete manual PR entries
3. **Date Tracking:** Store creation date for each manual PR entry

---

## Implementation Approach

### Database Schema

Create a new table `manual_personal_bests` in Supabase:

```sql
CREATE TABLE manual_personal_bests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises_catalog(id) ON DELETE CASCADE,
  weight DECIMAL(5,1) NOT NULL CHECK (weight >= 0.5 AND weight <= 999.9),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, exercise_id)
);

CREATE INDEX idx_manual_pbs_user_id ON manual_personal_bests(user_id);
CREATE INDEX idx_manual_pbs_exercise_id ON manual_personal_bests(exercise_id);

-- Enable RLS
ALTER TABLE manual_personal_bests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own manual PRs
CREATE POLICY "Users can view own manual PRs"
  ON manual_personal_bests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own manual PRs"
  ON manual_personal_bests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own manual PRs"
  ON manual_personal_bests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own manual PRs"
  ON manual_personal_bests FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_manual_personal_bests_updated_at
  BEFORE UPDATE ON manual_personal_bests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Component Architecture

```
PersonalBests (Enhanced)
├── Header with Add Button (FAB)
├── PersonalBestsList
│   └── PersonalBestItem (with manual badge indicator)
└── AddPersonalBestModal
    ├── ExerciseSelects (Category + Exercise)
    ├── WeightInput (Custom increment/decrement)
    └── ActionButtons (Cancel, Save)
```

### Redux Store Updates

**New Types:**
```typescript
interface ManualPersonalBest {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  category: string;
  createdAt: string;
  isManual: true;
}

interface PersonalBest {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number;
  category: string;
  isManual?: boolean;
  createdAt?: string;
}
```

**New Actions:**
- `addManualPersonalBest` - Add a new manual PR
- `updateManualPersonalBest` - Update existing manual PR
- `deleteManualPersonalBest` - Delete a manual PR
- `fetchManualPersonalBests` - Fetch all manual PRs for current user

**Enhanced Action:**
- `fetchPersonalBests` - Merge manual and workout-derived PRs, showing highest

### Files to Create

1. **WeightInput Component**
   - Path: `src/components/weightInput/WeightInput.tsx`
   - Features: Increment/decrement buttons, direct input, keyboard support

2. **AddPersonalBestModal Component**
   - Path: `src/pages/profile/components/AddPersonalBestModal.tsx`
   - Features: Exercise selection, weight input, validation, save logic

3. **EditPersonalBestModal Component** (for editing)
   - Path: `src/pages/profile/components/EditPersonalBestModal.tsx`
   - Similar to add modal but pre-filled with existing data

### Files to Modify

1. **PersonalBests Component**
   - Path: `src/pages/profile/components/PersonalBests.tsx`
   - Changes: Add FAB button, modal state, long-press for edit/delete menu

2. **Redux Types**
   - Path: `src/store/personalBests/types.ts`
   - Changes: Add manual PR interfaces, update PersonalBest interface

3. **Redux Actions**
   - Path: `src/store/personalBests/personalBests.actions.ts`
   - Changes: Add CRUD actions for manual PRs, update fetch logic

4. **Redux Reducer**
   - Path: `src/store/personalBests/personalBests.reducer.ts`
   - Changes: Handle manual PR actions

5. **i18n Files**
   - Path: `src/utils/i18n/en.json`, `src/utils/i18n/es.json`
   - Changes: Add translations for new UI text

### Implementation Phases

#### Phase 1: Database & Redux Foundation
1. Create `manual_personal_bests` table in Supabase
2. Update Redux types with manual PR interfaces
3. Create Redux actions for manual PRs (add, update, delete, fetch)
4. Update reducer to handle manual PR actions
5. Enhance `fetchPersonalBests` to merge manual and workout PRs

#### Phase 2: Core Components
1. Create `WeightInput` component with increment/decrement
2. Create `AddPersonalBestModal` component
3. Add translations to i18n files

#### Phase 3: Integration
1. Add FAB button to PersonalBests header
2. Wire up modal state management
3. Connect save action to Redux
4. Add manual badge indicator ("M" in purple)

#### Phase 4: Edit/Delete Features
1. Add long-press menu to PR items (Edit/Delete options)
2. Create `EditPersonalBestModal` component
3. Wire up edit and delete actions
4. Add confirmation dialog for delete

#### Phase 5: Polish & Testing
1. Add entrance/exit animations
2. Implement success feedback (toast notification)
3. Add loading states
4. Test all edge cases
5. Accessibility audit
6. Mobile device testing

### Merge Logic

When fetching personal bests:
1. Fetch all manual PRs for current user
2. Fetch all workout-derived PRs (existing logic)
3. Merge both lists by exercise_id:
   - If only manual PR exists: use it with `isManual: true`
   - If only workout PR exists: use it with `isManual: false`
   - If both exist: use the one with higher weight
4. Sort by weight descending

### Visual Design Specs

**Add Button:**
- Position: Top-right of PersonalBests card
- Size: 40x40px
- Style: Gradient border (brand-primary to accent-purple), rounded-full
- Icon: Plus (+) in white

**Manual Badge:**
- Position: Right side of PR item, before weight
- Style: Small pill badge, purple background, white text
- Text: "M"
- Size: ~20x20px

**Modal:**
- Backdrop: Blur(8px) + rgba(0,0,0,0.7)
- Container: rounded-2xl, bg-elevated, p-6
- Width: 90vw mobile, 480px desktop
- Gap between elements: 20px

**Weight Input:**
- Large centered display: text-2xl font-semibold
- Increment/decrement buttons: 48x48px
- Step: 0.5kg (normal), 5kg (long-press)
- Validation: 0.5 - 999.9 kg

### Success Criteria

- [ ] Users can add manual PRs via modal
- [ ] Manual PRs display with "M" badge
- [ ] Manual and workout PRs merge correctly (highest shown)
- [ ] Users can edit manual PRs
- [ ] Users can delete manual PRs
- [ ] All animations run smoothly (60fps)
- [ ] Touch targets meet 44x44px minimum
- [ ] Keyboard navigation works
- [ ] Screen readers announce properly
- [ ] Mobile and desktop responsive

### Testing Checklist

- [ ] Add a new manual PR
- [ ] Add manual PR for exercise with existing workout PR (higher weight)
- [ ] Add manual PR for exercise with existing workout PR (lower weight)
- [ ] Edit a manual PR
- [ ] Delete a manual PR
- [ ] Try to add duplicate (same exercise) - should show error or update
- [ ] Test weight validation (min, max, decimal places)
- [ ] Test keyboard navigation
- [ ] Test on mobile device
- [ ] Test dark mode appearance
- [ ] Test screen reader announcements
- [ ] Test with empty state
- [ ] Test network error handling

---

## Next Steps

1. Create database migration file
2. Update Redux store structure
3. Build WeightInput component
4. Build AddPersonalBestModal component
5. Enhance PersonalBests component
6. Test and iterate

---

**Ready for Implementation** ✅
