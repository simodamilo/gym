# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the application
```bash
npm run dev              # Start dev server with network access (--host flag)
npm run build            # TypeScript compile + Vite build + copy index.html to 404.html for GH Pages
npm run preview          # Preview production build locally
```

### Code quality
```bash
npm run lint             # Run ESLint on the codebase
```

### Deployment
```bash
npm run deploy           # Deploy to GitHub Pages (runs predeploy + gh-pages)
```

### Environment setup
Create a `.env.local` file with Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Workflow Rules

### Task Documentation Process

**REQUIRED**: Always write documentation for every task requested by the user.

Before starting implementation of any task:

1. **Create a planning document** in `docs/YYYY-MM-DD/YYYY-MM-DD-taskname.md`
   - Use today's date in YYYY-MM-DD format
   - Create the date folder if it doesn't exist
   - Use a descriptive task name (e.g., `2026-01-16-add-exercise-filtering.md`)
   - **If there are related tasks asked one after the other, update the same file** instead of creating multiple files

2. **Document content** should include:
   - What you will implement
   - How you will implement it (approach, affected files, new components)
   - Any architectural decisions or trade-offs

3. **Get user approval** before starting implementation

4. **Update the document** after implementation if:
   - The approach changed during development
   - New information or insights emerged
   - Additional context would be helpful for future reference

Example structure:
```
docs/
  2026-01-16/
    2026-01-16-add-exercise-filtering.md
    2026-01-16-fix-workout-routing.md
  2026-01-17/
    2026-01-17-implement-dark-mode.md
```

### Code Modularity Requirements

**Maintain modular architecture** - follow the existing patterns in the codebase:

- Keep files focused and single-purpose
- Avoid creating long or complex files (prefer splitting into smaller modules)
- Follow the established component structure: feature folders with subcomponents
- For Redux slices, maintain the pattern: actions, reducer, selectors, types (and mapper if needed) in separate files
- Split complex components into smaller, reusable pieces
- Extract shared logic into utility functions or custom hooks

If a file becomes too large or handles multiple concerns, split it into smaller modules following the existing organizational patterns.

### Styling Requirements

**Use only Tailwind CSS for styling** - no exceptions:

- **NEVER** use CSS modules (`.module.css` files)
- **NEVER** use inline styles with the `style` attribute
- **NEVER** use any other styling approach (styled-components, emotion, etc.)
- **ALWAYS** use Tailwind utility classes for all styling needs
- For complex or repeated styling patterns, use Tailwind's `@apply` directive in global CSS files if absolutely necessary

This ensures consistency and maintainability across the entire codebase.

## Architecture Overview

### Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **State Management**: Redux Toolkit with thunks
- **Routing**: React Router v7 with nested routes
- **UI Components**: Ant Design (antd) + Tailwind CSS 4
- **Backend**: Supabase (authentication + database)
- **PWA**: vite-plugin-pwa with workbox
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Charts**: Recharts
- **i18n**: i18next + react-i18next

### Application Entry Points

**main.tsx**: Root entry that sets up Redux Provider, AuthProvider, and RouterProvider with splash screen logic (minimum 1 second display time).

**App.tsx**: Layout wrapper that renders NotificationProvider, BottomBar (for authenticated users), and Outlet for child routes.

### Routing Structure

Base path is `/gym` (configured for GitHub Pages deployment).

Routes:
- `/gym/login` - Login page (public)
- `/gym/workouts` - Protected workout section
  - `/gym/workouts/current` - Current active workout
  - `/gym/workouts/history` - Workout history list
  - `/gym/workouts/history/:workoutId` - Specific historical workout
- `/gym/workouts/create` - Draft workout creation (protected)
- `/gym/profile` - User profile (protected)
- `/gym/exercises` - Exercise catalog (protected)

Protected routes use `ProtectedPage` wrapper that checks authentication.

### Redux Store Architecture

The store is split into domain-specific slices, each with its own folder containing:
- `*.actions.ts` - Async thunks and action creators
- `*.reducer.ts` - Reducer logic
- `*.selectors.ts` - Memoized selectors
- `*.mapper.ts` - Transform backend responses to frontend types (where needed)
- `types.ts` - TypeScript interfaces for state and payloads

**Store slices**:
1. **current** - Active workout state (the workout user is currently doing)
2. **draft** - Draft workout being created/edited
3. **exercisesCatalog** - Exercise library with categories
4. **history** - Historical workouts
5. **progressHistory** - User progress data over time

**Key types** (from `src/store/draft/types.ts`):
- `Workout` contains `Day[]`
- `Day` contains `DayExercise[]`
- `DayExercise` contains `Set[]` and references `ExerciseCatalog`
- Each entity has separate types for frontend state vs. backend payloads vs. API responses

**State reset**: Global action `RESET_STORE` clears entire store state (used on logout).

### Authentication Flow

**AuthProvider** (`src/utils/auth/AuthProvider.tsx`):
- Context provider wrapping the app
- Listens to Supabase auth state changes via `onAuthStateChange`
- Provides `user`, `session`, `signIn()`, `signOut()` to components via `useAuth()` hook
- OAuth provider: Google (configured in `signIn` method)

**Supabase client**: Initialized in `src/store/supabaseClient.ts` using env vars.

### Component Organization

Components are organized in feature folders:
- `/components` - Shared components (bottomBar, navbar, buttons, etc.)
- `/pages/{feature}` - Page-level components
- `/pages/workouts/components` - Workout-specific subcomponents
  - `dayContent` - Day view and editing
  - `exerciseContent` - Exercise card display
  - `exercisesList` - List view for exercises
  - `history` - Historical workout views
  - `workout` - Main workout component (handles current/draft/history modes)

The `WorkoutComponent` is polymorphic: it accepts `isCurrent`, `isDraft`, or `isHistory` props to render different workout modes.

### Key Patterns

**Drag and Drop**: Uses @dnd-kit for reordering exercises within workouts.

**PWA Configuration**:
- Base URL: `/gym/` (GitHub Pages)
- Navigate fallback: `/gym/index.html`
- Service worker auto-update enabled
- Manifest configured for standalone display

**i18n**: Currently English only, configured in `src/utils/i18n/i18n.ts`.

**Build process**: The build script copies `index.html` to `404.html` to handle GitHub Pages routing for SPA.

### Data Flow

1. User authenticates via Supabase OAuth (Google)
2. On auth state change, `currentActions.fetchCurrentWorkout()` is dispatched
3. Components use Redux selectors to read state
4. User interactions dispatch thunk actions
5. Thunks make Supabase API calls
6. Responses are mapped from snake_case backend format to camelCase frontend format
7. State updates trigger component re-renders

### Deployment

Automatic deployment to GitHub Pages via GitHub Actions on push to `main`:
- Secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `PAT_TOKEN`
- Workflow: `.github/workflows/deploy.yml`
- Publishes `dist` folder to gh-pages branch
