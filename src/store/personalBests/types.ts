export interface PersonalBest {
    exerciseId: string;
    exerciseName: string;
    maxWeight: number;
    category: string;
}

export interface PersonalBestsState {
    personalBests: PersonalBest[];
    isLoading: boolean;
    isError: boolean;
}

// Response types from Supabase (using 'any' to handle Supabase's nested structure)
export interface PersonalBestsWorkoutResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    days: any[];
}
