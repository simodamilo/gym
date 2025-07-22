import { createReducer } from "@reduxjs/toolkit";
import type { WorkoutsState } from "./types";
import { workoutsActions } from "./workouts.action";

const workoutsState: WorkoutsState = {
    currentWorkout: undefined,
    draftWorkout: undefined,
    historyWorkouts: [],
    isLoading: false,
    isError: false,
};

export const workoutsReducer = {
    workouts: createReducer(workoutsState, (builder) => {
        builder
            .addCase(workoutsActions.fetchDraftWorkout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(workoutsActions.fetchDraftWorkout.fulfilled, (state, action) => {
                state.isLoading = false;
                state.draftWorkout = action.payload[0];
            })
            .addCase(workoutsActions.fetchDraftWorkout.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
    }),
};
