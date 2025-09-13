import { CloseOutlined, HolderOutlined, PlayCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../../../store";
import { useEffect, useState } from "react";
import { DndContext, closestCenter, useSensor, useSensors, type DragEndEvent, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Collapse } from "antd";
import { ExerciseContent } from "../exerciseContent/ExerciseContent";
import { SortableItem } from "../../../../components/sortableItem/SortableItem";
import type { DayExercise } from "../../../../store/draft/types";
import { draftActions } from "../../../../store/draft/draft.actions";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { MoveIcon } from "../moveIcon/MoveIcon";
import { useParams } from "react-router-dom";
import { IconButton } from "../../../../components/iconButton/IconButton";
import { Button } from "../../../../components/button/Button";

interface ExercisesProps {
    workoutId: string;
    dayId: string;
    dayExercises: DayExercise[];
    isDraft?: boolean;
    isCurrent?: boolean;
    isHistory?: boolean;
    setOpenExercisesId: (id?: string) => void;
    handleStartClick?: (dayId: string) => void;
    lastWorkout?: number;
}

export const ExercisesList = (props: ExercisesProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { workoutId } = useParams();

    const [activeKey, setActiveKey] = useState<string>();
    const [mutableDayExercises, setMutableDayExercises] = useState<DayExercise[]>([]);
    const [isDragEnable, setIsDragEnable] = useState<boolean>(false);

    useEffect(() => {
        const mutable: DayExercise[] = [...props.dayExercises];
        mutable.sort((a: DayExercise, b: DayExercise) => a.orderNumber - b.orderNumber);
        setMutableDayExercises(mutable);
    }, [props.dayExercises]);

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

    /* only used if isReadOnly is false */
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

    /* only used if isReadOnly is false */
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

    /* only used if isReadOnly is false */
    const saveNewOrder = async (newItems: DayExercise[]) => {
        const newOrder = newItems.filter((dayExercise) => dayExercise.exercise?.id);

        await dispatch(
            draftActions.upsertExercises({
                dayExercises: newOrder,
                dayId: props.dayId,
                workoutId: props.workoutId,
                isOrderUpdate: true,
            })
        );
    };

    /* only used if isReadOnly is false */
    const saveExercises = async (exercise: DayExercise) => {
        await dispatch(
            draftActions.upsertExercises({
                dayExercises: [exercise],
                dayId: props.dayId,
                workoutId: props.workoutId,
            })
        );
        if (!isAlreadyStarted() && props.isCurrent) {
            props.handleStartClick?.(props.dayId);
        }
    };

    /* only used if isReadOnly is false */
    const deleteExercise = async (exerciseId: string) => {
        await dispatch(draftActions.deleteExercise(exerciseId));
    };

    const isAlreadyStarted = () => {
        if (props.lastWorkout) {
            const savedDate = new Date(props.lastWorkout);
            const today = new Date();

            return savedDate.getFullYear() === today.getFullYear() && savedDate.getMonth() === today.getMonth() && savedDate.getDate() === today.getDate();
        }
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

    const renderItem = (exercise: DayExercise) => ({
        key: exercise.id,
        label: (
            <div className="flex justify-end gap-4 items-center dark:text-white">
                <div className="text-right">{exercise.exercise?.name}</div>
                {props.isDraft && isDragEnable && <HolderOutlined />}
            </div>
        ),
        children: (
            <ExerciseContent
                dayId={props.dayId}
                exerciseId={exercise.id}
                dayExercise={exercise}
                saveExercises={saveExercises}
                deleteExercise={deleteExercise}
                isDraft={props.isDraft}
                isCurrent={props.isCurrent}
                isHistory={props.isHistory}
                isNew={!exercise.exercise?.name}
            />
        ),
    });

    console.log("TEST", props.isCurrent);

    return (
        <>
            {props.isCurrent ? (
                <div className="flex justify-between w-full mb-2">
                    {isAlreadyStarted() ? (
                        <Button disabled label="Workout Started" onClick={() => props.handleStartClick?.(props.dayId)} />
                    ) : (
                        <IconButton icon={<PlayCircleOutlined />} onClick={() => props.handleStartClick?.(props.dayId)} />
                    )}

                    <CloseOutlined onClick={() => props.setOpenExercisesId()} />
                </div>
            ) : props.isDraft ? (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between w-full">
                        <div className={`flex items-center gap-4 ${!workoutId ? "justify-between" : "justify-end"}`}>
                            <IconButton icon={<PlusOutlined />} onClick={handleAddExercise} />
                            {mutableDayExercises && mutableDayExercises.length > 1 && (
                                <IconButton
                                    active={isDragEnable}
                                    icon={<MoveIcon style={{ fontSize: "20px" }} />}
                                    onClick={() => {
                                        if (!isDragEnable) {
                                            setActiveKey(undefined);
                                        }
                                        setIsDragEnable(!isDragEnable);
                                    }}
                                />
                            )}
                        </div>
                        <CloseOutlined onClick={() => props.setOpenExercisesId()} />
                    </div>
                    {mutableDayExercises && mutableDayExercises.length > 0 && <p className="text-left text-[12px] italic">{t("workouts.exercises.description")}</p>}
                </div>
            ) : (
                <div className="flex justify-end w-full mb-2">
                    <CloseOutlined onClick={() => props.setOpenExercisesId()} />
                </div>
            )}

            <div className="flex-1 overflow-y-auto flex flex-col gap-2 hide-scrollbar">
                {mutableDayExercises.length > 0 && (
                    <>
                        {props.isCurrent || props.isHistory || activeKey !== undefined || !isDragEnable ? (
                            <>
                                {groupLinkedItems(mutableDayExercises).map((group) => {
                                    const renderedItems = group.map((exercise) => renderItem(exercise));
                                    const groupKey = group.map((g) => g.id).join("-");

                                    return (
                                        <SortableItem key={groupKey} id={group[0].id.toString()}>
                                            <Collapse accordion items={renderedItems} activeKey={activeKey} onChange={(key) => setActiveKey(Array.isArray(key) ? key[0] : key)} />
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
                                                <Collapse
                                                    items={[item]}
                                                    activeKey={item.key === activeKey ? item.key : undefined}
                                                    onChange={() => setActiveKey(item.key !== activeKey ? (item.key as string) : undefined)}
                                                />
                                            </SortableItem>
                                        );
                                    })}
                                </SortableContext>
                            </DndContext>
                        )}
                    </>
                )}
            </div>
        </>
    );
};
