import type { ExerciseProgressionEntry } from "../../../../../store/sessions/types";
import { getValueUnitKey } from "../../../../../utils/reps";

export interface ProgressionSession {
    sessionId: string;
    /**
     * Position in this exercise's progression, oldest = 1. Deliberately not `session_number`:
     * that one counts the trainings of the whole *day*, so it starts at 2 whenever the day was
     * trained (or backfilled) before this exercise recorded anything.
     */
    ordinal: number;
    /** The day's training number, as stored. Kept for reference, not displayed. */
    sessionNumber: number;
    startedAt: number;
    sets: ExerciseProgressionEntry[];
    /** Heaviest set of the session, the point plotted on the chart. */
    topWeight?: number;
    /** Reps performed on the heaviest set, not the session's max reps. */
    topReps?: number;
    repsType?: string;
}

/** Groups the flat per-set rows into one entry per session, oldest first. */
export const groupBySession = (entries: ExerciseProgressionEntry[]): ProgressionSession[] => {
    const bySession = new Map<string, ProgressionSession>();

    entries.forEach((entry) => {
        const existing = bySession.get(entry.sessionId);
        if (existing) {
            existing.sets.push(entry);
            return;
        }
        bySession.set(entry.sessionId, {
            sessionId: entry.sessionId,
            /* Overwritten once the sessions are sorted; the map cannot know the order yet. */
            ordinal: 0,
            sessionNumber: entry.sessionNumber,
            startedAt: entry.startedAt,
            sets: [entry],
            repsType: entry.repsType,
        });
    });

    return [...bySession.values()]
        .map((session) => {
            const sets = [...session.sets].sort((a, b) => a.setNumber - b.setNumber);
            const heaviest = sets.reduce<ExerciseProgressionEntry | undefined>((best, set) => {
                if (set.weight === undefined) return best;
                if (!best || best.weight === undefined || set.weight > best.weight) return set;
                return best;
            }, undefined);

            return {
                ...session,
                sets,
                topWeight: heaviest?.weight,
                topReps: heaviest?.reps,
            };
        })
        .sort((a, b) => a.startedAt - b.startedAt)
        .map((session, index) => ({ ...session, ordinal: index + 1 }));
};

/**
 * Reps are only chartable when at least one session recorded a parseable value. Exercises with
 * a `custom` reps type never qualify, and backfilled sessions carry no reps at all.
 */
export const hasChartableReps = (sessions: ProgressionSession[]): boolean => {
    return sessions.some((session) => session.topReps !== undefined);
};

export const hasChartableWeight = (sessions: ProgressionSession[]): boolean => {
    return sessions.some((session) => session.topWeight !== undefined);
};

export const formatSessionDate = (startedAt: number): string => {
    return new Date(startedAt).toLocaleDateString(undefined, { day: "2-digit", month: "short" });
};

/**
 * The set numbers to lay out as columns: the union across sessions, not the count of any single
 * one. A training where a set was skipped, or where a set was added later, must still line up
 * with the others — that alignment is the whole point of the grid.
 */
export const getSetColumns = (sessions: ProgressionSession[]): number[] => {
    const numbers = new Set<number>();
    sessions.forEach((session) => session.sets.forEach((set) => numbers.add(set.setNumber)));
    return [...numbers].sort((a, b) => a - b);
};

/**
 * The distinct units in play. Normally one, so it can be shown once in the header; more than one
 * means the exercise was switched between reps and time at some point and each cell must say
 * which it is.
 */
export const getUnitKeys = (sessions: ProgressionSession[]): string[] => {
    const keys = new Set<string>();
    sessions.forEach((session) => {
        session.sets.forEach((set) => keys.add(getValueUnitKey(set.repsType)));
        if (!session.sets.length) keys.add(getValueUnitKey(session.repsType));
    });
    return [...keys];
};
