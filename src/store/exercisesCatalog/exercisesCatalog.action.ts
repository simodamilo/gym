import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AddExercisePayload, ExerciseCatalog } from "./types";
import { supabase } from "../supabaseClient";

const fetchExercisesCatalog = createAsyncThunk("data/fetchExercisesCatalog", async (_arg, thunkAPI) => {
    try {
        const { data } = await supabase.from("exercises_catalog").select();
        return data as ExerciseCatalog[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const addExercise = createAsyncThunk("data/addExercise", async (exercise: AddExercisePayload, thunkAPI) => {
    try {
        const { data } = await supabase.from("exercises_catalog").insert([exercise]).select();
        return data as ExerciseCatalog[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const exercisesCatalogActions = {
    fetchExercisesCatalog,
    addExercise,
};

export { exercisesCatalogActions };
