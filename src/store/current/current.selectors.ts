import type { Workout } from "../draft/types";
import type { RootState } from "../reducer.config";

const getCurrentWorkout = (state: RootState): Workout | undefined => {
    return state.current.workout;
};

const isLoading = (state: RootState): boolean => {
    return state.current.isLoading;
};

export const currentSelectors = {
    getCurrentWorkout,
    isLoading,
};
