import type { Exercise } from "../exercisesCatalog/types";

export type DraftState = {
    draftWorkout?: Workout;
    isLoadingWorkout: boolean;
    isLoadingDays: boolean;
    isLoadingExercises: boolean;
    isError: boolean;
    currentRequestId?: string;
};

export interface Workout {
    id: string;
    name: string;
    description?: string;
    status: string;
    createdAt?: number;
    days: Day[];
}

export interface Day {
    id: string;
    name?: string;
    createdAt?: number;
    dayExercises: DayExercise[];
}

export interface DayExercise {
    id: string;
    rest?: number;
    orderNumber: number;
    notes?: string;
    exercise?: Exercise;
    sets: Set[];
}

export interface Set {
    id: string;
    setNumber: number;
    reps?: number;
    weight?: number;
}

/* Types used for payload to sent to be */
export interface UpsertDayPayload {
    id: string;
    name: string;
    workout_id: string;
}

export interface UpsertDayExercisePayload {
    id: string;
    day_id: string;
    exercises_catalog_id: string;
    order_number: number;
    rest?: number;
    notes?: string;
}

export interface UpsertSetPayload {
    id: string;
    day_exercise_id: string;
    set_number: number;
    reps: number;
    weight?: number;
}

/* Types used for reponse returned from be */
export interface DayExerciseResponse {
    id: string;
    day_id: string;
    order_number: number;
    exercise_id: string;
    rest?: number;
    notes?: string;
    exercises: Exercise;
    day_exercise_sets: SetResponse[];
}

export interface SetResponse {
    id: string;
    set_number: number;
    reps: number;
    weight?: number;
}
