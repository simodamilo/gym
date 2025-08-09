import type { ExerciseCatalog } from "../exercisesCatalog/types";

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
    status: string;
    createdAt?: number;
    startDate?: number;
    endDate?: number;
    days: Day[];
}

export interface Day {
    id: string;
    name?: string;
    createdAt?: number;
    counter?: number;
    isLast?: boolean;
    lastWorkout?: number;
    order?: number;
    dayExercises: DayExercise[];
}

export interface DayExercise {
    id: string;
    rest?: string;
    orderNumber: number;
    notes?: string;
    exercise?: ExerciseCatalog;
    sets: Set[];
}

export interface Set {
    id: string;
    setNumber: number;
    reps?: string;
    weight?: number;
}

/* Types used for payload to sent to be */
export interface UpsertDayPayload {
    id: string;
    name?: string;
    counter?: number;
    is_last?: boolean;
    last_workout?: number;
    order?: number;
    workout_id?: string;
}

export interface UpsertDayExercisePayload {
    id: string;
    day_id: string;
    exercises_catalog_id: string;
    order_number: number;
    rest?: string;
    notes?: string;
}

export interface UpsertSetPayload {
    id: string;
    day_exercise_id: string;
    set_number: number;
    reps: string;
    weight?: number;
}

/* Types used for reponse returned from be */
export interface WorkoutResponse {
    id: string;
    status: string;
    created_at: number;
    start_date?: number;
    end_date?: number;
    days: DayResponse[];
}

export interface DayResponse {
    id: string;
    name?: string;
    created_at?: number;
    counter?: number;
    is_last?: boolean;
    last_workout?: number;
    order?: number;
    day_exercises: DayExerciseResponse[];
}

export interface DayExerciseResponse {
    id: string;
    order_number: number;
    rest?: string;
    notes?: string;
    exercises_catalog: ExerciseCatalogResponse;
    day_exercise_sets: SetResponse[];
}

export interface ExerciseCatalogResponse {
    id: string;
    name: string;
    category: string;
    description?: string;
    created_at: number;
}

export interface SetResponse {
    id: string;
    set_number: number;
    reps: string;
    weight?: number;
    created_at: number;
}
