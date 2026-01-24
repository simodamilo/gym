# Add SEO Metadata to Pages

## Overview
Add dynamic page titles and meta descriptions to all pages for better SEO. This will improve search engine visibility and provide better context when pages are shared on social media.

**Status:** ✅ Implemented

## Current State
- Static title "Gym" in index.html
- No dynamic meta descriptions
- SEO metadata already defined in `src/utils/i18n/en.json` under `app.meta`
- Three language support: English (en), Spanish (es), Italian (it)

## Routes to Handle
Based on `src/utils/routing/router.tsx`:

### Public Pages
1. `/gym/login` - Login page
2. `/gym/signup` - Signup page
3. `/gym/forgot-password` - Forgot password page

### Protected Pages
4. `/gym/workouts/current/days` - Current workout (default)
5. `/gym/workouts/current/days/:dayId/exercises` - Current workout exercises
6. `/gym/workouts/history/workouts` - Workout history list
7. `/gym/workouts/history/workouts/:workoutId/days` - Historical workout details
8. `/gym/workouts/history/workouts/:workoutId/days/:dayId/exercises` - Historical workout exercises
9. `/gym/workouts/create/days` - Create new workout
10. `/gym/workouts/create/days/:dayId/exercises` - Create workout exercises
11. `/gym/profile` - User profile
12. `/gym/exercises` - Exercise catalog

## Implementation Approach

### 1. Install react-helmet-async
Use `react-helmet-async` for managing document head in a React app with async rendering support.

```bash
npm install react-helmet-async
```

### 2. Add Helmet Provider
Wrap the app with `HelmetProvider` in `src/main.tsx` (alongside existing providers).

### 3. Create SEO Component
Create `src/components/seo/PageSEO.tsx` - a reusable component that:
- Accepts `titleKey` and `descriptionKey` props for i18n translation keys
- Uses `useTranslation` hook to get translated strings
- Renders `<Helmet>` with title and meta description
- Supports optional dynamic values (e.g., workout name, day number)

### 4. Add Translation Keys
Extend `src/utils/i18n/en.json` (and es.json, it.json) with:
- Page-specific titles under `seo.titles.*`
- Page-specific descriptions under `seo.descriptions.*`

Example structure:
```json
{
  "seo": {
    "titles": {
      "login": "Login - GymTracker",
      "signup": "Sign Up - GymTracker",
      "forgot_password": "Reset Password - GymTracker",
      "workouts_current": "Current Workout - GymTracker",
      "workouts_history": "Workout History - GymTracker",
      "workouts_create": "Create Workout - GymTracker",
      "profile": "Profile - GymTracker",
      "exercises": "Exercise Library - GymTracker"
    },
    "descriptions": {
      "login": "Sign in to GymTracker to access your workouts and track your fitness progress.",
      "signup": "Create your free GymTracker account and start tracking your fitness journey today.",
      // ... etc
    }
  }
}
```

### 5. Add PageSEO to Each Page Component
Import and render `<PageSEO />` at the top of each page component:
- `src/pages/login/Login.tsx`
- `src/pages/signup/Signup.tsx`
- `src/pages/forgotPassword/ForgotPassword.tsx`
- `src/pages/workouts/current/Current.tsx`
- `src/pages/workouts/history/History.tsx`
- `src/pages/workouts/history/components/HistoryWorkout.component.tsx`
- `src/pages/workouts/create/CreateWorkout.component.tsx`
- `src/pages/profile/Profile.tsx`
- `src/pages/exercises/Exercises.tsx`

### 6. Update index.html
Keep base title as fallback, but make it more descriptive:
```html
<title>GymTracker - Track Workouts, Exercises & Personal Bests</title>
<meta name="description" content="Free fitness and workout tracking app..." />
```

## Files to Create
- `src/components/seo/PageSEO.tsx` - SEO component

## Files to Modify
- `src/main.tsx` - Add HelmetProvider
- `index.html` - Update default title and add meta description
- `src/utils/i18n/en.json` - Add SEO translation keys
- `src/utils/i18n/es.json` - Add SEO translation keys (Spanish)
- `src/utils/i18n/it.json` - Add SEO translation keys (Italian)
- `package.json` - Add react-helmet-async dependency
- All page components listed above - Add PageSEO component

## Benefits
- Improved search engine rankings
- Better social media sharing previews
- Clearer browser tab titles for better UX
- Internationalized SEO content (3 languages)
- Centralized SEO management through i18n

## Technical Decisions
- Using `react-helmet-async` instead of `react-helmet` for better async rendering support
- Leveraging existing i18n infrastructure for multilingual SEO
- Component-based approach for easy maintenance
- Keep existing `app.meta` keys for reuse where applicable

---

## Implementation Summary

### Completed Changes

1. **Installed Dependencies**
   - Added `react-helmet-async` package (installed with `--legacy-peer-deps` for React 19 compatibility)

2. **Created Components**
   - `src/components/seo/PageSEO.tsx` - Reusable SEO component that accepts translation keys and sets page title, description, and Open Graph/Twitter meta tags

3. **Updated Configuration**
   - `src/main.tsx` - Wrapped app with `HelmetProvider`
   - `index.html` - Updated default title to "GymTracker - Track Workouts, Exercises & Personal Bests" and added meta description

4. **Added Translations**
   - `src/utils/i18n/en.json` - Added `seo.titles` and `seo.descriptions` for all pages (English)
   - `src/utils/i18n/es.json` - Added SEO translations (Spanish)
   - `src/utils/i18n/it.json` - Added SEO translations (Italian)

5. **Updated Page Components**
   All pages now include the `PageSEO` component:
   - Login page (`/gym/login`)
   - Signup page (`/gym/signup`)
   - Forgot password page (`/gym/forgot-password`)
   - Current workout page (`/gym/workouts/current/days`)
   - Workout history page (`/gym/workouts/history/workouts`)
   - Create workout page (`/gym/workouts/create/days`)
   - Profile page (`/gym/profile`)
   - Exercises page (`/gym/exercises`)

### SEO Meta Tags Included
Each page now dynamically sets:
- `<title>` - Page-specific title
- `<meta name="description">` - Page-specific description
- `<meta property="og:title">` - Open Graph title for social sharing
- `<meta property="og:description">` - Open Graph description for social sharing
- `<meta name="twitter:title">` - Twitter card title
- `<meta name="twitter:description">` - Twitter card description

### Multi-language Support
All SEO metadata is fully internationalized in:
- English (en)
- Spanish (es)
- Italian (it)

The page titles and descriptions will automatically update based on the user's selected language preference.

### Testing
- Dev server starts successfully without errors
- All page components render correctly with SEO metadata
