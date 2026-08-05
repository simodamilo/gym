import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { AddExercisePayload, ExerciseCatalog, UserExercisePref } from "./types";
import { supabase } from "../supabaseClient";
import { personalBestsActions } from "../personalBests/personalBests.actions";
import { mergeExercisePrefs } from "./exercisesCatalog.mapper";
import { setExerciseTracked } from "./userExercisePrefs";

const getUserId = async (): Promise<string> => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
        throw new Error("Not authenticated");
    }
    return data.user.id;
};

const fetchExercisesCatalog = createAsyncThunk("data/fetchExercisesCatalog", async (_arg, thunkAPI) => {
    try {
        // RLS returns global exercises (user_id is null) plus the user's own ones.
        const [catalogResult, prefsResult] = await Promise.all([
            supabase.from("exercises_catalog").select(),
            supabase.from("user_exercise_prefs").select("exercise_id, show_in_personal_best"),
        ]);

        if (catalogResult.error) {
            return thunkAPI.rejectWithValue(catalogResult.error.message);
        }
        if (prefsResult.error) {
            return thunkAPI.rejectWithValue(prefsResult.error.message);
        }

        return mergeExercisePrefs((catalogResult.data ?? []) as ExerciseCatalog[], (prefsResult.data ?? []) as UserExercisePref[]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const addExercise = createAsyncThunk("data/addExercise", async (exercise: AddExercisePayload, thunkAPI) => {
    try {
        // Stamped with the current user so it stays private; only global rows have a null user_id.
        const userId = await getUserId();
        const { data, error } = await supabase
            .from("exercises_catalog")
            .insert([{ ...exercise, user_id: userId }])
            .select();

        if (error) {
            return thunkAPI.rejectWithValue(error.message);
        }

        return data as ExerciseCatalog[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const updateExercise = createAsyncThunk("data/updateExercise", async (exercise: AddExercisePayload, thunkAPI) => {
    try {
        const { data, error } = await supabase.from("exercises_catalog").update(exercise).eq("id", exercise.id).select();

        if (error) {
            return thunkAPI.rejectWithValue(error.message);
        }

        // RLS silently matches no rows when the exercise is global, so report it explicitly.
        if (!data || data.length === 0) {
            return thunkAPI.rejectWithValue("Global catalog exercises cannot be edited");
        }

        return data as ExerciseCatalog[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const deleteExercise = createAsyncThunk("data/deleteExercise", async (id: string, thunkAPI) => {
    try {
        const { data, error } = await supabase.from("exercises_catalog").delete().eq("id", id).select();

        if (error) {
            return thunkAPI.rejectWithValue(error.message);
        }

        if (!data || data.length === 0) {
            return thunkAPI.rejectWithValue("Global catalog exercises cannot be deleted");
        }

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
            // Per-user preference: written to user_exercise_prefs rather than to the shared
            // catalog row, so one user's choice cannot affect anyone else.
            await setExerciseTracked(payload.id, payload.showInPersonalBest);

            // Refresh personal bests state to reflect the changes
            // Manual PRs are kept in the database but filtered out by the preference
            await thunkAPI.dispatch(personalBestsActions.fetchPersonalBests());

            return payload;
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
