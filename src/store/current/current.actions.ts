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
                        id, name, counter, is_last, is_extra, last_workout, order, created_at, day_exercises (
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

/**
 * The note of an exercise belongs to the plan, not to a training session: it is the same note
 * every time that exercise comes round. It therefore lives on `day_exercises` and is written
 * here, since the session save owns `session_sets` only.
 */
const updateExerciseNotes = createAsyncThunk("data/updateExerciseNotes", async (payload: { dayExerciseId: string; notes?: string }, thunkAPI) => {
    try {
        /* `.select()` so a row denied by RLS is caught: such an update comes back without an
           error and simply affects nothing, which is the silent drop this fix exists to remove. */
        const { data, error } = await supabase.from("day_exercises").update({ notes: payload.notes }).eq("id", payload.dayExerciseId).select("id");

        if (error || !(data ?? []).length) {
            throw new Error("Error in updating exercise notes");
        }

        return payload;
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
    updateExerciseNotes,
    showSwitcher
};

export { currentActions };
