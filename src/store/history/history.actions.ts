import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";

const fetchHistoryWorkout = createAsyncThunk("data/fetchHistoryWorkout", async (_arg, thunkAPI) => {
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
                            creation_notes,
                            reps_type,
                            custom_type,
                            created_at,
                            is_linked_to_next,
                            exercises_catalog (
                                id, name, category, description, created_at
                            ), 
                            day_exercise_sets (
                                id, set_number, reps, weight, base_weight, created_at
                            )
                        )
                    )
                `
            )
            .eq("status", "archived");
        if (error) {
            throw Error("Error in get history workout");
        }

        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const historyActions = {
    fetchHistoryWorkout,
};

export { historyActions };
