import { CloseOutlined, LeftOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../../../store";
import { useEffect, useState } from "react";
import { DndContext, closestCenter, useSensor, useSensors, type DragEndEvent, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button, Collapse } from "antd";
import { ExerciseContent } from "../exercisesContent/ExerciseContent";
import { SortableItem } from "../../../../components/sortableItem/SortableItem";
import type { DayExercise } from "../../../../store/draft/types";
import { draftActions } from "../../../../store/draft/draft.actions";
import { getNotificationApi } from "../../../../utils/notificationService";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

interface ExercisesProps {
    workoutId: string;
    dayId: string;
    dayExercises: DayExercise[];
    isReadOnly?: boolean;
    setOpenExercisesId: (id?: string) => void;
    handleStartClick?: (dayId: string) => void;
    lastWorkout?: number;
}

export const ExercisesList = (props: ExercisesProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [activeKey, setActiveKey] = useState<string>();
    const [mutableDayExercises, setMutableDayExercises] = useState<DayExercise[]>([]);

    useEffect(() => {
        const mutable: DayExercise[] = [...props.dayExercises];
        mutable.sort((a: DayExercise, b: DayExercise) => a.orderNumber - b.orderNumber);
        if (!props.isReadOnly) {
            mutable.push({
                id: uuidv4(),
                orderNumber: mutable.length + 1,
                sets: [],
                rest: undefined,
                notes: undefined,
            });
        }

        setMutableDayExercises(mutable);
    }, [props.dayExercises, props.isReadOnly]);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 50,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 500,
                tolerance: 50,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = mutableDayExercises.findIndex((item) => item.id.toString() === active.id);
            const newIndex = mutableDayExercises.findIndex((item) => item.id.toString() === over?.id);

            if (oldIndex === mutableDayExercises.length - 1 || newIndex === mutableDayExercises.length - 1) {
                getNotificationApi().error({
                    message: `Save exercise before to move`,
                    placement: "top",
                });
                return; // skip moving last item or moving items onto last
            }

            const newItems = arrayMove(mutableDayExercises, oldIndex, newIndex).map((item, index) => ({ ...item, orderNumber: index }));

            setMutableDayExercises(newItems);

            saveNewOrder(newItems);
        }
    };

    const renderItem = (exercise: DayExercise) => ({
        key: exercise.id,
        label: (
            <div className="flex justify-end gap-6 items-center">
                <div className=" dark:text-white text-right">{exercise.exercise?.name}</div>
                {!props.isReadOnly && <span className=" dark:text-white text-lg">⋮⋮</span>}
            </div>
        ),
        children: (
            <ExerciseContent
                dayId={props.dayId}
                exerciseId={exercise.id}
                dayExercise={exercise}
                saveExercises={saveExercises}
                deleteExercise={deleteExercise}
                isReadOnly={props.isReadOnly}
                isNew={!exercise.exercise?.name}
            />
        ),
    });

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

    const saveExercises = async (exercise: DayExercise) => {
        await dispatch(
            draftActions.upsertExercises({
                dayExercises: [exercise],
                dayId: props.dayId,
                workoutId: props.workoutId,
            })
        );
        if (!checkIfAlreadyStarted()) {
            props.handleStartClick?.(props.dayId);
        }
    };

    const deleteExercise = async (exerciseId: string) => {
        await dispatch(draftActions.deleteExercise(exerciseId));
    };

    const checkIfAlreadyStarted = () => {
        if (props.lastWorkout) {
            const savedDate = new Date(props.lastWorkout);
            const today = new Date();

            return savedDate.getFullYear() === today.getFullYear() && savedDate.getMonth() === today.getMonth() && savedDate.getDate() === today.getDate();
        }
    };

    return (
        <>
            {props.isReadOnly ? (
                <div className="flex justify-between w-full">
                    <LeftOutlined onClick={() => props.setOpenExercisesId()} />
                    {!checkIfAlreadyStarted() ? (
                        <Button type="primary" onClick={() => props.handleStartClick?.(props.dayId)}>
                            {t("workouts.exercises.start_workout")}
                        </Button>
                    ) : (
                        <div>Workout Started</div>
                    )}
                </div>
            ) : (
                <div className="flex justify-end w-full">
                    <CloseOutlined onClick={() => props.setOpenExercisesId()} />
                </div>
            )}

            <div className="flex-1 overflow-y-auto flex flex-col gap-2 hide-scrollbar">
                {mutableDayExercises.length > 0 && (
                    <>
                        {!props.isReadOnly && <p className="text-left text-[12px] italic">This is the list of exercises. Long press and drag to reorder</p>}
                        {props.isReadOnly || activeKey !== undefined ? (
                            <>
                                {mutableDayExercises.map((mutableDayExercise) => {
                                    const item = renderItem(mutableDayExercise);
                                    return (
                                        <Collapse
                                            key={mutableDayExercise.id}
                                            items={[item]}
                                            activeKey={item.key === activeKey ? item.key : undefined}
                                            onChange={() => setActiveKey(item.key !== activeKey ? (item.key as string) : undefined)}
                                        />
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
