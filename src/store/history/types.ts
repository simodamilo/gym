import type { Workout } from "../draft/types";

export type HistoryState = {
    workouts: Workout[];
    isLoading: boolean;
    isError: boolean;
    currentRequestId?: string;
};
