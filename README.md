# Gym Tracker App

A modern Progressive Web App (PWA) designed to help you track your workouts, monitor your progress, and achieve your fitness goals. Whether you're a beginner or an experienced athlete, this app provides all the tools you need to plan, execute, and analyze your training sessions.

## Live App

**Try it now:** [https://simodamilo.github.io/gym/login](https://simodamilo.github.io/gym/login)

Install it on your phone as a PWA for the best experience (see installation instructions below).

## Features

-   🏋️ **Workout Management**

    -   Create and customize workout routines
    -   Track sets, reps, and weights
    -   Organize exercises by days
    -   Support for supersets
    -   Real-time workout tracking

-   📊 **Progress Tracking**

    -   Weight tracking with visual graphs
    -   Exercise history
    -   Personal records monitoring

-   🎯 **Exercise Library**

    -   Categorized exercise database
    -   Custom exercise creation
    -   Exercise categories (Chest, Back, Legs, etc.)

-   🌓 **User Experience**
    -   Dark/Light mode support
    -   Mobile-first responsive design
    -   PWA with offline capabilities
    -   Drag and drop interface for workout organization

## How to Use on Mobile

This app is a Progressive Web App (PWA), which means you can install it on your phone and use it like a native app with offline support.

### Installation on Android

1. Open the app in **Chrome** or **Samsung Internet** browser: [https://simodamilo.github.io/gym/login](https://simodamilo.github.io/gym/login)
2. Tap the **three-dot menu** (⋮) in the top-right corner
3. Select **"Add to Home screen"** or **"Install app"**
4. Confirm the installation by tapping **"Add"** or **"Install"**
5. The app icon will appear on your home screen
6. Tap the icon to launch the app in full-screen mode

**Alternative method:**
- Look for the **"Install"** banner that appears at the bottom of the screen
- Tap **"Install"** when prompted

### Installation on iOS (iPhone/iPad)

1. Open the app in **Safari** browser: [https://simodamilo.github.io/gym/login](https://simodamilo.github.io/gym/login)
   - Note: PWA installation only works in Safari on iOS
2. Tap the **Share button** (□↑) at the bottom of the screen
3. Scroll down and tap **"Add to Home Screen"**
4. Edit the name if desired, then tap **"Add"** in the top-right corner
5. The app icon will appear on your home screen
6. Tap the icon to launch the app

### Using the PWA

Once installed:
- The app launches in full-screen mode without browser controls
- Works offline after the first load (cached data)
- Receives updates automatically when online
- Behaves like a native app with fast loading times
- Push notifications support (if enabled)

### Benefits of Installing as PWA

-   **Faster access**: Launch directly from your home screen
-   **Offline mode**: Continue tracking workouts without internet
-   **Native feel**: Full-screen experience without browser UI
-   **Auto-updates**: Always get the latest version automatically
-   **Storage**: Local data storage for better performance

## Technologies Used

### Frontend

-   React 19
-   TypeScript
-   Vite
-   Redux Toolkit for state management
-   React Router for navigation
-   Ant Design (antd) for UI components
-   Tailwind CSS for styling
-   Framer Motion for animations
-   i18next for internationalization
-   Recharts for data visualization

### Backend & Authentication

-   Supabase for backend services
-   Supabase Auth for authentication

### Development Tools

-   ESLint for code linting
-   GitHub Actions for CI/CD
-   GitHub Pages for hosting

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/gym.git
```

2. Install dependencies:

```bash
npm i
```

3. Set up environment variables.
   Create a .env.local file with your Supabase credentials:

```javascript
VITE_SUPABASE_URL = your_supabase_url;
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key;
```

4. Run development server:

```bash
npm run dev
```
