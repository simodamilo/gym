import type { RootState } from "../reducer.config";
import type { ExerciseCatalog } from "./types";

const getExercises = (state: RootState): ExerciseCatalog[] => {
    return state.exercises.exercises;
};

const isModalOpen = (state: RootState): boolean => {
    return state.exercises.showCreationModal;
};

export const exercisesSelectors = {
    getExercises,
    isModalOpen,
};
