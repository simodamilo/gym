import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import type { AddProgressHistory, ProgressHistory } from "./types";

const fetchProgressesByType = createAsyncThunk("data/fetchProgressesByType", async (_arg, thunkAPI) => {
    try {
        const { data } = await supabase.from("progress_history").select();
        return data as ProgressHistory[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const addWeight = createAsyncThunk("data/addWeight", async (progress: AddProgressHistory, thunkAPI) => {
    try {
        const { data } = await supabase
            .from("progress_history")
            .upsert(progress, {
                onConflict: "id",
            }).select();
        return data as ProgressHistory[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const progressHistoryActions = {
    fetchProgressesByType,
    addWeight,
};

export { progressHistoryActions };
