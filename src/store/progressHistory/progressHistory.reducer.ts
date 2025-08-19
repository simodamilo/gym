import { createReducer } from "@reduxjs/toolkit";
import type { ProgressState } from "./types";
import { progressHistoryActions } from "./progressHistory.action";

const progressesState: ProgressState = {
    progresses: [],
    isLoading: false,
    isError: false,
};

export const progressesReducer = {
    progresses: createReducer(progressesState, (builder) => {
        builder
            .addCase(progressHistoryActions.fetchProgressesByType.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(progressHistoryActions.fetchProgressesByType.fulfilled, (state, action) => {
                state.isLoading = false;
                state.progresses = action.payload;
            })
            .addCase(progressHistoryActions.fetchProgressesByType.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(progressHistoryActions.addWeight.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(progressHistoryActions.addWeight.fulfilled, (state, action) => {
                state.isLoading = false;
                state.progresses = [...state.progresses, action.payload[0]];
            })
            .addCase(progressHistoryActions.addWeight.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
    }),
};
