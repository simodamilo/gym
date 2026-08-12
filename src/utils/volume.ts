import type { Day, DayExercise } from "../store/draft/types";

/**
 * Volume is measured in sets, not tonnage.
 *
 * A draft usually has no weight yet, and its reps are often a prescribed range ("8-10") that
 * `parseReps` deliberately refuses to reduce to a number. Tonnage would therefore be blank
 * exactly where this feature is most useful, while a set count is always computable.
 */
export interface MuscleVolume {
    /** An `ExerciseCatalog.category` value: the closest thing the schema has to a muscle. */
    category: string;
    sets: number;
}

/** Categories left out of the breakdown entirely: they do not count towards any muscle's volume. */
const EXCLUDED_CATEGORIES = new Set(["extra", "abs", "legs"]);

/**
 * Every set of an exercise is attributed to that exercise's single category. There is no
 * secondary-muscle attribution in the schema, so a bench press contributes nothing to triceps.
 */
const accumulate = (totals: Map<string, number>, dayExercises: DayExercise[]): void => {
    dayExercises.forEach((dayExercise) => {
        const category = dayExercise.exercise?.category;
        if (!category || EXCLUDED_CATEGORIES.has(category)) return;

        totals.set(category, (totals.get(category) || 0) + dayExercise.sets.length);
    });
};

/** Heaviest muscle first, ties broken alphabetically so the order is stable between renders. */
const toSortedList = (totals: Map<string, number>): MuscleVolume[] =>
    Array.from(totals.entries())
        .filter(([, sets]) => sets > 0)
        .map(([category, sets]) => ({ category, sets }))
        .sort((a, b) => b.sets - a.sets || a.category.localeCompare(b.category));

/** Sets per muscle for a single day. */
export const getMuscleVolume = (dayExercises: DayExercise[]): MuscleVolume[] => {
    const totals = new Map<string, number>();
    accumulate(totals, dayExercises);
    return toSortedList(totals);
};

/** Sets per muscle across every day of a workout. */
export const getWorkoutMuscleVolume = (days: Day[]): MuscleVolume[] => {
    const totals = new Map<string, number>();
    days.forEach((day) => accumulate(totals, day.dayExercises));
    return toSortedList(totals);
};

export const getTotalSets = (volumes: MuscleVolume[]): number => volumes.reduce((total, volume) => total + volume.sets, 0);
