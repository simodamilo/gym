import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../../App";
import { Login } from "../../pages/login/Login";
import ProtectedPage from "../auth/ProtectedPage";
import { Workouts } from "../../pages/workouts/Workouts";
import { Profile } from "../../pages/profile/Profile";
import { Exercises } from "../../pages/exercises/Exercises";
import { Current } from "../../pages/workouts/current/Current";
import { CreateWorkout } from "../../pages/workouts/create/CreateWorkout.component";
import { History } from "../../pages/workouts/history/History";
import { CreateExercisesList } from "../../pages/workouts/create/components/CreateExercisesList.component";
import { CurrentExercisesList } from "../../pages/workouts/current/components/CurrentExercisesList";
import { HistoryWorkout } from "../../pages/workouts/history/components/HistoryWorkout.component";
import { HistoryExercisesList } from "../../pages/workouts/history/components/HistoryExercisesList";
import { Signup } from "../../pages/signup/Signup";
import { ForgotPassword } from "../../pages/forgotPassword/ForgotPassword";
import { ResetPassword } from "../../pages/resetPassword/ResetPassword";

export const router = createBrowserRouter([
    {
        path: "/gym",
        element: <App />,
        errorElement: <div>Error loading page</div>,
        children: [
            { index: true, element: <Navigate to="/gym/login" replace /> },
            { path: "signup", element: <Signup /> },
            { path: "forgot-password", element: <ForgotPassword /> },
            { path: "reset-password", element: <ResetPassword /> },
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
                            { index: true, element: <Navigate to="current/days" replace /> },
                            { path: "current/days", element: <Current /> },
                            { path: "current/days/:dayId/exercises", element: <CurrentExercisesList /> },
                            { path: "history/workouts", element: <History /> },
                            { path: "history/workouts/:workoutId/days", element: <HistoryWorkout /> },
                            { path: "history/workouts/:workoutId/days/:dayId/exercises", element: <HistoryExercisesList /> },
                            { path: "create/days", element: <CreateWorkout /> },
                            { path: "create/days/:dayId/exercises", element: <CreateExercisesList /> },
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
