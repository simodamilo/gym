import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import type { RootState } from "../reducer.config";
import { getNotificationApi } from "../../utils/notificationService";
import type { UpsertDayExercisePayload, UpsertDayPayload, DayExercise, Set, UpsertSetPayload } from "./types";

const fetchDraftWorkout = createAsyncThunk("data/fetchDraftWorkout", async (_arg, thunkAPI) => {
    try {
        const state = thunkAPI.getState() as RootState;
        if (state.draft.isLoadingWorkout && thunkAPI.requestId !== state.draft.currentRequestId) {
            return;
        }
        const { data } = await supabase
            .from("workouts")
            .select(
                `
                    id, name, description, created_at, status, days (
                        id, name, created_at, day_exercises (
                            id, 
                            exercise_id,
                            order_number,
                            exercises (
                                id, name, category_id
                            ), 
                            day_exercise_sets (
                                id, set_number, reps, weight, notes
                            )
                        )
                    )
                `
            )
            .eq("status", "draft");
        if (!data || !data[0]) {
            thunkAPI.dispatch(createDraftWorkout());
        }
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const createDraftWorkout = createAsyncThunk("data/createDraftWorkout", async (_arg, thunkAPI) => {
    try {
        const { data } = await supabase
            .from("workouts")
            .insert([{ name: "New Workout", status: "draft", created_at: new Date().getMilliseconds() }])
            .select(
                `
                    id, name, description, created_at, status, days (
                        id, name, created_at
                    )
                `
            );
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const upsertDay = createAsyncThunk("data/upsertDay", async (day: UpsertDayPayload, thunkAPI) => {
    try {
        const { data } = await supabase
            .from("days")
            .upsert([day], {
                onConflict: "id",
            })
            .select();
        getNotificationApi().success({
            message: `Successfully saved`,
            placement: "top",
        });
        return data ? data[0] : null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const deleteDay = createAsyncThunk("data/deleteDay", async (dayId: number, thunkAPI) => {
    try {
        await supabase.from("days").delete().eq("id", dayId);
        return dayId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const upsertExercises = createAsyncThunk("data/upsertExercise", 
    async (payloadData: {dayExercises: DayExercise[], dayId: number, isOrderUpdate?: boolean}, thunkAPI) => {
        try {
            if (!payloadData.isOrderUpdate) {
                const payloadDayExerciseSets: UpsertSetPayload[] = payloadData.dayExercises[0].sets.map((set: Set) => {
                    return {
                        id: set.id,
                        day_exercise_id: payloadData.dayExercises[0].id,
                        set_number: set.setNumber,
                        reps: set.reps!,
                        weight: set.weight,
                        notes: set.notes
                    }
                })

                await supabase
                    .from("day_exercise_sets")
                    .delete()
                    .eq("day_exercise_id", payloadData.dayExercises[0].id);
                await supabase
                    .from("day_exercise_sets")
                    .upsert(payloadDayExerciseSets, {
                        onConflict: "id, day_exercise_id",
                    });
            }

            const payloadDayExercises: UpsertDayExercisePayload[] = payloadData.dayExercises.map((dayExercise: DayExercise) => {
                return {
                    id: dayExercise.id,
                    day_id: payloadData.dayId,
                    order_number: dayExercise.orderNumber,
                    exercise_id: dayExercise.exercise!.id
                }
            });

            await supabase
                .from("day_exercises")
                .upsert(payloadDayExercises, {
                    onConflict: "id",
                });

            getNotificationApi().success({
                message: `Successfully saved`,
                placement: "top",
            });

            await thunkAPI.dispatch(fetchDraftWorkout());
            return;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
});

const deleteExercise = createAsyncThunk("data/deleteExercise", async (payload: { dayExerciseId: number, dayId: number}, thunkAPI) => {
    try {
        await supabase.from("day_exercises").delete().eq("id", payload.dayExerciseId);
        return {
            dayId: payload.dayId,
            dayExerciseId: payload.dayExerciseId
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const draftActions = {
    fetchDraftWorkout,
    createDraftWorkout,
    upsertDay,
    deleteDay,
    upsertExercises,
    deleteExercise
};

export { draftActions };
