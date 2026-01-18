import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../../App";
import { Login } from "../../pages/login/Login";
import ProtectedPage from "../auth/ProtectedPage";
import { Workouts } from "../../pages/workouts/Workouts";
import { WorkoutComponent } from "../../pages/workouts/components/workout/Workout.component";
import { Profile } from "../../pages/profile/Profile";
import { Exercises } from "../../pages/exercises/Exercises";
import { ExercisesList } from "../../pages/workouts/components/exercisesList/ExercisesList";
import { Current } from "../../pages/workouts/current/Current";
import { CreateWorkout } from "../../pages/workouts/create/CreateWorkout.component";
import { History } from "../../pages/workouts/history/History";
import { CreateExercisesList } from "../../pages/workouts/create/components/CreateExercisesList.component";

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
                            { path: 'current', element: <Current /> },
                            { path: 'current/exercises', element: <ExercisesList /> },
                            { path: "history", element: <History /> },
                            { path: "history/:workoutId", element: <WorkoutComponent isHistory /> },
                            { path: "create/days", element: <CreateWorkout /> },
                            { path: "create/days/:dayId/exercises", element: <CreateExercisesList /> }
                        ],
                    },
                ],
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
