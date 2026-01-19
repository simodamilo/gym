import { useEffect, useState } from "react";
import { useAppDispatch, type RootState } from "../../store";
import { exercisesCatalogActions } from "../../store/exercisesCatalog/exercisesCatalog.action";
import { useSelector } from "react-redux";
import { exercisesSelectors } from "../../store/exercisesCatalog/exercisesCatalog.selector";
import type { ExerciseCatalog } from "../../store/exercisesCatalog/types";
import { Input, Select, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { Categories } from "../../utils/constants";
import { DeleteOutlined, EditOutlined, MoreOutlined, AppstoreOutlined, InboxOutlined, TrophyOutlined, CheckOutlined } from "@ant-design/icons";
import { CustomModal } from "../../components/customModal/CustomModal";

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

    // Group exercises by category
    const filteredExercises = exercises.filter((exercise: ExerciseCatalog) => {
        return !selectedCategory || exercise.category === selectedCategory;
    });

    const groupedExercises = filteredExercises.reduce((acc, exercise) => {
        if (!acc[exercise.category]) {
            acc[exercise.category] = [];
        }
        acc[exercise.category].push(exercise);
        return acc;
    }, {} as Record<string, ExerciseCatalog[]>);

    // Sort categories alphabetically
    const sortedCategories = Object.keys(groupedExercises).sort();

    // Toggle personal best tracking for an exercise
    const togglePersonalBest = async (exercise: ExerciseCatalog) => {
        await dispatch(
            exercisesCatalogActions.togglePersonalBest({
                id: exercise.id,
                showInPersonalBest: !exercise.show_in_personal_best,
            })
        );
    };

    // Create dropdown menu for each exercise
    const getDropdownMenu = (exercise: ExerciseCatalog): MenuProps => ({
        items: [
            {
                key: "personal-best",
                label: "Track in Personal Bests",
                icon: exercise.show_in_personal_best ? <CheckOutlined /> : <TrophyOutlined />,
                onClick: () => {
                    togglePersonalBest(exercise);
                },
            },
            {
                type: "divider",
            },
            {
                key: "edit",
                label: "Edit",
                icon: <EditOutlined />,
                onClick: () => {
                    setIsEditExerciseModalOpen(true);
                    setSelectedExercise(exercise);
                },
            },
            {
                key: "delete",
                label: "Delete",
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => {
                    setIsDeleteExerciseModalOpen(true);
                    setSelectedExercise(exercise);
                },
            },
        ],
    });

    return (
        <div className="w-full h-screen md:w-3xl flex flex-col gap-6 p-4 overflow-hidden bg-[var(--bg-secondary)]">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Exercises</h1>
            </div>

            {/* Search/Filter Bar */}
            <div className="flex flex-col text-left md:flex-row items-start gap-2">
                <Select
                    allowClear
                    className="w-full md:w-xl exercises-select"
                    placeholder={t("exercises.category_placeholder")}
                    value={selectedCategory}
                    onChange={(value) => {
                        setSelectedCategory(value ?? undefined);
                    }}
                    options={Categories}
                    size="large"
                    style={{ borderRadius: "12px" }}
                />
            </div>

            {/* Exercise List - Grouped by Category */}
            <div className="flex flex-col gap-6 pb-28 overflow-auto hide-scrollbar">
                {sortedCategories.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 px-6">
                        <div className="w-24 h-24 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-6">
                            <InboxOutlined className="text-5xl text-[var(--text-tertiary)]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                            {selectedCategory ? "No exercises found" : "No exercises yet"}
                        </h3>
                        <p className="text-[var(--text-secondary)] text-center max-w-sm">
                            {selectedCategory
                                ? `There are no exercises in the "${selectedCategory}" category. Try selecting a different category or create a new exercise.`
                                : "Get started by creating your first exercise using the button below."}
                        </p>
                    </div>
                ) : (
                    sortedCategories.map((category) => {
                        const categoryExercises = groupedExercises[category].sort((a, b) =>
                            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
                        );

                        return (
                            <div key={category} className="flex flex-col gap-3">
                                {/* Category Header */}
                                <h2 className="text-sm font-bold text-[var(--accent-teal)] uppercase tracking-wide">
                                    {category}
                                </h2>

                                {/* Exercise Cards */}
                                <div className="flex flex-col gap-3">
                                    {categoryExercises.map((exercise: ExerciseCatalog) => (
                                        <div
                                            key={exercise.id}
                                            className="bg-[var(--bg-elevated)] rounded-2xl shadow-[var(--shadow-sm)] flex items-center justify-between p-4 hover:shadow-[var(--shadow-md)] transition-shadow border border-[var(--border-light)]"
                                        >
                                            {/* Left side: Icon + Exercise Info */}
                                            <div className="flex items-center gap-4 flex-1">
                                                {/* Exercise Icon */}
                                                <div className="relative">
                                                    <div className="w-10 h-10 bg-[var(--brand-primary-light)] rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <AppstoreOutlined className="text-[var(--brand-primary)] text-lg" />
                                                    </div>
                                                    {/* Trophy Badge - shown when tracked in personal bests */}
                                                    {exercise.show_in_personal_best && (
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--accent-teal)] rounded-full flex items-center justify-center shadow-md">
                                                            <TrophyOutlined className="text-white text-xs" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Exercise Name */}
                                                <div className="font-semibold text-[var(--text-primary)]">
                                                    {exercise.name}
                                                </div>
                                            </div>

                                            {/* Right side: Three-dot Menu */}
                                            <Dropdown menu={getDropdownMenu(exercise)} trigger={["click"]} placement="bottomRight">
                                                <button className="w-8 h-8 flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
                                                    <MoreOutlined className="text-lg" />
                                                </button>
                                            </Dropdown>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Create exercise */}
            <CustomModal
                type="edit"
                title={t("exercises.create_exercise_modal.title")}
                open={isCreateModalOpen}
                onOk={() => addExercise()}
                onCancel={() => {
                    dispatch(exercisesCatalogActions.manageCreateModal(false));
                    setNewExerciseCategory(undefined);
                    setNewExerciseName("");
                }}
                okText="Create"
            >
                <div className="flex flex-col gap-3">
                    <Select
                        allowClear
                        className="w-full"
                        placeholder={t("exercises.category_placeholder")}
                        value={newExerciseCategory}
                        onChange={(value) => {
                            setNewExerciseCategory(value ?? undefined);
                        }}
                        options={Categories}
                    />

                    <Input placeholder={t("exercises.name_placeholder")} value={newExerciseName} onChange={(input) => setNewExerciseName(input.target.value)} />
                </div>
            </CustomModal>

            {/* Edit exercise */}
            <CustomModal
                type="edit"
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
            </CustomModal>

            {/* Delete exercise */}
            <CustomModal
                type="delete"
                title="Delete Exercise"
                open={isDeleteExerciseModalOpen}
                onOk={() => deleteExercise()}
                onCancel={() => {
                    setIsDeleteExerciseModalOpen(false);
                    setSelectedExercise(undefined);
                }}
            >
                {t("exercises.delete_exercise_modal.description")}
            </CustomModal>
        </div>
    );
};
