import { createAsyncThunk } from "@reduxjs/toolkit";
import { createClient } from "@supabase/supabase-js";
import type { Exercise } from "./types";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const fetchAllExercises = createAsyncThunk(
  "data/fetchAllExercises",
  async (_arg, thunkAPI) => {
    try {
      const { data } = await supabase.from("exercises").select();
      if (!data) {
        return thunkAPI.rejectWithValue("No data found");
      }
      return data as Exercise[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const exercisesActions = {
  fetchAllExercises,
};

export { exercisesActions };
