import { ArrowLeftOutlined, PlayCircleOutlined, SaveOutlined, FileTextOutlined } from "@ant-design/icons";
import { useAppDispatch, type RootState } from "../../../../store";
import { useEffect, useState } from "react";
import { Collapse } from "antd";
import { SortableItem } from "../../../../components/sortableItem/SortableItem";
import { CustomModal } from "../../../../components/customModal";
import type { Day, DayExercise } from "../../../../store/draft/types";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { currentActions } from "../../../../store/current/current.actions";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { currentSelectors } from "../../../../store/current/current.selectors";
import { routes } from "../../../../utils/routing/routes";
import { ExerciseContent } from "../../components/exerciseContent/ExerciseContent";

export const CurrentExercisesList = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { dayId } = useParams();
    const workout = useSelector((state: RootState) => currentSelectors.getCurrentWorkout(state));

    const [activeKey, setActiveKey] = useState<string>();
    const [mutableDayExercises, setMutableDayExercises] = useState<DayExercise[]>([]);
    const [showConfirmSaveBase, setShowConfirmSaveBase] = useState<boolean>(false);

    useEffect(() => {
        const day = workout?.days.find(day => day.id === dayId);
        if (day) {
            const mutable: DayExercise[] = [...day.dayExercises];
            mutable.sort((a: DayExercise, b: DayExercise) => a.orderNumber - b.orderNumber);
            setMutableDayExercises(mutable);
        }
    }, [workout, dayId]);

    const saveAsBaseWeight = async () => {
        if (dayId) {
            await dispatch(currentActions.saveBaseWeight({ dayExercises: mutableDayExercises, dayId }));
        }
    };

    const isAlreadyStarted = () => {
        const day = workout?.days.find(day => day.id === dayId);
        if (day?.lastWorkout) {
            const savedDate = new Date(day.lastWorkout);
            const today = new Date();

            return savedDate.getFullYear() === today.getFullYear() && savedDate.getMonth() === today.getMonth() && savedDate.getDate() === today.getDate();
        }
    };

    const handleStartClick = async () => {
        const now = new Date();
        const newDay: Day | undefined = workout?.days.find((day) => day.id === dayId);

        if (newDay) {
            await dispatch(
                currentActions.updateDayStart({
                    id: newDay.id,
                    last_workout: now.getTime(),
                    workout_id: workout!.id,
                    name: newDay.name,
                    counter: newDay.counter ? newDay.counter + 1 : 1,
                    is_last: true,
                    order: newDay.order,
                })
            );
        }
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
                        <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {exercise.exercise?.name || "New Exercise"}
                        </span>
                    </div>
                </div>
            ),
            children: (
                <ExerciseContent
                    dayId={dayId!}
                    exerciseId={exercise.id}
                    dayExercise={exercise}
                    isCurrent
                />
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
                    className="bg-transparent border-0 p-0 cursor-pointer text-2xl leading-none transition-all duration-150 flex items-center justify-center hover:-translate-x-0.5 active:scale-95"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                    aria-label="Go back"
                >
                    <ArrowLeftOutlined />
                </button>

                <div className="flex gap-2 items-center">
                    {mutableDayExercises.length > 0 && mutableDayExercises[0].sets.length > 0 && !mutableDayExercises[0].sets[0].baseWeight && (
                        <button className="bg-transparent border-none p-0 cursor-pointer text-text-tertiary text-2xl transition-all duration-150 hover:text-brand-primary hover:scale-110 flex items-center justify-center" onClick={() => setShowConfirmSaveBase(true)} title="Save base weight">
                            <SaveOutlined />
                        </button>
                    )}
                    {isAlreadyStarted() ? (
                        <div className="text-[15px] font-medium text-text-primary">{t("workouts.exercises.workout_started")}</div>
                    ) : (
                        <button className="bg-transparent border-none p-0 cursor-pointer text-text-tertiary text-2xl transition-all duration-150 hover:text-brand-primary hover:scale-110 flex items-center justify-center" onClick={() => handleStartClick()} title="Start workout">
                            <PlayCircleOutlined />
                        </button>
                    )}
                </div>
            </div>

            {mutableDayExercises && mutableDayExercises.length > 0 && (
                <p className="text-left text-xs italic mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {t("workouts.exercises.description")}
                </p>
            )}

            {/* Exercise list */}
            <div className="flex flex-col gap-3 overflow-y-auto pb-28 hide-scrollbar">
                {mutableDayExercises.length > 0 ? (
                    <>
                        {groupLinkedItems(mutableDayExercises).map((group) => {
                            const renderedItems = group.map((exercise) => renderItem(exercise));
                            const groupKey = group.map((g) => g.id).join("-");

                            return (
                                <SortableItem key={groupKey} id={group[0].id.toString()}>
                                    <div>
                                        <Collapse
                                            accordion
                                            items={renderedItems}
                                            activeKey={activeKey}
                                            onChange={(key) => setActiveKey(Array.isArray(key) ? key[0] : key)}
                                            bordered={false}
                                        />
                                    </div>
                                </SortableItem>
                            );
                        })}
                    </>
                ) : (
                    <motion.div
                        className="flex flex-col items-center justify-center h-full gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FileTextOutlined
                            className="text-6xl"
                            style={{ color: 'var(--brand-primary)', opacity: 0.5 }}
                        />
                        <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                            No exercises yet
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            Add exercises to your workout to get started
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Confirmation modal */}
            <CustomModal
                type="confirm"
                title={t("workouts.exercises.confirm_save_base_title") || "Save Base Weight"}
                open={showConfirmSaveBase}
                onOk={() => {
                    saveAsBaseWeight();
                    setShowConfirmSaveBase(false);
                }}
                onCancel={() => {
                    setShowConfirmSaveBase(false);
                }}
                okText="Save"
            >
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    {t("workouts.exercises.confirm_save_base")}
                </p>
            </CustomModal>
        </div>
    );
};
