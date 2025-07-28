import { createReducer } from "@reduxjs/toolkit";
import type { Day, DayExercise, DraftState } from "./types";
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
                if (action.payload && action.payload[0]) {
                    const mappedWorkout = workoutMapper.getDraftWorkoutDataMapper(action.payload[0]);
                    state.draftWorkout = mappedWorkout;
                }
                state.isLoadingWorkout = false;
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
                state.draftWorkout = action.payload ? action.payload[0] : state.draftWorkout;
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
            .addCase(draftActions.upsertExercise.pending, (state, action) => {
                state.isLoadingExercises = true;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(draftActions.upsertExercise.fulfilled, (state, action) => {
                state.isLoadingExercises = false;
                if (!action.payload || !state.draftWorkout) return;

                const firstItem = action.payload[0];

                const updatedDay = state.draftWorkout.days.find(
                    (day: Day) => day.id === firstItem.day_id
                );

                if (updatedDay) {
                    let newDayExercises: DayExercise[] = updatedDay.day_exercises || [];

                    newDayExercises = newDayExercises.map((day_exercise) => {
                        if (day_exercise.id === firstItem.id) {
                            return {
                                ...day_exercise,
                                exercise: {
                                    id: firstItem.exercises.id,
                                    name: firstItem.exercises.name,
                                    category_id: firstItem.exercises.category_id,
                                },
                            };
                        }
                        return day_exercise;
                    });

                    // Replace updated day in the workout
                    state.draftWorkout = {
                        ...state.draftWorkout,
                        days: state.draftWorkout.days.map((day) =>
                            day.id === updatedDay.id
                                ? { ...updatedDay, day_exercises: newDayExercises }
                                : day
                        ),
                    };
                }
            })
            .addCase(draftActions.upsertExercise.rejected, (state) => {
                state.isLoadingExercises = false;
                state.isError = true;
            });
    }),
};
