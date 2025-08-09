import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../../App";
import { Login } from "../../pages/login/Login";
import ProtectedPage from "../auth/ProtectedPage";
import { Workouts } from "../../pages/workouts/Workouts";
import { WorkoutComponent } from "../../pages/workouts/components/workout/Workout.component";
import { Profile } from "../../pages/profile/Profile";
import { Exercises } from "../../pages/exercises/Exercises";

export const router = createBrowserRouter([
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
                children: [
                    {
                        element: <Workouts />,
                        children: [
                            { index: true, element: <Navigate to="current" replace /> },
                            { path: "current", element: <WorkoutComponent isReadOnly /> },
                            { path: "history", element: <div>Something</div> },
                        ],
                    },
                ],
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
