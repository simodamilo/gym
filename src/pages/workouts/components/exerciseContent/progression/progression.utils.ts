import type { ExerciseProgressionEntry } from "../../../../../store/sessions/types";

export interface ProgressionSession {
    sessionId: string;
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
        .sort((a, b) => a.startedAt - b.startedAt);
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
