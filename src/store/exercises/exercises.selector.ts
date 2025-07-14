import type { RootState } from "../reducer.config";
import type { Exercise } from "./types";

const getExercises = (state: RootState): Exercise[] => {
  return state.exercises.exercises;
};

export const exercisesSelectors = {
  getExercises,
};
