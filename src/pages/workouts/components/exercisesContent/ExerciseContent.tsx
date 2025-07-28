import { useTranslation } from "react-i18next";
import { useAppDispatch, type RootState } from "../../../../store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { exercisesSelectors } from "../../../../store/exercises/exercises.selector";
import { categoriesSelectors } from "../../../../store/categories/categories.selector";
import { exercisesActions } from "../../../../store/exercises/exercises.action";
import { categoriesActions } from "../../../../store/categories/categories.actions";
import { Button, Select } from "antd";
import type { Category } from "../../../../store/categories/types";
import type { DayExercise } from "../../../../store/draft/types";
import { DeleteOutlined } from "@ant-design/icons";

export interface ExerciseContentProps {
    dayId: number;
    exerciseId: number;
    dayExercise: DayExercise;
    saveExercises: (dayExercise: DayExercise) => void;
    deleteExercise: (dayExerciseId: number) => void;
    isReadOnly?: boolean;
    isNew?: boolean;
}

export const ExerciseContent = (props: ExerciseContentProps) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const [dayExercise, setDayExercise] = useState<DayExercise>(props.dayExercise);
    const [selectedExercise, setSelectedExercise] = useState<number>();
    const [selectedCategory, setSelectedCategory] = useState<number>();

    const exercises = useSelector((state: RootState) => exercisesSelectors.getExercises(state));
    const categories = useSelector((state: RootState) => categoriesSelectors.getCategories(state));

    useEffect(() => {
        if (props.dayExercise) {
            setSelectedCategory(props.dayExercise.exercise?.category_id);
            setSelectedExercise(props.dayExercise.exercise?.id);
        }
    }, [props.dayExercise]);

    useEffect(() => {
        getExercises();
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getExercises = async () => {
        await dispatch(exercisesActions.fetchAllExercises());
    };

    const getCategories = async () => {
        await dispatch(categoriesActions.fetchAllCategories());
    };

    const hasValidFields = (): boolean => {
        return !!selectedCategory && !!selectedExercise;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <Select
                    allowClear
                    className="w-full md:w-xl"
                    placeholder={t("workouts.exercises.category_placeholder")}
                    value={selectedCategory}
                    onChange={(value) => {
                        setSelectedCategory(value ? Number(value) : undefined);
                        setSelectedExercise(undefined);
                    }}
                    options={categories.map((category: Category) => ({
                        label: category.name[0].toUpperCase() + category.name.slice(1),
                        value: category.id,
                    }))}
                    disabled={props.isReadOnly}
                />
                <Select
                    allowClear
                    className="w-full md:w-xl"
                    placeholder={t("workouts.exercises.exercise_placeholder")}
                    value={selectedExercise}
                    onChange={(value) => {
                        setSelectedExercise(value ? Number(value) : undefined);
                        setDayExercise({
                            ...dayExercise,
                            id: props.dayExercise.id,
                            order_number: props.dayExercise.order_number,
                            exercise: exercises.find(ex => ex.id === value)
                        })
                    }}
                    options={exercises
                        .filter((exercise) => (selectedCategory ? exercise.category_id === selectedCategory : true))
                        .map((exercise: Category) => ({
                            label: exercise.name[0].toUpperCase() + exercise.name.slice(1),
                            value: exercise.id,
                        }))}
                    disabled={props.isReadOnly || !selectedCategory}
                />
            </div>
            <div className="flex gap-4">
                <Button 
                    type="primary" 
                    icon={<DeleteOutlined />} 
                    danger 
                    shape="circle" 
                    disabled={props.isNew}
                    onClick={() => props.deleteExercise(props.exerciseId)}
                />
                <Button 
                    type="primary" 
                    block 
                    onClick={() => props.saveExercises(dayExercise)} 
                    disabled={!hasValidFields()}
                >
                    {t("workouts.exercises.save_btn")}
                </Button>
            </div>
        </div>
    );
};
