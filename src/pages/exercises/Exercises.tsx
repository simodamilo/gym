import { useEffect, useState } from "react";
import { useAppDispatch, type RootState } from "../../store";
import { exercisesActions } from "../../store/exercises/exercises.action";
import { useSelector } from "react-redux";
import { exercisesSelectors } from "../../store/exercises/exercises.selector";
import type { Exercise } from "../../store/exercises/types";
import { Link } from "react-router-dom";
import { Button, Input, Select } from "antd";
import { categoriesActions } from "../../store/categories/categories.actions";
import { categoriesSelectors } from "../../store/categories/categories.selector";
import type { Category } from "../../store/categories/types";
import { useTranslation } from "react-i18next";

export const Exercises = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [newExerciseName, setNewExerciseName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number>();

  const exercises = useSelector((state: RootState) => exercisesSelectors.getExercises(state));
  const categories = useSelector((state: RootState) => categoriesSelectors.getCategories(state));

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

  const addExercise = async () => {
    if (!newExerciseName.trim()) {
      return;
    }
    await dispatch(
      exercisesActions.addExercise({
        name: newExerciseName,
        created: Date.now(),
        category_id: selectedCategory ?? 0,
      })
    );
    setNewExerciseName("");
  };

  return (
    <div className="w-full h-screen md:w-3xl flex flex-col gap-2 p-4">
      <div className="flex items-start">
        <Link to="/">{t("common.back_btn")}</Link>
      </div>
      <div className="flex flex-col md:flex-row items-start gap-4">
        <Select
          allowClear
          className="w-full md:w-xl"
          placeholder={t("exercises.category_placeholder")}
          value={selectedCategory}
          onChange={(value) => {
            setSelectedCategory(value ? Number(value) : undefined);
          }}
          options={categories.map((category: Category) => ({
            label: category.name[0].toUpperCase() + category.name.slice(1),
            value: category.id,
          }))}
        />

        <Input placeholder={t("exercises.name_placeholder")} value={newExerciseName} onChange={(input) => setNewExerciseName(input.target.value)} />

        <Button className="w-full md:w-lg" type="primary" onClick={addExercise}>
          {t("exercises.add_exercise_btn")}
        </Button>
      </div>

      {exercises
        .filter((exercise: Exercise) => {
          return !selectedCategory || exercise.category_id == selectedCategory;
        })
        .map((exercise: Exercise) => {
          return (
            <div key={exercise.id} className="p-4 flex items-start border-solid border-amber-50 border-1 rounded-lg">
              {exercise.name}
            </div>
          );
        })}
    </div>
  );
};
