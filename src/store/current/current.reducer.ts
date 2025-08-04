import { createReducer } from "@reduxjs/toolkit";
import type { CurrentState } from "./types";
import { currentActions } from "./current.actions";
import { workoutMapper } from "../draft/draft.mapper";

const currentState: CurrentState = {
    workout: undefined,
    isLoading: false,
    isError: false,
};

export const currentReducer = {
    current: createReducer(currentState, (builder) => {
        builder
            .addCase(currentActions.fetchCurrentWorkout.pending, (state, action) => {
                state.isLoading = true;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(currentActions.fetchCurrentWorkout.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload && action.payload[0]) {
                    const mappedWorkout = workoutMapper.getDraftWorkoutDataMapper(action.payload[0]);
                    state.workout = mappedWorkout;
                }
            })
            .addCase(currentActions.fetchCurrentWorkout.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(currentActions.updateDayStart.pending, (state, action) => {
                state.isLoading = true;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(currentActions.updateDayStart.fulfilled, (state, action) => {
                state.isLoading = false;

                if (action.payload && state.workout) {
                    state.workout = {
                        ...state.workout,
                        days: state.workout.days.map((day) => {
                            if (day.id === action.payload.id) {
                                return {
                                    ...day,
                                    lastWorkout: action.payload.last_workout,
                                };
                            }
                            return day;
                        }),
                    };
                }
            })
            .addCase(currentActions.updateDayStart.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
    }),
};
