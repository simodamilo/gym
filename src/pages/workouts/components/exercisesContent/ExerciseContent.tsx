import { useTranslation } from "react-i18next";
import { useAppDispatch, type RootState } from "../../../../store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { exercisesSelectors } from "../../../../store/exercises/exercises.selector";
import { categoriesSelectors } from "../../../../store/categories/categories.selector";
import { exercisesActions } from "../../../../store/exercises/exercises.action";
import { categoriesActions } from "../../../../store/categories/categories.actions";
import { Button, Input, Select } from "antd";
import type { Category } from "../../../../store/categories/types";
import type { DayExercise, Set } from "../../../../store/draft/types";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { draftSelectors } from "../../../../store/draft/draft.selectors";
import TextArea from "antd/es/input/TextArea";

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
    const [selectedCategory, setSelectedCategory] = useState<number>();

    const exercises = useSelector((state: RootState) => exercisesSelectors.getExercises(state));
    const categories = useSelector((state: RootState) => categoriesSelectors.getCategories(state));
    const isLoadingExercises: boolean = useSelector((state: RootState) => draftSelectors.isLoadingExercises(state));

    useEffect(() => {
        if (props.dayExercise) {
            setDayExercise(props.dayExercise);
            setSelectedCategory(props.dayExercise.exercise?.category_id);
        }
    }, [props.dayExercise]);

    useEffect(() => {
        getCategories();
        getExercises();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getExercises = async () => {
        await dispatch(exercisesActions.fetchAllExercises());
    };

    const getCategories = async () => {
        await dispatch(categoriesActions.fetchAllCategories());
    };

    const hasValidFields = (): boolean => {
        return !!selectedCategory;
    };

    const addSet = () => {
        if (dayExercise.sets) {
            const newSets: Set[] = [...dayExercise.sets];
            const highestId: number = Math.max(...newSets.map((set) => set.id), 0) + 1;
            const newSetNumber: number = Math.max(...newSets.map((set) => set.setNumber), 0) + 1;
            newSets.push({
                id: highestId,
                setNumber: newSetNumber,
            });
            setDayExercise((prevState) => {
                return {
                    ...prevState,
                    sets: newSets,
                };
            });
        }
    };

    const removeSet = () => {
        const newSets: Set[] = [...dayExercise.sets];
        setDayExercise((prevState) => {
            return {
                ...prevState,
                sets: newSets.filter((set) => set.setNumber !== newSets.length),
            };
        });
    };

    const updateSet = (reps: number, setId: number) => {
        const newSets: Set[] = [...dayExercise.sets];
        setDayExercise((prevState) => {
            return {
                ...prevState,
                sets: newSets.map((set) => {
                    if (set.id === setId) {
                        return {
                            ...set,
                            reps: reps,
                        };
                    }
                    return set;
                }),
            };
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Select
                    allowClear
                    className="w-full md:w-xl text-left !text-[16px]"
                    placeholder={t("workouts.exercises.category_placeholder")}
                    value={selectedCategory}
                    onChange={(value) => {
                        setSelectedCategory(value !== undefined ? Number(value) : undefined);
                        setDayExercise({
                            ...dayExercise,
                            id: props.dayExercise.id,
                            orderNumber: props.dayExercise.orderNumber,
                            exercise: undefined,
                        });
                    }}
                    options={categories.map((category: Category) => ({
                        label: category.name[0].toUpperCase() + category.name.slice(1),
                        value: category.id,
                    }))}
                    disabled={props.isReadOnly || isLoadingExercises}
                />
                <Select
                    allowClear
                    className="w-full md:w-xl text-left !text-[16px]"
                    placeholder={t("workouts.exercises.exercise_placeholder")}
                    value={dayExercise.exercise?.id}
                    onChange={(value) => {
                        setDayExercise({
                            ...dayExercise,
                            id: props.dayExercise.id,
                            orderNumber: props.dayExercise.orderNumber,
                            exercise: exercises.find((ex) => ex.id === value),
                        });
                    }}
                    options={exercises
                        .filter((exercise) => (selectedCategory ? exercise.category_id === selectedCategory : true))
                        .map((exercise: Category) => ({
                            label: exercise.name[0].toUpperCase() + exercise.name.slice(1),
                            value: exercise.id,
                        }))}
                    disabled={props.isReadOnly || !selectedCategory || isLoadingExercises}
                />
            </div>
            <div className="flex flex-col gap-2 border rounded-md border-[#FFEAD8] p-3">
                <p className="text-lg text-left">{t("workouts.exercises.set_title")}</p>
                {[...(dayExercise.sets ?? [])]
                    .sort((a, b) => a.setNumber - b.setNumber)
                    .map((set: Set) => {
                        return (
                            <Input
                                key={set.id}
                                addonBefore={set.setNumber}
                                placeholder={t("workouts.exercises.reps_placeholder")}
                                value={set.reps}
                                onChange={(input) => updateSet(Number(input.target.value), set.id)}
                                type="number"
                                disabled={isLoadingExercises}
                            />
                        );
                    })}
                <div className="flex justify-between">
                    <Button type="primary" icon={<MinusOutlined />} shape="circle" onClick={removeSet} disabled={dayExercise.sets.length === 0 || isLoadingExercises} />
                    <Button type="primary" icon={<PlusOutlined />} shape="circle" onClick={addSet} disabled={isLoadingExercises} />
                </div>
            </div>
            <Input
                addonBefore={t("workouts.exercises.rest_label")}
                placeholder={t("workouts.exercises.rest_placeholder")}
                value={dayExercise.rest}
                onChange={(input) => {
                    setDayExercise((prevState) => {
                        return {
                            ...prevState,
                            rest: Number(input.target.value),
                        };
                    });
                }}
                type="number"
                disabled={isLoadingExercises}
            />
            <TextArea
                rows={4}
                value={dayExercise.notes}
                onChange={(input) => {
                    setDayExercise((prevState) => {
                        return {
                            ...prevState,
                            notes: input.target.value,
                        };
                    });
                }}
                placeholder={t("workouts.exercises.notes_placeholder")}
                disabled={isLoadingExercises}
            />
            <div className="flex gap-4">
                <Button type="primary" icon={<DeleteOutlined />} danger shape="circle" disabled={props.isNew} onClick={() => props.deleteExercise(props.exerciseId)} />
                <Button type="primary" block onClick={() => props.saveExercises(dayExercise)} disabled={!hasValidFields()}>
                    {t("workouts.exercises.save_btn")}
                </Button>
            </div>
        </div>
    );
};
