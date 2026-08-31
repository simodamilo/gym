import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Spin } from "antd";
import { useAppDispatch, type RootState } from "../../../../../store";
import { sessionsActions } from "../../../../../store/sessions/sessions.actions";
import { sessionsSelectors } from "../../../../../store/sessions/sessions.selectors";
import { groupBySession } from "./progression.utils";
import { ExerciseProgressionTable } from "./ExerciseProgressionTable";

interface ExerciseProgressionProps {
    exerciseId?: string;
    /** Progression is scoped to this workout: every day of it, but no other workout. */
    workoutId?: string;
}

export const ExerciseProgression = ({ exerciseId, workoutId }: ExerciseProgressionProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const entries = useSelector((state: RootState) => sessionsSelectors.getProgressionForExercise(state, exerciseId, workoutId));
    const isLoading = useSelector((state: RootState) => sessionsSelectors.isLoadingProgression(state));

    useEffect(() => {
        if (exerciseId && workoutId) {
            dispatch(sessionsActions.fetchProgressionForExercise({ exerciseId, workoutId }));
        }
    }, [dispatch, exerciseId, workoutId]);

    const sessions = useMemo(() => groupBySession(entries), [entries]);

    if (isLoading && !sessions.length) {
        return (
            <div className="flex justify-center py-6">
                <Spin />
            </div>
        );
    }

    if (!sessions.length) {
        return <p className="text-sm text-[var(--text-secondary)] m-0">{t("workouts.progression.empty")}</p>;
    }

    return (
        <div className="flex flex-col gap-4">
            <ExerciseProgressionTable sessions={sessions} />
        </div>
    );
};
