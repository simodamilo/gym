import { ArrowLeftOutlined, FileTextOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Collapse } from "antd";
import { SortableItem } from "../../../../components/sortableItem/SortableItem";
import type { Day, DayExercise } from "../../../../store/draft/types";
import { ExerciseContent } from "../../components/exerciseContent/ExerciseContent";
import { historySelectors } from "../../../../store/history/history.selectors";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../../../../components/emptyState/EmptyState";

export const HistoryExercisesList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { workoutId, dayId } = useParams();

    const [activeKey, setActiveKey] = useState<string>();
    const [day, setDay] = useState<Day>();

    const archivedWorkouts = useSelector(historySelectors.getHistoryWorkouts);

    useEffect(() => {
        if (workoutId) {
            const currentWorkout = archivedWorkouts.find((workout) => workout.id === workoutId);
            const day = currentWorkout?.days.find((day) => day.id === dayId);
            if (day) {
                setDay(day);
            }
        }
    }, [archivedWorkouts, workoutId, dayId]);

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
                <div className="flex-1 flex flex-col gap-1">
                    <span className="text-base font-semibold text-[var(--text-primary)]">{exercise.exercise?.name || t('components.item_card.exercise_singular')}</span>
                </div>
            </div>
        ),
        children: <ExerciseContent dayId={dayId!} exerciseId={exercise.id} dayExercise={exercise} isHistory />,
    });

    const renderSuperset = (group: DayExercise[]) => {
        const groupKey = group.map(g => g.id).join('-');
        return {
            key: groupKey,
            label: (
                <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <span className="text-base font-semibold text-[var(--text-primary)]">
                            {group.map(ex => ex.exercise?.name || t('components.item_card.exercise_singular')).join(' + ')}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)]">Superset</span>
                    </div>
                </div>
            ),
            children: (
                <div className="flex flex-col gap-6">
                    {group.map((exercise, index) => (
                        <div key={exercise.id}>
                            {index > 0 && <div className="border-t border-[var(--border-color)] my-4" />}
                            <ExerciseContent
                                dayId={dayId!}
                                exerciseId={exercise.id}
                                dayExercise={exercise}
                                isHistory
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
                    onClick={() => navigate(-1)}
                    className="bg-transparent border-0 p-0 cursor-pointer text-2xl leading-none transition-all duration-150 flex items-center justify-center hover:-translate-x-0.5 active:scale-95 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                    aria-label="Go back"
                >
                    <ArrowLeftOutlined />
                </button>
            </div>

            {day?.dayExercises && day?.dayExercises.length > 0 && <p className="text-left text-xs italic mb-4 text-[var(--text-secondary)]">{t("workouts.exercises.description")}</p>}

            {/* Exercise list */}
            <div className="flex flex-col gap-3 overflow-y-auto pb-28 hide-scrollbar">
                {day?.dayExercises && day?.dayExercises.length > 0 ? (
                    <>
                        {groupLinkedItems(day.dayExercises).map((group) => {
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
                    <EmptyState icon={<FileTextOutlined />} title={t('pages.history.empty_exercises_title')} description={t('pages.history.empty_exercises_description')} />
                )}
            </div>
        </div>
    );
};
