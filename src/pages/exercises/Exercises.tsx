import { useEffect, useState } from "react";
import { useAppDispatch, type RootState } from "../../store";
import { exercisesCatalogActions } from "../../store/exercisesCatalog/exercisesCatalog.action";
import { useSelector } from "react-redux";
import { exercisesSelectors } from "../../store/exercisesCatalog/exercisesCatalog.selector";
import type { ExerciseCatalog } from "../../store/exercisesCatalog/types";
import { Button, Input, Select } from "antd";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { Categories } from "../../utils/constants";

export const Exercises = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const [newExerciseName, setNewExerciseName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>();

    const exercises: ExerciseCatalog[] = useSelector((state: RootState) => exercisesSelectors.getExercises(state));

    useEffect(() => {
        getExercises();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getExercises = async () => {
        await dispatch(exercisesCatalogActions.fetchExercisesCatalog());
    };

    const addExercise = async () => {
        if (!newExerciseName.trim() || !selectedCategory) {
            return;
        }
        await dispatch(
            exercisesCatalogActions.addExercise({
                id: uuidv4(),
                name: newExerciseName,
                category: selectedCategory,
            })
        );
        setNewExerciseName("");
    };

    return (
        <div className="w-full h-screen md:w-3xl flex flex-col gap-4">
            <div className="flex flex-col text-left md:flex-row items-start gap-2">
                <Select
                    allowClear
                    className="w-full md:w-xl"
                    placeholder={t("exercises.category_placeholder")}
                    value={selectedCategory}
                    onChange={(value) => {
                        setSelectedCategory(value ?? undefined);
                    }}
                    options={Categories}
                />

                <Input placeholder={t("exercises.name_placeholder")} value={newExerciseName} onChange={(input) => setNewExerciseName(input.target.value)} />

                <Button className="w-full md:w-lg" type="primary" onClick={addExercise}>
                    {t("exercises.add_exercise_btn")}
                </Button>
            </div>

            <div className="flex flex-col gap-2 pb-24">
                {exercises
                    .filter((exercise: ExerciseCatalog) => {
                        return !selectedCategory || exercise.category === selectedCategory;
                    })
                    .map((exercise: ExerciseCatalog) => {
                        return (
                            <div key={exercise.id} className="p-4 flex items-start border-solid border-amber-50 border-1 rounded-lg">
                                {exercise.name}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};
