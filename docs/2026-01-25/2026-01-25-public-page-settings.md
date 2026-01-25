# Add Theme and Language Settings to Public Pages

**Date**: 2026-01-25
**Status**: Implemented

## Overview

Add theme toggle and language selector controls to all public (unauthenticated) pages to allow users to customize their viewing experience before logging in.

## Affected Pages

- Login (`src/pages/login/Login.tsx`)
- Signup (`src/pages/signup/Signup.tsx`)
- Forgot Password (`src/pages/forgotPassword/ForgotPassword.tsx`)
- Reset Password (`src/pages/resetPassword/ResetPassword.tsx`)

## Implementation Approach

### 1. Create a Reusable Component: `PublicPageSettings`

**Location**: `src/components/publicPageSettings/PublicPageSettings.tsx`

**Purpose**: A small, non-intrusive component that displays theme toggle and language selector

**Features**:
- Theme toggle using `useTheme()` hook (already persists to localStorage)
- Language selector using `useTranslation()` hook with i18n (already persists)
- Clean, minimal design that doesn't distract from the main content
- Positioned in top-right corner with subtle styling

**Why a new component?**
- Keeps the code DRY (used across 4 pages)
- Makes it easy to update styling/behavior in one place
- Maintains separation of concerns

### 2. Update Public Pages

**Changes needed**:
- Import and render `PublicPageSettings` component
- Position it absolutely in the top-right corner of each page
- Ensure it works well on mobile (responsive design)

### 3. Theme Integration

**Current state**:
- Public pages use hardcoded colors (`bg-[#2d2d2d]`, `bg-white`, `text-gray-900`)
- Theme provider already exists and uses localStorage
- Need to update public pages to respect theme mode

**Approach**:
- Update public page backgrounds to use CSS variables (`var(--bg-primary)`)
- Update card backgrounds to use `var(--bg-elevated)`
- Update text colors to use `var(--text-primary)`, `var(--text-secondary)`
- Ensure form inputs respect theme

### 4. Design Considerations

**Placement**:
- Top-right corner with absolute positioning
- Uses flex layout for horizontal arrangement
- Subtle spacing and sizing to not overwhelm the UI

**Controls**:
- Theme: Simple icon button (moon/sun) similar to existing ThemeToggle
- Language: Compact select dropdown with flags or language codes

**Mobile responsiveness**:
- Ensure controls are accessible on small screens
- Consider stacking or reducing size on mobile if needed

## Files to Create

1. `src/components/publicPageSettings/PublicPageSettings.tsx` - New component

## Files to Modify

1. `src/pages/login/Login.tsx` - Add PublicPageSettings, update to use theme variables
2. `src/pages/signup/Signup.tsx` - Add PublicPageSettings, update to use theme variables
3. `src/pages/forgotPassword/ForgotPassword.tsx` - Add PublicPageSettings, update to use theme variables
4. `src/pages/resetPassword/ResetPassword.tsx` - Add PublicPageSettings, update to use theme variables

## Benefits

1. **Accessibility**: Users with visual impairments can enable dark mode before logging in
2. **UX**: International users can read auth instructions in their language
3. **Modern**: Matches current UX patterns of popular applications
4. **Consistency**: Settings persist across sessions via localStorage
5. **Non-intrusive**: Doesn't interfere with the main auth flow

## Alternative Approaches Considered

**Alternative 1**: Add settings to DesktopNav
- **Issue**: DesktopNav might not be rendered on public pages
- **Issue**: Would require checking auth state in DesktopNav

**Alternative 2**: Keep public pages hardcoded to light theme only
- **Issue**: Not accessible for users who need dark mode
- **Issue**: Inconsistent with the rest of the app

**Alternative 3**: Use a header component for all pages
- **Could work**, but overkill for just 2 controls
- Creates more structural changes than necessary

## Translation Keys Needed

The existing translations already cover:
- `languages.english`, `languages.spanish`, `languages.italian`
- `profile.settings.theme`, `profile.settings.dark`, `profile.settings.light`

May need to add accessibility labels:
- `accessibility.change_language`

## Technical Notes

- Theme persistence: Already handled by `ThemeProvider` (localStorage)
- Language persistence: Already handled by i18next (localStorage)
- No new dependencies required
- Follows existing patterns (useTheme, useTranslation hooks)

---

## Implementation Summary

### Files Created
1. **`src/components/publicPageSettings/PublicPageSettings.tsx`**
   - Reusable component with theme toggle and language selector
   - Positioned absolutely in top-right corner
   - Uses existing hooks: `useTheme()` and `useTranslation()`
   - Animated theme toggle with Framer Motion
   - Compact language selector with country codes (EN, ES, IT)

### Files Modified

**Public Pages** (all updated to use theme variables and include PublicPageSettings):
1. `src/pages/login/Login.tsx`
2. `src/pages/signup/Signup.tsx`
3. `src/pages/forgotPassword/ForgotPassword.tsx`
4. `src/pages/resetPassword/ResetPassword.tsx`

**Translation Files** (added `accessibility.change_language` key):
1. `src/utils/i18n/en.json` - "Change language"
2. `src/utils/i18n/es.json` - "Cambiar idioma"
3. `src/utils/i18n/it.json` - "Cambia lingua"

### Changes Made to Public Pages
- Added `PublicPageSettings` component import and rendering
- Updated background: `bg-[#2d2d2d]` → `bg-[var(--bg-primary)]`
- Updated card background: `bg-white` → `bg-[var(--bg-elevated)]`
- Updated text colors: `text-gray-900` → `text-[var(--text-primary)]`
- Updated input backgrounds: `bg-gray-100` → `bg-[var(--bg-primary)]`
- Updated borders: `border-gray-200` → `border-[var(--border-default)]`
- Updated placeholders: `placeholder:text-gray-500` → `placeholder:text-[var(--text-tertiary)]`
- Updated buttons: `bg-indigo-600` → `bg-[var(--brand-primary)]`
- Updated links: `text-indigo-600` → `text-[var(--brand-primary)]`
- Added `relative` positioning to main container for absolute positioning of settings

### Result
Users can now:
- Toggle between light and dark themes on public pages
- Select their preferred language (English, Spanish, Italian) before logging in
- Have their preferences persist across sessions via localStorage
- Experience a consistent theme across all pages from first visit
