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
const fetchPersonalBests = createAsyncThunk("personalBests/fetchPersonalBests", async (_arg, thunkAPI) => {
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
            .eq("status", "archived")
            .eq("days.day_exercises.exercises_catalog.show_in_personal_best", true);

        if (error) {
            throw new Error("Error fetching personal bests");
        }

        if (!data) {
            return [];
        }

        return processPersonalBests(data as PersonalBestsWorkoutResponse[]);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return thunkAPI.rejectWithValue(errorMessage);
    }
});

const personalBestsActions = {
    fetchPersonalBests,
};

export { personalBestsActions };
