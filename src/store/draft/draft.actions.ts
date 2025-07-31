import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import type { RootState } from "../reducer.config";
import { getNotificationApi } from "../../utils/notificationService";
import type { UpsertDayExercisePayload, UpsertDayPayload, DayExercise, Set, UpsertSetPayload } from "./types";
import { v4 as uuidv4 } from "uuid";

const fetchDraftWorkout = createAsyncThunk("data/fetchDraftWorkout", async (_arg, thunkAPI) => {
    try {
        const state = thunkAPI.getState() as RootState;
        if (state.draft.isLoadingWorkout && thunkAPI.requestId !== state.draft.currentRequestId) {
            return;
        }
        const { data, error } = await supabase
            .from("workouts")
            .select(
                `
                    id, name, description, status, created_at, days (
                        id, name, created_at, day_exercises (
                            id, 
                            exercises_catalog_id,
                            order_number,
                            rest, 
                            notes,
                            exercises_catalog (
                                id, name, category, description
                            ), 
                            day_exercise_sets (
                                id, set_number, reps, weight
                            )
                        )
                    )
                `
            )
            .eq("status", "draft");

        if (error) {
            throw Error("Error in get draft workout");
        }
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
        const { data } = await supabase
            .from("workouts")
            .insert([{ id: uuidv4(), name: "New Workout", status: "draft" }])
            .select(
                `
                    id, name, description, status, created_at, days (
                        id, name, created_at
                    )
                `
            );
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const publishDraftWorkout = createAsyncThunk("data/publishDraftWorkout", async (_arg, thunkAPI) => {
    try {
        await supabase.from("workouts").update({ status: "archived" }).eq("status", "published");
        await supabase.from("workouts").update({ status: "published" }).eq("status", "draft");

        thunkAPI.dispatch(resetDraft());
        return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const upsertDay = createAsyncThunk("data/upsertDay", async (day: UpsertDayPayload, thunkAPI) => {
    try {
        const { data, error } = await supabase
            .from("days")
            .upsert([day], {
                onConflict: "id, workout_id",
            })
            .select();

        if (error) {
            throw new Error("Error in adding day");
        }

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

const deleteDay = createAsyncThunk("data/deleteDay", async (dayId: string, thunkAPI) => {
    try {
        await supabase.from("days").delete().eq("id", dayId);
        return dayId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const upsertExercises = createAsyncThunk("data/upsertExercise", async (payloadData: { dayExercises: DayExercise[]; dayId: string; workoutId: string; isOrderUpdate?: boolean }, thunkAPI) => {
    try {
        const payloadDayExercises: UpsertDayExercisePayload[] = payloadData.dayExercises.map((dayExercise: DayExercise) => {
            return {
                id: dayExercise.id,
                day_id: payloadData.dayId,
                workout_id: payloadData.workoutId,
                order_number: dayExercise.orderNumber,
                exercise_id: dayExercise.exercise!.id,
                rest: dayExercise.rest,
                notes: dayExercise.notes,
            };
        });

        await supabase.from("day_exercises").upsert(payloadDayExercises, {
            onConflict: "id, day_id",
        });

        if (!payloadData.isOrderUpdate) {
            const payloadDayExerciseSets: UpsertSetPayload[] = payloadData.dayExercises[0].sets.map((set: Set) => {
                return {
                    id: set.id,
                    day_exercise_id: payloadData.dayExercises[0].id,
                    set_number: set.setNumber,
                    reps: set.reps!,
                    weight: set.weight,
                    day_id: payloadData.dayId,
                };
            });

            await supabase.from("day_exercise_sets").delete().eq("day_exercise_id", payloadData.dayExercises[0].id).eq("day_id", payloadData.dayId);
            await supabase.from("day_exercise_sets").upsert(payloadDayExerciseSets, {
                onConflict: "id, day_exercise_id, day_id",
            });
        }

        getNotificationApi().success({
            message: `Successfully saved`,
            placement: "top",
        });

        await thunkAPI.dispatch(fetchDraftWorkout());
        return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const deleteExercise = createAsyncThunk("data/deleteExercise", async (dayExerciseId: string, thunkAPI) => {
    try {
        await supabase.from("day_exercises").delete().eq("id", dayExerciseId);
        await thunkAPI.dispatch(fetchDraftWorkout());
        return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const resetDraft = createAction("data/resetDraft");

const draftActions = {
    fetchDraftWorkout,
    createDraftWorkout,
    publishDraftWorkout,
    upsertDay,
    deleteDay,
    upsertExercises,
    deleteExercise,
    resetDraft,
};

export { draftActions };
