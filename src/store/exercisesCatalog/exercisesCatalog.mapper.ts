import type { ExerciseCatalog, UserExercisePref } from "./types";

/**
 * The catalog is shared across users, so `show_in_personal_best` cannot live on the
 * exercise row. It comes from the per-user `user_exercise_prefs` table and is merged
 * onto each exercise here. Exercises with no pref row default to false.
 */
export const mergeExercisePrefs = (exercises: ExerciseCatalog[], prefs: UserExercisePref[]): ExerciseCatalog[] => {
    const prefsByExerciseId = new Map(prefs.map((pref) => [pref.exercise_id, pref.show_in_personal_best]));

    return exercises.map((exercise) => ({
        ...exercise,
        show_in_personal_best: prefsByExerciseId.get(exercise.id) ?? false,
    }));
};
