import { createReducer } from "@reduxjs/toolkit";
import { historyActions } from "./history.actions";
import { workoutMapper } from "../draft/draft.mapper";
import type { HistoryState } from "./types";

const historyState: HistoryState = {
    workouts: [],
    isLoading: false,
    isError: false,
};

export const historyReducer = {
    history: createReducer(historyState, (builder) => {
        builder
            .addCase(historyActions.fetchHistoryWorkout.pending, (state, action) => {
                state.isLoading = true;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(historyActions.fetchHistoryWorkout.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload && action.payload) {
                    const mappedWorkouts = action.payload.map((workout) => {
                        return workoutMapper.getDraftWorkoutDataMapper(workout);
                    })

                    state.workouts = mappedWorkouts;
                }
            })
            .addCase(historyActions.fetchHistoryWorkout.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
    }),
};
