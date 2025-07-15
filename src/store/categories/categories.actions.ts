import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import type { Category } from "./types";

const fetchAllCategories = createAsyncThunk("data/fetchAllCategories", async (_arg, thunkAPI) => {
  try {
    const { data } = await supabase.from("categories").select();
    return data as Category[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const categoriesActions = {
  fetchAllCategories,
};

export { categoriesActions };
