import type { Exercise } from "../exercises/types";

export type DraftState = {
    currentWorkout?: Workout;
    draftWorkout?: Workout;
    historyWorkouts: Workout[];
    isLoadingWorkout: boolean;
    isLoadingDays: boolean;
    isLoadingExercises: boolean;
    isError: boolean;
    currentRequestId?: string;
};

export interface Workout {
    id: number;
    name: string;
    description?: string;
    status: string;
    days: Day[];
    created_at: number;
}

export interface Day {
    id: number;
    name?: string;
    day_exercises: DayExercise[];
    created_at?: number;
}

export interface AddDayPayload {
    id: number;
    name?: string;
    workout_id?: number;
    created_at?: number;
}

export interface DayExercise {
    id: number;
    order_number: number;
    exercise?: Exercise;
}

export interface UpsertDayExercisePayload {
    id?: number;
    day_id: number;
    order_number: number;
    exercise_id: number;
}

export interface DayExerciseResponse {
    id: number;
    day_id: number;
    order_number: number;
    exercise_id: number;
    exercises: Exercise;
}
