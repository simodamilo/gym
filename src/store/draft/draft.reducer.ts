import { createReducer } from "@reduxjs/toolkit";
import type { Day, DraftState } from "./types";
import { draftActions } from "./draft.actions";
import { workoutMapper } from "./draft.mapper";

const draftState: DraftState = {
    currentWorkout: undefined,
    draftWorkout: undefined,
    historyWorkouts: [],
    isLoadingWorkout: false,
    isLoadingDays: false,
    isLoadingExercises: false,
    isError: false,
};

export const draftReducer = {
    draft: createReducer(draftState, (builder) => {
        builder
            .addCase(draftActions.fetchDraftWorkout.pending, (state, action) => {
                state.isLoadingWorkout = true;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(draftActions.fetchDraftWorkout.fulfilled, (state, action) => {
                state.isLoadingWorkout = false;
                if (action.payload && action.payload[0]) {
                    const mappedWorkout = workoutMapper.getDraftWorkoutDataMapper(action.payload[0]);
                    state.draftWorkout = mappedWorkout;
                }
            })
            .addCase(draftActions.fetchDraftWorkout.rejected, (state) => {
                state.isLoadingWorkout = false;
                state.isError = true;
            })
            .addCase(draftActions.createDraftWorkout.pending, (state, action) => {
                state.isLoadingWorkout = true;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(draftActions.createDraftWorkout.fulfilled, (state, action) => {
                state.isLoadingWorkout = false;
                if (action.payload && action.payload[0]) {
                    const mappedWorkout = workoutMapper.getDraftWorkoutDataMapper(action.payload[0]);
                    state.draftWorkout = mappedWorkout;
                }
            })
            .addCase(draftActions.createDraftWorkout.rejected, (state) => {
                state.isLoadingWorkout = false;
                state.isError = true;
            })
            .addCase(draftActions.upsertDay.pending, (state, action) => {
                state.isLoadingDays = true;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(draftActions.upsertDay.fulfilled, (state, action) => {
                state.isLoadingDays = false;
                if (!action.payload || !state.draftWorkout) return;

                let newDays: Day[] = [...state.draftWorkout.days];
                if (newDays.find((day) => day.id === action.payload.id)) {
                    newDays = newDays.map((day) => {
                        if (day.id === action.payload.id) {
                            return action.payload;
                        }
                        return day;
                    });
                } else {
                    newDays.push(action.payload);
                }

                if (state.draftWorkout) {
                    state.draftWorkout = {
                        ...state.draftWorkout,
                        days: newDays,
                    };
                }
            })
            .addCase(draftActions.upsertDay.rejected, (state) => {
                state.isLoadingDays = false;
                state.isError = true;
            })
            .addCase(draftActions.deleteDay.pending, (state, action) => {
                state.isLoadingDays = true;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(draftActions.deleteDay.fulfilled, (state, action) => {
                state.isLoadingDays = false;
                if (!action.payload || !state.draftWorkout) return;

                let newDays: Day[] = [...state.draftWorkout.days];
                newDays = newDays.filter((day) => day.id !== action.payload);

                if (state.draftWorkout) {
                    state.draftWorkout = {
                        ...state.draftWorkout,
                        days: newDays,
                    };
                }
            })
            .addCase(draftActions.deleteDay.rejected, (state) => {
                state.isLoadingDays = false;
                state.isError = true;
            })
            .addCase(draftActions.upsertExercises.pending, (state, action) => {
                state.isLoadingExercises = true;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(draftActions.upsertExercises.fulfilled, (state) => {
                state.isLoadingExercises = false;                
            })
            .addCase(draftActions.upsertExercises.rejected, (state) => {
                state.isLoadingExercises = false;
                state.isError = true;
            })
            .addCase(draftActions.deleteExercise.pending, (state, action) => {
                state.isLoadingExercises = true;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(draftActions.deleteExercise.fulfilled, (state) => {
                state.isLoadingExercises = false;
            })
            .addCase(draftActions.deleteExercise.rejected, (state) => {
                state.isLoadingExercises = false;
                state.isError = true;
            })
            .addCase(draftActions.resetDraft, (state) => {
                state.draftWorkout = undefined;
            });
    }),
};
