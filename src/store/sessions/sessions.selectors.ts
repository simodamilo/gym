import type { RootState } from "../reducer.config";
import type { DaySession, ExerciseProgressionEntry, SessionSet } from "./types";

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

const getActiveSessionSets = (state: RootState): SessionSet[] => {
    return getActiveSession(state)?.sets ?? [];
};

const getProgressionForExercise = (state: RootState, exerciseId?: string): ExerciseProgressionEntry[] => {
    if (!exerciseId) return [];
    return state.sessions.progressionByExercise[exerciseId] ?? [];
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
    getActiveSessionSets,
    getProgressionForExercise,
    isLoading,
    isLoadingProgression,
    isError,
};
