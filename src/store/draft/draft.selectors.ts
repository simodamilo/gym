import type { RootState } from "../reducer.config";
import type { DayExercise, Workout } from "./types";

const getDraftWorkout = (state: RootState): Workout | undefined => {
    return state.draft.draftWorkout;
};

const getDraftExercisesByDayId = (state: RootState, dayId: number): DayExercise[] => {
    return state.draft.draftWorkout?.days.find((day) => day.id === dayId)?.day_exercises || [];
};

const isLoadingWorkout = (state: RootState): boolean => {
    return state.draft.isLoadingWorkout;
};

const isLoadingDays = (state: RootState): boolean => {
    return state.draft.isLoadingDays;
};

export const draftSelectors = {
    getDraftWorkout,
    isLoadingWorkout,
    isLoadingDays,
    getDraftExercisesByDayId,
};
