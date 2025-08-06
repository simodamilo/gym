import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AuthProvider from "./utils/AuthProvider.tsx";
import ProtectedPage from "./ProtectedPage.tsx";
import { Workouts } from "./pages/workouts/Workouts.tsx";
import { Profile } from "./pages/profile/Profile.tsx";
import { Exercises } from "./pages/exercises/Exercises.tsx";
import "./utils/i18n/i18n";
import { WorkoutComponent } from "./pages/workouts/components/workout/Workout.component.tsx";
import App from "./App.tsx";
import { Login } from "./pages/login/Login.tsx";

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
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
);
