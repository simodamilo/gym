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
import { IconButton } from "../../components/iconButton/IconButton";

export const Exercises = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const [selectedCategory, setSelectedCategory] = useState<string>();
    // new exercise
    const [newExerciseCategory, setNewExerciseCategory] = useState<string>();
    const [newExerciseName, setNewExerciseName] = useState("");
    const [isEditExerciseModalOpen, setIsEditExerciseModalOpen] = useState<boolean>(false);
    const [isDeleteExerciseModalOpen, setIsDeleteExerciseModalOpen] = useState<boolean>(false);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseCatalog>();

    const exercises: ExerciseCatalog[] = useSelector((state: RootState) => exercisesSelectors.getExercises(state));
    const isCreateModalOpen: boolean = useSelector(exercisesSelectors.isModalOpen);

    useEffect(() => {
        getExercises();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getExercises = async () => {
        await dispatch(exercisesCatalogActions.fetchExercisesCatalog());
    };

    const addExercise = async () => {
        if (!newExerciseName.trim() || !newExerciseCategory) {
            return;
        }
        await dispatch(
            exercisesCatalogActions.addExercise({
                id: uuidv4(),
                name: newExerciseName,
                category: newExerciseCategory,
            })
        );
        setNewExerciseName("");
        setNewExerciseCategory(undefined);
        dispatch(exercisesCatalogActions.manageCreateModal(false));
    };

    const updateExercise = async () => {
        if (selectedExercise) {
            dispatch(exercisesCatalogActions.updateExercise(selectedExercise));
            setIsEditExerciseModalOpen(false);
            setSelectedExercise(undefined);
        }
    };

    const deleteExercise = async () => {
        if (selectedExercise) {
            dispatch(exercisesCatalogActions.deleteExercise(selectedExercise.id));
            setIsDeleteExerciseModalOpen(false);
        }
    };

    return (
        <div className="w-full h-screen md:w-3xl flex flex-col gap-4 p-4">
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
            </div>

            <div className="flex flex-col gap-2 pb-28">
                {exercises
                    .filter((exercise: ExerciseCatalog) => {
                        return !selectedCategory || exercise.category === selectedCategory;
                    })
                    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
                    .map((exercise: ExerciseCatalog) => {
                        return (
                            <div key={exercise.id} className="bg-[var(--primary-color)] shadow-lg rounded-lg flex justify-between items-center p-3">
                                <div>{exercise.name}</div>
                                <div className="flex justify-between items-center gap-4">
                                    <IconButton
                                        size="SMALL"
                                        icon={<DeleteOutlined />}
                                        onClick={() => {
                                            setIsDeleteExerciseModalOpen(true);
                                            setSelectedExercise(exercise);
                                        }}
                                    />
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

            {/* Create exercise */}
            <Modal
                title={t("exercises.create_exercise_modal.title")}
                open={isCreateModalOpen}
                onOk={() => addExercise()}
                onCancel={() => {
                    dispatch(exercisesCatalogActions.manageCreateModal(false));
                    setNewExerciseCategory(undefined);
                    setNewExerciseName("");
                }}
            >
                <div className="flex flex-col gap-2">
                    <Select
                        allowClear
                        className="w-full md:w-xl"
                        placeholder={t("exercises.category_placeholder")}
                        value={newExerciseCategory}
                        onChange={(value) => {
                            setNewExerciseCategory(value ?? undefined);
                        }}
                        options={Categories}
                    />

                    <Input placeholder={t("exercises.name_placeholder")} value={newExerciseName} onChange={(input) => setNewExerciseName(input.target.value)} />
                </div>
            </Modal>

            {/* Edit exercise */}
            <Modal
                title={t("exercises.edit_exercise_modal.title")}
                open={isEditExerciseModalOpen}
                onOk={() => updateExercise()}
                onCancel={() => {
                    setIsEditExerciseModalOpen(false);
                    setSelectedExercise(undefined);
                }}
            >
                <Input
                    placeholder={t("exercises.edit_exercise_modal.name_placeholder")}
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

            {/* Delete exercise */}
            <Modal
                open={isDeleteExerciseModalOpen}
                onOk={() => deleteExercise()}
                onCancel={() => {
                    setIsDeleteExerciseModalOpen(false);
                    setSelectedExercise(undefined);
                }}
            >
                <div className="w-[90%]">
                    <p>{t("exercises.delete_exercise_modal.description")}</p>
                </div>
            </Modal>
        </div>
    );
};
