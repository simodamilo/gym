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
                    id, status, created_at, start_date, end_date, days (
                        id, name, counter, is_last, order, created_at, day_exercises (
                            id,
                            order_number,
                            rest, 
                            notes,
                            created_at,
                            exercises_catalog (
                                id, name, category, description, created_at
                            ), 
                            day_exercise_sets (
                                id, set_number, reps, weight, created_at
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
        console.error("Error in getting draft workout", error.message);
        getNotificationApi().error({
            message: `Error in getting draft workout`,
            placement: "bottom",
            className: "custom-error-notification",
        });
        return thunkAPI.rejectWithValue(error.message);
    }
});

const createDraftWorkout = createAsyncThunk("data/createDraftWorkout", async (_arg, thunkAPI) => {
    try {
        const { data } = await supabase
            .from("workouts")
            .insert([{ id: uuidv4(), status: "draft" }])
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
        console.error("Error in creating new draft workout", error.message);
        getNotificationApi().error({
            message: `Error in creating new draft workout`,
            placement: "bottom",
            className: "custom-error-notification",
        });
        return thunkAPI.rejectWithValue(error.message);
    }
});

const publishDraftWorkout = createAsyncThunk("data/publishDraftWorkout", async (_arg, thunkAPI) => {
    try {
        const now = new Date();
        await supabase.from("workouts").update({ status: "archived", end_date: now.getTime() }).eq("status", "published");
        await supabase.from("workouts").update({ status: "published", start_date: now.getTime() }).eq("status", "draft");

        getNotificationApi().success({
            message: `Successfully published`,
            placement: "bottom",
            className: "custom-success-notification",
        });

        thunkAPI.dispatch(resetDraft());
        return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in publishing draft workout", error.message);
        getNotificationApi().error({
            message: `Error in publishing draft workout`,
            placement: "bottom",
            className: "custom-error-notification",
        });
        return thunkAPI.rejectWithValue(error.message);
    }
});

const upsertDay = createAsyncThunk("data/upsertDay", async (days: UpsertDayPayload[], thunkAPI) => {
    try {
        const { error } = await supabase
            .from("days")
            .upsert(days, {
                onConflict: "id",
            })
            .select();

        if (error) {
            throw new Error("Error in adding day");
        }

        getNotificationApi().success({
            message: `Successfully saved`,
            placement: "bottom",
            className: "custom-success-notification",
        });

        await thunkAPI.dispatch(fetchDraftWorkout());
        return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in updating day", error.message);
        getNotificationApi().error({
            message: `Error in updating day`,
            placement: "bottom",
            className: "custom-error-notification",
        });
        return thunkAPI.rejectWithValue(error.message);
    }
});

const deleteDay = createAsyncThunk("data/deleteDay", async (dayId: string, thunkAPI) => {
    try {
        await supabase.from("days").delete().eq("id", dayId);

        getNotificationApi().success({
            message: `Successfully deleted`,
            placement: "bottom",
            className: "custom-success-notification",
        });

        return dayId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in deleting day", error.message);
        getNotificationApi().error({
            message: `Error in deleting day`,
            placement: "bottom",
            className: "custom-error-notification",
        });
        return thunkAPI.rejectWithValue(error.message);
    }
});

const upsertExercises = createAsyncThunk("data/upsertExercise", async (payloadData: { dayExercises: DayExercise[]; dayId: string; workoutId: string; isOrderUpdate?: boolean }, thunkAPI) => {
    try {
        const payloadDayExercises: UpsertDayExercisePayload[] = payloadData.dayExercises.map((dayExercise: DayExercise) => {
            return {
                id: dayExercise.id,
                day_id: payloadData.dayId,
                exercises_catalog_id: dayExercise.exercise!.id,
                order_number: dayExercise.orderNumber,
                rest: dayExercise.rest,
                notes: dayExercise.notes,
            };
        });

        await supabase.from("day_exercises").upsert(payloadDayExercises, {
            onConflict: "id",
        });

        if (!payloadData.isOrderUpdate) {
            const payloadDayExerciseSets: UpsertSetPayload[] = payloadData.dayExercises[0].sets.map((set: Set) => {
                return {
                    id: set.id,
                    day_exercise_id: payloadData.dayExercises[0].id,
                    set_number: set.setNumber,
                    reps: set.reps!,
                    weight: set.weight,
                };
            });

            await supabase.from("day_exercise_sets").delete().eq("day_exercise_id", payloadData.dayExercises[0].id);
            await supabase.from("day_exercise_sets").upsert(payloadDayExerciseSets, {
                onConflict: "id",
            });
        }

        getNotificationApi().success({
            message: `Successfully saved`,
            placement: "bottom",
            className: "custom-success-notification",
        });

        await thunkAPI.dispatch(fetchDraftWorkout());
        return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in updating exercise", error.message);
        getNotificationApi().error({
            message: `Error in updating exercise`,
            placement: "bottom",
            className: "custom-error-notification",
        });
        return thunkAPI.rejectWithValue(error.message);
    }
});

const deleteExercise = createAsyncThunk("data/deleteExercise", async (dayExerciseId: string, thunkAPI) => {
    try {
        await supabase.from("day_exercises").delete().eq("id", dayExerciseId);

        getNotificationApi().success({
            message: `Successfully deleted`,
            placement: "bottom",
            className: "custom-success-notification",
        });

        await thunkAPI.dispatch(fetchDraftWorkout());
        return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in deleting exercise", error.message);
        getNotificationApi().error({
            message: `Error in deleting exercise`,
            placement: "bottom",
            className: "custom-error-notification",
        });
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
