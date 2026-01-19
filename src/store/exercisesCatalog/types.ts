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
    show_in_personal_best?: boolean;
}

export interface AddExercisePayload {
    id: string;
    name: string;
    category: string;
    description?: string;
}
