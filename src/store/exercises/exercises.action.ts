import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AddExercisePayload, Exercise } from "./types";
import { supabase } from "../supabaseClient";

const fetchAllExercises = createAsyncThunk("data/fetchAllExercises", async (_arg, thunkAPI) => {
  try {
    const { data } = await supabase.from("exercises").select();
    return data as Exercise[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const addExercise = createAsyncThunk("data/addExercise", async (exercise: AddExercisePayload, thunkAPI) => {
  try {
    const { data } = await supabase.from("exercises").insert([exercise]).select();
    return data as Exercise[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const exercisesActions = {
  fetchAllExercises,
  addExercise,
};

export { exercisesActions };
