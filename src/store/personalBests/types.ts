export interface PersonalBest {
    exerciseId: string;
    exerciseName: string;
    maxWeight: number;
    category: string;
    isManual?: boolean;
    createdAt?: string;
    manualId?: string; // ID of the manual PR record if it's a manual entry
}

export interface PersonalBestsState {
    personalBests: PersonalBest[];
    isLoading: boolean;
    isError: boolean;
}

// Manual Personal Best types
export interface ManualPersonalBestPayload {
    exerciseId: string;
    weight: number;
}

export interface UpdateManualPersonalBestPayload {
    id: string;
    weight: number;
}

export interface ManualPersonalBestResponse {
    id: string;
    user_id: string;
    exercise_id: string;
    weight: number;
    created_at: string;
    updated_at: string;
    exercises_catalog?: {
        id: string;
        name: string;
        category: string;
    };
}
