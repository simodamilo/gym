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
}

export interface AddExercisePayload {
    id: string;
    name: string;
    category: string;
    description?: string;
}
