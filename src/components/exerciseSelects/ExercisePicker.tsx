import { useEffect, useRef, useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "../../store";
import type { ExerciseCatalog } from "../../store/exercisesCatalog/types";
import { exercisesSelectors } from "../../store/exercisesCatalog/exercisesCatalog.selector";
import { Categories } from "../../utils/constants";

interface ExercisePickerProps {
    selectedExercise?: ExerciseCatalog;
    onChange: (exercise?: ExerciseCatalog) => void;
}

/**
 * Category chips over a plain scrollable list, rather than two antd Selects.
 *
 * The Selects portal their dropdown to the body and scroll it with a virtual list, which chains
 * the gesture into the page behind and feels wrong on touch. A list rendered inline in the modal
 * scrolls natively and has neither problem.
 */
export const ExercisePicker = ({ selectedExercise, onChange }: ExercisePickerProps) => {
    const { t } = useTranslation();
    const listRef = useRef<HTMLDivElement>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(selectedExercise?.category);

    const exercises: ExerciseCatalog[] = useSelector((state: RootState) => exercisesSelectors.getExercises(state));

    useEffect(() => {
        setSelectedCategory(selectedExercise?.category);
    }, [selectedExercise]);

    const visibleExercises = exercises
        .filter((exercise) => exercise.category === selectedCategory)
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

    const selectCategory = (category: string) => {
        setSelectedCategory(category);
        /* The current exercise belongs to another category, so it can no longer stay selected. */
        if (selectedExercise && selectedExercise.category !== category) onChange(undefined);
        listRef.current?.scrollTo({ top: 0 });
    };

    return (
        <div className="w-full flex flex-col gap-3 text-left">
            <div className="flex flex-wrap gap-2">
                {Categories.map((category) => {
                    const isSelected = category.value === selectedCategory;

                    return (
                        <button
                            key={category.value}
                            onClick={() => selectCategory(category.value)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border cursor-pointer transition-colors duration-150 ${
                                isSelected
                                    ? "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white"
                                    : "bg-[var(--bg-elevated)] border-[var(--border-default)] text-[var(--text-secondary)]"
                            }`}
                        >
                            {t(`components.muscle_volume.muscles.${category.value}`)}
                        </button>
                    );
                })}
            </div>

            {!selectedCategory ? (
                <p className="m-0 py-6 text-center text-sm text-[var(--text-tertiary)]">{t("workouts.exercises.category_placeholder")}</p>
            ) : (
                <div ref={listRef} className="max-h-[220px] overflow-y-auto overscroll-contain hide-scrollbar rounded-xl border border-[var(--border-default)]">
                    {visibleExercises.length === 0 ? (
                        <p className="m-0 py-6 text-center text-sm text-[var(--text-tertiary)]">{t("workouts.exercises.no_exercises")}</p>
                    ) : (
                        visibleExercises.map((exercise) => {
                            const isSelected = exercise.id === selectedExercise?.id;

                            return (
                                <button
                                    key={exercise.id}
                                    onClick={() => onChange(isSelected ? undefined : exercise)}
                                    className={`w-full px-4 py-3 flex items-center justify-between gap-3 text-left text-sm cursor-pointer border-0 border-b border-[var(--border-light)] last:border-b-0 ${
                                        isSelected ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-medium" : "bg-transparent text-[var(--text-secondary)]"
                                    }`}
                                >
                                    <span>{exercise.name[0].toUpperCase() + exercise.name.slice(1)}</span>
                                    {isSelected && <CheckOutlined className="text-[var(--brand-primary)] flex-shrink-0" />}
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};
