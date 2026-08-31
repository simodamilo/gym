import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "../../../../store";
import { currentActions } from "../../../../store/current/current.actions";
import { sessionsActions } from "../../../../store/sessions/sessions.actions";
import { sessionsSelectors } from "../../../../store/sessions/sessions.selectors";
import type { Day, Workout } from "../../../../store/draft/types";

interface UseTrainingSessionParams {
    workout?: Workout;
    dayId?: string;
}

/**
 * Owns "which session do edits go into", for both the explicit start button and the implicit
 * start triggered by editing an exercise before pressing it.
 *
 * Two things this fixes over the previous inline logic:
 *
 * 1. Whether today has started is read from day_sessions, not from the `days.last_workout`
 *    date. That column is a denormalised cache updated by a second round trip, so it was
 *    stale exactly when it mattered — right after an implicit start — and it is slated to be
 *    dropped in phase 2 of the sessions migration.
 * 2. Concurrent first edits share one start. The per-exercise autosave debounce fires each
 *    exercise separately, so two edits made seconds apart both used to see "not started" and
 *    each opened a session, splitting one training across two.
 */
export const useTrainingSession = ({ workout, dayId }: UseTrainingSessionParams) => {
    const dispatch = useAppDispatch();

    const todaySession = useSelector((state: RootState) => sessionsSelectors.getSessionStartedToday(state));

    /* Holds the in-flight (then resolved) start for this day, so simultaneous callers await the
       same one instead of racing. Kept after it resolves: the sessions list only catches up on
       the next fetch, and a caller in that gap must not open a second session. */
    const startRef = useRef<Promise<string | undefined> | null>(null);

    useEffect(() => {
        startRef.current = null;
    }, [dayId]);

    /**
     * Opens a session and seeds it from the plan. The `days` update rides along during the
     * compatibility window: counter and last_workout are derivable from day_sessions and are
     * dropped in phase 2 of the migration.
     */
    const startSession = useCallback(async (): Promise<string | undefined> => {
        const day: Day | undefined = workout?.days.find((current) => current.id === dayId);
        if (!day || !workout) return undefined;

        const started = await dispatch(
            sessionsActions.startSession({
                dayId: day.id,
                workoutId: workout.id,
                dayExercises: day.dayExercises,
            }),
        );

        if (!sessionsActions.startSession.fulfilled.match(started)) return undefined;

        await dispatch(
            currentActions.updateDayStart({
                id: day.id,
                last_workout: new Date().getTime(),
                workout_id: workout.id,
                name: day.name,
                counter: day.counter ? day.counter + 1 : 1,
                is_last: true,
                order: day.order,
            }),
        );

        return started.payload;
    }, [dispatch, workout, dayId]);

    /** The session to write to, opening one if today has not started yet. */
    const ensureSession = useCallback(async (): Promise<string | undefined> => {
        if (todaySession) return todaySession.id;

        if (!startRef.current) {
            const pending = startSession();
            startRef.current = pending;
            /* Only a failed start is retried; keeping a rejected/undefined promise cached would
               wedge every later edit of this day. */
            const sessionId = await pending;
            if (!sessionId) startRef.current = null;
            return sessionId;
        }

        return startRef.current;
    }, [todaySession, startSession]);

    return { isStarted: !!todaySession, ensureSession };
};
