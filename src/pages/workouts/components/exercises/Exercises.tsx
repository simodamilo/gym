import { LeftOutlined } from "@ant-design/icons";
import { draftSelectors } from "../../../../store/draft/draft.selectors";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store";
import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Collapse, type CollapseProps } from "antd";
import { ExerciseContent } from "../exercisesContent/ExerciseContent";
import { SortableItem } from "../../../../components/sortableItem/SortableItem";
import { useTranslation } from "react-i18next";

interface ExercisesProps {
    dayId: number;
    setOpenExercisesId: (id?: number) => void;
}

export const Exercises = (props: ExercisesProps) => {    
    const { t } = useTranslation();
    const [items, setItems] = useState<CollapseProps["items"]>([]);
    const [activeKey, setActiveKey] = useState<number>();

    const day_exercises = useSelector((state: RootState) => draftSelectors.getDraftExercisesByDayId(state, props.dayId));

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
            const oldIndex = items!.findIndex(item => item.key === active.id);
            const newIndex = items!.findIndex(item => item.key === over.id);

            setItems((items) => arrayMove(items!, oldIndex, newIndex));
        }
    };

    useEffect(() => {
        const newItems = day_exercises.map((day_exercise) => {
            return {
                key: day_exercise.id.toString(),
                label: (
                    <div className="flex justify-end">
                        {day_exercise.exercise.name}
                    </div>
                ),
                children: (
                    <div>
                        <ExerciseContent dayId={props.dayId} exerciseId={day_exercise.id} day_exercise={day_exercise} />
                    </div>
                ),
            }
        });

        // Add a new item for creating a new exercise
        const highestId = Math.max(...day_exercises.map((day_exercise) => day_exercise.id), 0) + 1;
        newItems.push({
            key: highestId.toString(),
            label: (
                    <div className="flex justify-end">
                        {t('workouts.exercises.new_exercise_title')}
                    </div>
                ),
            children: (
                <div>
                    <ExerciseContent dayId={props.dayId} exerciseId={highestId} isNew/>
                </div>
            ),
        });

        setItems(newItems);
    }, [day_exercises, props.dayId]);

    return (
        <>
            <div className="flex justify-start w-full">
                <LeftOutlined onClick={() => props.setOpenExercisesId()} />
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                {items && items.length > 0 && <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext 
                        items={items.map(item => item?.key).filter((key): key is string | number => key !== undefined && key !== null)} 
                        strategy={verticalListSortingStrategy}>
                            {items.map((item) => (
                                <SortableItem key={item.key} id={String(item.key)}>
                                    <Collapse items={[item]} activeKey={item.key === activeKey ? item.key : undefined} onChange={() => setActiveKey(item.key !== activeKey ? (item.key as number) : undefined)} />
                                </SortableItem>
                            ))}
                    </SortableContext>
                </DndContext>}
            </div>
        </>
    );
};
