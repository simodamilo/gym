import { LeftOutlined } from "@ant-design/icons";
import { draftSelectors } from "../../../../store/draft/draft.selectors";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "../../../../store";
import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Collapse, Skeleton } from "antd";
import { ExerciseContent } from "../exercisesContent/ExerciseContent";
import { SortableItem } from "../../../../components/sortableItem/SortableItem";
import { useTranslation } from "react-i18next";
import type { DayExercise } from "../../../../store/draft/types";
import { draftActions } from "../../../../store/draft/draft.actions";
import { getNotificationApi } from "../../../../utils/notificationService";

interface ExercisesProps {
    dayId: number;
    setOpenExercisesId: (id?: number) => void;
}

export const Exercises = (props: ExercisesProps) => {    
    const { t } = useTranslation();    
    const dispatch = useAppDispatch();

    const [activeKey, setActiveKey] = useState<number>();
    const [mutableDayExercises, setMutableDayExercises] = useState<DayExercise[]>([]);

    const dayExercises: DayExercise[] = useSelector((state: RootState) => draftSelectors.getDraftExercisesByDayId(state, props.dayId));
    const isLoadingExercises: boolean = useSelector((state: RootState) => draftSelectors.isLoadingExercises(state));

    useEffect(() => {
        const mutable: DayExercise[] = [...dayExercises];
        const highestId: number = Math.max(...mutable.map((dayExercise) => dayExercise.id), 0) + 1;
        mutable
            .sort((a: DayExercise, b: DayExercise) => a.orderNumber - b.orderNumber)
            .push({
                id: highestId,
                orderNumber: mutable.length,
                sets: []
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = mutableDayExercises.findIndex(item => item.id.toString() === active.id);
            const newIndex = mutableDayExercises.findIndex(item => item.id.toString() === over.id);

            if (oldIndex === mutableDayExercises.length - 1 || newIndex === mutableDayExercises.length - 1) {
                getNotificationApi().error({
                    message: `Save exercise before to move`,
                    placement: "top"
                });
                return; // skip moving last item or moving items onto last
            }

            const newItems = arrayMove(mutableDayExercises, oldIndex, newIndex)
                .map((item, index) => ({ ...item, orderNumber: index }));

            setMutableDayExercises(newItems);

            saveNewOrder(newItems);
        }
    };

    const saveNewOrder = async (newItems: DayExercise[]) => {
        const newOrder = newItems
            .filter((dayExercise) => dayExercise.exercise?.id);

        await dispatch(draftActions.upsertExercises({
            dayExercises: newOrder,
            dayId: props.dayId,
            isOrderUpdate: true
        }));
    }

    const saveExercises = async (exercise: DayExercise) => {
        await dispatch(draftActions.upsertExercises({
            dayExercises: [exercise],
            dayId: props.dayId
        }));
    }

    const deleteExercise = async (exerciseId: number) => {
        await dispatch(draftActions.deleteExercise({
            dayExerciseId: exerciseId,
            dayId: props.dayId
        }))
    }

    return (
        <>
            <div className="flex justify-start w-full">
                <LeftOutlined onClick={() => props.setOpenExercisesId()} />
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                {
                    isLoadingExercises ? (
                        <Skeleton active className="width-[90%]"/>
                    ) : (
                        mutableDayExercises.length > 0 && 
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext 
                                    items={mutableDayExercises.map(item => item.id.toString()).filter((id): id is string => id !== undefined && id !== null)} 
                                    strategy={verticalListSortingStrategy}>
                                        {
                                            mutableDayExercises.map((mutableDayExercise) => {
                                                const item = {
                                                    key: mutableDayExercise.id,
                                                    label: (
                                                        <div className="flex justify-end dark:text-white">
                                                            {mutableDayExercise.exercise?.name || t('workouts.exercises.new_exercise_title')}
                                                        </div>
                                                    ),
                                                    children: (
                                                        <div>
                                                            <ExerciseContent 
                                                                dayId={props.dayId} 
                                                                exerciseId={mutableDayExercise.id} 
                                                                dayExercise={mutableDayExercise} 
                                                                saveExercises={saveExercises}
                                                                deleteExercise={deleteExercise}
                                                                isNew={!mutableDayExercise.exercise?.name}
                                                            />
                                                        </div>
                                                    ),
                                                };
                                                return (
                                                    <SortableItem 
                                                        key={mutableDayExercise.id} 
                                                        id={mutableDayExercise.id.toString()}>
                                                        <Collapse items={[item]} activeKey={item.key === activeKey ? item.key : undefined} onChange={() => setActiveKey(item.key !== activeKey ? (item.key as number) : undefined)} />
                                                    </SortableItem>
                                                )
                                            })
                                        }
                                </SortableContext>
                            </DndContext>
                    )
                
                }
                {
                }
            </div>
        </>
    );
};
