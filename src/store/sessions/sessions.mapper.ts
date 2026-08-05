import type { DaySession, DaySessionResponse, ExerciseProgressionEntry, SessionSet, SessionSetResponse } from "./types";

const getSessionSetMapper = (set: SessionSetResponse): SessionSet => {
    return {
        id: set.id,
        sessionId: set.session_id,
        dayExerciseId: set.day_exercise_id,
        setNumber: set.set_number,
        weight: set.weight ?? undefined,
        reps: set.reps ?? undefined,
        repsRaw: set.reps_raw ?? undefined,
        targetReps: set.target_reps ?? undefined,
        repsType: set.reps_type ?? undefined,
    };
};

const getSessionMapper = (session: DaySessionResponse): DaySession => {
    return {
        id: session.id,
        dayId: session.day_id,
        workoutId: session.workout_id,
        sessionNumber: session.session_number,
        startedAt: new Date(session.started_at).getTime(),
        completedAt: session.completed_at ? new Date(session.completed_at).getTime() : undefined,
        notes: session.notes,
        sets: (session.session_sets ?? []).map(getSessionSetMapper),
    };
};

const getSessionsMapper = (sessions: DaySessionResponse[]): DaySession[] => {
    return (sessions ?? []).map(getSessionMapper).sort((a, b) => b.startedAt - a.startedAt);
};

/**
 * Flattens the nested session -> sets response into one row per performed set, oldest first,
 * which is the shape both the progression table and the chart consume.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProgressionMapper = (rows: any[]): ExerciseProgressionEntry[] => {
    return (rows ?? [])
        .flatMap((row) => {
            const session = row.day_sessions;
            if (!session) return [];
            return [
                {
                    sessionId: session.id,
                    sessionNumber: session.session_number,
                    startedAt: new Date(session.started_at).getTime(),
                    dayExerciseId: row.day_exercise_id,
                    setNumber: row.set_number,
                    weight: row.weight ?? undefined,
                    reps: row.reps ?? undefined,
                    repsRaw: row.reps_raw ?? undefined,
                    targetReps: row.target_reps ?? undefined,
                    repsType: row.reps_type ?? undefined,
                } as ExerciseProgressionEntry,
            ];
        })
        .sort((a, b) => a.startedAt - b.startedAt || a.setNumber - b.setNumber);
};

export const sessionsMapper = {
    getSessionMapper,
    getSessionsMapper,
    getSessionSetMapper,
    getProgressionMapper,
};
