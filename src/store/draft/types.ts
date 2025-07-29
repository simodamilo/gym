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
    createdAt?: number;
}

export interface Day {
    id: number;
    name?: string;
    dayExercises: DayExercise[];
    createdAt?: number;
}

export interface DayExercise {
    id: number;
    rest?: number;
    orderNumber: number;
    exercise?: Exercise;
    sets: Set[];
}

export interface Set {
    id: number;
    setNumber: number;
    reps?: number;
    weight?: number;
    notes?: string;
}

/* Types used for payload to sent to be */
export interface UpsertDayPayload {
    id: number;
    name?: string;
    workout_id?: number;
    created_at?: number;
}

export interface UpsertDayExercisePayload {
    id: number;
    day_id: number;
    order_number: number;
    exercise_id: number;
}

export interface UpsertSetPayload {
    id: number;
    day_exercise_id: number;
    set_number: number;
    reps: number;
    weight?: number;
    notes?: string; 
}

/* Types used for reponse returned from be */
export interface DayExerciseResponse {
    id: number;
    day_id: number;
    order_number: number;
    day_exercise_sets: SetResponse[];
    exercise_id: number;
    exercises: Exercise;
}

export interface SetResponse {
    id: number;
    set_number: number;
    reps: number;
    weight?: number;
    notes?: string;
}
