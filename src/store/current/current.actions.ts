import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import type { UpsertDayPayload } from "../draft/types";

const fetchCurrentWorkout = createAsyncThunk("data/fetchCurrentWorkout", async (_arg, thunkAPI) => {
    try {
        const { data, error } = await supabase
            .from("workouts")
            .select(
                `
                    id, status, created_at, start_date, end_date, days (
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

        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const updateDayStart = createAsyncThunk("data/updateDayStart", async (day: UpsertDayPayload, thunkAPI) => {
    try {
        const { error } = await supabase.from("days").update(day).eq("id", day.id).select();

        if (error) {
            throw new Error("Error in updating day");
        }

        thunkAPI.dispatch(currentActions.fetchCurrentWorkout());
        return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const showSwitcher = createAction("data/showSwitcher", (show: boolean) => {
    return {
        payload: show,
    };
});

const currentActions = {
    fetchCurrentWorkout,
    updateDayStart,
    showSwitcher,
};

export { currentActions };
