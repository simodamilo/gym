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
    /** Sets coming from days flagged as extra, reported apart rather than added to `sets`. */
    extraSets: number;
}

/** Categories left out of the breakdown entirely: they do not count towards any muscle's volume. */
const EXCLUDED_CATEGORIES = new Set(["extra", "abs", "legs"]);

/**
 * Every set of an exercise is attributed to that exercise's single category. There is no
 * secondary-muscle attribution in the schema, so a bench press contributes nothing to triceps.
 */
type Totals = Map<string, { sets: number; extraSets: number }>;

const addTo = (totals: Totals, category: string, count: number, isExtra: boolean): void => {
    const current = totals.get(category) || { sets: 0, extraSets: 0 };

    if (isExtra) {
        current.extraSets += count;
    } else {
        current.sets += count;
    }

    totals.set(category, current);
};

const accumulate = (totals: Totals, dayExercises: DayExercise[], isExtra: boolean): void => {
    dayExercises.forEach((dayExercise) => {
        const category = dayExercise.exercise?.category;
        if (!category || EXCLUDED_CATEGORIES.has(category)) return;

        addTo(totals, category, dayExercise.sets.length, isExtra);
    });
};

/**
 * Heaviest muscle first, ties broken alphabetically so the order is stable between renders.
 * Extra sets do not drive the order: a muscle trained only on an extra day sorts last, but it
 * is still listed rather than dropped.
 */
const toSortedList = (totals: Totals): MuscleVolume[] =>
    Array.from(totals.entries())
        .filter(([, { sets, extraSets }]) => sets > 0 || extraSets > 0)
        .map(([category, { sets, extraSets }]) => ({ category, sets, extraSets }))
        .sort((a, b) => b.sets - a.sets || b.extraSets - a.extraSets || a.category.localeCompare(b.category));

/**
 * Sets per muscle for a single day. A day is either extra or not, so its own breakdown is a
 * plain count and `extraSets` is always zero here.
 */
export const getMuscleVolume = (dayExercises: DayExercise[]): MuscleVolume[] => {
    const totals: Totals = new Map();
    accumulate(totals, dayExercises, false);
    return toSortedList(totals);
};

/** Sets per muscle across every day of a workout, keeping extra days apart from the rest. */
export const getWorkoutMuscleVolume = (days: Day[]): MuscleVolume[] => {
    const totals: Totals = new Map();
    days.forEach((day) => accumulate(totals, day.dayExercises, !!day.isExtra));
    return toSortedList(totals);
};

export const getTotalSets = (volumes: MuscleVolume[]): { sets: number; extraSets: number } =>
    volumes.reduce(
        (total, volume) => ({ sets: total.sets + volume.sets, extraSets: total.extraSets + volume.extraSets }),
        { sets: 0, extraSets: 0 },
    );
