import { createReducer } from "@reduxjs/toolkit";
import type { ExercisesState } from "./types";
import { exercisesCatalogActions } from "./exercisesCatalog.action";

const exercisesState: ExercisesState = {
    exercises: [],
    showCreationModal: false,
    isLoading: false,
    isError: false,
};

export const exercisesReducer = {
    exercises: createReducer(exercisesState, (builder) => {
        builder
            .addCase(exercisesCatalogActions.fetchExercisesCatalog.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(exercisesCatalogActions.fetchExercisesCatalog.fulfilled, (state, action) => {
                state.isLoading = false;
                state.exercises = action.payload;
            })
            .addCase(exercisesCatalogActions.fetchExercisesCatalog.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(exercisesCatalogActions.addExercise.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(exercisesCatalogActions.addExercise.fulfilled, (state, action) => {
                state.isLoading = false;
                // New exercises have no prefs row yet, so they start untracked.
                state.exercises = [...state.exercises, { ...action.payload[0], show_in_personal_best: false }];
            })
            .addCase(exercisesCatalogActions.addExercise.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(exercisesCatalogActions.updateExercise.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(exercisesCatalogActions.updateExercise.fulfilled, (state, action) => {
                state.isLoading = false;
                state.exercises = [...state.exercises.map((exercise) => (exercise.id === action.payload[0].id ? action.payload[0] : exercise))];
            })
            .addCase(exercisesCatalogActions.updateExercise.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(exercisesCatalogActions.deleteExercise.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(exercisesCatalogActions.deleteExercise.fulfilled, (state, action) => {
                state.isLoading = false;
                state.exercises = [...state.exercises.filter((exercise) => exercise.id !== action.payload)];
            })
            .addCase(exercisesCatalogActions.deleteExercise.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(exercisesCatalogActions.togglePersonalBest.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(exercisesCatalogActions.togglePersonalBest.fulfilled, (state, action) => {
                state.isLoading = false;
                // The preference lives in user_exercise_prefs now, so patch the flag in place
                // rather than replacing the (shared) catalog row.
                state.exercises = state.exercises.map((exercise) =>
                    exercise.id === action.payload.id ? { ...exercise, show_in_personal_best: action.payload.showInPersonalBest } : exercise,
                );
            })
            .addCase(exercisesCatalogActions.togglePersonalBest.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                console.error("Failed to toggle personal best:", action.payload);
            })
            .addCase(exercisesCatalogActions.manageCreateModal, (state, action) => {
                state.showCreationModal = action.payload;
            });
    }),
};
