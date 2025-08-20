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
                state.progresses = action.payload.sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());
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
                if (state.progresses.find((progress) => progress.id === action.payload[0].id)) {
                    state.progresses = state.progresses.map((progress) => {
                        if (progress.id === action.payload[0].id) {
                            return action.payload[0];
                        }
                        return progress;
                    });
                } else {
                    state.progresses = [...state.progresses, action.payload[0]];
                }
            })
            .addCase(progressHistoryActions.addWeight.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
    }),
};
