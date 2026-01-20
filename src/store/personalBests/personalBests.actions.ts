import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";
import type { PersonalBest, PersonalBestsWorkoutResponse } from "./types";

/**
 * Process workout data to extract personal bests
 * Groups all weights by exercise and finds the maximum for each
 */
function processPersonalBests(workouts: PersonalBestsWorkoutResponse[]): PersonalBest[] {
    const exerciseWeights = new Map<
        string,
        {
            name: string;
            category: string;
            maxWeight: number;
        }
    >();

    workouts.forEach((workout) => {
        if (!workout.days || !Array.isArray(workout.days)) return;

        workout.days.forEach((day) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const typedDay = day as any;
            if (!typedDay.day_exercises || !Array.isArray(typedDay.day_exercises)) return;

            typedDay.day_exercises.forEach((dayEx: unknown) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const typedDayEx = dayEx as any;
                if (!typedDayEx.exercises_catalog) return;

                const exerciseId = typedDayEx.exercises_catalog.id;
                const exerciseName = typedDayEx.exercises_catalog.name;
                const category = typedDayEx.exercises_catalog.category;
                const showInPersonalBest = typedDayEx.exercises_catalog.show_in_personal_best;

                // Only process exercises marked for personal best tracking
                if (!showInPersonalBest) return;
                if (!exerciseId || !exerciseName || !category) return;
                if (!typedDayEx.day_exercise_sets || !Array.isArray(typedDayEx.day_exercise_sets)) return;

                typedDayEx.day_exercise_sets.forEach((set: unknown) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const typedSet = set as any;
                    if (typedSet.weight && typeof typedSet.weight === 'number') {
                        const current = exerciseWeights.get(exerciseId);
                        if (!current || typedSet.weight > current.maxWeight) {
                            exerciseWeights.set(exerciseId, {
                                name: exerciseName,
                                category,
                                maxWeight: typedSet.weight,
                            });
                        }
                    }
                });
            });
        });
    });

    return Array.from(exerciseWeights.entries())
        .map(([id, data]) => ({
            exerciseId: id,
            exerciseName: data.name,
            maxWeight: data.maxWeight,
            category: data.category,
        }))
        .sort((a, b) => b.maxWeight - a.maxWeight); // Sort by weight descending
}

/**
 * Fetch personal bests from archived workouts
 * Only fetches exercise info and weights for exercises marked as tracked in personal bests
 */
