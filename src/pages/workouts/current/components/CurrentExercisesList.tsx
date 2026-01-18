import { ArrowLeftOutlined, PlayCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { useAppDispatch, type RootState } from "../../../../store";
import { useEffect, useState } from "react";
import { Collapse, Modal } from "antd";
import { SortableItem } from "../../../../components/sortableItem/SortableItem";
import type { Day, DayExercise } from "../../../../store/draft/types";
import { useTranslation } from "react-i18next";
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

    const renderItem = (exercise: DayExercise) => ({
        key: exercise.id,
        label: (
            <div className="flex items-center justify-between w-full gap-4">
                <span className="flex-1 text-[17px] font-normal text-text-primary leading-snug">{exercise.exercise?.name}</span>
            </div>
        ),
        children: (
            <ExerciseContent
                dayId={dayId!}
                exerciseId={exercise.id}
                dayExercise={exercise}
                isCurrent
                isNew={!exercise.exercise?.name}
            />
        ),
    });

    return (
        <div className="fixed inset-0 bg-bg-primary p-6 flex flex-col overflow-hidden z-10">
            {/* Header with close button and action buttons */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-5 items-center">
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

            {/* Exercise list */}
            <div className="flex-1 overflow-y-auto pb-28 md:pb-6 exercises-list-collapse hide-scrollbar">
                {mutableDayExercises.length > 0 ? (
                    <>
                        {groupLinkedItems(mutableDayExercises).map((group) => {
                            const renderedItems = group.map((exercise) => renderItem(exercise));
                            const groupKey = group.map((g) => g.id).join("-");

                            return (
                                <SortableItem key={groupKey} id={group[0].id.toString()}>
                                    <Collapse
                                        accordion
                                        items={renderedItems}
                                        activeKey={activeKey}
                                        onChange={(key) => setActiveKey(Array.isArray(key) ? key[0] : key)}
                                        bordered={false}
                                    />
                                </SortableItem>
                            );
                        })}
                    </>
                ) : (
                    <div className="flex items-center justify-center py-12 px-6 text-text-tertiary text-[15px]">No exercises yet</div>
                )}
            </div>

            {/* Confirmation modal */}
            <Modal
                closable={{ "aria-label": "Custom Close Button" }}
                open={showConfirmSaveBase}
                onOk={() => saveAsBaseWeight()}
                onCancel={() => {
                    setShowConfirmSaveBase(false);
                }}
            >
                <div className="px-2">{t("workouts.exercises.confirm_save_base")}</div>
            </Modal>
        </div>
    );
};
