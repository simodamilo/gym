import { CloseOutlined } from "@ant-design/icons";
import { draftSelectors } from "../../../../store/draft/draft.selectors";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../store";
import { useEffect, useMemo, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Collapse } from "antd";
import { ExerciseContent } from "../exercisesContent/ExerciseContent";
import { SortableItem } from "../../../../components/sortableItem/SortableItem";
import type { Day, DayExercise } from "../../../../store/draft/types";
import { draftActions } from "../../../../store/draft/draft.actions";
import { getNotificationApi } from "../../../../utils/notificationService";

interface ExercisesProps {
    dayId: number;
    setOpenExercisesId: (id?: number) => void;
}

export const Exercises = (props: ExercisesProps) => {
    const dispatch = useAppDispatch();

    const [activeKey, setActiveKey] = useState<number>();
    const [mutableDayExercises, setMutableDayExercises] = useState<DayExercise[]>([]);

    const draftWorkout = useSelector(draftSelectors.getDraftWorkout);

    const dayExercises = useMemo(() => {
        return draftWorkout?.days.find((day: Day) => day.id === props.dayId)?.dayExercises ?? [];
    }, [draftWorkout?.days, props.dayId]);

    useEffect(() => {
        const mutable: DayExercise[] = [...dayExercises];
        const highestId: number = Math.max(...mutable.map((dayExercise) => dayExercise.id), 0) + 1;
        mutable
            .sort((a: DayExercise, b: DayExercise) => a.orderNumber - b.orderNumber)
            .push({
                id: highestId,
                orderNumber: mutable.length + 1,
                sets: [],
                rest: undefined,
                notes: undefined,
            });
        setMutableDayExercises(mutable);
    }, [dayExercises]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
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
        label: <div className="flex justify-end dark:text-white">{exercise.exercise?.name}</div>,
        children: (
            <ExerciseContent dayId={props.dayId} exerciseId={exercise.id} dayExercise={exercise} saveExercises={saveExercises} deleteExercise={deleteExercise} isNew={!exercise.exercise?.name} />
        ),
    });

    const saveNewOrder = async (newItems: DayExercise[]) => {
        const newOrder = newItems.filter((dayExercise) => dayExercise.exercise?.id);

        await dispatch(
            draftActions.upsertExercises({
                dayExercises: newOrder,
                dayId: props.dayId,
                workoutId: draftWorkout!.id,
                isOrderUpdate: true,
            })
        );
    };

    const saveExercises = async (exercise: DayExercise) => {
        await dispatch(
            draftActions.upsertExercises({
                dayExercises: [exercise],
                dayId: props.dayId,
                workoutId: draftWorkout!.id,
            })
        );
    };

    const deleteExercise = async (exerciseId: number) => {
        await dispatch(draftActions.deleteExercise(exerciseId));
    };

    return (
        <>
            <div className="flex justify-end w-full">
                <CloseOutlined onClick={() => props.setOpenExercisesId()} />
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                {mutableDayExercises.length > 0 && (
                    <>
                        {activeKey === undefined ? (
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
                                                    onChange={() => setActiveKey(item.key !== activeKey ? (item.key as number) : undefined)}
                                                />
                                            </SortableItem>
                                        );
                                    })}
                                </SortableContext>
                            </DndContext>
                        ) : (
                            <>
                                {mutableDayExercises.map((mutableDayExercise) => {
                                    const item = renderItem(mutableDayExercise);
                                    return (
                                        <SortableItem key={mutableDayExercise.id} id={mutableDayExercise.id.toString()}>
                                            <Collapse
                                                items={[item]}
                                                activeKey={item.key === activeKey ? item.key : undefined}
                                                onChange={() => setActiveKey(item.key !== activeKey ? (item.key as number) : undefined)}
                                            />
                                        </SortableItem>
                                    );
                                })}
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
};
