import { ArrowLeftOutlined, HolderOutlined, PlusOutlined, FileTextOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { DndContext, closestCenter, useSensor, useSensors, type DragEndEvent, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Collapse } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, type RootState } from "../../../../store";
import { draftSelectors } from "../../../../store/draft/draft.selectors";
import type { DayExercise } from "../../../../store/draft/types";
import { draftActions } from "../../../../store/draft/draft.actions";
import { ExerciseContent } from "../../components/exerciseContent/ExerciseContent";
import { routes } from "../../../../utils/routing/routes";
import { IconButton } from "../../../../components/iconButton/IconButton";
import { MoveIcon } from "../../../../components/moveIcon/MoveIcon";
import { SortableItem } from "../../../../components/sortableItem/SortableItem";

export const CreateExercisesList = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { dayId } = useParams();
    const workout = useSelector((state: RootState) => draftSelectors.getDraftWorkout(state));

    const [activeKey, setActiveKey] = useState<string>();
    const [mutableDayExercises, setMutableDayExercises] = useState<DayExercise[]>([]);
    const [isDragEnable, setIsDragEnable] = useState<boolean>(false);

    useEffect(() => {
        const day = workout?.days.find(day => day.id === dayId);
        if (day) {
            const mutable: DayExercise[] = [...day.dayExercises];
            mutable.sort((a: DayExercise, b: DayExercise) => a.orderNumber - b.orderNumber);
            setMutableDayExercises(mutable);
        }
    }, [dayId, workout?.days]);

    /* only used if isReadOnly is false */
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 50,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 50,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = mutableDayExercises.findIndex((item) => item.id.toString() === active.id);
            const newIndex = mutableDayExercises.findIndex((item) => item.id.toString() === over?.id);

            const newItems = arrayMove(mutableDayExercises, oldIndex, newIndex).map((item, index) => ({ ...item, orderNumber: index, isLinkedToNext: false }));
            setMutableDayExercises(newItems);
            saveNewOrder(newItems);
        }
    };

    const handleAddExercise = () => {
        const newId = uuidv4();
        setMutableDayExercises([
            ...mutableDayExercises,
            {
                id: newId,
                orderNumber: mutableDayExercises.length,
                sets: [],
                rest: undefined,
                notes: undefined,
            },
        ]);
        setActiveKey(newId);
    };

    const saveNewOrder = async (newItems: DayExercise[]) => {
        const newOrder = newItems.filter((dayExercise) => dayExercise.exercise?.id);

        if (dayId && workout?.id) {
            await dispatch(
                draftActions.upsertExercises({
                    dayExercises: newOrder,
                    dayId: dayId,
                    workoutId: workout?.id,
                    isOrderUpdate: true,
                })
            );
        }
    };

    const saveExercises = async (exercise: DayExercise) => {
        if (dayId && workout?.id) {
            await dispatch(
                draftActions.upsertExercises({
                    dayExercises: [exercise],
                    dayId: dayId,
                    workoutId: workout?.id,
                })
            );
        }
    };

    /* only used if isReadOnly is false */
    const deleteExercise = async (exerciseId: string) => {
        await dispatch(draftActions.deleteExercise(exerciseId));
    };

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

    const renderItem = (exercise: DayExercise) => {
        const setsCount = exercise.sets?.length || 0;

        return {
            key: exercise.id,
            label: (
                <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {exercise.exercise?.name || "New Exercise"}
                        </span>
                        {setsCount > 0 && (
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {setsCount} set{setsCount !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    {isDragEnable && (
                        <HolderOutlined
                            className="text-xl cursor-grab active:cursor-grabbing flex-shrink-0"
                            style={{ color: 'var(--text-tertiary)' }}
                        />
                    )}
                </div>
            ),
            children: (
                <ExerciseContent
                    dayId={dayId!}
                    exerciseId={exercise.id}
                    dayExercise={exercise}
                    saveExercises={saveExercises}
                    deleteExercise={deleteExercise}
                    isDraft
                    isNew={!exercise.exercise?.name}
                />
            ),
        };
    };

    return (
        <div className="w-full h-full max-h-full flex flex-col overflow-hidden pt-4">
            {/* Header with back button and action buttons */}
            <div className="flex justify-between items-center gap-4 mb-4">
                <button
                    onClick={() => navigate(routes.workoutsCreate)}
                    className="bg-transparent border-0 p-0 cursor-pointer text-2xl leading-none transition-all duration-150 flex items-center justify-center hover:-translate-x-0.5 active:scale-95"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                    aria-label="Go back"
                >
                    <ArrowLeftOutlined />
                </button>

                <div className="flex gap-2">
                    <IconButton icon={<PlusOutlined />} onClick={handleAddExercise} />
                    {mutableDayExercises && mutableDayExercises.length > 1 && (
                        <IconButton
                            active={isDragEnable}
                            icon={<MoveIcon className="text-xl" />}
                            onClick={() => {
                                if (!isDragEnable) {
                                    setActiveKey(undefined);
                                }
                                setIsDragEnable(!isDragEnable);
                            }}
                        />
                    )}
                </div>
            </div>

            {mutableDayExercises && mutableDayExercises.length > 0 && (
                <p className="text-left text-xs italic mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {t("workouts.exercises.description")}
                </p>
            )}

            {/* Exercise list */}
            <div className="flex-1 overflow-y-auto pb-28 hide-scrollbar">
                {mutableDayExercises.length > 0 ? (
                    <>
                        {activeKey !== undefined || !isDragEnable ? (
                            <>
                                {groupLinkedItems(mutableDayExercises).map((group) => {
                                    const renderedItems = group.map((exercise) => renderItem(exercise));
                                    const groupKey = group.map((g) => g.id).join("-");

                                    return (
                                        <SortableItem key={groupKey} id={group[0].id.toString()}>
                                            <div className="mb-3">
                                                <Collapse
                                                    accordion
                                                    items={renderedItems}
                                                    activeKey={activeKey}
                                                    onChange={(key) => setActiveKey(Array.isArray(key) ? key[0] : key)}
                                                    bordered={false}
                                                />
                                            </div>
                                        </SortableItem>
                                    );
                                })}
                            </>
                        ) : (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext
                                    items={mutableDayExercises.map((item) => item.id.toString()).filter((id): id is string => id !== undefined && id !== null)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {mutableDayExercises.map((mutableDayExercise) => {
                                        const item = renderItem(mutableDayExercise);
                                        return (
                                            <SortableItem key={mutableDayExercise.id} id={mutableDayExercise.id.toString()}>
                                                <div className="mb-3">
                                                    <Collapse
                                                        items={[item]}
                                                        activeKey={item.key === activeKey ? item.key : undefined}
                                                        onChange={() => setActiveKey(item.key !== activeKey ? (item.key as string) : undefined)}
                                                        bordered={false}
                                                    />
                                                </div>
                                            </SortableItem>
                                        );
                                    })}
                                </SortableContext>
                            </DndContext>
                        )}
                    </>
                ) : (
                    <motion.div
                        className="flex flex-col items-center justify-center h-full gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FileTextOutlined
                            className="text-6xl"
                            style={{ color: 'var(--brand-primary)', opacity: 0.5 }}
                        />
                        <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                            No exercises yet
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            Tap the + button to add your first exercise
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
