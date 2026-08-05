import { createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabaseClient";
import type { DayExercise, Set } from "../draft/types";
import type { DaySessionResponse, SessionSet, UpsertSessionSetPayload } from "./types";
import { sessionsMapper } from "./sessions.mapper";
import { parseReps } from "../../utils/reps";
import { getNotificationApi } from "../../utils/notificationService";

const SESSION_SELECT = `
    id, day_id, workout_id, session_number, started_at, completed_at, notes, session_sets (
        id, session_id, day_exercise_id, set_number, weight, reps, reps_raw, target_reps, reps_type, created_at
    )
`;

const fetchSessionsForDay = createAsyncThunk("sessions/fetchSessionsForDay", async (dayId: string, thunkAPI) => {
    try {
        const { data, error } = await supabase.from("day_sessions").select(SESSION_SELECT).eq("day_id", dayId).order("session_number", { ascending: false });

        if (error) {
            throw new Error("Error in fetching sessions");
        }

        return sessionsMapper.getSessionsMapper((data ?? []) as unknown as DaySessionResponse[]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

/**
 * Opens a new session for a day and seeds one row per planned set.
 *
 * Seeding rule: weight comes from the plan (which holds the last performed weight thanks to the
 * write-back in updateSessionSet), while reps come from the *previous session's actual reps*
 * rather than the plan's target — the user wants last session's "8" pre-filled, not "8-10".
 * On the very first session there is no prior, so reps stay empty and target_reps carries the
 * prescription for the placeholder.
 */
const startSession = createAsyncThunk(
    "sessions/startSession",
    async (payload: { dayId: string; workoutId: string; dayExercises: DayExercise[] }, thunkAPI) => {
        try {
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData?.user?.id;
            if (!userId) {
                throw new Error("Error in starting session");
            }

            const { data: lastSessions, error: lastError } = await supabase
                .from("day_sessions")
                .select(SESSION_SELECT)
                .eq("day_id", payload.dayId)
                .order("session_number", { ascending: false })
                .limit(1);

            if (lastError) {
                throw new Error("Error in starting session");
            }

            const previous = (lastSessions ?? [])[0] as unknown as DaySessionResponse | undefined;
            const previousSets: SessionSet[] = previous ? sessionsMapper.getSessionMapper(previous).sets : [];
            const sessionNumber = (previous?.session_number ?? 0) + 1;

            const sessionId = uuidv4();
            const { error: insertError } = await supabase.from("day_sessions").insert({
                id: sessionId,
                user_id: userId,
                workout_id: payload.workoutId,
                day_id: payload.dayId,
                session_number: sessionNumber,
                started_at: new Date().toISOString(),
            });

            if (insertError) {
                throw new Error("Error in starting session");
            }

            const seededSets: UpsertSessionSetPayload[] = [];
            payload.dayExercises.forEach((dayExercise: DayExercise) => {
                (dayExercise.sets ?? []).forEach((set: Set) => {
                    const previousSet = previousSets.find((prev) => prev.dayExerciseId === dayExercise.id && prev.setNumber === set.setNumber);

                    seededSets.push({
                        id: uuidv4(),
                        session_id: sessionId,
                        day_exercise_id: dayExercise.id,
                        set_number: set.setNumber,
                        weight: set.weight,
                        reps: previousSet?.reps,
                        reps_raw: previousSet?.repsRaw,
                        target_reps: set.reps,
                        reps_type: dayExercise.repsType,
                    });
                });
            });

            if (seededSets.length) {
                const { error: setsError } = await supabase.from("session_sets").insert(seededSets);
                if (setsError) {
                    throw new Error("Error in starting session");
                }
            }

            thunkAPI.dispatch(sessionsActions.fetchSessionsForDay(payload.dayId));
            return sessionId;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

/**
 * Persists what was actually performed for a set of an exercise.
 *
 * The session row is authoritative; day_exercise_sets.weight is additionally updated as a
 * denormalised "last performed" cache so the next session pre-fills without a lookup and every
 * existing read path keeps working. The plan's reps are deliberately NOT written back: they
 * remain the target.
 */
const saveSessionSets = createAsyncThunk(
    "sessions/saveSessionSets",
    async (payload: { sessionId: string; dayId: string; dayExercise: DayExercise }, thunkAPI) => {
        try {
            const { data: existing, error: existingError } = await supabase
                .from("session_sets")
                .select("id, set_number")
                .eq("session_id", payload.sessionId)
                .eq("day_exercise_id", payload.dayExercise.id);

            if (existingError) {
                throw new Error("Error in saving session");
            }

            const sessionSets: UpsertSessionSetPayload[] = (payload.dayExercise.sets ?? []).map((set: Set) => {
                const existingSet = (existing ?? []).find((row) => row.set_number === set.setNumber);
                return {
                    id: existingSet?.id ?? uuidv4(),
                    session_id: payload.sessionId,
                    day_exercise_id: payload.dayExercise.id,
                    set_number: set.setNumber,
                    weight: set.weight,
                    reps: parseReps(set.reps, payload.dayExercise.repsType) ?? undefined,
                    reps_raw: set.reps,
                    target_reps: set.targetReps,
                    reps_type: payload.dayExercise.repsType,
                };
            });

            if (sessionSets.length) {
                const { error: upsertError } = await supabase.from("session_sets").upsert(sessionSets, { onConflict: "id" });
                if (upsertError) {
                    throw new Error("Error in saving session");
                }
            }

            /* Write-back: keep the plan's weight as the last performed value.
               `reps` here is the plan's target, never the performed value. A set whose target has
               gone missing is skipped rather than written, so an upsert can never blank the
               prescription. */
            const weightWriteBack = (payload.dayExercise.sets ?? [])
                .filter((set: Set) => set.targetReps !== undefined)
                .map((set: Set) => ({
                    id: set.id,
                    day_exercise_id: payload.dayExercise.id,
                    set_number: set.setNumber,
                    reps: set.targetReps,
                    weight: set.weight,
                    base_weight: set.baseWeight,
                }));

            if (weightWriteBack.length) {
                await supabase.from("day_exercise_sets").upsert(weightWriteBack, { onConflict: "id" });
            }

            getNotificationApi().success({
                message: `Exercise saved`,
                placement: "bottom",
                className: "custom-success-notification",
            });

            thunkAPI.dispatch(sessionsActions.fetchSessionsForDay(payload.dayId));
            return;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            getNotificationApi().error({
                message: `Unable to save exercise`,
                placement: "bottom",
                className: "custom-error-notification",
            });
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const completeSession = createAsyncThunk("sessions/completeSession", async (payload: { sessionId: string; dayId: string }, thunkAPI) => {
    try {
        const { error } = await supabase.from("day_sessions").update({ completed_at: new Date().toISOString() }).eq("id", payload.sessionId);

        if (error) {
            throw new Error("Error in completing session");
        }

        thunkAPI.dispatch(sessionsActions.fetchSessionsForDay(payload.dayId));
        return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

/** Every performed set of one catalog exercise, across all sessions, oldest first. */
const fetchProgressionForExercise = createAsyncThunk("sessions/fetchProgressionForExercise", async (exerciseId: string, thunkAPI) => {
    try {
        const { data: dayExercises, error: dayExercisesError } = await supabase.from("day_exercises").select("id").eq("exercises_catalog_id", exerciseId);

        if (dayExercisesError) {
            throw new Error("Error in fetching progression");
        }

        const dayExerciseIds = (dayExercises ?? []).map((row) => row.id);
        if (!dayExerciseIds.length) {
            return { exerciseId, entries: [] };
        }

        const { data, error } = await supabase
            .from("session_sets")
            .select(
                `
                    id, day_exercise_id, set_number, weight, reps, reps_raw, target_reps, reps_type, day_sessions (
                        id, session_number, started_at
                    )
                `
            )
            .in("day_exercise_id", dayExerciseIds);

        if (error) {
            throw new Error("Error in fetching progression");
        }

        return { exerciseId, entries: sessionsMapper.getProgressionMapper(data ?? []) };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const sessionsActions = {
    fetchSessionsForDay,
    startSession,
    saveSessionSets,
    completeSession,
    fetchProgressionForExercise,
};

export { sessionsActions };
