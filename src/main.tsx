import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import ProtectedPage from "./utils/auth/ProtectedPage.tsx";
import { Workouts } from "./pages/workouts/Workouts.tsx";
import { Profile } from "./pages/profile/Profile.tsx";
import { Exercises } from "./pages/exercises/Exercises.tsx";
import "./utils/i18n/i18n";
import { WorkoutComponent } from "./pages/workouts/components/workout/Workout.component.tsx";
import App from "./App.tsx";
import { Login } from "./pages/login/Login.tsx";
import { useEffect, useRef, useState } from "react";
import { Provider, useSelector } from "react-redux";
import store, { useAppDispatch } from "./store/store.config.ts";
import type { RootState } from "./store/reducer.config.ts";
import { currentSelectors } from "./store/current/current.selectors.ts";
import { currentActions } from "./store/current/current.actions.ts";
import AuthProvider, { useAuth } from "./utils/auth/AuthProvider.tsx";

const MIN_SPLASH_TIME = 1000;

// eslint-disable-next-line react-refresh/only-export-components
const RootWithSplash = () => {
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const isLoadingWorkout = useSelector((state: RootState) => currentSelectors.isLoading(state));

    const [showSplash, setShowSplash] = useState(true);
    const splashStartTime = useRef(Date.now());

    useEffect(() => {
        if (user) {
            dispatch(currentActions.fetchCurrentWorkout());
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (!user) {
            // For no user: show splash for at least MIN_SPLASH_TIME
            const elapsed = Date.now() - splashStartTime.current;
            const remaining = MIN_SPLASH_TIME - elapsed;

            if (remaining > 0) {
                const timer = setTimeout(() => setShowSplash(false), remaining);
                return () => clearTimeout(timer);
            } else {
                setShowSplash(false);
            }
        } else if (!isLoadingWorkout) {
            // For logged user: wait for API call + MIN_SPLASH_TIME
            const elapsed = Date.now() - splashStartTime.current;
            const remaining = MIN_SPLASH_TIME - elapsed;

            if (remaining > 0) {
                const timer = setTimeout(() => setShowSplash(false), remaining);
                return () => clearTimeout(timer);
            } else {
                setShowSplash(false);
            }
        }
    }, [user, isLoadingWorkout]);

    if (showSplash) return null;

    return <RouterProvider router={router} />;
};

const router = createBrowserRouter([
    {
        path: "/gym",
        element: <App />,
        errorElement: <div>Error loading page</div>,
        children: [
            { index: true, element: <Navigate to="/gym/login" replace /> },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "workouts",
                element: <ProtectedPage />,
                children: [{ index: true, element: <Workouts /> }],
            },
            {
                path: "workouts/create",
                element: <ProtectedPage />,
                children: [{ index: true, element: <WorkoutComponent isDraft /> }],
            },
            {
                path: "profile",
                element: <ProtectedPage />,
                children: [{ index: true, element: <Profile /> }],
            },
            {
                path: "exercises",
                element: <ProtectedPage />,
                children: [{ index: true, element: <Exercises /> }],
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <AuthProvider>
            <RootWithSplash />
        </AuthProvider>
    </Provider>
);
