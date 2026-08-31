import type { ExerciseProgressionEntry } from "../../../../../store/sessions/types";

/**
 * One cell of the progression grid: the value performed, and the reps when they were recorded.
 *
 * Reps are frequently absent — the sessions backfilled by the 2026-08-05 migration carry none,
 * because reps were never stored as a performed value before it. Those cells show the weight
 * alone rather than an invented "× 0".
 */
export const formatProgressionCell = (set: ExerciseProgressionEntry, unit?: string) => {
    if (set.weight === undefined) return <span className="text-[var(--text-tertiary)]">–</span>;

    return (
        <>
            <span className="text-[var(--text-primary)]">{set.weight}</span>
            {unit ? <span className="text-[var(--text-tertiary)]"> {unit}</span> : null}
            {set.repsRaw ? <span className="text-[var(--text-tertiary)]"> × {set.repsRaw}</span> : null}
        </>
    );
};
