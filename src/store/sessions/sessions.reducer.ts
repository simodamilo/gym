import { createReducer } from "@reduxjs/toolkit";
import type { SessionsState } from "./types";
import { sessionsActions } from "./sessions.actions";
import { getProgressionKey } from "./progression.key";

const sessionsState: SessionsState = {
    sessions: [],
    activeSessionId: undefined,
    progressionByExercise: {},
    isLoading: false,
    isLoadingProgression: false,
    isError: false,
};

export const sessionsReducer = {
    sessions: createReducer(sessionsState, (builder) => {
        builder
            .addCase(sessionsActions.fetchSessionsForDay.pending, (state, action) => {
                state.isLoading = true;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(sessionsActions.fetchSessionsForDay.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.sessions = action.payload ?? [];
            })
            .addCase(sessionsActions.fetchSessionsForDay.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(sessionsActions.startSession.pending, (state, action) => {
                state.isLoading = true;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(sessionsActions.startSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.activeSessionId = action.payload;
            })
            .addCase(sessionsActions.startSession.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(sessionsActions.saveSessionSets.rejected, (state) => {
                state.isError = true;
            })
            .addCase(sessionsActions.completeSession.fulfilled, (state) => {
                state.activeSessionId = undefined;
            })
            .addCase(sessionsActions.fetchProgressionForExercise.pending, (state) => {
                state.isLoadingProgression = true;
            })
            .addCase(sessionsActions.fetchProgressionForExercise.fulfilled, (state, action) => {
                state.isLoadingProgression = false;
                if (action.payload) {
                    state.progressionByExercise[getProgressionKey(action.payload.exerciseId, action.payload.workoutId)] = action.payload.entries;
                }
            })
            .addCase(sessionsActions.fetchProgressionForExercise.rejected, (state) => {
                state.isLoadingProgression = false;
                state.isError = true;
            });
    }),
};
