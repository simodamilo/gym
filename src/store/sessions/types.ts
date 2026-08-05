export type SessionsState = {
    /** Sessions of the day currently being trained or inspected, newest first. */
    sessions: DaySession[];
    /** The session opened by "start", i.e. the one set edits are written to. */
    activeSessionId?: string;
    /** Progression rows keyed by exercises_catalog id, filled on demand. */
    progressionByExercise: Record<string, ExerciseProgressionEntry[]>;
    isLoading: boolean;
    isLoadingProgression: boolean;
    isError: boolean;
    currentRequestId?: string;
};

export interface DaySession {
    id: string;
    dayId: string;
    workoutId: string;
    sessionNumber: number;
    startedAt: number;
    completedAt?: number;
    notes?: string;
    sets: SessionSet[];
}

export interface SessionSet {
    id: string;
    sessionId: string;
    dayExerciseId: string;
    setNumber: number;
    weight?: number;
    /** Parsed performed reps. Undefined when repsRaw could not be reduced to a number. */
    reps?: number;
    /** Verbatim user input, always kept. */
    repsRaw?: string;
    /** Snapshot of the plan's prescription when the session ran. */
    targetReps?: string;
    /** Snapshot of the exercise's reps type when the session ran. */
    repsType?: string;
}

/** One point on an exercise's progression, flattened across sessions. */
export interface ExerciseProgressionEntry {
    sessionId: string;
    sessionNumber: number;
    startedAt: number;
    dayExerciseId: string;
    setNumber: number;
    weight?: number;
    reps?: number;
    repsRaw?: string;
    targetReps?: string;
    repsType?: string;
}

/* Types used for payload to be sent to be */
export interface StartSessionPayload {
    dayId: string;
    workoutId: string;
}

export interface InsertSessionPayload {
    id: string;
    user_id: string;
    workout_id: string;
    day_id: string;
    session_number: number;
    started_at: string;
}

export interface UpsertSessionSetPayload {
    id: string;
    session_id: string;
    day_exercise_id: string;
    set_number: number;
    weight?: number;
    reps?: number;
    reps_raw?: string;
    target_reps?: string;
    reps_type?: string;
}

/* Types used for response returned from be */
export interface SessionSetResponse {
    id: string;
    session_id: string;
    day_exercise_id: string;
    set_number: number;
    weight?: number;
    reps?: number;
    reps_raw?: string;
    target_reps?: string;
    reps_type?: string;
    created_at: string;
}

export interface DaySessionResponse {
    id: string;
    day_id: string;
    workout_id: string;
    session_number: number;
    started_at: string;
    completed_at?: string;
    notes?: string;
    session_sets: SessionSetResponse[];
}
