import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import type { RootState } from "../reducer.config";

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
                    id, name, description, created_at, status, days (
                        id, name, created_at, day_exercises (
                            id, 
                            exercise_id,
                            order_number,
                            rest, 
                            notes,
                            exercises (
                                id, name, category_id
                            ), 
                            day_exercise_sets (
                                id, set_number, reps, weight
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

const currentActions = {
    fetchCurrentWorkout,
};

export { currentActions };
