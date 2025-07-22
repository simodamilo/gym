import type { RootState } from "../reducer.config";
import type { Workout } from "./types";

const getDraftWorkout = (state: RootState): Workout | undefined => {
    return state.workouts.draftWorkout;
};

export const workoutsSelectors = {
    getDraftWorkout,
};
