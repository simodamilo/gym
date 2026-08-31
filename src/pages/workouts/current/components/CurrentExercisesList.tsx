import { ArrowLeftOutlined, PlayCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { useAppDispatch, type RootState } from "../../../../store";
import { useEffect, useState } from "react";
import { Collapse } from "antd";
import { SortableItem } from "../../../../components/sortableItem/SortableItem";
import type { DayExercise, Set } from "../../../../store/draft/types";
import { useTranslation } from "react-i18next";
import { currentActions } from "../../../../store/current/current.actions";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { currentSelectors } from "../../../../store/current/current.selectors";
import { routes } from "../../../../utils/routing/routes";
import { ExerciseContent } from "../../components/exerciseContent/ExerciseContent";
import { IconButton } from "../../../../components/iconButton/IconButton";
import { MuscleVolumeButton } from "../../../../components/muscleVolume/MuscleVolumeButton";
import { draftActions } from "../../../../store/draft/draft.actions";
import { EmptyState } from "../../../../components/emptyState/EmptyState";
import { sessionsActions } from "../../../../store/sessions/sessions.actions";
import { sessionsSelectors } from "../../../../store/sessions/sessions.selectors";
import type { SessionSet } from "../../../../store/sessions/types";
import { useTrainingSession } from "../hooks/useTrainingSession";
import { getNotificationApi } from "../../../../utils/notificationService";

export const CurrentExercisesList = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { dayId } = useParams();
    const workout = useSelector((state: RootState) => currentSelectors.getCurrentWorkout(state));

    const [activeKey, setActiveKey] = useState<string>();
    const [mutableDayExercises, setMutableDayExercises] = useState<DayExercise[]>([]);

    const activeSession = useSelector((state: RootState) => sessionsSelectors.getActiveSession(state));
    const { isStarted, ensureSession } = useTrainingSession({ workout, dayId });

    useEffect(() => {
        if (dayId) {
            dispatch(sessionsActions.fetchSessionsForDay(dayId));
        }
    }, [dispatch, dayId]);

    /**
     * The plan supplies the structure; the active session supplies what was actually performed.
     * `reps` is overlaid with the session value so the input the user edits is always the
     * performed one, while `targetReps` keeps the prescription for the placeholder.
     */
    useEffect(() => {
        const day = workout?.days.find((day) => day.id === dayId);
        if (!day) return;

        const sessionSets: SessionSet[] = activeSession?.sets ?? [];
        const mutable: DayExercise[] = day.dayExercises.map((dayExercise: DayExercise) => ({
            ...dayExercise,
            sets: (dayExercise.sets ?? []).map((set: Set) => {
                const performed = sessionSets.find((sessionSet) => sessionSet.dayExerciseId === dayExercise.id && sessionSet.setNumber === set.setNumber);
                if (!performed) return { ...set, targetReps: set.targetReps ?? set.reps };
                return {
                    ...set,
                    targetReps: performed.targetReps ?? set.targetReps ?? set.reps,
                    reps: performed.repsRaw ?? "",
                    weight: performed.weight ?? set.weight,
                };
            }),
        }));
        mutable.sort((a: DayExercise, b: DayExercise) => a.orderNumber - b.orderNumber);
        setMutableDayExercises(mutable);
    }, [workout, dayId, activeSession]);

    /* Editing an exercise before pressing start opens the session implicitly, so nothing typed
       is ever dropped for the want of a button press. */
    const saveExercises = async (exercise: DayExercise) => {
        if (!workout || !dayId) return;

        const sessionId = await ensureSession();
        if (!sessionId) {
            /* Silently returning here used to look exactly like a successful save. */
            getNotificationApi().error({
                message: t("workouts.exercises.session_start_failed"),
                placement: "bottom",
                className: "custom-error-notification",
            });
            return;
        }

        await dispatch(
            sessionsActions.saveSessionSets({
                sessionId,
                dayId,
                dayExercise: exercise,
            }),
        );
    };

    /* only used if isReadOnly is false */
    const deleteExercise = async (exerciseId: string) => {
        await dispatch(draftActions.deleteExercise(exerciseId));
    };

    const groupLinkedItems = (items: DayExercise[]) => {
        const groups: DayExercise[][] = [];
        let currentGroup: DayExercise[] = [];

        for (let i = 0; i < items.length; i++) {
            const current = items[i];
            currentGroup.push(current);

            if (!current.isLinkedToNext) {
                groups.push(currentGroup);
                currentGroup = [];
            }
        }

        // in caso ci sia un gruppo non pushato
        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    };

    const renderItem = (exercise: DayExercise) => {
        return {
            key: exercise.id,
            label: (
                <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <span className="text-base font-semibold text-[var(--text-primary)]">{exercise.exercise?.name || t("workouts.exercises.new_exercise_title")}</span>
                    </div>
                </div>
            ),
            children: (
                <ExerciseContent
                    dayId={dayId!}
                    workoutId={workout?.id}
                    exerciseId={exercise.id}
                    dayExercise={exercise}
                    saveExercises={saveExercises}
                    deleteExercise={deleteExercise}
                    isCurrent
                />
            ),
        };
    };

    const renderSuperset = (group: DayExercise[]) => {
        const groupKey = group.map((g) => g.id).join("-");
        return {
            key: groupKey,
            label: (
                <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <span className="text-base font-semibold text-[var(--text-primary)]">{group.map((ex) => ex.exercise?.name || t("workouts.exercises.new_exercise_title")).join(" + ")}</span>
                        <span className="text-xs text-[var(--text-secondary)]">Superset</span>
                    </div>
                </div>
            ),
            children: (
                <div className="flex flex-col">
                    {group.map((exercise, index) => (
                        <div key={exercise.id}>
                            {index > 0 && <div className="border-t border-[var(--border-color)] my-4" />}
                            <ExerciseContent
                                dayId={dayId!}
                                workoutId={workout?.id}
                                exerciseId={exercise.id}
                                dayExercise={exercise}
                                saveExercises={saveExercises}
                                deleteExercise={deleteExercise}
                                isCurrent
                            />
                        </div>
                    ))}
                </div>
            ),
        };
    };

    return (
        <div className="w-full h-full max-h-full flex flex-col overflow-hidden pt-4">
            {/* Header with close button and action buttons */}
            <div className="flex justify-between items-center gap-4 mb-4">
                <button
                    onClick={() => {
                        navigate(routes.workoutsCurrent);
                        dispatch(currentActions.showSwitcher(true));
                    }}
                    className="bg-transparent border-0 p-0 cursor-pointer text-2xl leading-none transition-all duration-150 flex items-center justify-center hover:-translate-x-0.5 active:scale-95 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                    aria-label="Go back"
                >
                    <ArrowLeftOutlined />
                </button>

                <div className="flex gap-2 items-center">
                    {mutableDayExercises && mutableDayExercises.length > 0 && <MuscleVolumeButton dayExercises={mutableDayExercises} />}
                    {isStarted ? (
                        <div className="text-[15px] font-medium text-[var(--text-primary)]">{t("workouts.exercises.workout_started")}</div>
                    ) : (
                        <IconButton icon={<PlayCircleOutlined />} onClick={() => ensureSession()} />
                    )}
                </div>
            </div>

            {mutableDayExercises && mutableDayExercises.length > 0 && <p className="text-left text-xs italic mb-4 text-[var(--text-secondary)]">{t("workouts.exercises.description")}</p>}

            {/* Exercise list */}
            <div className="flex flex-col gap-3 overflow-y-auto pb-28 hide-scrollbar">
                {mutableDayExercises.length > 0 ? (
                    <>
                        {groupLinkedItems(mutableDayExercises).map((group) => {
                            const item = group.length > 1 ? renderSuperset(group) : renderItem(group[0]);
                            const groupKey = group.map((g) => g.id).join("-");

                            return (
                                <SortableItem key={groupKey} id={group[0].id.toString()}>
                                    <div className="history-exercises-collapse">
                                        <Collapse accordion items={[item]} activeKey={activeKey} onChange={(key) => setActiveKey(Array.isArray(key) ? key[0] : key)} bordered={false} />
                                    </div>
                                </SortableItem>
                            );
                        })}
                    </>
                ) : (
                    <EmptyState icon={<FileTextOutlined />} title={t("pages.current.empty_exercises_title")} description={t("pages.current.empty_exercises_description")} />
                )}
            </div>
        </div>
    );
};
