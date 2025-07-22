import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import type { Workout } from "./types";

const fetchDraftWorkout = createAsyncThunk("data/fetchDraftWorkout", async (_arg, thunkAPI) => {
    try {
        const { data } = await supabase.from("workouts").select().eq("status", "draft");
        return data as Workout[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const workoutsActions = {
    fetchDraftWorkout,
};

export { workoutsActions };