const fetchWorkoutPersonalBests = createAsyncThunk(
    "personalBests/fetchWorkoutPersonalBests",
    async (_arg, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from("workouts")
                .select(
                    `
                days (
                    day_exercises (
                        exercises_catalog!inner (
                            id,
                            name,
                            category,
                            show_in_personal_best
                        ),
                        day_exercise_sets (
                            weight
                        )
                    )
                )
            `
                )
                .in("status", ["archived", "published"])
                .eq("days.day_exercises.exercises_catalog.show_in_personal_best", true);

            if (error) {
                throw new Error("Error fetching workout personal bests");
            }

            if (!data) {
                return [];
            }

            return processPersonalBests(data as PersonalBestsWorkoutResponse[]);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

/**
 * Fetch all personal bests (both workout-derived and manual)
 * Merges both sources and shows the highest weight for each exercise
 */
const fetchPersonalBests = createAsyncThunk("personalBests/fetchPersonalBests", async (_arg, thunkAPI) => {
    try {
        // Fetch workout-derived PRs
        const workoutPRsPromise = supabase
            .from("workouts")
            .select(
                `
                days (
                    day_exercises (
                        exercises_catalog!inner (
                            id,
                            name,
                            category,
                            show_in_personal_best
                        ),
                        day_exercise_sets (
                            weight
                        )
                    )
                )
            `
            )
            .in("status", ["archived", "published"])
            .eq("days.day_exercises.exercises_catalog.show_in_personal_best", true);

        // Fetch manual PRs
        const manualPRsPromise = supabase
            .from("manual_personal_bests")
            .select(
                `
                id,
                exercise_id,
                weight,
                created_at,
                exercises_catalog!inner (
                    id,
                    name,
                    category
                )
            `
            );

        const [workoutResult, manualResult] = await Promise.all([workoutPRsPromise, manualPRsPromise]);

        if (workoutResult.error) {
            throw new Error("Error fetching workout personal bests");
        }

        if (manualResult.error) {
            throw new Error("Error fetching manual personal bests");
        }

        // Process workout PRs
        const workoutPRs = processPersonalBests((workoutResult.data || []) as PersonalBestsWorkoutResponse[]);

        // Process manual PRs
        const manualPRs: PersonalBest[] = (manualResult.data || []).map((item) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const exercise = (item as any).exercises_catalog;
            return {
                exerciseId: (item as any).exercise_id,
                exerciseName: exercise.name,
                maxWeight: (item as any).weight,
                category: exercise.category,
                isManual: true,
                createdAt: (item as any).created_at,
                manualId: (item as any).id,
            };
        });

        // Merge both lists - show highest weight for each exercise
        // BUT preserve manual PR metadata even when workout PR is higher
        const mergedMap = new Map<string, PersonalBest>();

        // Add workout PRs
        workoutPRs.forEach((pr) => {
            mergedMap.set(pr.exerciseId, pr);
        });

        // Process manual PRs
        manualPRs.forEach((pr) => {
            const existing = mergedMap.get(pr.exerciseId);
            if (!existing || pr.maxWeight > existing.maxWeight) {
                // Manual PR is higher or no workout PR exists, use manual PR
                mergedMap.set(pr.exerciseId, pr);
            } else {
                // Workout PR is higher, but preserve manual PR metadata
                mergedMap.set(pr.exerciseId, {
                    ...existing,
                    manualId: pr.manualId,
                    isManual: false, // Show it's not the displayed value
                    createdAt: pr.createdAt,
                });
            }
        });

        // Convert back to array and sort by weight
        return Array.from(mergedMap.values()).sort((a, b) => b.maxWeight - a.maxWeight);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return thunkAPI.rejectWithValue(errorMessage);
    }
});

/**
 * Fetch manual personal bests from the database
 */
const fetchManualPersonalBests = createAsyncThunk(
    "personalBests/fetchManualPersonalBests",
    async (_arg, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from("manual_personal_bests")
                .select(
                    `
                    id,
                    exercise_id,
                    weight,
                    created_at,
                    exercises_catalog!inner (
                        id,
                        name,
                        category
                    )
                `
                )
                .order("weight", { ascending: false });

            if (error) {
                throw new Error("Error fetching manual personal bests");
            }

            if (!data) {
                return [];
            }

            // Map response to PersonalBest format
            return data.map((item) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const exercise = (item as any).exercises_catalog;
                return {
                    exerciseId: (item as any).exercise_id,
                    exerciseName: exercise.name,
                    maxWeight: (item as any).weight,
                    category: exercise.category,
                    isManual: true,
                    createdAt: (item as any).created_at,
                    manualId: (item as any).id,
                };
            }) as PersonalBest[];
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

/**
 * Add a new manual personal best
 */
const addManualPersonalBest = createAsyncThunk(
    "personalBests/addManualPersonalBest",
    async (payload: { exerciseId: string; weight: number }, thunkAPI) => {
        try {
            // Get current user ID
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("User not authenticated");
            }

            // Update the exercise to be tracked in personal bests
            const { error: updateError } = await supabase
                .from("exercises_catalog")
                .update({ show_in_personal_best: true })
                .eq("id", payload.exerciseId);

            if (updateError) {
                throw new Error(updateError.message || "Error updating exercise catalog");
            }

            const { data, error } = await supabase
                .from("manual_personal_bests")
                .insert({
                    user_id: user.id,
                    exercise_id: payload.exerciseId,
                    weight: payload.weight,
                })
                .select(
                    `
                    id,
                    exercise_id,
                    weight,
                    created_at,
                    exercises_catalog!inner (
                        id,
                        name,
                        category
                    )
                `
                )
                .single();

            if (error) {
                throw new Error(error.message || "Error adding manual personal best");
            }

            if (!data) {
                throw new Error("No data returned after adding manual personal best");
            }

            // Map response to PersonalBest format
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const exercise = (data as any).exercises_catalog;
            return {
                exerciseId: (data as any).exercise_id,
                exerciseName: exercise.name,
                maxWeight: (data as any).weight,
                category: exercise.category,
                isManual: true,
                createdAt: (data as any).created_at,
                manualId: (data as any).id,
            } as PersonalBest;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

/**
 * Update an existing manual personal best
 */
const updateManualPersonalBest = createAsyncThunk(
    "personalBests/updateManualPersonalBest",
    async (payload: { id: string; weight: number }, thunkAPI) => {
        try {
            const { data, error } = await supabase
                .from("manual_personal_bests")
                .update({
                    weight: payload.weight,
                })
                .eq("id", payload.id)
                .select(
                    `
                    id,
                    exercise_id,
                    weight,
                    created_at,
                    exercises_catalog!inner (
                        id,
                        name,
                        category
                    )
                `
                )
                .single();

            if (error) {
                throw new Error(error.message || "Error updating manual personal best");
            }

            if (!data) {
                throw new Error("No data returned after updating manual personal best");
            }

            // Map response to PersonalBest format
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const exercise = (data as any).exercises_catalog;
            return {
                exerciseId: (data as any).exercise_id,
                exerciseName: exercise.name,
                maxWeight: (data as any).weight,
                category: exercise.category,
                isManual: true,
                createdAt: (data as any).created_at,
                manualId: (data as any).id,
            } as PersonalBest;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

/**
 * Delete a manual personal best
 */
const deleteManualPersonalBest = createAsyncThunk(
    "personalBests/deleteManualPersonalBest",
    async (id: string, thunkAPI) => {
        try {
            const { error } = await supabase.from("manual_personal_bests").delete().eq("id", id);

            if (error) {
                throw new Error(error.message || "Error deleting manual personal best");
            }

            return id;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

const personalBestsActions = {
    fetchPersonalBests,
    fetchWorkoutPersonalBests,
    fetchManualPersonalBests,
    addManualPersonalBest,
    updateManualPersonalBest,
    deleteManualPersonalBest,
};

export { personalBestsActions };
