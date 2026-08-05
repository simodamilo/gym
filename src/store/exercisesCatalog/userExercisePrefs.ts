import { supabase } from "../supabaseClient";

/**
 * Ids of the exercises the current user tracks in their personal bests.
 *
 * The catalog is shared, so this preference cannot be a column on the exercise row and
 * cannot be filtered inside a join. Callers fetch the ids once and filter with them.
 */
export const fetchTrackedExerciseIds = async (): Promise<string[]> => {
    const { data, error } = await supabase.from("user_exercise_prefs").select("exercise_id").eq("show_in_personal_best", true);

    if (error) {
        throw new Error(error.message || "Error fetching tracked exercises");
    }

    return (data ?? []).map((pref) => pref.exercise_id as string);
};

/** Turn a tracked exercise on or off for the current user. */
export const setExerciseTracked = async (exerciseId: string, tracked: boolean): Promise<void> => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
        throw new Error("User not authenticated");
    }

    const { error } = await supabase.from("user_exercise_prefs").upsert(
        {
            user_id: data.user.id,
            exercise_id: exerciseId,
            show_in_personal_best: tracked,
        },
        { onConflict: "user_id,exercise_id" },
    );

    if (error) {
        throw new Error(error.message || "Error updating tracked exercise");
    }
};
