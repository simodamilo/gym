import { LeftOutlined } from "@ant-design/icons";
import { draftSelectors } from "../../../../store/draft/draft.selectors";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store";
import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CollapseProps } from "antd";
import { ExerciseContent } from "../exercisesContent/ExerciseContent";

const SortableItem = ({ id }: { id: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition,
        padding: 16,
        margin: "8px 0",
        background: "#f2f2f2",
        borderRadius: 8,
        touchAction: "none",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {id}
        </div>
    );
};

interface ExercisesProps {
    dayId: number;
    setOpenExercisesId: (id?: number) => void;
}

export const Exercises = (props: ExercisesProps) => {
    const [items, setItems] = useState<CollapseProps["items"]>([]);

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
            const oldIndex = items!.indexOf(active.id);
            const newIndex = items!.indexOf(over.id);

            setItems((items) => arrayMove(items!, oldIndex, newIndex));
        }
    };

    useEffect(() => {
        const newItems = day_exercises.map((day_exercise) => ({
            key: day_exercise.id.toString(),
            label: day_exercise.name,
            children: (
                <div>
                    <ExerciseContent dayId={props.dayId} exerciseId={day_exercise.id} exercise={day_exercise} />
                </div>
            ),
        }));

        // Add a new item for creating a new exercise
        const highestId = Math.max(...day_exercises.map((day_exercise) => day_exercise.id), 0) + 1;
        newItems.push({
            key: highestId.toString(),
            label: "",
            children: (
                <div>
                    <ExerciseContent dayId={props.dayId} exerciseId={highestId} />
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

            {/*<div className="flex-1 overflow-y-auto flex flex-col gap-2">
                <Collapse items={items} defaultActiveKey={["1"]} onChange={() => console.log("TEST")} />
            </div>*/}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    {items.map((id) => (
                        <SortableItem key={id} id={id} />
                    ))}
                </SortableContext>
            </DndContext>
        </>
    );
};
