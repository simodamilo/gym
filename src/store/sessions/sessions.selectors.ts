import type { RootState } from "../reducer.config";
import type { DaySession, ExerciseProgressionEntry, SessionSet } from "./types";
import { getProgressionKey } from "./progression.key";

const getSessions = (state: RootState): DaySession[] => {
    return state.sessions.sessions;
};

/**
 * The session set edits are written to: the one just started, or failing that the newest
 * still-open session of the day (the user may have navigated away and come back).
 */
const getActiveSession = (state: RootState): DaySession | undefined => {
    const sessions = state.sessions.sessions;
    const activeId = state.sessions.activeSessionId;
    if (activeId) {
        const active = sessions.find((session: DaySession) => session.id === activeId);
        if (active) return active;
    }
    return sessions.find((session: DaySession) => !session.completedAt);
};

const isSameDay = (a: number, b: number): boolean => {
    const left = new Date(a);
    const right = new Date(b);
    return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
};

/**
 * The session opened today for the day being trained, if any. This is what decides whether the
 * training has already started: sessions are never marked complete, so "the newest open one" is
 * not enough to tell today's training from last week's.
 *
 * A training spanning midnight therefore still splits in two. Closing that properly needs an
 * explicit completion, which is a separate change.
 */
const getSessionStartedToday = (state: RootState): DaySession | undefined => {
    const now = Date.now();
    return state.sessions.sessions.find((session: DaySession) => isSameDay(session.startedAt, now));
};

const getActiveSessionSets = (state: RootState): SessionSet[] => {
    return getActiveSession(state)?.sets ?? [];
};

const getProgressionForExercise = (state: RootState, exerciseId?: string, workoutId?: string): ExerciseProgressionEntry[] => {
    if (!exerciseId || !workoutId) return [];
    return state.sessions.progressionByExercise[getProgressionKey(exerciseId, workoutId)] ?? [];
};

const isLoading = (state: RootState): boolean => {
    return state.sessions.isLoading;
};

const isLoadingProgression = (state: RootState): boolean => {
    return state.sessions.isLoadingProgression;
};

const isError = (state: RootState): boolean => {
    return state.sessions.isError;
};

export const sessionsSelectors = {
    getSessions,
    getActiveSession,
    getSessionStartedToday,
    getActiveSessionSets,
    getProgressionForExercise,
    isLoading,
    isLoadingProgression,
    isError,
};
