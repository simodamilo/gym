import { useEffect, useState } from "react";
import { useAppDispatch, type RootState } from "../../store";
import { exercisesCatalogActions } from "../../store/exercisesCatalog/exercisesCatalog.action";
import { useSelector } from "react-redux";
import { exercisesSelectors } from "../../store/exercisesCatalog/exercisesCatalog.selector";
import type { ExerciseCatalog } from "../../store/exercisesCatalog/types";
import { Input, Modal, Select } from "antd";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { Categories } from "../../utils/constants";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "../../components/button/Button";
import { IconButton } from "../../components/iconButton/IconButton";

export const Exercises = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const [newExerciseName, setNewExerciseName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const [isEditExerciseModalOpen, setIsEditExerciseModalOpen] = useState<boolean>(false);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseCatalog>();

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

    const updateExercise = async () => {
        if (selectedExercise) {
            dispatch(exercisesCatalogActions.updateExercise(selectedExercise));
            setIsEditExerciseModalOpen(false);
            setSelectedExercise(undefined);
        }
    };

    const deleteExercise = async (exerciseId: string) => {
        dispatch(exercisesCatalogActions.deleteExercise(exerciseId));
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
                <Button label={t("exercises.add_exercise_btn")} onClick={addExercise} />
            </div>

            <div className="flex flex-col gap-2 pb-24">
                {exercises
                    .filter((exercise: ExerciseCatalog) => {
                        return !selectedCategory || exercise.category === selectedCategory;
                    })
                    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
                    .map((exercise: ExerciseCatalog) => {
                        return (
                            <div key={exercise.id} className="flex justify-between items-center border-solid border-amber-50 border-1 rounded-lg p-4">
                                <div>{exercise.name}</div>
                                <div className="flex justify-between items-center gap-4">
                                    <IconButton size="SMALL" icon={<DeleteOutlined />} onClick={() => deleteExercise(exercise.id)} />
                                    <IconButton
                                        size="SMALL"
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                            setIsEditExerciseModalOpen(true);
                                            setSelectedExercise(exercise);
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Edit exercise */}
            <Modal
                title={t("workouts.workout_page.add_day_modal_title")}
                closable={{ "aria-label": "Custom Close Button" }}
                open={isEditExerciseModalOpen}
                onOk={() => updateExercise()}
                onCancel={() => {
                    setIsEditExerciseModalOpen(false);
                    setSelectedExercise(undefined);
                }}
            >
                <Input
                    placeholder={t("workouts.workout_page.day_name_placeholder")}
                    value={selectedExercise?.name || ""}
                    onChange={(input) =>
                        setSelectedExercise((prevState) => {
                            return {
                                ...prevState,
                                id: prevState!.id,
                                category: prevState!.category,
                                name: input.target.value,
                            };
                        })
                    }
                />
            </Modal>
        </div>
    );
};
