import type { Workout } from "../draft/types";
import type { RootState } from "../reducer.config";

const getHistoryWorkouts = (state: RootState): Workout[] => {
    return state.history.workouts;
};

const isLoading = (state: RootState): boolean => {
    return state.history.isLoading;
};

const isError = (state: RootState): boolean | undefined => {
    return state.history.isError;
};

export const historySelectors = {
    getHistoryWorkouts,
    isLoading,
    isError,
};
