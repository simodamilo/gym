import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import type { RootState } from "../reducer.config";
import type { UpsertDayPayload, WorkoutResponse } from "../draft/types";

const fetchCurrentWorkout = createAsyncThunk("data/fetchCurrentWorkout", async (_arg, thunkAPI) => {
    try {
        const state = thunkAPI.getState() as RootState;
        if (state.draft.isLoadingWorkout && thunkAPI.requestId !== state.draft.currentRequestId) {
            return;
        }
        const { data, error } = await supabase
            .from("workouts")
            .select(
                `
                    id, name, description, status, created_at, days (
                        id, name, counter, is_last, last_workout, order, created_at, day_exercises (
                            id,
                            order_number,
                            rest, 
                            notes,
                            created_at,
                            exercises_catalog (
                                id, name, category, description, created_at
                            ), 
                            day_exercise_sets (
                                id, set_number, reps, weight, created_at
                            )
                        )
                    )
                `
            )
            .eq("status", "published");
        if (error) {
            throw Error("Error in get draft workout");
        }
        return data as WorkoutResponse[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const updateDayStart = createAsyncThunk("data/updateDayStart", async (day: UpsertDayPayload, thunkAPI) => {
    try {
        const { error } = await supabase
            .from("days")
            .upsert([day], {
                onConflict: "id",
            })
            .select();

        if (error) {
            throw new Error("Error in updating day");
        }

        return day;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const currentActions = {
    fetchCurrentWorkout,
    updateDayStart,
};

export { currentActions };
