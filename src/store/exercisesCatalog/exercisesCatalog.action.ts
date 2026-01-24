import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { AddExercisePayload, ExerciseCatalog } from "./types";
import { supabase } from "../supabaseClient";
import { personalBestsActions } from "../personalBests/personalBests.actions";

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

const updateExercise = createAsyncThunk("data/updateExercise", async (exercise: AddExercisePayload, thunkAPI) => {
    try {
        const { data } = await supabase.from("exercises_catalog").update(exercise).eq("id", exercise.id).select();
        return data as ExerciseCatalog[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const deleteExercise = createAsyncThunk("data/deleteExercise", async (id: string, thunkAPI) => {
    try {
        await supabase.from("exercises_catalog").delete().eq("id", id);
        return id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const togglePersonalBest = createAsyncThunk(
    "data/togglePersonalBest",
    async (payload: { id: string; showInPersonalBest: boolean }, thunkAPI) => {
        try {
            // Update the exercises_catalog table
            const { data, error } = await supabase
                .from("exercises_catalog")
                .update({ show_in_personal_best: payload.showInPersonalBest })
                .eq("id", payload.id)
                .select();

            if (error) {
                return thunkAPI.rejectWithValue(error.message);
            }

            if (!data || data.length === 0) {
                return thunkAPI.rejectWithValue("No data returned from update");
            }

            // Refresh personal bests state to reflect the changes
            // Manual PRs are kept in the database but filtered out by show_in_personal_best
            await thunkAPI.dispatch(personalBestsActions.fetchPersonalBests());

            return data as ExerciseCatalog[];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const manageCreateModal = createAction<boolean>("data/manageCreateModal");

const exercisesCatalogActions = {
    fetchExercisesCatalog,
    addExercise,
    updateExercise,
    deleteExercise,
    togglePersonalBest,
    manageCreateModal,
};

export { exercisesCatalogActions };
