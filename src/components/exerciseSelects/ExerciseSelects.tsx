import { Select } from "antd";
import { useEffect, useState } from "react";
import { Categories } from "../../utils/constants";
import type { ExerciseCatalog } from "../../store/exercisesCatalog/types";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { draftSelectors } from "../../store/draft/draft.selectors";
import { exercisesSelectors } from "../../store/exercisesCatalog/exercisesCatalog.selector";
import { useTranslation } from "react-i18next";

interface ExerciseSelectsProps {
    selectedExercise?: ExerciseCatalog;
    onChange: (exerciseId?: string) => void;
    isReadOnly?: boolean;
}

export const ExerciseSelects = (props: ExerciseSelectsProps) => {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string>();

    const exercises: ExerciseCatalog[] = useSelector((state: RootState) => exercisesSelectors.getExercises(state));
    const isLoadingExercises: boolean = useSelector((state: RootState) => draftSelectors.isLoadingExercises(state));

    useEffect(() => {
        if (props.selectedExercise) {
            setSelectedCategory(props.selectedExercise.category);
        }
    }, [props.selectedExercise]);

    return (
        <div className="flex flex-col gap-2">
            <Select
                allowClear
                className="w-full md:w-xl text-left !text-[16px]"
                placeholder={t("workouts.exercises.category_placeholder")}
                value={selectedCategory}
                onChange={(value) => {
                    setSelectedCategory(value ?? undefined);
                    props.onChange();
                }}
                options={Categories}
                disabled={props.isReadOnly || isLoadingExercises}
            />
            <Select
                allowClear
                className="w-full md:w-xl text-left !text-[16px]"
                placeholder={t("workouts.exercises.exercise_placeholder")}
                value={props.selectedExercise?.name}
                onChange={(value) => props.onChange(value)}
                options={exercises
                    .filter((exercise) => exercise.category === selectedCategory)
                    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
                    .map((exercise: ExerciseCatalog) => ({
                        label: exercise.name[0].toUpperCase() + exercise.name.slice(1),
                        value: exercise.id,
                    }))}
                disabled={props.isReadOnly || !selectedCategory || isLoadingExercises}
            />
        </div>
    );
};
