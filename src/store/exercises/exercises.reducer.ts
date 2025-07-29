import { createReducer } from "@reduxjs/toolkit";
import type { ExercisesState } from "./types";
import { exercisesActions } from "./exercises.action";

const exercisesState: ExercisesState = {
  exercises: [],
  isLoading: false,
  isError: false,
};

export const exercisesReducer = {
  exercises: createReducer(exercisesState, (builder) => {
    builder
      .addCase(exercisesActions.fetchAllExercises.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(exercisesActions.fetchAllExercises.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exercises = action.payload;
      })
      .addCase(exercisesActions.fetchAllExercises.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(exercisesActions.addExercise.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(exercisesActions.addExercise.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exercises = [...state.exercises, action.payload[0]];
      })
      .addCase(exercisesActions.addExercise.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  }),
};
