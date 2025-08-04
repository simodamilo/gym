import type { RootState } from "../reducer.config";
import type { ExerciseCatalog } from "./types";

const getExercises = (state: RootState): ExerciseCatalog[] => {
  return state.exercises.exercises;
};

export const exercisesSelectors = {
  getExercises,
};
