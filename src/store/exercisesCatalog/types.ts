export type ExercisesState = {
    exercises: ExerciseCatalog[];
    showCreationModal: boolean;
    isLoading: boolean;
    isError: boolean;
};

export interface ExerciseCatalog {
    id: string;
    name: string;
    category: string;
    description?: string;
    created_at?: number;
    /** null for global catalog exercises, set for a user's own private exercise */
    user_id?: string | null;
    /** Per-user preference, merged in from user_exercise_prefs (not a column on the row) */
    show_in_personal_best?: boolean;
}

export interface AddExercisePayload {
    id: string;
    name: string;
    category: string;
    description?: string;
}

export interface UserExercisePref {
    exercise_id: string;
    show_in_personal_best: boolean;
}

/** Global exercises are read-only from the app; only a user's own exercises can be edited. */
export const isCustomExercise = (exercise: ExerciseCatalog): boolean => !!exercise.user_id;
