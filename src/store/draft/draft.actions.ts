import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import type { RootState } from "../reducer.config";
import { getNotificationApi } from "../../utils/notificationService";
import type { AddDayPayload, Workout } from "./types";

const fetchDraftWorkout = createAsyncThunk("data/fetchDraftWorkout", async (_arg, thunkAPI) => {
    try {
        const state = thunkAPI.getState() as RootState;
        if (state.draft.isLoadingWorkout && thunkAPI.requestId !== state.draft.currentRequestId) {
            return;
        }
        const { data } = await supabase
            .from("workouts")
            .select(
                `
                    id, name, description, created_at, status, days (
                        id, name, created_at, day_exercises (
                            id, exercise_id, exercises (
                                id, name
                            )
                        )
                    )
                `
            )
            .eq("status", "draft");
        if (!data || !data[0]) {
            thunkAPI.dispatch(createDraftWorkout());
        }
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const createDraftWorkout = createAsyncThunk("data/createDraftWorkout", async (_arg, thunkAPI) => {
    try {
        console.log("test");
        const { data } = await supabase
            .from("workouts")
            .insert([{ name: "New Workout", status: "draft", created_at: new Date().getMilliseconds() }])
            .select(
                `
                    id, name, description, created_at, status, days (
                        id, name, created_at
                    )
                `
            );
        return data as Workout[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const upsertDay = createAsyncThunk("data/upsertDay", async (day: AddDayPayload, thunkAPI) => {
    try {
        const { data } = await supabase
            .from("days")
            .upsert([day], {
                onConflict: "id",
            })
            .select();
        getNotificationApi().success({
            message: `Successfully saved`,
            placement: "top",
        });
        return data ? data[0] : null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const deleteDay = createAsyncThunk("data/deleteDay", async (dayId: number, thunkAPI) => {
    try {
        await supabase.from("days").delete().eq("id", dayId);
        return dayId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const draftActions = {
    fetchDraftWorkout,
    createDraftWorkout,
    upsertDay,
    deleteDay,
};

export { draftActions };
