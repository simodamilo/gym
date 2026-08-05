/**
 * Reps are stored twice on a logged set: verbatim as the user typed them (`repsRaw`) and,
 * when it can be derived, as a number (`reps`) so progression can be charted.
 *
 * A number is not always derivable, and that is by design:
 *  - "reps" / "max" -> a plain count, chartable
 *  - "time"         -> seconds, chartable on its own axis
 *  - "custom"       -> free text, never chartable. Withdrawn: it can no longer be selected, but
 *                      exercises created before then still carry it, so it stays handled here.
 */
export type RepsType = "reps" | "time" | "max" | "custom";

/**
 * Returns the performed reps as a number, or null when the input carries no single value.
 *
 * Ranges such as "8-10" are deliberately rejected: a range is a prescription, not something
 * that was performed. When a logged value is a range it means the user did not record what
 * they actually did, so there is nothing to chart.
 */
export const parseReps = (raw?: string | null, repsType?: string): number | null => {
    if (repsType === "custom") return null;
    if (raw === undefined || raw === null) return null;

    const trimmed = raw.trim();
    if (!trimmed) return null;

    // "8-10", "8/10", "8 - 10": a range, not a performed value.
    if (/[-/]/.test(trimmed)) return null;

    const normalised = trimmed.replace(/,/g, ".");
    const match = normalised.match(/^(\d+(?:\.\d+)?)/);
    if (!match) return null;

    const value = Number(match[1]);
    return Number.isFinite(value) ? Math.round(value) : null;
};

/**
 * Unit label key for the value column.
 *
 * Only `reps` exercises store an actual weight; `time` stores seconds and `max` stores the reps
 * achieved, both in the same column. The label is what tells them apart.
 */
export const getValueUnitKey = (repsType?: string): string => {
    switch (repsType) {
        case "time":
            return "workouts.exercises.secs";
        case "max":
            return "workouts.exercises.reps";
        default:
            return "workouts.exercises.kg";
    }
};
